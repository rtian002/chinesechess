var level = 0;
var game_history = [];
var gameinfo = JSON.parse(JSON.stringify(levels[0]));
var blank1 = document.querySelector('#blank-1');
var blank2 = document.getElementById('blank-2');
var chessinfo = {};
var editor = false;
var start = false;
var replays = false;
var hisdiv = { 'red': document.getElementById('hisred'), 'black': document.getElementById('hisblack') };

function setmark() {
	let dom = document.getElementById('aside3'),
		m = '１２３４５６７８９九八七六五四三二一';
	for (n = 0; n < 2; n++) {
		dom = n ? document.getElementById('aside4') : dom;
		for (let i = 0; i < 9; i++) {
			let div = document.createElement('div');
			div.className = 'mark';
			div.innerHTML = m[i + 9 * n];
			div.style.transform = `translate(${i*80+40}px,0)`;
			dom.appendChild(div);
		}
	}
}
setmark();

function init() {
	for (let i = 0; i < levels.length; i++) {
		aside1.innerHTML += '<img src="https://s.128877.xyz/chessMaps/level' + i + '.jpg" level="' + i + '">';
	}
	for (let c in gameinfo) {
		let info = { 'black': 'JCMXSPZ', 'red': 'jcmxspz' },
			i = 0;
		for (let qz in gameinfo[c]) {
			for (let j = 0; j < gameinfo[c][qz].length; j++) {
				var qizi = document.createElement('div');
				qizi.className = 'qizi ' + c;
				let imgid = `${c}-${i}`;
				qizi.style.background = 'url(https://s.128877.xyz/img/' + imgid + '.jpg) 0 0/70px 70px';
				qizi.id = `${c}-${i}-${info[c][i]}${j}`;
				// qizi.id=`${c}-${info[c][i]}${j}`;
				let data = gameinfo[c][qz][j];
				let [y, x] = [~~(data / 9), data % 9];
				qizi.style.transform = `translate(${x*80}px,${y*80}px)`;
				qizi.setAttribute('index', i);
				blank1.appendChild(qizi);
				chessinfo[qizi.id] = y * 9 + x * 1;
				gameinfo[c][qz][j] = qizi;
			}
			i++;
		}
	}
	setmark();
}
init();
var play = {};
play.map = Array.from(new Array(10)).map(n => new Array(9));
play.mans = com.mans = {};
play.pace = [];
play.my = 1;
play.isFoul = false;
play.AI=false;
function getMap() {
	play.map = Array.from(new Array(10)).map(n => new Array(9));
	play.mans = com.mans = {};
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
	let droppos = chessinfo[dropid];
	moveQZ(dragid, droppos);
	removeQZ(dropid);
	if (start) hiddQZ(dropid);
}

function removeQZ(dropid) {
	let c = dropid.split('-')[0];
	let dropdiv = document.getElementById(dropid);
	let index = dropid.split('-')[1];
	let top = 200 + index * 55,
		left = 875;
	if (c == 'red') {
		left += 60;
	};
	chessinfo[dropid] = null;
	if (replays) dropdiv.style.transform = 'scale(0)';
	setTimeout(function() {
		dropdiv.style.transform = `translate(${left}px,${top}px) scale(0.75)`;
	}, 100);
}

function moveQZ(id, pos) {
	let div = document.getElementById(id);
	let [x, y] = [~~(pos / 9), pos % 9];
	div.style.zIndex = 99;
	div.style.transform = `translate(${y*80}px,${x*80}px)`;
	setTimeout(() => { div.style.zIndex = 0; }, 300);
	chessinfo[id] = pos;
}

function recode_history(id1, p1, p2, id2 = null) {
	if (!start) return;
	let [c, q] = id1.split('-');
	let tit = move[q](id1, p1, p2);
	let rec = { 'player': c, 'move': [id1, p1, p2], 'kill': '', title: tit };
	if (!!id2) rec.kill = id2;
	let li = document.createElement('li');
	li.className = 'hisli li' + c;
	li.innerHTML = tit;
	hisdiv[c].appendChild(li);
	game_history.push(rec);
}

