var level = 0;
var game_history = [];
var blank1 = document.querySelector('#blank-1');
var blank2 = document.getElementById('blank-2');
var editor = false;
var start = false;
var replays = false;
var gameover=false;
var gameinfo = {};
var chessinfo = {};
var gameblock = {};
var hisinfo={index:null,step:0,data:[]}
var row_reverse=false
var col_reverse=false
var roll = 1;
var _w=80;
var hisdiv =document.getElementById('hisol');
init();
// clearQP();
function test1() {
	let info = '94S43J1S32c3C21m5M1p7P1m5M12c3C23Z1Z34j4';
	//ok info=info.split('').map(n=>isNaN(n)?n:new Array(n*1).fill(0)).flat().join('').match(/(.{9})/g);
	// for(let i=0;i<10;i++){
	// 	res.push(info.substr(i*9,9));
	// }
	info = info.split('').map(n => isNaN(n) ? n : '0'.repeat(n)).join('').match(/(.{9})/g);
	// console.log(info);
	//逆向 info=info.map(n=>n.match(/([0-9]{1,9}|[a-zA-Z]{1,9})/g)).map(n=>n.map(m=>isNaN(m)?m:m.length).join('')).join('');
	return info;
}

function getLevelData(lv, r = 0, c = 0) {
	// let data =JSON.parse(JSON.stringify(levels[lv]));
	let data = levels[lv];
	data = r ? data.map(n => n.reverse().join('')) : data;
	data = c ? data.reverse() : data;
	let obj = {};
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].length; j++) {
			let id = data[i][j];
			if (isNaN(id)) {
				obj[id] = obj[id] || [];
				obj[id].push([i, j]);
			}
		}
	}
	return obj;
}

function setmark() {
	let dom = document.getElementById('aside3'),
		m = '１２３４５６７８９九八七六五四三二一';
	for (n = 0; n < 2; n++) {
		dom = n ? document.getElementById('aside4') : dom;
		for (let i = 0; i < 9; i++) {
			let div = document.createElement('div');
			div.className = 'mark';
			div.innerHTML = m[i + 9 * n];
			// div.style.transform = `translate(${i*_w}px,0)`;
			dom.appendChild(div);
		}
	}
}
setmark();

function init() {
	//生成残局列表
	// for (let i = 0; i < levels.length; i++) {
	// 	aside1.innerHTML += '<img src="../chessMaps/level' + i + '.jpg" title="' + i + '" level="' + i + '">';
	// }
	//初始化棋子
	let data = getLevelData(0);
	for (let qz in data) {
		for (let i = 0; i < data[qz].length; i++) {
			let info = chessData[qz];
			let c = info.color;
			let gid = qz + i;
			let [row, col] = data[qz][i];
			//DOM
			let div = document.createElement('div');
			div.className = 'qizi ' + c;
			div.id = c + '-' + gid;
			let imgid = c + '-' + qz;
			div.innerHTML = info.name;
			// div.style.background = 'url(img/' + imgid + '.jpg) 0 0/70px 70px';
			div.style.transform = `translate(${col*80}px,${row*80}px)`;
			blank1.appendChild(div);
			//游戏信息
			gameinfo[gid] = {
				pos: [row, col],
				dom: div,
				poi: [],
				kill: [],
			};
		}
	}
}

function init1() {
	let lv = levels[0];
	for (let row = 0; row < 10; row++) {
		for (let col = 0; col < 9; col++) {
			if (lv[row][col] != 0) {
				let id = lv[row][col];
				let c = row < 5 ? 'black' : 'red';
				let n = chessinfo[id].qizi.length;
				chessinfo[id].qizi.push(id + n);
				let gid = id + n;
				let div = document.createElement('div');
				gameinfo[gid] = {
					title: id,
					color: c,
					name: chessinfo[id].name,
					pos: [row, col],
					poi: [],
					kill: [],
					score: 0,
					dom: div,
					isShow: true
				};
				let bid = 'bk-' + row + '-' + col;
				chessinfo[id].blocks.push(div);
				div.className = 'qizi';
				div.id = c + '-' + gid;
				let imgid = c + '-' + id;
				div.style.background = 'url(img/' + imgid + '.jpg) 0 0/70px 70px';
				div.style.transform = `translate(${col*80}px,${row*80}px)`;
				blank1.appendChild(div);
			}
		}
	}
	for (let i = 0; i < levels.length; i++) {
		aside1.innerHTML += '<img src="../chessMaps/level' + i + '.jpg" title="' + i + '" level="' + i + '">';
	}
}
var play = {};
play.map = Array.from(new Array(10)).map(n => new Array(9));
play.mans = {};
play.pace = [];
play.my = 1;
play.isFoul = false;

