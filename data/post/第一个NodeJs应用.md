# 代码
**http.js**
``` JavaScript
//使用require指令来载入hhtp模块,并将实例化的HTTP赋值给http
var http = require("http")

http.createServer(function(request,response){
    // 发送hhtp头部
    // HTTP状态值:200:OK
    // 内容类型：text/plain
    response.writeHead(200,{'Content-Type': 'text/plain'});

    //发送响应数据"hello world"
    response.end('Hello wrold!\n');
}).listen(8888);

//在终端打印信息
console.log('Server running at http://127.0.0.1:8888/');
```
# 运行代码
``` shell
node http.js
```