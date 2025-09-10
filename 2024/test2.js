/*
var str = '┌─┬─┬─┬─┬─┬─┬─┬─┐,│　│　│　│╲│╱│　│　│　│,├─┼─┼─┼─※─┼─┼─┼─┤,│　│　│　│╱│╲│　│　│　│,├─┼─┼─┼─┼─┼─┼─┼─┤,│　│　│　│　│　│　│　│　│,├─┼─┼─┼─┼─┼─┼─┼─┤,│　│　│　│　│　│　│　│　│,├─┴─┴─┴─┴─┴─┴─┴─┤,│　　　　　　　　　　　　　　　│,├─┬─┬─┬─┬─┬─┬─┬─┤,│　│　│　│　│　│　│　│　│,├─┼─┼─┼─┼─┼─┼─┼─┤,│　│　│　│　│　│　│　│　│,├─┼─┼─┼─┼─┼─┼─┼─┤,│　│　│　│╲│╱│　│　│　│,├─┼─┼─┼─※─┼─┼─┼─┤,│　│　│　│╱│╲│　│　│　│,┗━┻━┻━┻━┻━┻━┻━┻━┛';
*/
var _str = `
┎─┬─┬─┬─┬─┬─┬─┬─┒
┃ │ │ │╲│╱│ │ │ ┃
┠─┼─┼─┼─※─┼─┼─┼─┨
┃ │ │ │╱│╲│ │ │ ┃
┠─┼─┼─┼─┼─┼─┼─┼─┨
┃ │ │ │ │ │ │ │ ┃
┠─┼─┼─┼─┼─┼─┼─┼─┨
┃ │ │ │ │ │ │ │ ┃
┠─┴─┴─┴─┴─┴─┴─┴─┨
┃               ┃
┠─┬─┬─┬─┬─┬─┬─┬─┨
┃ │ │ │ │ │ │ │ ┃
┠─┼─┼─┼─┼─┼─┼─┼─┨
┃ │ │ │ │ │ │ │ ┃
┠─┼─┼─┼─┼─┼─┼─┼─┨
┃ │ │ │╲│╱│ │ │ ┃
┠─┼─┼─┼─※─┼─┼─┼─┨
┃ │ │ │╱│╲│ │ │ ┃
┖─┴─┴─┴─┴─┴─┴─┴─┚
`.trim().replaceAll(' ', '　');

function createMap(lv = 0) {
	var chessStr = _str.split('\n').map(n => n.trim().split(''));
	let data = getLevelData(lv);
	for (let qz in data) {
		for (let q of data[qz]) {
			let name = chessData[qz].name;
			let color = chessData[qz].color;
			let [x, y] = q.map(n => n * 2);
			let str = `<span class="${color}">${name}</span>`;
			chessStr[x][y] = str;
		}
	}
	let temparr = chessStr.map(n => n.filter((m, j) => j % 2 == 0)).filter((n, i) => i % 2 == 0);
	let str = temparr.map(n => n.join('')).join('<br>');
	// pre.innerHTML=str;
	return str;
}
! function() {
	var res = document.querySelector('.res');
	for (let i = 0; i < levels.length; i++) {
		let div = document.createElement('div');
		let pre = document.createElement('pre');
		div.appendChild(pre);
		pre.setAttribute('level', i);
		pre.title=i
		res.appendChild(div);
		pre.innerHTML = createMap(i);
	}
}();
function getMapinfoStr(){
	let gamearr=game.getMapinfo()
	let str=''
	for(let i=0;i<10;i++){
		let s=0
		for(let j=0;j<9;j++){
			if(!!gamearr[i][j]){
				if(s>0)str+=s
				s=0
				str+=gamearr[i][j][0]
			}else{
				s++;
			}
		}
		if(s>0)str+=s
	}
	return str
}
function createMap1(lv = 0) {
	var chessStr = _str.split('\n').map(n => n.trim().split(''));
	chessStr = chessStr.map(n => ['　', ...n, '　']);
	let data = getLevelData(lv);
	for (let qz in data) {
		for (let q of data[qz]) {
			let name = chessData[qz].name;
			let color = chessData[qz].color;
			let [row, col] = q.map(n => n * 2);
			col++;
			chessStr[row][col] = name;
			let left = chessStr[row][col - 1];
			let right = chessStr[row][col + 1];
			let ls = color == 'red' ? '[' : '(';
			let rs = color == 'red' ? ']' : ')';
			let lls = (col - 1) == 0 ? ' ' : '-';
			let rrs = (col + 1) == 18 ? ' ' : '-';
			if (left.length > 1) {
				chessStr[row][col - 1][1] = ls;
			} else {
				chessStr[row][col - 1] = [lls, ls];
			}
			if (right.length > 1) {
				chessStr[row][col + 1][0] = rs;
			} else {
				chessStr[row][col + 1] = [rs, rrs];
			}
		}
	}
	return chessStr.map(n => n.flat().join('')).join('<br>');
}