function clearQP() {
	start = false;
	editor = true;
	game_history = [];
	play.pace = [];
	clearInterval(timer);
	let blocks = getblocks();
	for (let bid in blocks) {
		let id = blocks[bid];
		removeQZ(id);
	}
	btn4.classList.remove('start');
	btn5.innerHTML = '显示余子';
	hiddenQZ();
	markhidden();
	blank2.innerHTML = '';
	hisdiv['red'].innerHTML = '';
	hisdiv['black'].innerHTML = '';
	activeqz.id = null;
}

function getblocks(c = '-') {
	let obj = {};
	for (let qz in chessinfo) {
		if (chessinfo[qz] == null || !qz.includes(c)) continue;
		let pos = chessinfo[qz];
		let bid = `div-${pos}`;
		obj[bid] = qz;
	}
	return obj;
}

function getLevel(lv) {
	for (let c in lv) {
		for (let qz in lv[c]) {
			for (let i = 0; i < lv[c][qz].length; i++) {
				let pos = lv[c][qz][i];
				let div = gameinfo[c][qz][i];
				let id = div.id;
				moveQZ(id, pos);
			}
		}
	}
}

function setLevel(lv) {
	let blocks = getblocks();
	if (Object.keys(blocks).length > 0) {
		clearQP();
		setTimeout(() => getLevel(lv), 300);
	} else {
		getLevel(lv);
	}
};
//---------------------------------------------------------------------
function drag(ev) {
	ev.dataTransfer.setData('id', ev.target.id);
}

function allowDrop(ev) {
	if (!start && !editor) return;
	ev = ev || window.event;
	ev.preventDefault();
}

function drop(ev) {
	ev = ev || window.event;
	ev.preventDefault();
	ev.stopPropagation();
	let dragid = ev.dataTransfer.getData('id');
	let dropid = ev.target.id;
	let dragpos = chessinfo[dragid];
	let droppos = chessinfo[dropid];
	if (dragid.split('-')[0] == dropid.split('-')[0]) return;
	if (dragpos == null) return;
	swapQZ(dragid, dropid);
	recode_history(dragid, dragpos, droppos, dropid);
}

function drop1(ev) {
	[x, y] = [~~(ev.layerX / 80), ~~(ev.layerY / 80)];
	let id = ev.dataTransfer.getData('id');
	var uid = y * 9 + x;
	let str = 'div-' + uid;
	let blocks = getblocks();
	if (blocks[str] != null) return;
	let p1 = chessinfo[id];
	moveQZ(id, uid);
	recode_history(id, p1, uid);
}

function dragdrop() {
	Object.keys(chessinfo).forEach(id => {
		let qizi = document.getElementById(id);
		qizi.setAttribute('draggable', 'true');
		qizi.setAttribute('ondragstart', 'drag(event)');
		qizi.setAttribute('ondragover', 'allowDrop(event)');
		qizi.setAttribute('ondrop', 'drop(event)');
	});
	blank1.setAttribute('ondragover', 'allowDrop(event)');
	blank1.setAttribute('ondrop', 'drop1(event)');
}

function dragdropRM() {
	Object.keys(chessinfo).forEach(id => {
		let qizi = document.getElementById(id);
		qizi.removeAttribute('draggable');
		qizi.removeAttribute('ondragstart');
		qizi.removeAttribute('ondragover');
		qizi.removeAttribute('ondrop');
	});
	blank1.removeAttribute('ondragover');
	blank1.removeAttribute('ondrop');
}
//-------------------------------------------------------------------------
//=========================================================================按钮事件
btn1.onclick = () => { //编辑棋局
	dragdrop();
	clearQP();
};
btn2.addEventListener('click', outDisplay); //导出棋局
btn3.onclick = () => {
	reback();
	reback();
}; //悔棋
btn5.addEventListener('click', hiddenQZ); //隐藏棋子
btn4.onclick = () => { //开始
	let blocks = Object.keys(getblocks());
	if (start || blocks.length == 0) return;
	start = 'red';
	editor = false;
	hiddenQZ();
	btn4.classList.add('start');
	dragdropRM();
	getMap();
};
btn6.onclick = () => { //演示棋局
	if (level == 0) return;
	if (start) setLevel(levels[level]);
	start = 'red';
	replays = true;
	replay1(historys[level - 1]);
};
aside1.addEventListener('click', function(ev) {
	start = false;
	editor = true;
	replays = false;
	let img = ev.target;
	level = img.getAttribute('level') || 0;
	setLevel(levels[level]);
});
tit1.onclick = () => {
	if (!start) {
		activeqz.id = null;
		start = 'red';
	}
};
tit2.onclick = () => {
	if (!start) {
		activeqz.id = null;
		start = 'black';
	}
};
//==========================================================================
function output() {
	var data = '0'.repeat(90).split('');
	for (let qz in chessinfo) {
		if (chessinfo[qz] != null) {
			let tit = qz.slice(-2,-1);
			let id = chessinfo[qz];
			data[id] = tit;
		}
	}
	data = data.join('').match(/.{9}/g);
	let res = data.map(n => n.match(/(\d{1,9}|\D{1,9})/g)).map(n => n.map(m => isNaN(m) ? m : m.length).join('')).join('');
	console.log(res);
	return res;
}

