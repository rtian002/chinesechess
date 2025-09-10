/*! 一叶孤舟 | qq:28701884 | 欢迎指教 */
var AI = AI || {};
AI.historyTable = {}; //历史表
//人工智能初始化
AI.init = function(pace) {
	//如果棋谱里面没有，人工智能开始运作
	var initTime = new Date().getTime();
	AI.treeDepth = 4;
	AI.setHistoryTable.lenght = 0;
	var val = AI.getAlphaBeta(-99999, 99999, AI.treeDepth, com.arr2Clone(play.map), play.my);
	// console.log(play.map);
	// var val = AI.iterativeSearch(com.arr2Clone(play.map),play.my);
	if (!val || val.value == -8888) {
		AI.treeDepth = 2;
		val = AI.getAlphaBeta(-99999, 99999, AI.treeDepth, com.arr2Clone(play.map), play.my);
	}
	// var val = AI.iterativeSearch(com.arr2Clone(play.map),play.my);
	if (val && val.value != -8888) {
		var man = play.mans[val.key];
		var nowTime = new Date().getTime();
		/**/
		console.log('最佳着法：' + com.createMove(com.arr2Clone(play.map), man.x, man.y, val.x, val.y) + ' 搜索深度：' + AI.treeDepth + ' 搜索分支：' + AI.number + '个  最佳着法评估：' + val.value + '分' + ' 搜索用时：' + (nowTime - initTime) + '毫秒');
		return [man.x, man.y, val.x, val.y];
	} else {
		return false;
	}
};

//迭代加深搜索着法
AI.iterativeSearch = function (map, my){
	var timeOut=100;
	var initDepth = 1;
	var maxDepth = 6;
	AI.treeDepth=0;
	var initTime = new Date().getTime();
	var val = {};
	for (var i=initDepth; i<=maxDepth; i++){
		var nowTime= new Date().getTime();
		AI.treeDepth=i;
		AI.aotuDepth=i;
		var val = AI.getAlphaBeta(-99999, 99999, AI.treeDepth , map ,my);
		if (nowTime-initTime > timeOut){
			return val;
		}
	}
	return false;
};