function createMap2(lv = 0,type=0) {
	let arr = '0'.repeat(90).match(/.{9}/g).map(n => n.split(''));
	for (qz in gameinfo) {
		if (gameinfo[qz].pos != null) {
			let [x, y] = gameinfo[qz].pos;
			arr[x][y] = qz[0];
		}
	}
	let str = arr.map(n => n.join('')).join('\n');
	if(type==0){
		return str;
	}else{
		return arr
	}
	
}

function setHis(lv) {
	pieces=getPieces(lv);
	//pieces
	//his
	console.log(hisinfo);
}
function getHisinfo(lv){
	gamemap=getGameMap(lv);
	hisinfo.data=[];
	let info=historys[lv];
	let div=document.querySelector('.hisaside');
	div.innerHTML=''
	for(let i=0;i<info.length;i++){
		let li=document.createElement('li');
		li.innerHTML='记录-'+(i+1);
		div.appendChild(li);
		let mapinfo=deepClone(gamemap);
		let d=info[i].match(/.{4}/g).map(n=>n.match(/.{2}/g).map(m=>m.split('').map(n=>n*1)));
		let obj=[];
		for(let i=0;i<d.length;i++){
			let [r1,c1]=d[i][0];
			let [r2,c2]=d[i][1];
			let id1=mapinfo[r1][c1];
			let id2=mapinfo[r2][c2]?.split('-')[1];
			let[ c,id]=id1.split('-');
			let index=chessData[id[0]].index;
			let title=move[index](id,d[i][0],d[i][1]);
			mapinfo[r2][c2]=mapinfo[r1][c1];
			delete mapinfo[r1][c1];
			obj.push({id:id,pos:[r1,c1],moveto:[r2,c2],kill:id2,title:title,color:c});
		}
		hisinfo.data.push(obj)
	}
	return hisinfo;
}
function getLevelMap(lv){
	let map = Array.from(new Array(10)).map(n => new Array(9));
	let d=Maps[lv].split('').map(n=>isNaN(n)?n:'0'.repeat(n)).join('');
	for(let i=0;i<90;i++){
		if(isNaN(d[i])){
			let [c,r]=[~~(i/9),i%9];
			let id=d[i];
			let re=new RegExp(id,'g');
			let index=d.slice(0,i+1).match(re).length-1;
			let cid=id+index;
			map[c][r]=cid;
		}
	}
	return map;
}
function getGameMap() {
	let map = Array.from(new Array(10)).map(n => new Array(9));
	for (let qz in gameinfo) {
		if (gameinfo[qz].pos == null) continue;
		let [r, c] = gameinfo[qz].pos;
		map[r][c] = gameinfo[qz].dom.id;
	}
	return map;
}
var timer;

function replay2(lv) {
	let his = historys[lv].match(/.{4}/g);
	// start = 'red';
	let map = getGameMap();
	let his_index = 0;
	timer = setInterval(() => {
		if (his_index == his.length - 1) clearInterval(timer);
		let info = his[his_index];
		let [r1, c1, r2, c2] = info.split('');
		let id1 = map[r1][c1];
		let id2 = map[r2][c2];
		let div = document.getElementById(id1);
		div.style.transform = `translate(${c2*80}px,${r2*80}px)`;
		let c=chessData[id1.slice(-2,-1)].color;
		gameinfo[id1.slice(-2)].pos=[r2,c2];
		if (!!id2) {
			let div2 = document.getElementById(id2);
			div2.style.transform = 'scale(0)';
		gameinfo[id2.slice(-2)].pos=null;
		}
		map[r2][c2] = id1;
		delete map[r1][c1];
		his_index++;
	}, 1000);
}

function getHis1(lv){
	let info=historys[lv];
	if(!info)return false;
	let obj={};
	let d='92Z1Z43jx41Z3C35P36P23c54zz35z34J1p2';
	d=d.split('').map(n=>isNaN(n)?n:'0'.repeat(n)).join('');
	for(let i=0;i<90;i++){
		if(isNaN(d[i])){
			let [c,r]=[~~(i/9),i%9];
			let id=d[i];
			let re=new RegExp(id,'g');
			let index=d.slice(0,i+1).match(re).length-1;
			let cid=id+index;
			obj[cid]={name:id,pos:[c,r]};
		}
	}
	console.log(obj);
	return obj;
}
// getHis(10);