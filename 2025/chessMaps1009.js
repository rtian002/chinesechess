var chess = {
	'red': '帥車馬相仕砲兵',
	'black': '將車馬象士炮卒'
};
var levels = [{
	'red': {
		'0': [85],
		'1': [81, 89],
		'2': [82, 88],
		'3': [83, 87],
		'4': [84, 86],
		'5': [64, 70],
		'6': [54, 56, 58, 60, 62]
	},
	'black': {
		'0': [4],
		'1': [0, 8],
		'2': [1, 7],
		'3': [2, 6],
		'4': [3, 5],
		'5': [19, 25],
		'6': [27, 29, 31, 33, 35]
	}
}, {
	'red': { '0': [85], '1': [29, 65], '2': [55, 37], '5': [45] },
	'black': { '0': [21], '1': [69, 33], '2': [61, 43], '4': [23, 13], '5': [53], '6': [75, 77] }
}, {
	'red': { '0': [84], '2': [12, 50], '5': [49, 48], '6': [38, 29, 20, 24, 33] },
	'black': { '0': [14], '1': [31], '2': [13], '6': [42, 78, 74, 76] }
}, {
	'red': { '0': [85], '1': [14], '2': [24], '3': [67, 87], '4': [76], '5': [86, 17] },
	'black': { '0': [4], '1': [65, 21], '2': [26], '3': [6], '4': [13, 3], '5': [58, 22], '6': [75] },
}, {
	'red': { '0': [84], '1': [3], '2': [30], '5': [34], '6': [32] },
	'black': { '0': [14], '1': [65], '4': [5, 13], '5': [68], '6': [66, 67, 69, 86] },
}, {
	'red': { '0': [86], '1': [50], '2': [10, 0], '5': [67] },
	'black': { '0': [4], '3': [22], '4': [13, 5], '5': [11, 1], '6': [84, 78, 76] },
}, {
	'red': { '0': [85], '1': [13], '2': [47, 22], '5': [53] },
	'black': { '0': [3], '1': [75, 24], '6': [77] },
}, {
	'red': { '0': [85], '1': [25], '2': [26], '5': [71, 8], '6': [11] },
	'black': { '0': [3], '1': [74, 34], '2': [43, 21], '4': [23, 13], '5': [73], '6': [75, 77, 70, 61, 52] },
}, {
	'red': { '0': [85], '4': [76],'1': [21, 5], '2': [3, 23] },
	'black': { '0': [13] },
}, {
	'red': { '0': [76],  '5': [82], '6': [12] },
	'black': { '0': [4], '4': [13, 5], '5': [22] }
}, {
	'red': { '0': [85], '1': [32], '5': [41, 51], '6': [28, 11, 13] },
	'black': { '0': [21], '1': [57], '3': [22], '5': [87], '6': [77, 68, 67] }
}, {
	'red': { '0': [75], '1': [52,62], '5': [35, 44], '6': [60, 12, 13] },
	'black': { '0': [5], '1': [23], '5': [4], '6': [76, 66] }
}];
var historys = [
	[{
		'player': 'red',
		'move': ['red-1-1', '29', 20],
		'kill': '',
		'title': '車七进1'
	}, {
		'player': 'black',
		'move': ['black-0-0', '21', 12],
		'kill': '',
		'title': '將4退1'
	}, {
		'player': 'red',
		'move': ['red-1-1', 20, 11],
		'kill': '',
		'title': '車七进1'
	}, {
		'player': 'black',
		'move': ['black-0-0', 12, 3],
		'kill': '',
		'title': '將4退1'
	}, {
		'player': 'red',
		'move': ['red-1-1', 11, 2],
		'kill': '',
		'title': '車七进1'
	}, {
		'player': 'black',
		'move': ['black-0-0', 3, 12],
		'kill': '',
		'title': '將4进1'
	}, {
		'player': 'red',
		'move': ['red-1-2', '65', 11],
		'kill': '',
		'title': '車七进6'
	}, {
		'player': 'black',
		'move': ['black-0-0', 12, 21],
		'kill': '',
		'title': '將4进1'
	}, {
		'player': 'red',
		'move': ['red-1-2', 11, 20],
		'kill': '',
		'title': '車七退1'
	}, {
		'player': 'black',
		'move': ['black-0-0', 21, 12],
		'kill': '',
		'title': '將4退1'
	}, {
		'player': 'red',
		'move': ['red-1-1', 2, 11],
		'kill': '',
		'title': '車七退1'
	}, {
		'player': 'black',
		'move': ['black-0-0', 12, 3],
		'kill': '',
		'title': '將4退1'
	}, {
		'player': 'red',
		'move': ['red-1-2', 20, 21],
		'kill': '',
		'title': '車七平六'
	}, {
		'player': 'black',
		'move': ['black-4-8', '13', 21],
		'kill': 'red-1-2',
		'title': '士5进4'
	}, {
		'player': 'red',
		'move': ['red-1-1', 11, 2],
		'kill': '',
		'title': '車七进1'
	}, {
		'player': 'black',
		'move': ['black-0-0', 3, 12],
		'kill': '',
		'title': '將4进1'
	}, {
		'player': 'red',
		'move': ['red-1-1', 2, 3],
		'kill': '',
		'title': '車七平六'
	}, {
		'player': 'black',
		'move': ['black-0-0', 12, 3],
		'kill': 'red-1-1',
		'title': '將4退1'
	}, {
		'player': 'red',
		'move': ['red-2-4', '37', 20],
		'kill': '',
		'title': '馬八进七'
	}, {
		'player': 'black',
		'move': ['black-0-0', 3, 12],
		'kill': '',
		'title': '將4进1'
	}, {
		'player': 'red',
		'move': ['red-2-4', 20, 1],
		'kill': '',
		'title': '馬七进八'
	}, {
		'player': 'black',
		'move': ['black-0-0', 12, 3],
		'kill': '',
		'title': '將4退1'
	}, {
		'player': 'red',
		'move': ['red-5-9', '45', 0],
		'kill': '',
		'title': '砲九进5'
	}],
	[{
		'player': 'red',
		'move': ['red-6-14', '24', 15],
		'kill': '',
		'title': '兵三进1'
	}, {
		'player': 'black',
		'move': ['black-0-0', '14', 5],
		'kill': '',
		'title': '將6退1'
	}, {
		'player': 'red',
		'move': ['red-6-14', 15, 14],
		'kill': '',
		'title': '兵三平四'
	}, {
		'player': 'black',
		'move': ['black-0-0', 5, 14],
		'kill': 'red-6-14',
		'title': '將6进1'
	}, {
		'player': 'red',
		'move': ['red-2-4', '50', '31'],
		'kill': 'black-1-1',
		'title': '馬四进五'
	}, {
		'player': 'black',
		'move': ['black-0-0', 14, 5],
		'kill': '',
		'title': '將6退1'
	}, {
		'player': 'red',
		'move': ['red-2-4', '31', 24],
		'kill': '',
		'title': '馬五进三'
	}, {
		'player': 'black',
		'move': ['black-0-0', 5, 14],
		'kill': '',
		'title': '將6进1'
	}, {
		'player': 'red',
		'move': ['red-2-3', '12', 31],
		'kill': '',
		'title': '馬六退五'
	}, {
		'player': 'black',
		'move': ['black-0-0', 14, 23],
		'kill': '',
		'title': '將6进1'
	}, {
		'player': 'red',
		'move': ['red-6-15', '33', 32],
		'kill': '',
		'title': '兵三平四'
	}, {
		'player': 'black',
		'move': ['black-2-3', '13', 32],
		'kill': 'red-6-15',
		'title': '馬5进6'
	}, {
		'player': 'red',
		'move': ['red-2-3', 31, 12],
		'kill': '',
		'title': '馬五进六'
	}, {
		'player': 'black',
		'move': ['black-0-0', 23, 14],
		'kill': '',
		'title': '將6退1'
	}, {
		'player': 'red',
		'move': ['red-2-4', 24, 31],
		'kill': '',
		'title': '馬三退五'
	}],
	[{
		'player': 'red',
		'move': ['red-5-10', '17', 8],
		'kill': '',
		'title': '砲一进1'
	}, {
		'player': 'black',
		'move': ['black-2-3', '26', 7],
		'kill': '',
		'title': '馬9退8'
	}, {
		'player': 'red',
		'move': ['red-1-1', '14', 5],
		'kill': '',
		'title': '車四进1'
	}, {
		'player': 'black',
		'move': ['black-4-7', '13', 5],
		'kill': 'red-1-1',
		'title': '士5退6'
	}, {
		'player': 'red',
		'move': ['red-5-10', 8, '6'],
		'kill': 'black-3-5',
		'title': '砲一平三'
	}, {
		'player': 'black',
		'move': ['black-4-7', 5, 13],
		'kill': '',
		'title': '士6进5'
	}, {
		'player': 'red',
		'move': ['red-5-9', '86', 5],
		'kill': '',
		'title': '砲四进9'
	}],
	[{
		'player': 'red',
		'move': ['red-6-11', '32', 23],
		'kill': '',
		'title': '兵四进1'
	}, {
		'player': 'black',
		'move': ['black-4-8', '13', 23],
		'kill': 'red-6-11',
		'title': '士5进6'
	}, {
		'player': 'red',
		'move': ['red-5-9', '34', 32],
		'kill': '',
		'title': '砲二平四'
	}, {
		'player': 'black',
		'move': ['black-4-8', 23, 13],
		'kill': '',
		'title': '士6退5'
	}, {
		'player': 'red',
		'move': ['red-1-1', '3', '5'],
		'kill': 'black-4-7',
		'title': '車六平四'
	}, {
		'player': 'black',
		'move': ['black-0-0', '14', '5'],
		'kill': 'red-1-1',
		'title': '將6退1'
	}, {
		'player': 'red',
		'move': ['red-2-3', '30', 23],
		'kill': '',
		'title': '馬六进四'
	}],
	[{
		'player': 'red',
		'move': ['red-1-1', '50', '5'],
		'kill': 'black-4-8',
		'title': '車四进5'
	}, {
		'player': 'black',
		'move': ['black-5-10', '1', '5'],
		'kill': 'red-1-1',
		'title': '炮2平6'
	}, {
		'player': 'red',
		'move': ['red-2-4', '0', '11'],
		'kill': 'black-5-9',
		'title': '馬九退七'
	}, {
		'player': 'black',
		'move': ['black-0-0', '4', 3],
		'kill': '',
		'title': '將5平4'
	}, {
		'player': 'red',
		'move': ['red-2-4', '11', '22'],
		'kill': 'black-3-5',
		'title': '馬七退五'
	}, {
		'player': 'black',
		'move': ['black-0-0', 3, 4],
		'kill': '',
		'title': '將4平5'
	}, {
		'player': 'red',
		'move': ['red-2-4', '22', 15],
		'kill': '',
		'title': '馬五进三'
	}],
	[{
		'player': 'red',
		'move': ['red-1-1', '13', 4],
		'kill': '',
		'title': '車五进1'
	}, {
		'player': 'black',
		'move': ['black-0-0', '3', 12],
		'kill': '',
		'title': '將4进1'
	}, {
		'player': 'red',
		'move': ['red-1-1', 4, 3],
		'kill': '',
		'title': '車五平六'
	}, {
		'player': 'black',
		'move': ['black-0-0', 12, 13],
		'kill': '',
		'title': '將4平5'
	}, {
		'player': 'red',
		'move': ['red-5-9', '53', 49],
		'kill': '',
		'title': '砲一平五'
	}, {
		'player': 'black',
		'move': ['black-0-0', 13, '22'],
		'kill': 'red-2-4',
		'title': '將5进1'
	}, {
		'player': 'red',
		'move': ['red-2-3', '47', 40],
		'kill': '',
		'title': '馬七进五'
	}],
	[{
		'player': 'red',
		'move': ['red-1-1', '25', 7],
		'kill': '',
		'title': '車二进2'
	}, {
		'player': 'black',
		'move': ['black-2-4', '21', 4],
		'kill': '',
		'title': '馬4退5'
	}, {
		'player': 'red',
		'move': ['red-1-1', 7, 16],
		'kill': '',
		'title': '車二退1'
	}, {
		'player': 'black',
		'move': ['black-2-4', 4, 15],
		'kill': '',
		'title': '馬5进7'
	}, {
		'player': 'red',
		'move': ['red-2-3', '26', 7],
		'kill': '',
		'title': '馬一进二'
	}, {
		'player': 'black',
		'move': ['black-2-4', 15, 4],
		'kill': '',
		'title': '馬7退5'
	}, {
		'player': 'red',
		'move': ['red-2-3', 7, 14],
		'kill': '',
		'title': '馬二退四'
	}, {
		'player': 'black',
		'move': ['black-2-4', 4, 15],
		'kill': '',
		'title': '馬5进7'
	}, {
		'move': ['red-1-1', 16, 7],
		'kill': '',
		'title': '車二进1'
	}],
	[{
		'player': 'red',
		'move': ['red-1-2', '5', 14],
		'kill': '',
		'title': '車四退1'
	}, {
		'player': 'black',
		'move': ['black-0-0', '13', 4],
		'kill': '',
		'title': '將5退1'
	}, {
		'player': 'red',
		'move': ['red-1-1', '21', 22],
		'kill': '',
		'title': '車六平五'
	}, {
		'player': 'black',
		'move': ['black-0-0', 4, '3'],
		'kill': 'red-2-3',
		'title': '將5平4'
	}, {
		'player': 'red',
		'move': ['red-1-1', 22, 21],
		'kill': '',
		'title': '車五平六'
	}, {
		'player': 'black',
		'move': ['black-0-0', '3', 4],
		'kill': '',
		'title': '將4平5'
	}, {
		'player': 'red',
		'move': ['red-1-1', 21, 3],
		'kill': '',
		'title': '車六进2'
	}, {
		'player': 'black',
		'move': ['black-0-0', 4, 3],
		'kill': 'red-1-1',
		'title': '將5平4'
	}, {
		'player': 'red',
		'move': ['red-1-2', 14, 5],
		'kill': '',
		'title': '車四进1'
	}],
	[{ 'player': 'red', 'move': ['red-5-9', 82, 85], 'kill': '', 'title': '砲八平五' }, { 'player': 'black', 'move': ['black-5-9', 22, 23], 'kill': '', 'title': '炮5平6' }, { 'player': 'red', 'move': ['red-5-9', 85, 87], 'kill': '', 'title': '砲五平三' }, { 'player': 'black', 'move': ['black-5-9', 23, 24], 'kill': '', 'title': '炮6平7' }, { 'player': 'red', 'move': ['red-5-9', 87, 33], 'kill': '', 'title': '砲三进6' }, { 'player': 'black', 'move': ['black-5-9', 24, 15], 'kill': '', 'title': '炮7退1' }, { 'player': 'red', 'move': ['red-5-9', 33, 24], 'kill': '', 'title': '砲三进1' }, { 'player': 'black', 'move': ['black-5-9', 15, 6], 'kill': '', 'title': '炮7退1' }, { 'player': 'red', 'move': ['red-5-9', 24, 15], 'kill': '', 'title': '砲三进1' }, { 'player': 'black', 'move': ['black-5-9', 6, 8], 'kill': '', 'title': '炮7平9' }, { 'player': 'red', 'move': ['red-5-9', 15, 6], 'kill': '', 'title': '砲三进1' }],
	[{
		'player': 'red',
		'move': ['red-5-10', 51, 24],
		'kill': '',
		'title': '砲三进3'
	}, {
		'player': 'black',
		'move': ['black-3-5', 22, 38],
		'kill': '',
		'title': '象5进3'
	}, {
		'player': 'red',
		'move': ['red-1-1', 32, 30],
		'kill': '',
		'title': '車四平六'
	}, {
		'player': 'black',
		'move': ['black-0-0', 21, 22],
		'kill': '',
		'title': '將4平5'
	}, {
		'player': 'red',
		'move': ['red-1-1', 30, 31],
		'kill': '',
		'title': '車六平五'
	}, {
		'player': 'black',
		'move': ['black-0-0', 22, 23],
		'kill': '',
		'title': '將5平6'
	}, {
		'player': 'red',
		'move': ['red-5-9', 41, 77],
		'kill': 'black-6-11',
		'title': '砲四退4'
	}, {
		'player': 'black',
		'move': ['black-6-12', 68, 77],
		'kill': 'red-5-9',
		'title': '卒6进1'
	}, {
		'player': 'red',
		'move': ['red-1-1', 31, 67],
		'kill': 'black-6-13',
		'title': '車五退4'
	}, {
		'player': 'black',
		'move': ['black-5-9', 87, 86],
		'kill': '',
		'title': '炮7平6'
	}, {
		'player': 'red',
		'move': ['red-5-10', 24, 6],
		'kill': '',
		'title': '砲三进2'
	}, {
		'player': 'black',
		'move': ['black-1-1', 57, 3],
		'kill': '',
		'title': '車4退6'
	}, {
		'player': 'red',
		'move': ['red-5-10', 6, 4],
		'kill': '',
		'title': '砲三平五'
	}, {
		'player': 'black',
		'move': ['black-1-1', 3, 0],
		'kill': '',
		'title': '車4平1'
	}, {
		'player': 'red',
		'move': ['red-0-0', 85, 84],
		'kill': '',
		'title': '帥五平六'
	}, {
		'player': 'black',
		'move': ['black-1-1', 0, 1],
		'kill': '',
		'title': '車1平2'
	}, {
		'player': 'red',
		'move': ['red-6-11', 28, 29],
		'kill': '',
		'title': '兵八平七'
	}, {
		'player': 'black',
		'move': ['black-1-1', 1, 3],
		'kill': '',
		'title': '車2平4'
	}, {
		'player': 'red',
		'move': ['red-0-0', 84, 85],
		'kill': '',
		'title': '帥六平五'
	}, {
		'player': 'black',
		'move': ['black-1-1', 3, 1],
		'kill': '',
		'title': '車4平2'
	}, {
		'player': 'red',
		'move': ['red-0-0', 85, 84],
		'kill': '',
		'title': '帥五平六'
	}, {
		'player': 'black',
		'move': ['black-1-1', 1, 3],
		'kill': '',
		'title': '車2平4'
	}, {
		'player': 'red',
		'move': ['red-0-0', 84, 85],
		'kill': '',
		'title': '帥六平五'
	}, {
		'player': 'black',
		'move': ['black-1-1', 3,
			21
		],
		'kill': '',
		'title': '車4进2'
	}, {
		'player': 'red',
		'move': ['red-6-11', 29, 30],
		'kill': '',
		'title': '兵七平六'
	}, {
		'player': 'black',
		'move': ['black-1-1', 21, 30],
		'kill': 'red-6-11',
		'title': '車4进1'
	}, {
		'player': 'red',
		'move': ['red-1-1', 67, 22],
		'kill': '',
		'title': '車五进5'
	}]
];