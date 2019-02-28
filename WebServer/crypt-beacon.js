let sec = null
let pub = null
let ppub = null
let oneG1 = null
let zkp_oneG1 = null
let oneG2 = null
let zkp_oneG2 = null
let vecG1 = []
let zkp_vecG1 = []
let vecG2 = []
let zkp_vecG2 = []
let cG1 = null
let cGT = null
let chr = 0
let chrlen = 0
let posG1 = 0
let posG2 = 0
let posGT = 0
let pos = 0
const chrnum = {}
const nt2i ={}
const chrnt = []
let nt = 0
let position = 0
let total_len = 0
let chrflag = true
let HEflag = true
let lengthX = 0
let lengthY = 0
let posX = 0
let posY = 0
const num_of_database = 1

she.init(0).then(() => {
    gettime("begin init")
    document.getElementsByName("status")[0].innerText = "Initializing query..."
    setTimeout(()=>{
	setinfo()
	sec = new she.SecretKey()
	sec.setByCSPRNG()
	sec.dump('sec=')
	pub = sec.getPublicKey()
	pub.dump('pub=')
	document.getElementsByName("status")[0].innerText = "Loading table..."
	setTimeout(()=>{
	    ppub = new she.PrecomputedPublicKey()
	    ppub.init(pub)
	    document.getElementsByName("status")[0].innerText = 'Fill in the form below and click "Send an Encrypted Beacon" button.'
	    document.getElementsByName("sendbutton")[0].disabled = false
	    document.getElementsByName("query-form")[0].style.display = "block"
	    gettime("finish init")
	},100);
    },100);
})

function setinfo(){
    chrnum.chr1 = 1
    chrnum.chr2 = 2
    chrnum.chr3 = 3
    chrnum.chr4 = 4
    chrnum.chr5 = 5
    chrnum.chr6 = 6
    chrnum.chr7 = 7
    chrnum.chr8 = 8
    chrnum.chr9 = 9
    chrnum.chr10 = 10
    chrnum.chr11 = 11
    chrnum.chr12 = 12
    chrnum.chr13 = 13
    chrnum.chr14 = 14
    chrnum.chr15 = 15
    chrnum.chr16 = 16
    chrnum.chr17 = 17
    chrnum.chr18 = 18
    chrnum.chr19 = 19
    chrnum.chr20 = 20
    chrnum.chr21 = 21
    chrnum.chr22 = 22
    chrnum.chrX = 23
    chrnum.chrY = 24
    chrnum.chrM = 25

    nt2i.A = 0
    nt2i.C = 1
    nt2i.G = 2
    nt2i.T = 3

    chrnt.push(0) 
    chrnt.push(249250621) //1
    chrnt.push(243199373) //2
    chrnt.push(198022430) //3
    chrnt.push(191154276) //4
    chrnt.push(180915260) //5
    chrnt.push(171115067) //6
    chrnt.push(159138663) //7
    chrnt.push(146364022) //8
    chrnt.push(141213431) //9
    chrnt.push(135534747) //10
    chrnt.push(135006516) //11
    chrnt.push(133851895) //12
    chrnt.push(115169878) //13
    chrnt.push(107349540) //14
    chrnt.push(102531392) //15
    chrnt.push(90354753) //16
    chrnt.push(81195210) //17
    chrnt.push(78077248) //18
    chrnt.push(59128983) //19
    chrnt.push(63025520) //20
    chrnt.push(48129895) //21
    chrnt.push(51304566) //22
    chrnt.push(155270560) //X
    chrnt.push(59373566) //Y
    chrnt.push(1000000) //M

    total_len = 3096677412
}

