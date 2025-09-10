
//-------------------------------------------------------------------------
const btn_1 = document.querySelector('#btn-1');
//=========================================================================按钮事件
btn_1.onclick = () => {
	setLevel(level);
};
btn1.onclick = () => { //编辑棋局
	// dragdrop();
	clearQP();
	level = '99';
	Maps['99'] = '';
};
btn2.addEventListener('click', output); //导出棋局
btn3.onclick = () => {
	reback();
	// reback();
}; //悔棋
btn5.addEventListener('click', hiddenQZ); //隐藏棋子

btn4.onclick = () => { //开始
	let blocks = Object.keys(getblocks());
	if (start || blocks.length == 0||gameover) return;
	activeqz.id=null;
	markhidden();
	start = 'red';
	editor = false;
	hiddenQZ();
	btn4.classList.add('start');
	// dragdropRM();
	if (level == '99') {
		Maps['99'] = getMapinfoStr();
		levels['99'] = createMap2(99, 1);
		console.log('临时棋局:', Maps['99'], levels[99]);
	}
	// getMap();
};
btn6.onclick = () => { //演示棋局
	if (level == 0) return;
	if (start) setLevel(level);
	start = 'red';
	replays = true;
	replay1(historys[level - 1]);
};
//======================================================获取游戏残局
aside1.addEventListener('click', function(ev) {
	start = false;
	editor = true;
	replays = false;
	row_reverse = false;
	col_reverse = false;
	let div = ev.target;
	if (div.tagName == 'SPAN') div = ev.target.parentElement;
	level = div.getAttribute('level') || 0;
	setLevel(level);
	/**/
	setTimeout(() => {
		let res1 = document.getElementById('res');
		res1.innerHTML = '';
		let pre = document.createElement('pre');
		pre.innerHTML = Maps[level];
		res1.appendChild(pre);
		pre = document.createElement('pre');
		pre.innerHTML = createMap2(level);
		res1.appendChild(pre);
		pre = document.createElement('pre');
		pre.innerHTML = createMap(level);
		res1.appendChild(pre);
		pre = document.createElement('pre');
		pre.innerHTML = createMap1(level);
		res1.appendChild(pre);
	}, 500);
});
//-------------------------------
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
//----------------------------------------------
blank1.addEventListener('click', ev => {
	let div = ev.target;
	let [color, id] = div.id.split('-');
	if (start == false||gameover) {
		if (editor) {
			if(div.id!='blank-1'){
				activeqz.id=div.id;
				let pos = gameinfo[id].pos||gameinfo[id].pos1;
			markQZ(pos);
			}else{
				if(activeqz.id==null)return;
				let [x, y] = [~~(ev.layerX / 80), ~~(ev.layerY / 80)];
				let pos = [y, x];
				moveQZ(activeqz.id, pos);
				markmoveQZ(pos);
			}
			
		}
		return;
	};
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
			// setTimeout(() => {
			// 	chessAI();
			// }, 500);
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
				// setTimeout(() => {
				// 	chessAI(); 
				// }, 500);
			}
		}
	}
});
//==========================================左右翻转
btn7.onclick = () => {
	col_reverse = !col_reverse;
	overturn('col');
};
//==========================================上下翻转
btn8.onclick = () => {
	roll = -roll;
	row_reverse = !row_reverse;
	overturn('row');
};