function getMap() {
	play.map = Array.from(new Array(10)).map(n => new Array(9));
	// play.mans = com.mans = {};
	for (let qz in chessinfo) {
		let [c, i, t] = qz.split('-');
		let pos = chessinfo[qz];
		if (pos != null) {
			let [x, y] = [pos % 9, ~~(pos / 9)];
			play.map[y][x] = t;
			play.mans[t] = new com.class.Man(t);
			play.mans[t].x = x;
			play.mans[t].y = y;
		}
	}
	return play.map;
}

function swapQZ(dragid, dropid) {
	let droppos = gameinfo[dropid.split('-')[1]].pos;
	moveQZ(dragid, droppos);
	removeQZ(dropid);
	if (start) hiddQZ(dropid);
}

function removeQZ(dropid) {
	let [c, id] = dropid.split('-');
	let dropdiv = document.getElementById(dropid);
	let index = chessData[id[0]].index;
	let top = 120 + index * 80,
		left = 760; //875
	if (c == 'black') {
		left += 80;
	};
	gameinfo[id].pos = null;
	gameinfo[id].pos1 = [top/80,left/80];
	if (replays) dropdiv.style.transform = 'scale(0)';
	setTimeout(function() {
		dropdiv.style.transform = `translate(${left}px,${top}px)`;
	}, 100);
}

function moveQZ(id, pos) {
	let [c, gid] = id.split('-');
	let div = gameinfo[gid].dom;
	let cid = id.split('-')[1];
	let [row, col] = pos;
	div.style.zIndex = 99;
	div.style.transform = `translate(${col*80}px,${row*80}px)`;
	setTimeout(() => {
		div.style.zIndex = 0;
	}, 300);
	gameinfo[cid].pos = [row, col];
}

function recode_history(id1, p1, p2, id2 = null) {
	if (!start) return;
	let id = id1[0];
	let c = chessData[id].color;
	let i = chessData[id].index;
	let tit = move[i](id1, p1, p2);
	let rec = {
		'player': c,
		'move': [id1, p1, p2],
		'kill': '',
		title: tit
	};

	let li = document.createElement('li');
	li.className = 'hisli li' + c;
	li.innerHTML = tit;
	if (!!id2) {
		rec.kill = id2;
		li.className+=' killed'
	}	
	hisdiv.appendChild(li);
	game_history.push(rec);
}

function clearQP() {
	start = false;
	editor = true;
	game_history = [];
	// play.pace = [];
	clearInterval(timer);
	let blocks = getblocks();
	for (let bid in blocks) {
		let divid = blocks[bid];
		let id = divid.split('-')[1];
		let g = gameinfo[id];
		g.pos = null;
		removeQZ(divid);
	}
	btn4.classList.remove('start');
	btn5.innerHTML = '显示余子';
	hiddenQZ();
	markhidden();
	blank2.innerHTML = '';
	hisdiv.innerHTML = '';
	activeqz.id = null;
}

function getblocks(cc = null) {
	let obj = {};
	for (let qz in gameinfo) {
		if (gameinfo[qz].pos == null) continue;
		let c = chessData[qz[0]].color;
		let pos = gameinfo[qz].pos.join('-');
		let bid = `div-${pos}`;
		if (cc != null && cc != c) continue;
		obj[bid] = c + '-' + qz;
	}
	return obj;
}

function getLevel(level, c = 0, r = 0) {
	editor=false
	let data = getLevelData(level, c, r);
	for (let qz in data) {
		for (let i = 0; i < data[qz].length; i++) {
			let pos = data[qz][i];
			let div = gameinfo[qz + i].dom;
			let id = div.id;
			moveQZ(id, pos);
		}
	}
	let his=historys[level]
	if(!!his&&his.length>0){
		getHisinfo(level)
		document.querySelector('.hisbtn').style.display='block'
	}else{
		document.querySelector('.hisbtn').style.display='none'
		hisinfo={index:null,data:[]}
	}
}