function enc(){
    if(HEflag){
	let [c , zkp] = ppub.encWithZkpBinG1(1)
	oneG1 = window.btoa(String.fromCharCode.apply(null,c.serialize()))
	zkp_oneG1 = window.btoa(String.fromCharCode.apply(null,zkp.serialize()))
	for(let i = 0;i<lengthX;i++){
	    [c , zkp] = ppub.encWithZkpBinG1(0)
	    vecG1.push(btoa(String.fromCharCode.apply(null,c.serialize())))
	    zkp_vecG1.push(btoa(String.fromCharCode.apply(null,zkp.serialize())))
	}
	[c , zkp] = ppub.encWithZkpBinG2(1)
	oneG2 = btoa(String.fromCharCode.apply(null,c.serialize()))
	zkp_oneG2 = window.btoa(String.fromCharCode.apply(null,zkp.serialize()))
	for(let i = 0;i<lengthY;i++){
	    [c , zkp] = ppub.encWithZkpBinG2(0)
	    vecG2.push(btoa(String.fromCharCode.apply(null,c.serialize())))
	    zkp_vecG2.push(btoa(String.fromCharCode.apply(null,zkp.serialize())))
	}
	console.log("vecG1 len" + vecG1.length)
	console.log("vecG2 len" + vecG2.length)
    }else{
	let [c , zkp] = ppub.encWithZkpBinG1(1)
	oneG1 = btoa(String.fromCharCode.apply(null,c.serialize()))
	zkp_oneG1 = window.btoa(String.fromCharCode.apply(null,zkp.serialize()))
	for(let i = 0;i<lengthX;i++){
	    [c , zkp] = ppub.encWithZkpBinG1(0)
	    vecG1.push(btoa(String.fromCharCode.apply(null,c.serialize())))
	    zkp_vecG1.push(btoa(String.fromCharCode.apply(null,zkp.serialize())))
	}
	console.log("vecG1 len" + vecG1.length)
    }
}

function calcPos(){
    //chr,pos,NTから位置を計算
    chr = chrnum[document.getElementsByName("chromosome")[0].value]
    position = document.getElementsByName("position")[0].value
    nt = nt2i[document.getElementsByName("nucleotide")[0].value]
    console.log("chr : " + chr)
    console.log("position : " + position)
    console.log("nucleotide : " + nt)
    if(chr == null) return 1 
    if(position == null || position == '') return 2 
    if(nt == null) return 3
    if(isFinite(position) == false || position < 0 || position > parseInt(chrnt[chr])) return 4 
    return 0 
}

function calcEachPos(){
    let x
    let y
    chrflag = document.check.private.checked //染色体公開オプション用
    HEflag = chrflag //true : SHE, false : AHE ←染色体公開するかとHEの切り替えをわけるならここ
    console.log("chrflag : " + chrflag)
    if(chrflag){//true : 全ゲノム, false : 染色体選択
	let tmp = 0
	for(let i=0;i<chr;i++){
	    tmp += parseInt(chrnt[i])
	}
	pos = (parseInt(position) + parseInt(tmp)) * 4 + nt
    }else{
	pos = position * 4 + nt
    }
    console.log("pos : " + pos)
    if(HEflag){
	let mid = Math.ceil(Math.pow(Math.ceil(total_len / 18),(1/3)))
	lengthX = 12 * mid
	lengthY = 6 * mid
	console.log("lengthG1 : " + lengthX)
	console.log("lengthG2 : " + lengthY)
	posG1 = pos % lengthX
	posG2 = (pos / lengthX | 0) % lengthY
	posGT = pos / (lengthX*lengthY) | 0
    }else{
	lengthX = 10000
	lengthY = Math.ceil(parseInt(chrnt[chr]) * 4 / lengthX)
	console.log("lengthX : " + lengthX)
	console.log("lengthY : " + lengthY)
	posX = pos % lengthX
	posY = pos / lengthX | 0
    }
}

function sort(){
    if(HEflag){
	console.log("posG1 : " + posG1)
	console.log("posG2 : " + posG2)
	console.log("posGT : " + posGT)
	vecG1.splice(posG1,1,oneG1)
	zkp_vecG1.splice(posG1,1,zkp_oneG1)
	vecG2.splice(posG2,1,oneG2)
	zkp_vecG2.splice(posG2,1,zkp_oneG2)
	cGT = btoa(String.fromCharCode.apply(null,ppub.encGT(posGT).serialize()))
	console.log("vecG1 len " + vecG1.length)
	console.log("vecG2 len " + vecG2.length)
    }else{
	console.log("posX : " + posX)
	console.log("posY : " + posY)
	vecG1.splice(posX,1,oneG1)
	zkp_vecG1.splice(posX,1,zkp_oneG1)
	cG1 = btoa(String.fromCharCode.apply(null,ppub.encG1(posY).serialize()))
	console.log("vecG1 len " + vecG1.length)
    }
}

function gettime(log_msg){
    var now_time = new Date();
    var now_hour = now_time.getHours();
    var now_min = now_time.getMinutes();
    var now_sec = now_time.getSeconds();
    var now_msec = now_time.getMilliseconds();
    log_msg += " > " + now_hour + ":" + now_min + ":" + now_sec + "." + now_msec;
    console.log(log_msg);
}