function overturn(c) {
	blank2.innerHTML = '';
	markhidden();
	if (!c.match(/row|col/)) return;
	for (let qz in gameinfo) {
		let pos = gameinfo[qz].pos;
		if (pos != null) {
			let [row, col] = pos;
			if (c == 'row') {
				row = 9 - row;
			} else {
				col = 8 - col;
			}
			let div = gameinfo[qz].dom;
			gameinfo[qz].pos = [row, col];
			div.style.transform = `translate(${col*80}px,${row*80}px)`;
		}
	}
}
btn9.onclick = () => {
	blank2.innerHTML = '';
	markhidden();
	let obj = {};
	for (let qz in gameinfo) {
		obj[qz] = obj[qz] || { pos: [] };
		let info = gameinfo[qz];
		let div = info.dom;
		div.id = '_' + div.id;
		info.dom = div;
		obj[qz].pos = null;
		obj[qz].dom = div;
		if (info.pos != null) obj[qz].pos = info.pos.slice(0);
	}
	let keys = Object.keys(obj);
	let _keys = keys.map(n => 'jcmxspz'.includes(n[0]) ? n.toUpperCase() : n.toLowerCase());
	_keys.forEach((_qz, i) => {
		let qz = keys[i];
		gameinfo[_qz].pos = obj[qz].pos;
		let color = chessData[qz[0]].color;
		let _color = chessData[_qz[0]].color;
		let div = obj[qz].dom;
		div.classList.remove(color);
		div.classList.add(_color);
		div.id = _color + '-' + _qz;
		div.innerHTML = chessData[_qz[0]].name;
		gameinfo[_qz].dom = div;
	});
	// start=start=='red'?'black':'red';
	activeqz = {};
};
//-------------------------------历史记录
document.querySelector('.hisaside').onclick = ev => {
	if (timer) { clearInterval(timer); }
	timer = undefined;
	hisinfo.step = 0;
	hisinfo.map = null;
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 9; j++) {
			if (!!gamemap[i][j]) {
				let div = document.getElementById(gamemap[i][j]);
				div.style.transform = `translate(${j*80}px,${i*80}px)`;
			}
		}
	}
	//记录
	hiddenQZ(1);
	if (ev.target.tagName != 'LI') return;
	let index = ev.target.innerText.split('-')[1] - 1;
	hisinfo.index = index;
	let d = hisinfo.data[index];
	hisdiv.innerHTML = '';
	for (let i = 0; i < d.length; i++) {
		let title = d[i].title;
		let c = d[i].color;
		let li = document.createElement('li');
		li.tabIndex = (i + 1);
		li.className = 'hisli li' + c;
		li.innerHTML = title;
		hisdiv.appendChild(li);
	}
};
//-----------------------------------------------------------
hisol.onclick = ev => {
	if (timer) { clearInterval(timer);
		timer = undefined; }
	if (ev.target.tagName != 'LI') return;
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 9; j++) {
			if (!!gamemap[i][j]) {
				let div = document.getElementById(gamemap[i][j]);
				div.style.transform = `translate(${j*80}px,${i*80}px)`;
			}
		}
	}
	let n = ev.target.tabIndex;
	setHistoryStep(n);
};
//===========================================================历史回放：开始/暂停
let playstart = document.querySelector('.playlist.start');
playstart.onclick = () => {
	if (timer) { clearInterval(timer);
		timer = undefined; return; }
	let index = hisinfo.index;
	let d = hisinfo.data[index];
	if (hisinfo.step == 0)
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 9; j++) {
				if (!!gamemap[i][j]) {
					let div = document.getElementById(gamemap[i][j]);
					div.style.transform = `translate(${j*80}px,${i*80}px)`;
				}
			}
		}
	hisinfo.map = hisinfo.map || deepClone(gamemap);
	let map = hisinfo.map;
	timer = setInterval(() => {
		let i = hisinfo.step;
		if (hisinfo.step >= d.length) {
			clearInterval(timer);
			return;
		};
		let [r1, c1] = d[i].pos;
		let [r2, c2] = d[i].moveto;
		let id1 = map[r1][c1];
		let id2 = map[r2][c2];
		if (id2) {
			let div = document.getElementById(id2);
			div.style.transform = 'scale(0)';
		}
		map[r2][c2] = id1;
		delete map[r1][c1];
		let div = document.getElementById(id1);
		div.style.transform = `translate(${c2*80}px,${r2*80}px)`;
		hisinfo.step++;
	}, 1000);
};
//==================================================历史回放：上一步
let playpre = document.querySelector('.playlist.pre');
playpre.onclick = () => {
	if (hisinfo.step > 0) {
		hisinfo.step--;
	} else {
		hisinfo.step = 0;
	}
	n = hisinfo.step;
	setHistoryStep(n);
};
//==================================================历史回放：下一步
let playnext = document.querySelector('.playlist.next');
playnext.onclick = () => {
	let index = hisinfo.index;
	if (hisinfo.step < hisinfo.data[index].length) {
		hisinfo.step++;
	} else {
		hisinfo.step = hisinfo.data[index].length;
	}
	n = hisinfo.step;
	setHistoryStep(n);
};

function initHistory() {
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 9; j++) {
			if (!!gamemap[i][j]) {
				let div = document.getElementById(gamemap[i][j]);
				div.style.transform = `translate(${j*80}px,${i*80}px)`;
			}
		}
	}
}

function setHistoryStep(n) {
	if (n == 0 || n > hisinfo.data[hisinfo.index].length) {
		initHistory();
		return;
	}
	hisinfo.step = n;
	let index = hisinfo.index;
	let d = hisinfo.data[index].slice(0, n);
	let map = deepClone(gamemap);
	hisinfo.map = map;
	for (let i = 0; i < d.length; i++) {
		let [r1, c1] = d[i].pos;
		let [r2, c2] = d[i].moveto;
		if (row_reverse) {
			r1 = 10 - r1;
			r2 = 10 - r2;
		}
		if (col_reverse) {
			c1 = 9 - c1;
			c2 = 9 - c2;
		}
		let id1 = map[r1][c1];
		let id2 = map[r2][c2];
		if (id2) {
			let div = document.getElementById(id2);
			div.style.transform = 'scale(0)';
		}
		map[r2][c2] = id1;
		delete map[r1][c1];
		let div = document.getElementById(id1);
		div.style.transform = `translate(${c2*80}px,${r2*80}px)`;
	}
}