function setLevel(lv, c = 0, r = 0) {
	let blocks = getblocks();
	gameover=false;
	if (Object.keys(blocks).length > 0) {
		clearQP();
		setTimeout(() => getLevel(lv, c, r), 300);
	} else {
		getLevel(lv, c, r);
	}
};
//==========================================================================
function output() {
	var data = '0'.repeat(90).split('');
	for (let qz in gameinfo) {
		if (gameinfo[qz].pos != null) {
			let [c, i, n] = qz.split('-');
			let [row, col] = gameinfo[qz].pos;
			let id = row * 9 + col;
			data[id] = qz[0];
		}
	}
	data = data.join('').match(/.{9}/g);
	let res = data.map(n => n.match(/(\d{1,9}|\D{1,9})/g)).map(n => n.map(m => isNaN(m) ? m : m.length).join('')).join('');
	console.log(res)
	markhidden()
	let dom=document.querySelector('#main');
	window.domtoimage.toJpeg(dom).then(dataUrl => {
	                let link = document.createElement('a');
	                link.download = 'level'+level+'.jpg';
	                link.href = dataUrl;
	                link.click();
	            });
	// return res;
}
function outputHistory(){
	let str=''
	for(let poi of game_history){
		str+=poi.move.slice(1).flat().join('');
	}
	return str
}
function outDisplay() {
	// dragdropRM();
	let blocks = getblocks();
	let out = {
		'red': {},
		'black': {}
	};
	for (let bid in blocks) {
		let cid = blocks[bid];
		let c = cid.split('-')[0];
		let q = cid.split('-')[1];
		if (!out[c][q]) out[c][q] = [];
		let pos = bid.split('-')[1] * 1;
		out[c][q].push(pos);
	}
	let str = JSON.stringify(out);
	console.log(str);
};
// outDisplay();
//=============================================
//历史记录
//===========================================================================棋步记录
var shuzi = '123456789九八七六五四三二一'.split('');

function move1(qz, p1, p2) {
	let id = qz[0];
	let color = chessData[id].color;
	let title = chessData[id].name;
	let px = shuzi[p1[1]];
	let str = title + px;
	if (color == 'black') {
		if (p1[1] == p2[1]) {
			let n = p1[0] - p2[0];
			str += (n < 0 ? '进' : '退') +Math.abs(n);
		} else {
			let n = shuzi[p2[1] + (color == 'black' ? 0 : 9)];
			str += '平' + n;
		}
	} else {
		px = shuzi[p1[1] + 9];
		str = title + px;
		if (p1[1] == p2[1]) {
			let n = p1[0] - p2[0];
			str += (n > 0 ? '进' : '退') + shuzi.slice(0).reverse()[Math.abs(n-1)];
		} else {
			let n = shuzi[p2[1] + 9];
			str += '平' + n;
		}
	}
	// console.log(color, str);
	return str;
}

