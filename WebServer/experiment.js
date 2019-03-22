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
let s_enc,e_enc,s_dec,e_dec,s_init,e_init,s_total
let zkpflag = true


Promise.resolve()
	.then(function(){
	    gettime("begin init")
	    s_init = new Date()
	}).then(function(){
	    setinfo()
	    initShe(0)
	}).then(function(){
	    chr = 1
	    nt = 1
	    position = 10
	    chrflag = false //染色体公開オプション用
    	    HEflag = chrflag //true : SHE, false : AHE ←染色体公開するかとHEの切り替えをわけるならここ
	    setTimeout(()=>{
		send()
	    },3000)
	})

function initShe (curveType) {
    const initSecPub = () => {
	sec = new she.SecretKey()
	sec.setByCSPRNG()
	sec.dump('sec=')
	pub = sec.getPublicKey()
	pub.dump('pub=')
	console.log(`curveType=${curveType}`)
    }
    she.init(curveType,2,1).then(() => {
	initSecPub(she)
	ppub = new she.PrecomputedPublicKey()
	ppub.init(pub)
	gettime("finish init")
	e_init = new Date()
    })
}

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
		if(zkpflag){
			let [c , zkp] = ppub.encWithZkpBinG1(1)
			oneG1 = window.btoa(String.fromCharCode.apply(null,c.serialize()))
			zkp_oneG1 = window.btoa(String.fromCharCode.apply(null,zkp.serialize()))
			for(let i = 0;i<lengthX;i++){
	    		[c , zkp] = ppub.encWithZkpBinG1(0)
	    		vecG1.push(window.btoa(String.fromCharCode.apply(null,c.serialize())))
	    		zkp_vecG1.push(window.btoa(String.fromCharCode.apply(null,zkp.serialize())))
			}
			[c , zkp] = ppub.encWithZkpBinG2(1)
			oneG2 = window.btoa(String.fromCharCode.apply(null,c.serialize()))
			zkp_oneG2 = window.btoa(String.fromCharCode.apply(null,zkp.serialize()))
			for(let i = 0;i<lengthY;i++){
	    		[c , zkp] = ppub.encWithZkpBinG2(0)
	    		vecG2.push(window.btoa(String.fromCharCode.apply(null,c.serialize())))
	    		zkp_vecG2.push(window.btoa(String.fromCharCode.apply(null,zkp.serialize())))
			}
		}else{
			let c = ppub.encG1(1)
			oneG1 = window.btoa(String.fromCharCode.apply(null,c.serialize()))
			for(let i = 0;i<lengthX;i++){
	    		c = ppub.encG1(0)
	    		vecG1.push(window.btoa(String.fromCharCode.apply(null,c.serialize())))
			}
			c = ppub.encG2(1)
			oneG2 = window.btoa(String.fromCharCode.apply(null,c.serialize()))
			for(let i = 0;i<lengthY;i++){
	    		c = ppub.encG2(0)
	    		vecG2.push(window.btoa(String.fromCharCode.apply(null,c.serialize())))
			}
		}
		console.log("vecG1 len : " + vecG1.length)
		console.log("vecG2 len : " + vecG2.length)
    }else{
		if(zkpflag){
			let [c , zkp] = ppub.encWithZkpBinG1(1)
			oneG1 = window.btoa(String.fromCharCode.apply(null,c.serialize()))
			zkp_oneG1 = window.btoa(String.fromCharCode.apply(null,zkp.serialize()))
			for(let i = 0;i<lengthX;i++){
	    		[c , zkp] = ppub.encWithZkpBinG1(0)
	    		vecG1.push(window.btoa(String.fromCharCode.apply(null,c.serialize())))
	    		zkp_vecG1.push(window.btoa(String.fromCharCode.apply(null,zkp.serialize())))
			}
		}else{
			let c = ppub.encG1(1)
			oneG1 = window.btoa(String.fromCharCode.apply(null,c.serialize()))
			for(let i = 0;i<lengthX;i++){
	    		c = ppub.encG1(0)
	    		vecG1.push(window.btoa(String.fromCharCode.apply(null,c.serialize())))
			}
		}	
		console.log("vecG1 len : " + vecG1.length)
    }
}

