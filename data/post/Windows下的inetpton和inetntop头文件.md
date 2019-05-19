## 引言
想在IPv6地址字符串和struct in6_addr之间做转换，
也就是类似Linux下的inet_pton和inet_ntop函数。

查了MSDN，有两个函数InetPton和InetNtop：
http://msdn.microsoft.com/en-us/library/windows/desktop/cc805843(v=vs.85).aspx
http://msdn.microsoft.com/en-us/library/windows/desktop/cc805844(v=vs.85).aspx

## 添加头文件和库文件
**在代码里添加：**
``` cpp
#include <Ws2tcpip.h>
#pragma comment(lib,"Ws2_32.lib")
```