//取得棋盘上所有棋子
AI.getMapAllMan = function(map, my) {
	var _mans = [];
	for (var i = 0; i < map.length; i++) {
		for (var n = 0; n < map[i].length; n++) {
			var key = map[i][n];
			if (key && play.mans[key].my == my) {
				play.mans[key].x = n;
				play.mans[key].y = i;
				_mans.push(play.mans[key]);
			}
		}
	}
	return _mans;
};
//检查是否长将
var checkFoul = function() {
	var p = play.pace;
	var len = parseInt(p.length, 10);
	if (len > 11 && p[len - 1] == p[len - 5] && p[len - 5] == p[len - 9]) {
		return p[len - 4].split('');
	}
	return false;
};
//取得棋谱所有己方棋子的着法
AI.getMoves = function(map, my) {
	var manArr = AI.getMapAllMan(map, my);
	var moves = [];
	var foul = play.isFoul;
	for (var i = 0; i < manArr.length; i++) {
		var man = manArr[i];
		var val = man.bl(map);
		// let cid = Object.keys(chessinfo).filter(n => n.includes(man.key))[0];
		// console.log(man.key,id);
		// var val=getAround(id).arr;
		for (var n = 0; n < val.length; n++) {
			var x = man.x;
			var y = man.y;
			var newX = val[n][0];
			var newY = val[n][1];
			//如果不是长将着法
			if (foul[0] != x || foul[1] != y || foul[2] != newX || foul[3] != newY) {
				// let bk = 'div-' + (newY * 9 + newX);
				// let blocks = getblocks();
				// let flag = checkBJP(cid, bk);
				// if (!!blocks[bk]) {
				// 	flag = checkCJP(cid, bk);
				// }
				// if (!flag) {
				// }
				moves.push([x, y, newX, newY, man.key]);
			}
		}
	}
	return moves;
};
//A:当前棋手value/B:对手value/depth：层级
AI.getAlphaBeta = function(A, B, depth, map, my) {
	//var txtMap= map.join();
	//var history=AI.historyTable[txtMap];
	//	if (history && history.depth >= AI.treeDepth-depth+1){
	//		return 	history.value*my;
	//}
	if (depth == 0) {
		return { 'value': AI.evaluate(map, my) }; //局面评价函数;
	}
	// console.log(depth, '--------------');
	var moves = AI.getMoves(map, my); //生成全部走法;
	// var c=my==1?'red':'black';
	// console.log(depth,map);
	// var moves=getMoves(my);
	// if(my==play.my)
	// console.log(moves);
	//这里排序以后会增加效率
	for (var i = 0; i < moves.length; i++) {
		//走这个走法;
		var move = moves[i];
		var key = move[4];
		var oldX = move[0];
		var oldY = move[1];
		var newX = move[2];
		var newY = move[3];
		var clearKey = map[newY][newX] || '';
			if (clearKey) {
				play.mans[ clearKey ].isShow = false;
			}
		map[newY][newX] = key;
		delete map[oldY][oldX];
		play.mans[key].x = newX;
		play.mans[key].y = newY;

		if (clearKey == 'j0' || clearKey == 'J0') { //被吃老将,撤消这个走法;
			play.mans[key].x = oldX;
			play.mans[key].y = oldY;
			map[oldY][oldX] = key;
			delete map[newY][newX];
			if (clearKey) {
				map[newY][newX] = clearKey;
			}
			return { 'key': key, 'x': newX, 'y': newY, 'value': 8888 };
			// return rootKey;
		} else {
			var val = -AI.getAlphaBeta(-B, -A, depth - 1, map, -my).value;
			// val = val || val.value;
			play.mans[key].x = oldX;
			play.mans[key].y = oldY;
			map[oldY][oldX] = key;
			delete map[newY][newX];
			//撤消这个走法;　
			if (clearKey) {
				map[newY][newX] = clearKey;
				play.mans[ clearKey ].isShow = true;
			}
			if (val >= B) {
				//将这个走法记录到历史表中;
				B=val;
				//AI.setHistoryTable(txtMap,AI.treeDepth-depth+1,B,my);
				return { 'key': key, 'x': newX, 'y': newY, 'value': B };
			}
			if (val > A) {
				A = val; //设置最佳走法;
				if (AI.treeDepth == depth) var rootKey = { 'key': key, 'x': newX, 'y': newY, 'value': A };
			}
		}
	}
	//将这个走法记录到历史表中;
	//AI.setHistoryTable(txtMap,AI.treeDepth-depth+1,A,my);
	if (AI.treeDepth == depth) { //已经递归回根了
		if (!rootKey) {
			// console.log('rootKey',rootKey);
			//AI没有最佳走法，说明AI被将死了，返回false
			return false;
		} else {
			//这个就是最佳走法;
			return rootKey;
		}
	}
	return { 'key': key, 'x': newX, 'y': newY, 'value': A };
};
//奖着法记录到历史表
AI.setHistoryTable = function(txtMap, depth, value, my) {
	AI.setHistoryTable.lenght++;
	AI.historyTable[txtMap] = { depth: depth, value: value };
};
//评估棋局 取得棋盘双方棋子价值差
AI.evaluate = function(map, my) {
	var val = 0;
	for (var i = 0; i < map.length; i++) {
		for (var n = 0; n < map[i].length; n++) {
			var key = map[i][n];
			if (key) {
				val += play.mans[key].value[i][n] * play.mans[key].my;
			}
		}
	}
	// val += Math.floor(Math.random() * 10); //让AI走棋增加随机元素
	//com.show()
	// z(val*my);
	// AI.number++;
	return val * my;
};