function move2(qz, p1, p2) {
	let id = qz[0];
	let color = chessData[id].color;
	let title = chessData[id].name;
	let px1 = shuzi[p1[1]];
	let px2 = shuzi[p2[1]];
	let str = title + px1;
	if (color == 'black') {
		str += (p1[0] < p2[0] ? '进' : '退') + px2;
	} else {
		px1 = shuzi[p1[1] + 9];
		px2 = shuzi[p2[1] + 9];
		str = title + px1;
		str += (p1[0] > p2[0] ? '进' : '退') + px2;
	}
	// console.log(color, str);
	return str;
}
var move = {
	'0': function(qz, p1, p2) {
		return move1(qz, p1, p2);
	},
	'1': function(qz, p1, p2) {
		return move1(qz, p1, p2);
	},
	'2': function(qz, p1, p2) {
		return move2(qz, p1, p2);
	},
	'3': function(qz, p1, p2) {
		return move2(qz, p1, p2);
	},
	'4': function(qz, p1, p2) {
		return move2(qz, p1, p2);
	},
	'5': function(qz, p1, p2) {
		return move1(qz, p1, p2);
	},
	'6': function(qz, p1, p2) {
		return move1(qz, p1, p2);
	},
};
//--------------------------------------------------------------------悔棋
function reback() {
	if (game_history.length == 0 || replays == true) return;
	let qzinfo = game_history.pop();
	let [qz, p1, p2] = qzinfo.move;
	let [x, y] = p1;
	let div = gameinfo[qz].dom;
	div.style.transform = `translate(${y*80}px,${x*80}px)`;
	gameinfo[qz].pos = p1;
	let c = chessData[qz[0]].color;
	let li = document.querySelector(`.li${c}:last-child`);
	li.parentElement.removeChild(li);
	markQZ(p1);
	start = start == 'red' ? 'black' : 'red';
	activeqz = {};
	if (qzinfo.kill) {
		qz = qzinfo.kill;
		[x, y] = p2;
		div = gameinfo[qz].dom;
		div.style.display = 'block';
		div.style.transform = `translate(${y*80}px,${x*80}px)`;
		gameinfo[qz].pos = p2;
	}
	// showpoi(id);
}
//----------------------------------------------------------回放
async function replay(his) {
	for (let i = 0; i < his.length; i++) {
		await sleep();
		let info = his[i];
		let [id1, p1, p2] = info.move;
		moveQZ(id1, p2);
		if (info.kill.length > 0) {
			removeQZ(info.kill);
			recode_history(id1, p1, p2, info.kill);
		} else {
			recode_history(id1, p1, p2);
		}
	}
}
async function sleep() {
	return new Promise(resolve => {
		setTimeout(() => resolve(), 1000);
	});
}
var timer;

function replay1(his) {
	if (!his) {
		console.log('无该局记录');
		return;
	}
	let his_index = 0;
	timer = setInterval(() => {
		if (his_index == his.length - 1) clearInterval(timer);
		let info = his[his_index];
		let [id1, p1, p2] = info.move;
		moveQZ(id1, p2);
		if (info.kill.length > 0) {
			removeQZ(info.kill);
			recode_history(id1, p1, p2, info.kill);
		} else {
			recode_history(id1, p1, p2);
		}
		gameOver(start == 'red' ? 'black' : 'red');
		his_index++;
	}, 1000);
}
//======================================================================隐藏棋子
function hiddenQZ(flag=0) {
	if (start && editor) return;
	let btn = document.getElementById('btn5');
	let str = btn.innerHTML;
	if(flag==1)str = '隐藏余子'
	let h = str == '显示余子' ? 'block' : 'none';
	for (let qz in gameinfo) {
		let divid = chessData[qz[0]].color + '-' + qz;
		if (gameinfo[qz].pos == null) hiddQZ(divid, h);
	}
	str = str == '显示余子' ? '隐藏余子' : '显示余子';
	btn.innerHTML = str;
}

function hiddQZ(qz, h = 'none') {
	let div = document.getElementById(qz);
	div.style.display = h;
}
var activeqz = {
	id: null,
	poi: [],
	kill: []
};
//====================================================================下棋
function getQZ(ev) {
	if (start == false) return;
				console.log('oooooo');
	let div = ev.target;
	let [color, id] = div.id.split('-');
	if (activeqz.id == null) {
		if (color == start) {
			activeqz.id = id;
			let pos = gameinfo[id].pos;
			showpoi(id);
			markQZ(pos);
		}
	} else {
		if (div.id == 'blank-1') { //走棋子
			let [x, y] = [~~(ev.layerX / 80), ~~(ev.layerY / 80)];
			let pos = [y, x];
			let p1 = gameinfo[activeqz.id].pos;
			if (!checkpoi('div-' + y + '-' + x)) return;
			moveQZ(color + '-' + activeqz.id, pos);
			blank2.innerHTML = '';
			markmoveQZ(pos);
			recode_history(activeqz.id, p1, pos);
			checkJP(activeqz.id);
			start = start == 'red' ? 'black' : 'red';
			let str = [p1 % 9, ~~(p1 / 9), pos % 9, ~~(pos / 9)].join('');
			play.pace.push(str);
			gameOver(start);
			activeqz.id = null;
			setTimeout(() => {
				// chessAI();
			}, 500);
		} else { //
			if (id == activeqz.id) return;
			let pos = gameinfo[id].pos;
			let p1 = gameinfo[activeqz.id].pos;
			if (color == chessData[activeqz.id[0]].color) { //同色重新选棋子
				activeqz.id = id;
				showpoi(id);
				markQZ(pos);
			} else { //走棋吃棋子
				if (!checkpoi('div-' + pos.join('-'))) return;
				let id1 = chessData[activeqz.id[0]].color + '-' + activeqz.id;
				let id2 = color + '-' + id;
				swapQZ(id1, id2);
				blank2.innerHTML = '';
				markmoveQZ(pos);
				recode_history(activeqz.id, p1, pos, id);
				checkJP(activeqz.id);
				start = start == 'red' ? 'black' : 'red';
				let str = [p1 % 9, ~~(p1 / 9), pos % 9, ~~(pos / 9)].join('');
				play.pace.push(str);
				gameOver(start);
				activeqz.id = null;
				setTimeout(() => {
					// chessAI(); 
				}, 500);
			}
		}
	}
}

