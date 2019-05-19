## 引言
Windows平台下用C++做网络开发很多时候都会同时包含这两个头文件，如若顺序不当(windows.h先于winsock2.h)就会出现很多莫名其妙的错误。诸如：

``` cpp
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\ws2def.h(547): warning C4005: “INADDR_ANY”: 宏重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(304) : 参见“INADDR_ANY”的前一个定义
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\ws2def.h(549): warning C4005: “INADDR_BROADCAST”: 宏重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(306) : 参见“INADDR_BROADCAST”的前一个定义
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\ws2def.h(583): error C2011: “sockaddr_in”:“struct”类型重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(312) : 参见“sockaddr_in”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(132): error C2011: “fd_set”:“struct”类型重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(68) : 参见“fd_set”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(167): warning C4005: “FD_SET”: 宏重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(102) : 参见“FD_SET”的前一个定义
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(176): error C2011: “timeval”:“struct”类型重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(111) : 参见“timeval”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(232): error C2011: “hostent”:“struct”类型重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(167) : 参见“hostent”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(245): error C2011: “netent”:“struct”类型重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(180) : 参见“netent”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(252): error C2011: “servent”:“struct”类型重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(187) : 参见“servent”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(264): error C2011: “protoent”:“struct”类型重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(199) : 参见“protoent”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(360): error C2011: “WSAData”:“struct”类型重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(322) : 参见“WSAData”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(458): error C2011: “sockproto”:“struct”类型重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(494) : 参见“sockproto”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(500): error C2011: “linger”:“struct”类型重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(531) : 参见“linger”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(513): warning C4005: “SOMAXCONN”: 宏重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(544) : 参见“SOMAXCONN”的前一个定义
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(542): warning C4005: “FD_READ”: 宏重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(562) : 参见“FD_READ”的前一个定义
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(545): warning C4005: “FD_WRITE”: 宏重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(563) : 参见“FD_WRITE”的前一个定义
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(548): warning C4005: “FD_OOB”: 宏重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(564) : 参见“FD_OOB”的前一个定义
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(551): warning C4005: “FD_ACCEPT”: 宏重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(565) : 参见“FD_ACCEPT”的前一个定义
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(554): warning C4005: “FD_CONNECT”: 宏重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(566) : 参见“FD_CONNECT”的前一个定义
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(557): warning C4005: “FD_CLOSE”: 宏重定义
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(567) : 参见“FD_CLOSE”的前一个定义
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(1578): error C2375: “accept”: 重定义；不同的链接
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(742) : 参见“accept”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(1600): error C2375: “bind”: 重定义；不同的链接
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(747) : 参见“bind”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(1619): error C2375: “closesocket”: 重定义；不同的链接
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(752) : 参见“closesocket”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(1638): error C2375: “connect”: 重定义；不同的链接
1>          c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock.h(754) : 参见“connect”的声明
1>c:\program files (x86)\microsoft sdks\windows\v7.0a\include\winsock2.h(1659): error C2375: “ioctlsocket”: 重定义；不同的链接
``` 

## 解决方法

> **include**头文件时应**winsock2.h**先于**windows.h**。