function outDisplay() {
	dragdropRM();
	let blocks = getblocks();
	let out = { 'red': {}, 'black': {} };
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
	/*	=====================================================================*/
	//导出棋盘图片
	let dom = document.querySelector('#main');
	//----------导出时调整样式，白色背景，黑色线条
	let style = document.createElement('style');
	style.innerHTML = `
				#blank-0,#blank-1::before{
					border-color: #111;
				}
				#blank-0 td,#blank-0 hr,#blank-0 td::after,#blank-0 td::before{
					border-color: #333;
				}
				#blank-0::before,#blank-0::after{
					color: #333;
				}
				`;
	dom.appendChild(style);
	//----------
	window.domtoimage.toJpeg(dom, { bgcolor: '#fff', width: 800 }).then(dataUrl => {
		dom.removeChild(style);
		let link = document.createElement('a');
		link.download = 'level' + level + '.jpg';
		link.href = dataUrl;
		link.click();
	});
};
//=============================================
//历史记录
//===========================================================================棋步记录
var shuzi = '123456789九八七六五四三二一';

function move1(qz, p1, p2) {
	p1 = [~~(p1 / 9), p1 % 9];
	p2 = [~~(p2 / 9), p2 % 9];
	let info = qz.split('-');
	let color = info[0];
	let title = chess[color][info[1]];
	let px = shuzi[p1[1]];
	let str = title + px;
	if (color == 'black') {
		if (p1[1] == p2[1]) {
			let n = p1[0] - p2[0];
			str += (n < 0 ? '进' : '退') + Math.abs(n);
		} else {
			let n = shuzi[p2[1] + (color == 'black' ? 0 : 9)];
			str += '平' + n;
		}
	} else {
		px = shuzi[p1[1] + 9];
		str = title + px;
		if (p1[1] == p2[1]) {
			let n = p1[0] - p2[0];
			str += (n > 0 ? '进' : '退') + Math.abs(n);
		} else {
			let n = shuzi[p2[1] + 9];
			str += '平' + n;
		}
	}
	// console.log(color, str);
	return str;
}

