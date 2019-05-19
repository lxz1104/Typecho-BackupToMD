var shieldsLess = require('shields-less')
var svgBadge = shieldsLess.svg({
    leftText: 'npm 黄河远上白云间',
    rightText: 'hello 世界'
});

console.log(svgBadge);
//https://img.shields.io/badge/%E4%BD%A0%E5%A5%BD-v1.25-%3CCOLOR%3E.svg