//--------------------------------------------------------------------标记棋子
function markQZ(pos) {
	let [x, y] = pos;
	let mdiv = document.querySelector('.moveqz');
	let adiv = document.querySelector('.activeqz');
	mdiv.classList.remove('hidden', 'move');
	adiv.classList.remove('hidden');
	adiv.style.transform = `translate(${y*80}px,${x*80}px) scale(0.5)`;
	mdiv.style.transform = `translate(${y*80}px,${x*80}px)`;
}

function markmoveQZ(pos) {
	let [x, y] = pos;
	let adiv = document.querySelector('.activeqz');
	let mdiv = document.querySelector('.moveqz');
	// adiv.style.transform += ' scale(0.5)';
	if(editor)adiv.classList.add('hidden')
	mdiv.classList.add('move');
	mdiv.style.transform = `translate(${y*80}px,${x*80}px)`;
}

function markhidden() {
	let divs = document.querySelectorAll('.activeqz');
	divs.forEach(div => {
		div.classList.add('hidden');
	});
}
//=================================================================获取落子范围
var getpath = {
	'0': function(id) {
		return getaround_j(id);
	}, //将
	'1': function(id) {
		return getaround_cp(id);
	}, //车炮
	'2': function(id) {
		return getaround_m(id);
	}, //马
	'3': function(id) {
		return getaround_x(id);
	}, //相
	'4': function(id) {
		return getaround_s(id);
	}, //士
	'5': function(id) {
		return getaround_cp(id);
	}, //车炮
	'6': function(id) {
		return getaround_b(id);
	} //兵
};

function getaround_j(id) { //========================将
	let base = [
		[0, 1, 2],
		[7, 8, 9]
	];
	if (roll < 0) base.reverse();
	let color = chessData[id[0]].color;
	let rowarr = color == 'black' ? base[0] : base[1];
	let colarr = [3, 4, 5];
	let arr = [],
		kill = [];
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = gameinfo[id].pos;
	let [y, x] = pos;
	let poi = [];
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			let p = `div-${y+j}-${x+i}`;
			let row = y + j;
			let col = x + i;
			// let exp = (x + i >= 3) && (x + i < 6) && (y + j >= (color == 'red' ? 7 : 0)) && (y + j < (color == 'red' ? 10 : 3));
			let exp = colarr.includes(col) && rowarr.includes(row);
			if (Math.abs(i) != Math.abs(j) && exp) poi.push(p);
		}
	}
	poi.forEach(bk => {
		if (blocks.includes(bk)) {
			if (!info[bk].includes(color)) kill.push(bk);
		} else {
			arr.push(bk);
		}
	});
	return [arr, kill];
}