function getdevice(){
    var ua = navigator.userAgent;
    device = 'pc'
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0){
        device = 'iPhone';
    }else if(ua.indexOf('Android') > 0){
        device = 'Android';
    }
}

function post() {
    document.getElementsByName("status")[0].innerText = "Now searching..."
    if(chrflag) chr = 0
    $.ajax({
	url: 'http://localhost:3000',
        type: 'POST',
	data: {
	    'pub': btoa(String.fromCharCode.apply(null,pub.serialize())),
	    'vecG1': vecG1,
	    'vecG2': vecG2,
	    'zkp_vecG1': zkp_vecG1,
	    'zkp_vecG2': zkp_vecG2,
	    'cG1': cG1,
	    'cGT': cGT,
	    'chrflag': chrflag,
	    'HEflag': HEflag,
	    'chr': chr
	},
        dataType: 'json',
    }).done(function( data, textStatus, jqXHR ) {
        console.log(data)
	gettime("receive result")
	gettime("begin dec")
	dec(data)
	gettime("finish dec")
    }).fail(function( jqXHR, textStatus, errorThrown) {
        console.log("error")
	document.getElementsByName("status")[0].innerText = "Search failed"
    }).always(function( jqXHR, textStatus) {
	vecG1 = []
	vecG2 = []
	zkp_vecG1 = []
	zkp_vecG2 = []
	cG1 = null
	cGT = null
	document.getElementsByName("sendbutton")[0].disabled = false
	gettime("finish search")
    });
}

function send(){
    gettime("begin search")
    for(let i=0;i<num_of_database;i++){
	document.getElementsByName("found")[i].innerText = "-"
	document.getElementsByName("found")[i].style.backgroundColor = "white"
	document.getElementsByName("found")[i].style.color = "black"
	document.getElementsByName("found")[i].style.padding = "5px"
    }
    var retcode = calcPos()
    var msg = { 1 : "Select Chromosome", 2 : "Enter Base Position", 3 : "Select Alternative Allele" }
    if(retcode == 0){
        calcEachPos()
	getdevice()
	if(device == 'iPhone'){
	    document.getElementsByName("status")[0].innerText = "Encrypting query... (This may take 10 to 25 sec for your device (iPad or iPhone))"
	}else if(device == 'Android'){
	    document.getElementsByName("status")[0].innerText = "Encrypting query... (This may take 30 to 60 sec for your device (Android device) )"
	}else{
	    document.getElementsByName("status")[0].innerText = "Encrypting query..."
	}
        document.getElementsByName("sendbutton")[0].disabled = true
	setTimeout(()=>{
	    gettime("begin enc")
            enc()
	    gettime("finish enc")
            sort()
	    gettime("send query")
            post()
	},100)
    }else if(retcode == 4){
        console.log("input error")
        let chr = chrnum[document.getElementsByName("chromosome")[0].value]
        let maxposition = chrnt[chr]
        document.getElementsByName("status")[0].innerText = "Enter Vaild Base Position (0 < position <= " + maxposition + ")"
    }else{
        console.log("input error")
        document.getElementsByName("status")[0].innerText = msg[retcode] 
    }
}

function dec(data) {
    if(data.status == "ok"){
	let result = [null]
	let ct = [null]

	if(HEflag){
	    for(let i=0;i<num_of_database;i++) ct[i] = new she.CipherTextGT()
	    ct[0].deserialize(new Uint8Array(atob(data.vecAns[posGT]).split("").map(function(c) {return c.charCodeAt(0); })))
	}else{
	    for(let i=0;i<num_of_database;i++) ct[i] = new she.CipherTextG1()
	    ct[0].deserialize(new Uint8Array(atob(data.vecAns[posY]).split("").map(function(c) {return c.charCodeAt(0); })))
	}
	for(let i=0;i<num_of_database;i++){
	    result[i] = sec.dec(ct[i])
	    let ans = null
	    if(result[i] == 1){
		document.getElementsByName("found")[i].innerText = "Found"
		document.getElementsByName("found")[i].style.color = "#32cd32"
	    }else{
		document.getElementsByName("found")[i].innerText = "Not Found"
		document.getElementsByName("found")[i].style.color =  "#dc143c"
	    }
	}
	document.getElementsByName("status")[0].innerText = "Search done"
    }else{
	document.getElementsByName("status")[0].innerText = "Search failed"
    }
}

window.onbeforeunload = function(e){
    ppub.destroy()
    console.log("exit")
};