function calcPos(){
    if(HEflag) chr = 12
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
	let dataSize = total_len * 4
	lengthX = Math.ceil(Math.pow(48*dataSize,1/3))
	lengthY = Math.ceil(Math.pow(6*dataSize,1/3))
	console.log("lengthG1 : " + lengthX)
	console.log("lengthG2 : " + lengthY)
	posG1 = pos % lengthX
	posG2 = (pos / lengthX | 0) % lengthY
	posGT = pos / (lengthX*lengthY) | 0
	document.getElementsByName("num_of_G1")[25].innerText = lengthX
	document.getElementsByName("num_of_G2")[25].innerText = lengthY
	document.getElementsByName("num_of_GT")[25].innerText = Math.ceil(dataSize/lengthX/lengthY) + 1
    }else{
	lengthX = 10000
	lengthY = Math.ceil(parseInt(chrnt[chr]) * 4 / lengthX)
	console.log("lengthX : " + lengthX)
	console.log("lengthY : " + lengthY)
	posX = pos % lengthX
	posY = pos / lengthX | 0
	document.getElementsByName("num_of_G1")[chr-1].innerText = lengthX + lengthY + 1
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
	console.log("vecG1 len : " + vecG1.length)
	console.log("vecG2 len : " + vecG2.length)
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

function timeToStr(d_time){
    time_msg = d_time/1000;
    return time_msg;
}

function post() {
    if(chrflag) chr = 0
    $.ajax({
	url: 'http://venus.cbio.cs.waseda.ac.jp:3000',
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
	s_dec = new Date()
	dec(data)
	gettime("finish dec")
	e_dec = new Date()
	if(HEflag){
	    document.getElementsByName("dec_time")[25].innerText = timeToStr(e_dec-s_dec)
	    document.getElementsByName("total_time")[25].innerText = timeToStr(e_dec-s_total)
	}else{
	    document.getElementsByName("dec_time")[chr-1].innerText = timeToStr(e_dec-s_dec)
	    document.getElementsByName("total_time")[chr-1].innerText = timeToStr(e_dec-s_total)
	}
    }).fail(function( jqXHR, textStatus, errorThrown) {
        console.log("error")
    }).always(function( jqXHR, textStatus) {
	vecG1 = []
	vecG2 = []
	zkp_vecG1 = []
	zkp_vecG2 = []
	cG1 = null
	cGT = null
	gettime("finish search")
	chr = chr + 1
	if(!HEflag){
	    if(chr <= 25) send()
	    if(chr == 26){
		HEflag = true
		chrflag = true
		send()
	    }
	}
    });
}

function send(){
    Promise.resolve()
	.then(function(){
	    s_total = new Date()
	}).then(function(){
	    gettime("begin search")
	}).then(function(){
	    var retcode = calcPos()
	    if(retcode == 0){
		calcEachPos()
		}else{
		console.log("error")
	    }
	    return retcode
	}).then(function(retcode){
	    if(retcode == 0){
		gettime("begin enc")
		s_enc = new Date()
		enc()
		gettime("finish enc")
		e_enc = new Date()
		if(HEflag){
		    document.getElementsByName("enc_time")[25].innerText = timeToStr(e_enc-s_enc)
		}else{
		    document.getElementsByName("enc_time")[chr-1].innerText = timeToStr(e_enc-s_enc)
		}
		sort()
		gettime("send query")
		post()
	    }
	})
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
		console.log("Found")
	    }else{
		console.log("Not Found")
	    }
	}
    }
}

window.onbeforeunload = function(e){
    ppub.destroy()
    console.log("exit")
};