function getaround_cp(id) { //==============车炮
	// let [color, index] = id.split('-');
	let index = chessData[id[0]].index;
	let color = chessData[id[0]].color;
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = gameinfo[id].pos;
	let [y, x] = pos;
	let arr = [],
		kill = [];
	let flag = true;
	checkP(-1, 0), checkP(1, 0), checkP(0, -1), checkP(0, 1);
	return [arr, kill];

	function checkbk(bk) {
		if (blocks.includes(bk)) {
			if (flag && index == '5') {
				flag = false;
			} else {
				if (!info[bk].includes(color)) kill.push(bk);
				return true;
			}
		} else {
			if (flag) arr.push(bk);
		}
	};

	function checkP(xx, yy) {
		flag = true;
		let n = yy == 0 ? xx : yy;
		for (let i = n; Math.abs(i) < 9 + Math.abs(yy); i += n) {
			let m = yy == 0 ? x : y;
			if (m + i < 0 || m + i > 8 + Math.abs(yy)) return;
			// let bk = yy == 0 ? 'div-' + (x + i + y * 9) : 'div-' + (x + (y + i) * 9);
			let bk = yy == 0 ? `div-${y}-${x+i}` : `div-${y+i}-${x}`;
			if (checkbk(bk)) break;
		}
	}
}

function getaround_m(id) { //========================马
	let color = chessData[id[0]].color;
	let arr = [],
		kill = [];
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = gameinfo[id].pos;
	let [y, x] = pos;
	//-----------------------------------左右方向
	checkP(0, -1), checkP(0, 1), checkP(-1, 0), checkP(1, 0);
	return [arr, kill];

	function checkP(xx, yy) {
		if (x + xx * 2 < 0 || x + xx * 2 > 8 || y + yy * 2 < 0 || y + yy * 2 > 9) return;
		let bk = `div-${y+yy}-${x+xx}`;
		if (!blocks.includes(bk)) {
			if (xx == 0) {
				if (x + 1 < 9) checkbk(`div-${y+yy*2}-${x+1}`);
				// if (x + 1 < 9) checkbk('div-' + (x + 1 + (y + yy * 2) * 9));
				if (x - 1 >= 0) checkbk(`div-${y+yy*2}-${x-1}`);
			} else {
				if (y + 1 < 10) checkbk(`div-${y+1}-${x+xx*2}`);
				if (y - 1 >= 0) checkbk(`div-${y-1}-${x+xx*2}`);
			}
		}
	}

	function checkbk(bk) {
		if (blocks.includes(bk)) {
			if (!info[bk].includes(color)) kill.push(bk);
		} else {
			arr.push(bk);
		}
	}
}

function getaround_x(id) { //========================相
	let c = id[0];
	let arr = [],
		kill = [];
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = gameinfo[id].pos;
	let [y, x] = pos;
	checkP(-1, -1), checkP(-1, 1), checkP(1, -1), checkP(1, 1);
	return [arr, kill];

	function checkP(xx, yy) {
		if (x + xx < 0 || x + xx > 8 || y + yy < 0 || y + yy > 9) return;
		let base = [(y + yy) < 5, (y + yy) > 4];
		if (roll < 0) base.reverse();
		let flag = c == 'X' ? base[0] : base[1];
		if (flag && c == 'X') return;
		let bk1 = `div-${y+yy}-${x+xx}`;
		let bk = `div-${y+yy*2}-${x+xx*2}`;
		if (blocks.includes(bk1)) return;
		if (blocks.includes(bk)) {
			if (info[bk].split('-')[0] != chessData[c].color) kill.push(bk);
		} else {
			arr.push(bk);
		}
	}
}

function getaround_s(id) { //========================士
	let base = [
		['84', '93', '95', '73', '75'],
		['14', '23', '25', '03', '05']
	];
	if (roll < 0) base.reverse();
	let arr = id[0] == 'S' ? base[0] : base[1];
	let color = chessData[id[0]].color;
	let poi = arr.slice(1),
		kill = [];
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = gameinfo[id].pos;
	if (pos.join('') != arr[0]) poi = arr.slice(0, 1);
	poi = poi.map(n => 'div-' + n.split('').join('-')).filter(bk => {
		if (blocks.includes(bk)) {
			if (!info[bk].includes(color)) kill.push(bk);
		} else {
			return bk;
		}
	});
	return [poi, kill];
}

