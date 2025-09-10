//===========================================================
var game = {
	start: false,
	level: 0,
	getMapinfo: function() {
		let map = Array.from(new Array(10)).map(n => new Array(9));
		for (let qz in gameinfo) {
			if (gameinfo[qz].pos == null) continue;
			let [r, c] = gameinfo[qz].pos;
			map[r][c] = qz;
		}
		return map;
	},
	init: function() {},
	getLevel(lv) {},
	setLevel() {},
	clearBlank() {},
};
var gamemap = [],
	pieces = {};
class Piece {
	constructor(name, pos, div) {
		this.name = name;
		this.pos = pos;
		this.dom = document.getElementById(div);
		this.index = 'jcmxspz'.indexOf(name[0]) && 'JCMXSPZ'.indexOf(name[0]);
	}
	moveEndstr(pos) {
		let shuzi = '123456789九八七六五四三二一';
		if ('MXSmxs'.includes(this.name[0])) {
			return move2(this.name, this.pos, pos);
		} else {
			return move1(this.name, this.pos, pos);
		};

		function move1(qz, p1, p2) {
			let id = qz[0];
			let color = chessData[id].color;
			let title = chessData[id].name;
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
				console.log(p2[1] + 9);
				str = title + px1;
				str += (p1[0] > p2[0] ? '进' : '退') + px2;
			}
			// console.log(color, str);
			return str;
		}
	}
	moveTo(pos) {
		let div = this.dom;
		let [row, col] = pos;
		div.style.zIndex = 99;
		div.style.transform = `translate(${col*80}px,${row*80}px)`;
		setTimeout(() => {
			div.style.zIndex = 0;
		}, 300);
		return (this.moveEndstr(pos));
	}
	getAroundPois(flag = 'all') {
		var id = this.name;
		let index = this.index;
		var getAround = {
			'0': () => getAround_j(),
			'1': () => getAround_cp(),
			// '5': () => getAround_cp(),
			[id[0]]:()=>{
				if('CcPp'.includes(id[0])){
					return getAround_cp();
				}
			}
			//...
		};
		return getAround[id[0]]();

		function getAround_cp() {
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
					let bk = yy == 0 ? `div-${y}-${x+i}` : `div-${y+i}-${x}`;
					if (checkbk(bk)) break;
				}
			}
		}

		function getAround_j() {
			let base = [
				[0, 1, 2],
				[7, 8, 9]
			];
			// if (roll < 0) base.reverse();
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
		//..
	}
	showPois() {
		let id=this.name;
		let [poi,kill] = this.getAroundPois();
		let obj={poi,kill};
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
					}
				} else {
					div.innerHTML = '<div></div>';
					if (checkCJP(id, obj[bk][i])) {
						div.classList.add('killpoi');
					}
				}
			}
		};
		
	}
}
//===========================================================
 function getPieces(level=0) {
	var data = getLevelData(level);
	let obj={};
	for (let qz in data) {
		for (let i = 0; i < data[qz].length; i++) {
			let id = chessData[qz].qizi[i];
			let c = chessData[qz].color;
			let dom = c + '-' + id;
			let pos = data[qz][i];
			obj[id] = new Piece(id, pos, dom);
		}
	}
	return obj;
};