function move2(qz, p1, p2) {
	p1 = [~~(p1 / 9), p1 % 9];
	p2 = [~~(p2 / 9), p2 % 9];
	let info = qz.split('-');
	let color = info[0];
	let title = chess[color][info[1]];
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
	'0': function(qz, p1, p2) { return move1(qz, p1, p2); },
	'1': function(qz, p1, p2) { return move1(qz, p1, p2); },
	'2': function(qz, p1, p2) { return move2(qz, p1, p2); },
	'3': function(qz, p1, p2) { return move2(qz, p1, p2); },
	'4': function(qz, p1, p2) { return move2(qz, p1, p2); },
	'5': function(qz, p1, p2) { return move1(qz, p1, p2); },
	'6': function(qz, p1, p2) { return move1(qz, p1, p2); },
};
//--------------------------------------------------------------------悔棋
function reback() {
	if (game_history.length == 0 || replays == true) return;
	let qzinfo = game_history.pop();
	let [qz, p1, p2] = qzinfo.move;
	let [x, y] = [~~(p1 / 9), p1 % 9];
	let div = document.getElementById(qz);
	let id = div.id;
	div.style.transform = `translate(${y*80}px,${x*80}px)`;
	chessinfo[qz] = p1;
	let c = qz.split('-')[0];
	let li = document.querySelector(`.li${c}:last-child`);
	li.parentElement.removeChild(li);
	markQZ(p1);
	start = start == 'red' ? 'black' : 'red';
	activeqz.id = qz;
	if (qzinfo.kill) {
		qz = qzinfo.kill;
		[x, y] = [~~(p2 / 9), p2 % 9];
		div = document.getElementById(qz);
		div.style.display = 'block';
		div.style.transform = `translate(${y*80}px,${x*80}px)`;
		chessinfo[qz] = p2;
	}
	showpoi(id);
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
	if (!his) { console.log('无该局记录'); return; }
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
function hiddenQZ() {
	if (start && editor) return;
	let btn = document.getElementById('btn5');
	let str = btn.innerHTML;
	let h = str == '显示余子' ? 'block' : 'none';
	for (let qz in chessinfo) {
		if (chessinfo[qz] == null) hiddQZ(qz, h);
	}
	str = btn.innerHTML == '显示余子' ? '隐藏余子' : '显示余子';
	btn.innerHTML = str;
}

function hiddQZ(qz, h = 'none') {
	let div = document.getElementById(qz);
	div.style.display = h;
}
blank1.addEventListener('click', ev => { getQZ(ev); });
var activeqz = { id: null, poi: [], kill: [] };
//====================================================================下棋
function getQZ(ev) {
	if (start == false) return;
	let div = ev.target;
	let id = div.id;
	let [color, index] = id.split('-');
	if (activeqz.id == null) {
		if (color == start) {
			activeqz.id = id;
			let pos = chessinfo[id];
			showpoi(id);
			markQZ(pos);
		}
	} else {
		if (id == 'blank-1') { //走棋子
			let [x, y] = [~~(ev.layerX / 80), ~~(ev.layerY / 80)];
			let pos = y * 9 + x;
			let p1 = chessinfo[activeqz.id];
			if (!checkpoi('div-' + pos)) return;
			moveQZ(activeqz.id, pos);
			blank2.innerHTML = '';
			markmoveQZ(pos);
			recode_history(activeqz.id, p1, pos);
			checkJP(activeqz.id);
			start = start == 'red' ? 'black' : 'red';
			let str = [p1 % 9, ~~(p1 / 9), pos % 9, ~~(pos / 9)].join('');
			play.pace.push(str);
			gameOver(start);
			activeqz.id = null;
			play.AI&&setTimeout(() => {
				chessAI();
			}, 500);
		} else { //
			if (id == activeqz.id) return;
			let pos = chessinfo[id];
			let p1 = chessinfo[activeqz.id];
			if (color == activeqz.id.split('-')[0]) { //同色重新选棋子
				activeqz.id = id;
				showpoi(id);
				markQZ(pos);
			} else { //走棋吃棋子
				if (!checkpoi('div-' + pos)) return;
				swapQZ(activeqz.id, id);
				blank2.innerHTML = '';
				markmoveQZ(pos);
				recode_history(activeqz.id, p1, pos, id);
				checkJP(activeqz.id);
				start = start == 'red' ? 'black' : 'red';
				let str = [p1 % 9, ~~(p1 / 9), pos % 9, ~~(pos / 9)].join('');
				play.pace.push(str);
				gameOver(start);
				activeqz.id = null;
				play.AI&&setTimeout(() => {
					chessAI();
				}, 500);
			}
		}
	}
}

function chessAI() {
	// return;
	play.my = -1;
	getMap();
	play.isFoul = checkFoul();
	let blocks = getblocks();
	let ai = AI.init(play.pace.join(''));
	if (!ai) {
		gameOver('black');
		return;
	}
	play.pace.push(ai.join(''));
	let _p1 = ai[1] * 9 + ai[0];
	let _p2 = ai[3] * 9 + ai[2];
	let id = play.map[ai[1]][ai[0]];
	let div = document.querySelector(`[id$=${id}]`);
	let cid = div.id;
	if (Object.keys(blocks).includes('div-' + _p2)) {
		let _cid = blocks['div-' + _p2];
		swapQZ(cid, _cid);
		recode_history(cid, _p1, _p2, _cid);
	} else {
		moveQZ(cid, _p2);
		recode_history(cid, _p1, _p2);
	}
	markhidden();
	start = 'red';
	gameOver('red');
}
//--------------------------------------------------------------------标记棋子
function markQZ(pos) {
	let [x, y] = [~~(pos / 9), pos % 9];
	let mdiv = document.querySelector('.moveqz');
	let adiv = document.querySelector('.activeqz');
	mdiv.classList.remove('hidden', 'move');
	adiv.classList.remove('hidden');
	adiv.style.transform = `translate(${y*80}px,${x*80}px)`;
	mdiv.style.transform = `translate(${y*80}px,${x*80}px)`;
}

function markmoveQZ(pos) {
	let [x, y] = [~~(pos / 9), pos % 9];
	let mdiv = document.querySelector('.moveqz');
	let adiv = document.querySelector('.activeqz');
	adiv.style.transform += ' scale(0.8)';
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
	'0': function(id) { return getaround_j(id); }, //将
	'1': function(id) { return getaround_cp(id); }, //车炮
	'2': function(id) { return getaround_m(id); }, //马
	'3': function(id) { return getaround_x(id); }, //相
	'4': function(id) { return getaround_s(id); }, //士
	'5': function(id) { return getaround_cp(id); }, //车炮
	'6': function(id) { return getaround_b(id); } //兵
};

function getaround_j(id) { //========================将
	let color = id.split('-')[0];
	let arr = [],
		kill = [];
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = chessinfo[id];
	let [y, x] = [~~(pos / 9), pos % 9];
	let poi = [];
	for (let i = -1; i <= 1; i++) {
		for (let j = -1; j <= 1; j++) {
			let p = (x + i) + (y + j) * 9;
			let exp = (x + i >= 3) && (x + i < 6) && (y + j >= (color == 'red' ? 7 : 0)) && (y + j < (color == 'red' ? 10 : 3));
			if (Math.abs(i) != Math.abs(j) && exp) poi.push('div-' + p);
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
	let [color, index] = id.split('-');
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = chessinfo[id];
	let [y, x] = [~~(pos / 9), pos % 9];
	let arr = [],
		kill = [];
	let flag = true;
	checkP(-1, 0), checkP(1, 0), checkP(0, -1), checkP(0, 1);
	return [arr, kill];

	function checkbk(bk) {
		if (blocks.includes(bk)) {
			if (flag && index == '5') { flag = false; } else {
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
			let bk = yy == 0 ? 'div-' + (x + i + y * 9) : 'div-' + (x + (y + i) * 9);
			if (checkbk(bk)) break;
		}
	}
}

function getaround_m(id) { //========================马
	let color = id.split('-')[0];
	let arr = [],
		kill = [];
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = chessinfo[id];
	let [y, x] = [~~(pos / 9), pos % 9];
	//-----------------------------------左右方向
	checkP(0, -1), checkP(0, 1), checkP(-1, 0), checkP(1, 0);
	return [arr, kill];

	function checkP(xx, yy) {
		if (x + xx * 2 < 0 || x + xx * 2 > 8 || y + yy * 2 < 0 || y + yy * 2 > 9) return;
		let bk = 'div-' + (x + xx + (y + yy) * 9);
		if (!blocks.includes(bk)) {
			if (xx == 0) {
				if (x + 1 < 9) checkbk('div-' + (x + 1 + (y + yy * 2) * 9));
				if (x - 1 >= 0) checkbk('div-' + (x - 1 + (y + yy * 2) * 9));
			} else {
				if (y + 1 < 10) checkbk('div-' + (x + xx * 2 + (y + 1) * 9));
				if (y - 1 >= 0) checkbk('div-' + (x + xx * 2 + (y - 1) * 9));
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
	let color = id.split('-')[0];
	let arr = [],
		kill = [];
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = chessinfo[id];
	let [y, x] = [~~(pos / 9), pos % 9];
	checkP(-1, -1), checkP(-1, 1), checkP(1, -1), checkP(1, 1);
	return [arr, kill];

	function checkP(xx, yy) {
		if (x + xx < 0 || x + xx > 8 || y + yy < 0 || y + yy > 9) return;
		if ((color == 'red' && y + yy < 5) || (color == 'black' && y + yy > 4)) return;
		let bk1 = `div-${(x+xx)+(y+yy)*9}`;
		let bk = `div-${(x+xx*2)+(y+yy*2)*9}`;
		if (blocks.includes(bk1)) return;
		if (blocks.includes(bk)) {
			if (!info[bk].includes(color)) kill.push(bk);
		} else {
			arr.push(bk);
		}
	}
}

function getaround_s(id) { //========================士
	let obj = { 'red': [76, 84, 86, 66, 68], 'black': [13, 3, 5, 21, 23] };
	let color = id.split('-')[0];
	let arr = obj[color].slice(1),
		kill = [];
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = chessinfo[id];
	if (pos != obj[color][0]) arr = obj[color].slice(0, 1);
	arr = arr.map(n => 'div-' + n).filter(bk => {
		if (blocks.includes(bk)) {
			if (!info[bk].includes(color)) kill.push(bk);
		} else {
			return bk;
		}
	});
	return [arr, kill];
}

function getaround_b(id) { //========================兵
	let color = id.split('-')[0];
	let arr = [],
		kill = [];
	let info = getblocks();
	let blocks = Object.keys(info);
	let pos = chessinfo[id];
	let [y, x] = [~~(pos / 9), pos % 9];
	let yy = color == 'red' ? -1 : 1;
	if (y + yy < 0 || y + yy > 9) yy = 0;
	let n = 1;
	if ((color == 'red' && y > 4) || (color == 'black' && y < 5)) n = 0;
	for (let i = -n; i <= n; i++) {
		let j = i == 0 ? yy : 0;
		let bk = 'div-' + (x + i + (y + j) * 9);
		if (blocks.includes(bk)) {
			if (!info[bk].includes(color)) kill.push(bk);
		} else {
			arr.push(bk);
		}
	}
	return [arr, kill];
}
//===============================================================显示落子范围
function getAround(id) {
	let index = id.split('-')[1];
	let [poi, kill] = getpath[index](id);
	let obj = { poi, kill };
	for (let bk in obj) {
		for (let i = 0; i < obj[bk].length; i++) {
			if (obj[bk].length == 0) break;
			let pos = obj[bk][i].split('-')[1];
			let [y, x] = [~~(pos / 9), pos % 9];
			if (bk == 'poi' && checkBJP(id, obj[bk][i]) || bk == 'kill' && checkCJP(id, obj[bk][i])) {
				obj[bk][i] = 'false-' + obj[bk][i];
			}
		}
	};
	console.log(obj);
	let arr = Object.values(obj).flat().filter(n => !n.includes('false')).map(n => { m = n.split('-')[1]; return ([m % 9, ~~(m / 9)]); });
	return arr;
}

function getMoves(my) {
	let c = my == 1 ? 'red' : 'black';
	let moves = [];
	let bks = getblocks(c);
	for (let bk in bks) {
		let id = bk.split('-')[1];
		let [x, y] = [id % 9, ~~(id / 9)];
		let cid = bks[bk];
		let tit = cid.split('-')[2];
		let arr = getAround(cid);
		for (let i = 0; i < arr.length; i++) {
			moves.push([x, y, ...arr[i], tit]);
		}
	}
	return moves;
}

function showpoi(id) {
	let index = id.split('-')[1];
	let [poi, kill] = getpath[index](id);
	let obj = { poi, kill };
	activeqz.poi = poi;
	activeqz.kill = kill;
	blank2.innerHTML = '';
	for (let bk in obj) {
		for (let i = 0; i < obj[bk].length; i++) {
			if (obj[bk].length == 0) break;
			let pos = obj[bk][i].split('-')[1];
			let [y, x] = [~~(pos / 9), pos % 9];
			let div = document.createElement('div');
			div.className = bk;
			div.style.transform = `translate(${x*80}px,${y*80}px)`;
			blank2.appendChild(div);
			if (bk == 'poi') {
				if (checkBJP(id, obj[bk][i])) {
					div.classList.add('poikill');
					delete obj[bk][i];
				}
			} else {
			div.innerHTML='<div></div>';
				if (checkCJP(id, obj[bk][i])) {
					div.classList.add('killpoi');
					delete obj[bk][i];
				}
			}
		}
	};
	return { poi, kill };
}
//------------------------------------------------------------判断落子范围
function checkpoi(dropid) {
	poi = activeqz.poi;
	kill = activeqz.kill;
	return (poi.includes(dropid) || kill.includes(dropid));
}
//============================================================将军
function checkJP(cid) {
	let c = cid.split('-')[0];
	let blocks = getblocks();
	let bks = getblocks(c);
	let flag = Object.keys(bks).some(bk => {
		let id = bks[bk];
		let i = id.split('-')[1];
		let killp = getpath[i](id)[1];
		return killp.some(k => blocks[k].split('-')[1] == 0);
	});
	if (flag) {
		let color = c == 'red' ? 'black-0-J' : 'red-0-j';
		let cid = color + '0';
		let div = document.getElementById(cid);
		div.classList.add('poijiang');
		let li = document.querySelector('.li' + c + ':last-child');
		li.classList.add('jiang');
		// console.log('将军');
		setTimeout(() => {
			div.classList.remove('poijiang');
		}, 600);
	}
}
//-------------------------------------------------------被将军（影响落子范围）
function checkBJP(cid, bk) {
	let c = cid.split('-')[0];
	let poi = chessinfo[cid];
	chessinfo[cid] = bk.split('-')[1] * 1;
	let blocks = getblocks();
	let color = c == 'red' ? 'black' : 'red';
	let bks = getblocks(color);
	let flag = Object.keys(bks).some(bk1 => {
		let id = bks[bk1];
		let i = id.split('-')[1];
		let killp = getpath[i](id)[1];
		return killp.some(k => blocks[k].split('-')[1] == 0);
	});
	flag = flag || checkJJ();
	chessinfo[cid] = poi;
	return flag;
}

function checkCJP(cid, bk) {
	let c = cid.split('-')[0];
	let poi = chessinfo[cid];
	let blocks = getblocks();
	let _cid = blocks[bk];
	let _poi = chessinfo[_cid];
	chessinfo[cid] = _poi;
	chessinfo[_cid] = null;
	blocks = getblocks();
	let color = c == 'red' ? 'black' : 'red';
	let bks = getblocks(color);
	let flag = Object.keys(bks).some(bk1 => {
		let id = bks[bk1];
		let i = id.split('-')[1];
		let killp = getpath[i](id)[1];
		return killp.some(k => blocks[k].split('-')[1] == 0);
	});
	flag = flag || checkJJ();
	chessinfo[cid] = poi;
	chessinfo[_cid] = _poi;
	return flag;
}
//----------------------------------------------------------判断双方将帅对脸
function checkJJ() {
	let r = 'red-0-j0';
	let b = 'black-0-J0';
	let rpos = chessinfo[r],
		bpos = chessinfo[b];
	let rx = rpos % 9,
		ry = ~~(rpos / 9);
	let bx = bpos % 9,
		by = ~~(bpos / 9);
	let bks = [];
	let blocks = getblocks();
	let flag = false;
	if (rx == bx) {
		for (let i = by + 1; i < ry; i++) {
			bks.push('div-' + (bx + i * 9));
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
		let cid = bks[bk];
		let i = cid.split('-')[1];
		let pp = getpath[i](cid)[0];
		let kk = getpath[i](cid)[1];
		flag = flag && pp.every(bk => checkBJP(cid, bk));
		flag = flag && kk.every(bk => checkCJP(cid, bk));
	}
	if (flag) {
		// console.log(c, '困毙！！');
		let color = c == 'red' ? 'black' : 'red';
		let img = document.createElement('img');
		img.src = './img/' + color + '.png';
		img.className = 'ying';
		blank2.appendChild(img);
		// console.log(color, '获胜！！');
		// start = false;
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