function getaround_b(id) { //========================兵
	let color = chessData[id[0]].color;
	let arr = [],
		kill = [];
	let info = getblocks();
	let blocks = Object.keys(info);
	let [y, x] = gameinfo[id].pos;
	let base = [y > 4, y < 5];
	if (roll < 0) base.reverse();
	let flag = color == 'red' ? base[0] : base[1];
	let yy = roll * (color == 'black' ? 1 : -1);
	if (y + yy < 0 || y + yy > 9) yy = 0;
	let n = 1;
	if (flag) n = 0;
	for (let i = -n; i <= n; i++) {
		let j = i == 0 ? yy : 0;
		let bk = `div-${y+j}-${x+i}`;
		if (blocks.includes(bk)) {
			if (!info[bk].includes(color)) kill.push(bk);
		} else {
			arr.push(bk);
		}
	}
	return [arr, kill];
}
//===============================================================显示落子范围
function getAround(id) { //J0
	let index = chessData[id[0]].index;
	let [poi, kill] = getpath[index](id);
	let obj = {
		poi,
		kill
	};
			/*
	for (let bk in obj) {
		for (let i = 0; i < obj[bk].length; i++) {
			if (obj[bk].length == 0) break;
			if (bk == 'poi' && checkBJP(id, obj[bk][i]) || bk == 'kill' && checkCJP(id, obj[bk][i])) {
				obj[bk][i] = 'false-' + obj[bk][i];
			}
		}
	};
			*/
	let arr = Object.values(obj).flat().filter(n => !n.includes('false'));
	return arr;
}

function getMoves(c) {
	let moves = [];
	let bks = getblocks(c);
	for (let bk in bks) {
		let [,x,y] = bk.split('-');
		let cid = bks[bk].split('-')[1];
		let arr = getAround(cid);
		for (let i = 0; i < arr.length; i++) {
			let [,x1,y1]=arr[i].split('-')
			moves.push([x, y, x1,y1, cid]);
		}
	}
	return moves;
}

function showpoi(id) {
	let flagx = gameinfo['J0'].pos[0];
	roll = flagx < 3 ? -1 : 1;
	let index = chessData[id[0]].index;
	let [poi, kill] = getpath[index](id);
	let obj = {
		poi,
		kill
	};
	activeqz.poi = poi;
	activeqz.kill = kill;
	blank2.innerHTML = '';
	for (let bk in obj) {
		for (let i = 0; i < obj[bk].length; i++) {
			if (obj[bk].length == 0) break;
			let [, y, x] = obj[bk][i].split('-');
			let div = document.createElement('div');
			div.className = bk;
			div.style.transform = `translate(${x*80}px,${y*80}px)`;
			blank2.appendChild(div);
			/**/
			if (bk == 'poi') {
				if (checkBJP(id, obj[bk][i])) {
					div.classList.add('poikill');
					delete obj[bk][i];
				}
			} else {
				div.innerHTML = '<div></div>';
				if (checkCJP(id, obj[bk][i])) {
					div.classList.add('killpoi');
					delete obj[bk][i];
				}
			}
		}
	};
	return {
		poi,
		kill
	};
}
//------------------------------------------------------------判断落子范围
function checkpoi(dropid) {
	poi = activeqz.poi;
	kill = activeqz.kill;
	return (poi.includes(dropid) || kill.includes(dropid));
}
//============================================================将军
function checkJP(cid) {
	let c = chessData[cid[0]].color;
	let blocks = getblocks();
	let bks = getblocks(c);
	let flag = Object.keys(bks).some(bk => {
		let id = bks[bk];
		let i = chessData[id.slice(-2, -1)].index;
		let killp = getpath[i](id.slice(-2))[1];
		return killp.some(k => blocks[k].match(/j|J/g));
	});
	if (flag) {
		let cid = c == 'red' ? 'j0' : 'J0';
		let [row, col] = gameinfo[cid].pos;
		let div = document.createElement('div');
		div.innerHTML = '<div></div>';
		div.className = 'kill killpoi jiangjun';
		div.style.transform = `translate(${col*80}px,${row*80}px)`;
		blank2.appendChild(div);
		/**/
		let li = document.querySelector('.li' + c + ':last-child');
		li.classList.add('jiang');
		// console.log('将军');
		// setTimeout(() => {
		// 	// div.classList.remove('jiangjun');
		// }, 600);
	}
}
//-------------------------------------------------------被将军（影响落子范围）
function checkBJP(cid, bk) { //cid:J0,bk:div-8-4
	let c = chessData[cid[0]].color;
	let pos = gameinfo[cid].pos;
	let [, y, x] = bk.split('-');
	gameinfo[cid].pos = [y * 1, x * 1];
	let blocks = getblocks();
	let color = c == 'red' ? 'black' : 'red';
	let bks = getblocks(color);
	let flag = Object.keys(bks).some(bk1 => {
		let id = bks[bk1].slice(-2);
		let i = chessData[id[0]].index;
		let killp = getpath[i](id)[1];
		return killp.some(k => chessData[blocks[k].slice(-2, -1)].index == 0);
	});
	flag = flag || checkJJ();
	gameinfo[cid].pos = pos;
	return flag;
}

