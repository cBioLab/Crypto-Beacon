var bodyParser = require('body-parser')
var express = require('express')
var morgan = require('morgan')
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
const fs = require('fs')
var app = express()

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit:'50mb',extended: true,parameterLimit: 1000000 }));

app.use(morgan('combined'));
app.use(morgan({ format: 'dev', immediate: true }));

app.post('/', function (req, res){
    let vecG1 = null
    let vecG2 = null
    let zkp_vecG1 = null
    let zkp_vecG2 = null
    let cGT = null
    let cG1 = null
    let pub = req.body.pub
    let chrflag = req.body.chrflag
    let HEflag = req.body.HEflag
    let isPrivate = 1
    let isSHE = 1
    let chr = req.body.chr
    let query = true

    if(chrflag == "true"){
	isPrivate = 1
	if(chr != 0){
	    console.log("error chr != 0")
	    query = false
	}
    }else if(chrflag == "false"){
	isPrivate = 0
	if(chr <= 0 || chr >= 26){
	    console.log("error chr?")
	    query = false
	}
    }else{
	console.log("error chrflag")
	query = false
    }

    if(HEflag == "true"){
	vecG1 = req.body.vecG1
 	zkp_vecG1 = req.body.zkp_vecG1
	vecG2 = req.body.vecG2
	zkp_vecG2 = req.body.zkp_vecG2
	cGT = req.body.cGT
	isSHE = 1
	input = String(chr) + "\n" + String(isPrivate) + "\n"+ String(isSHE) + "\n" + pub + "\n" + vecG1.join("\n") + "\n" + vecG2.join("\n") + "\n" + cGT + "\n" + zkp_vecG1.join("\n") + "\n" + zkp_vecG2.join("\n")
    }else if(HEflag == "false"){
	vecG1 = req.body.vecG1
	zkp_vecG1 = req.body.zkp_vecG1
	cG1 = req.body.cG1
	isSHE = 0
	input = String(chr) + "\n" + String(isPrivate) + "\n"+ String(isSHE) + "\n" + pub + "\n" + vecG1.join("\n") + "\n" + cG1 + "\n" + zkp_vecG1.join("\n")
    }else{
	console.log("error HEflag")
	query = false
    }

    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")


    if(query){
	filename = getUniqueStr() + ".dat"
	fs.writeFileSync("./tmp/" + filename , input)
	console.log("start exec");
	exec('./she_server_core ../tmp/' + filename,{cwd:"./bin"},(err, stdout, stderr) => {
	    if(err){
		console.log("error exec core")
		console.log(err)
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({'status':"error"}));
	    }else{
		console.log("fin exec");
		try{
		    let vecAns = execSync('cat ans_' + stdout,{cwd:"./bin",maxBuffer :500*1024*1024}).toString().split('\n')
		    res.writeHead(200, { 'Content-Type': 'application/json' });
		    res.end(JSON.stringify({'status':"ok" ,'vecAns': vecAns}));
		}catch(err){
		    console.log("error cat files")
		    console.log(err)
		    res.writeHead(200, { 'Content-Type': 'application/json' });
		    res.end(JSON.stringify({'status':"error"}));
		}
	    }
	});
    }else{
	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.end(JSON.stringify({'status':"error"}));
    }
})

var server = app.listen(process.env.PORT || 3000)
// See https://nodejs.org/api/http.html#http_server_timeout
server.timeout = 600000 //10分

function getUniqueStr(){
 var rlen = 100000;
 return new Date().getTime().toString(16)  + Math.floor(rlen*Math.random()).toString(16)
}
