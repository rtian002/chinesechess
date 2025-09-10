var chessMaps = [{
	level: 0,
	desc: '初始棋局',
	data: 'cmxsjsxmc91p5p1z1z1z1z1z99Z1Z1Z1Z1Z1P5P19CMXSJSXMC',
	history: []
}, {
	level: 1,
	data: '94s43j1s32C3c21M5m1P7p1M5m12C3c23z1z34J4',
	history: []
}, {
	level: 2,
	data: '93Mmj32Z3Z22Z1c1Z22Z3z23PPM3992z1z1z23J5'
}, {
	level: 3,
	data: '3sj1x24sC2P3cp1M1m9994p42c1X43zS44JPX2'
}, {
	level: 4,
	data: '3C1s34sj393M1Z1P19992czzpz293J1z3'
}, {
	level: 5,
	data: 'Mp2js31Mp1s44x4995C394P44z1z23z1J3'
}, {
	level: 6,
	data: '3j54C44M1c2992M5P993c1z34J4'
}, {
	level: 7,
	data: '3j4P2Z1s43m1s1CM7c17m17z17z17zP1pcz1z34J4'
}, {
	level: 8,
	data: '3M1C34j43C1M39999999'
}, {
	level: 9,
	data: '4js33Zs44p4999994J41P7'
}, {
	level: 10,
	data: '4j49999992zPPM32zMSC33JCS3',
	history: ['75540403850503135433727333251314050414157475152504052524847324230503', '7554040385050313543372733325132305032324254473740304']
}, {
	level: 11,
	data: '92Z1Z43jx41Z3C35P36P23c54zz35z34J1p2'
}];
// var levels = [, '', '', '', '', '', '', '', '', '', '', ''];
// levels = levels.map(lv => lv.split('').map(n => isNaN(n) ? n : '0'.repeat(n)).join('').match(/(.{9})/g).map(n => n.split('')));
// //.map(lv=>lv.split(',').map(n=>n.split('').map(m=>isNaN(m)?m:new Array(m*1).fill(0)).flat().join('')));
// var historys = ['75540403850503135433727333251314050414157475152504052524847324230503', '7554040385050313543372733325132305032324254473740304'].map(a => a.match(/.{4}/g).map(n => n.match(/.{2}/g).map(n => n.split('').map(n => n * 1))));