function checkCJP(cid, bk) {
	let c = chessData[cid[0]].color;
	let poi = gameinfo[cid].pos;
	let blocks = getblocks();
	let _cid = blocks[bk].split('-')[1];
	let _poi = gameinfo[_cid].pos;
	gameinfo[cid].pos = _poi;
	gameinfo[_cid].pos = null;
	blocks = getblocks();
	let color = c == 'red' ? 'black' : 'red';
	let bks = getblocks(color);
	let flag = Object.keys(bks).some(bk1 => {
		let id = bks[bk1].slice(-2);
		let i = chessData[id[0]].index;
		let killp = getpath[i](id)[1];
		return killp.some(k => chessData[blocks[k].slice(-2, -1)].index == 0);
	});
	flag = flag || checkJJ();
	gameinfo[cid].pos = poi;
	gameinfo[_cid].pos = _poi;
	return flag;
}
//----------------------------------------------------------判断双方将帅对脸
function checkJJ() {
	let rpos = gameinfo['J0'].pos,
		bpos = gameinfo['j0'].pos;
	let [ry, rx] = rpos;
	let [by, bx] = bpos;
	let bks = [];
	let blocks = getblocks();
	let flag = false;
	if (roll < 0)[ry, by] = [by, ry];
	if (rx == bx) {
		for (let i = by + 1; i < ry; i++) {
			bks.push(`div-${i}-${rx}`);
		}
		flag = bks.every(bk => !Object.keys(blocks).includes(bk));
	}
	return flag;
}
//=======================================================判断困毙（未完成）
function gameOver(c) { //************只判断了 无棋子可吃，无落子范围的情况*******************
	let bks = getblocks(c);
	let flag = true;
	for (let bk in bks) {
		let id = bks[bk].slice(-2);
		let i = chessData[id[0]].index;
		let pp = getpath[i](id)[0];
		let kk = getpath[i](id)[1];
		flag = flag && pp.every(bk => checkBJP(id, bk));
		flag = flag && kk.every(bk => checkCJP(id, bk));
	}
	if (flag) {
		console.log(c, '困毙！！');
		let color = c == 'red' ? 'black' : 'red';
		let img = document.createElement('img');
		img.src = '../img/' + color + '.png';
		img.className = 'ying';
		blank2.appendChild(img);
		// console.log(color, '获胜！！');
		// start = false;
		gameover=true
		markhidden()
	}
}
/*
for (let i = 0; i < 10; i++) {
	for (let j = 0; j < 9; j++) {
		let div = document.createElement('div');
		div.className = 'dot';
		div.style.transform = `translate(${80*j}px,${80*i}px)`;
		div.style.background = 'url(../img/red-1.jpg) 0 0/70px 70px';
		blank1.appendChild(div);
	}
}
*/
function deepClone(obj) {
	if (!obj?.constructor.name.match(/Object|Array/)  || obj == null) return obj;
	let result = Array.isArray(obj) ? [] : {};
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			result[key] = deepClone(obj[key]);
		}
	}
	return result;
}

values['j']=deepClone(values['J']) ;
values['s']=deepClone(values['S']);
values['x']=deepClone(values['X']);
values['c']=deepClone(values['C']).reverse();
values['m']=deepClone(values['M']).reverse();
values['p']=deepClone(values['P']).reverse();
values['z']=deepClone(values['Z']).reverse();
