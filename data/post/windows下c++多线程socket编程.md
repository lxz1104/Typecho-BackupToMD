##引言
最近学习了c++网络编程，写了一个小项目。简单的socket服务端和客户端程序，同时服务端可动态创建线程来和客户端通信，同时支持响应浏览器的连接。

##代码部分
**服务端**
`server.h`
``` cpp
#ifndef SERVER_H
#define SERVER_H

#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN 	// 解决头文件冲突和版本问题
#endif
#include <windows.h>
#include <winsock2.h>
#include <Ws2tcpip.h>
#include <wininet.h>

//端口
#define SERVER_PORT 5000

//消息长度
#define MSG_BUF_SIZE 1024

enum ConnectType
{
    None,Browser,Client
};

class Server{
public:
    Server();
    ~Server();
    //不生成默认的拷贝函数
    Server(const Server&) = delete;
    //不生成“=”运算符重载函数
    Server& operator=(const Server&) = delete;
    //等待客户端连接
    void WaitForClient();

protected:
    /**win套接字版本*/
    WORD winsock_ver;
    /**wsa数据*/
    WSADATA wsa_data;
    /**服务器套接字*/
    SOCKET sock_srv;
    /**客户端套接字*/
    SOCKET sock_clt;
    /**服务端线程句柄*/
    HANDLE h_thread;
    /**服务端地址*/
    SOCKADDR_IN addr_srv;
    /**客户端地址*/
    SOCKADDR_IN addr_clt;
    /**记录函数返回值*/
    int ret_val;
    /**网络地址长度*/
    int addr_len;
    //根据连接类型创建对应的线程
    void SwitchThreaad(ConnectType&);
    //关闭套接字连接
    bool CloseConnect(SOCKET);

};


#endif
```
`server.cpp`
``` cpp
//winsock实现部分代码
// Created by longx on 2018/12/2.
//

#include "server.h"
#include <iostream>
#include <conio.h>
#include <fstream>
#include <time.h>
#include <exception>
using  std::ofstream;
using  std::cout;
using  std::endl;
using  std::cerr;

//浏览器连接线程
DWORD WINAPI BrowserThread(LPVOID lpParameter);
//客户端连接线程
DWORD WINAPI CreateClientThread(LPVOID lpParameter);
//写入文件
bool WirteFile(char* buf);
CRITICAL_SECTION file_thread;//线程锁

Server::Server() {
    cout << "++++++++++++++++++++++++++++++++++++++++++++" << endl;
    cout << "+       Begin starting server...           +" << endl;
    //设置winsock版本
    winsock_ver = MAKEWORD(2,2);
    //设置IP地址长度
    addr_len = sizeof(SOCKADDR_IN);
    //设置为IPV4协议
    addr_srv.sin_family = AF_INET;
    //设置监听端口
    addr_srv.sin_port = ::htons(SERVER_PORT);
    //设置为所有IP地址段都可连接
    addr_srv.sin_addr.S_un.S_addr = INADDR_ANY;


    //启动
    ret_val = ::WSAStartup(winsock_ver,&wsa_data);
    if(ret_val != 0)
    {
        cerr << ">> Start WSA failed with erorr code: " << ::WSAGetLastError() << " <<" << endl;
        ::getch();
        exit(1);
    }
    cout << "+       WSA start success...               +" << endl;
    //
    sock_srv = ::socket(AF_INET,SOCK_STREAM,IPPROTO_TCP);
    if(sock_srv == INVALID_SOCKET)
    {
        cerr << ">> Start socket failed with erorr code: " << ::WSAGetLastError() << " <<" << endl;
        ::WSACleanup();
        ::getch();
        exit(1);
    }
    cout << "+       Create socket success...           +" << endl;
    //绑定监听端口
    ret_val = ::bind(sock_srv,(SOCKADDR*)&addr_srv,addr_len);
    if(ret_val != 0)
    {
        cerr << ">> Bind the port failed with erorr code: " << ::WSAGetLastError() << " <<" << endl;
        ::WSACleanup();
        ::getch();
        exit(1);
    }
    cout << "+       Bind the socket success...         +" << endl;
    //服务端开始监听
    ret_val = ::listen(sock_srv,SOMAXCONN);
    if(ret_val == SOCKET_ERROR)
    {
        cerr << ">> Server listening failed with erorr code: " << ::WSAGetLastError() << " <<" << endl;
        ::WSACleanup();
        ::getch();
        exit(1);
    }
    cout << "+       Server socket starts listening...  +" << endl;

    //
    cout << "+       Start server success...            +" << endl;
    cout << "++++++++++++++++++++++++++++++++++++++++++++" << endl;

}

Server::~Server() {
    //关闭套接字
    ::closesocket(sock_srv);
    ::closesocket(sock_clt);
    //关闭WSA
    ::WSACleanup();
    cout << "##       Stop server success...           ##" << endl;
}



void Server::WaitForClient() {
    cout << "[Start]:Waiting for connecting... " << endl;
    char buf_msg[MSG_BUF_SIZE];
    int ret_val = 0;
    int send_result = 0;
    ConnectType connectType = None;
    while (true)
    {
        sock_clt = accept(sock_srv,(SOCKADDR*)&addr_clt,&addr_len);
        if(sock_clt == INVALID_SOCKET)
        {
            cerr << "[Error]:Accept client failed with error code:" << ::WSAGetLastError() << endl;
            ::WSACleanup();
            ::getch();
            exit(1);
        }

        //判断连接类型
        memset(buf_msg,0,MSG_BUF_SIZE);
        ret_val = ::recv(sock_clt,buf_msg,MSG_BUF_SIZE,0);
        if(ret_val > 0)
        {
            if(strcmp(buf_msg,"ATM Requests a connection") == 0)
            {
                cout  << "[Note]:A new client Requests a connection from <IP: " << ::inet_ntoa(addr_clt.sin_addr) << " >" << " && "
                      << "<Port: " << ::ntohs(addr_clt.sin_port) << ">" << endl;
                send_result = ::send(sock_clt,"200", MSG_BUF_SIZE,0);
                if(send_result == SOCKET_ERROR)
                {
                    cerr << "[Error]:Send message to client failed with error code:"
                         << ::WSAGetLastError() << endl;
                    ::closesocket(sock_clt);
                    continue;
                }
                connectType = Client;
            } else if(strstr(buf_msg, "GET") != NULL)
            {
                cout  << "[Note]:A new Browser Requests a connection from <IP: " << ::inet_ntoa(addr_clt.sin_addr) << " >" << " && "
                      << "<Port: " << ::ntohs(addr_clt.sin_port) << ">" << endl;
                send_result = ::send(sock_clt,"200", MSG_BUF_SIZE,0);
                if(send_result == SOCKET_ERROR)
                {
                    cerr << "[Error]:Send message to client failed with error code:"
                         << ::WSAGetLastError() << endl;
                    CloseConnect(sock_clt);
                    continue;
                }
                connectType = Browser;
            } else
            {
                connectType = None;
            }
        } else if(ret_val == 0)
        {
            CloseConnect(sock_clt);
            continue;
        }
        cout << "[Note]:Begin create thread connection for socket <" << sock_clt << ">" << endl;
        //创建对应的进程
        SwitchThreaad(connectType);
        if(h_thread == NULL)
        {
            cerr << "[Error]:Create thread failed with error code:" << ::WSAGetLastError() << endl;
            ::WSACleanup();
            continue;
        }
        cout << "[Note]:The connect thread has created.< id = " << h_thread << ",socket = " << sock_clt << " >" << endl;
        ::CloseHandle(h_thread);
    }
}
//关闭套接字连接
bool Server::CloseConnect(SOCKET socketfd)
{
    int ret_num;
    cout << "[Note]:Closing socket < " << socketfd << " >..." << endl;
    ret_num = ::shutdown(socketfd,SD_SEND);
    if(ret_num == SOCKET_ERROR)
    {
        cerr << "[Error]:Close Client socket failed with error code: "
             << WSAGetLastError() << endl;
        ::closesocket(socketfd);
        return false;
    }
    return true;
}
void Server::SwitchThreaad(ConnectType &connection) {
    switch (connection)
    {
        case None:
            h_thread == NULL;
            break;
        case Browser:
            h_thread = ::CreateThread(nullptr,0,BrowserThread,(LPVOID)sock_clt,0, nullptr);
            break;
        case Client:
            h_thread = ::CreateThread(nullptr,0,CreateClientThread,(LPVOID)sock_clt,0, nullptr);
            break;
    }
}

DWORD WINAPI BrowserThread(LPVOID lpParameter)
{
    SOCKET sock_clt = (SOCKET)lpParameter;
    char buf_msg[MSG_BUF_SIZE] = {'\0'};
    int ret_val = 0;
    //制作头信息
    strcat(buf_msg,"HTTP/1.1 200 OK\r\n");
    strcat(buf_msg,"Content-Type: text/html\r\n");
    strcat(buf_msg,"\r\n");
    strcat(buf_msg,"12321");

    ret_val = ::send(sock_clt,buf_msg,strlen(buf_msg),0);
    if(ret_val <= 0)
    {
        cerr << "[Error]:Send html to Browser failed with error code: "
             << WSAGetLastError() << endl;
        ::closesocket(sock_clt);
        return 1;
    }
    ::closesocket(sock_clt);
    ret_val = ::shutdown(sock_clt,SD_SEND);
    if(ret_val == SOCKET_ERROR)
    {
        cerr << "[Error]:Close Client socket failed with error code: "
             << WSAGetLastError() << endl;
        ::closesocket(sock_clt);
        return 1;
    }
    return 0;
}

DWORD WINAPI CreateClientThread(LPVOID lpParameter)
{
    SOCKET sock_clt = (SOCKET)lpParameter;
    char buf_msg[MSG_BUF_SIZE];
    int ret_val = 0;
    do
    {
        memset(buf_msg,0,MSG_BUF_SIZE);
        ret_val = ::recv(sock_clt,buf_msg,MSG_BUF_SIZE,0);
        if(ret_val > 0)
        {
            if(strcmp(buf_msg,"close") == 0)
             {
                cout << "[Note]:The client< " << sock_clt << " >Request to close connection" << endl;
                break;
            }
            cout << "[MSG]:Message Received: { " << buf_msg << " }" << endl;
            //EnterCriticalSection(&file_thread);//上锁
            WirteFile(buf_msg);
            //LeaveCriticalSection(&file_thread);//解锁
        }
        else if(ret_val == 0)
        {
            cout << "[Note]:Closing socket < " << sock_clt << " >..." << endl;

        }
        else
        {
            cerr << "[Error]:Receive message from client failed with error code: "
                 << WSAGetLastError() << endl;
            ::closesocket(sock_clt);
            cout << "[Note]:Closing socket < " << sock_clt << " >..." << endl;
            return 1;
        }
    }while (ret_val > 0);
    ret_val = ::shutdown(sock_clt,SD_SEND);
    if(ret_val == SOCKET_ERROR)
    {
        cerr << "[Error]:Close Client socket failed with error code: "
             << WSAGetLastError() << endl;
        ::closesocket(sock_clt);
        return 1;
    }
    return 0;
}
bool WirteFile(char* buf)
{
    char fileName[64];
    char *time_str;
    time_t time_now = time(0);
    ofstream file;
    time_str =  ctime(&time_now);
    sprintf(fileName, "report.txt");
    try
    {
        file.open(fileName,std::ios::app);

    }
    catch (std::exception)
    {
        return false;
    }
    file << "+------------------------------------------BEGIN---------------------------------------------------+" << endl;
    file <<  time_str << "\n" << buf << endl;
    file << "+-------------------------------------------END----------------------------------------------------+" << endl;
    file.close();
    return true;
}
```
`main.cpp`
``` cpp
//
// Created by longx on 2018/12/2.
//

#include "server.h"


int main(void)
{
    Server server;
    server.WaitForClient();
    return 0;
}
```
---
**客户端部分**
`client.h`
``` cpp
//
// Created by longx on 2018/12/2.
//

#ifndef WINSOCKET_CLIENT_CLIENT_H
#define WINSOCKET_CLIENT_CLIENT_H
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN 	// 解决冲突的关键
#endif
#define WINVER WindowsXP

#include <windows.h>
#include <winsock2.h>
#include <Ws2tcpip.h>


//端口
#define SERVER_PORT "5000"

//消息长度
#define MSG_BUF_SIZE 1024

//IP地址
#define IP_ADDR "127.0.0.1"

typedef unsigned int uint;

class Client{
public:
    Client(const char*ip = IP_ADDR,const char* Port = SERVER_PORT);
    ~Client();
    //不生成默认的拷贝函数
    Client(const Client&) = delete;
    //不生成“=”运算符重载函数
    Client& operator=(const Client&) = delete;
    //连接服务器
    int ConnetServer();
protected:
    /**win套接字版本*/
    WORD winsock_ver;
    /**wsa数据,包含win socket信息*/
    WSADATA wsa_data;
    /**服务端套接字*/
    SOCKET sock_srv;
    /**服务端地址*/
    addrinfo hints;
    /**存储IP地址信息*/
    addrinfo *result = nullptr;
    /**接收函数的返回值*/
    int ret_val;
    /**网络地址长度*/
    int addr_len;
    /**存储IP地址*/
    char buf_msg[MSG_BUF_SIZE];
};


#endif //WINSOCKET_CLIENT_CLIENT_H

```

`client.cpp`
``` cpp
//client实现部分
// Created by longx on 2018/12/2.
//

#include "client.h"
#include <iostream>
#include <conio.h>


using std::cout;
using std::endl;
using std::cerr;

Client::Client(const char *ip, const char* Port) {
    cout << "+------------------------------------------+" << endl;
    cout << "+       Begin starting Client...           +" << endl;
    //设置winsock版本
    winsock_ver = MAKEWORD(2,2);
    /*
    //设置IP地址长度
    addr_len = sizeof(SOCKADDR);
    //设置为IPV4协议
    addr_srv.sin_family = AF_INET;
    //设置监听端口
    addr_srv.sin_port = ::htons(Port);
    //设置服务端IP地址
    addr_srv.sin_addr.S_un.S_addr = inet_addr(ip);
     */
    memset(buf_msg,0,MSG_BUF_SIZE);
    //初始化成功
    cout << "<       Init client                 ...[OK]>" << endl;

    //启动
    cout << "+       Starting WSA...                    +" << endl;
    ret_val = ::WSAStartup(winsock_ver,&wsa_data);
    if(ret_val != 0)
    {
        cerr << ">> Start WSA failed with erorr code: " << ::WSAGetLastError() << " <<" << endl;
        ::getch();
        exit(EXIT_FAILURE);
    }
    cout << "<       WSA started                 ...[OK]>" << endl;
    //用0填充IP地址信息
    memset(&hints,0,sizeof(hints));
    hints.ai_family = AF_UNSPEC; //设置协议族
    hints.ai_socktype = SOCK_STREAM; //套接字类型，使用OOB数据传输机制提供的顺序
    hints.ai_protocol = IPPROTO_TCP; //协议类型，tcp传输控制协议

    ret_val = getaddrinfo(ip,Port,&hints,&result);
    if(ret_val != 0)
    {
        cerr << ">> Init ddrinfo failed with erorr code: " << ::WSAGetLastError() << " <<" << endl;
        ::WSACleanup();
        exit(EXIT_FAILURE);
    }
    //创建套接字
    cout << "+       Creating socket...                 +" << endl;
    //创建套接字
    sock_srv = ::socket(result->ai_family,result->ai_socktype,result->ai_protocol);
    if(sock_srv == INVALID_SOCKET)
    {
        cerr << ">> Start socket failed with erorr code: " << ::WSAGetLastError() << " <<" << endl;
        ::WSACleanup();
        ::getch();
        exit(EXIT_FAILURE);
    }
    cout << "<       Socket create finish        ...[OK]>" << endl;
}

Client::~Client() {
    //关闭套接字
    ::closesocket(sock_srv);

    //关闭WSA
    ::WSACleanup();
    cout << "<       Stop Client                 ...[OK]>" << endl;
}

int Client::ConnetServer() {
    int send_result = 0;
    cout << "+       Start Connect to server...         +" << endl;
    ret_val = ::connect(sock_srv,result->ai_addr,result->ai_addrlen);
    if(ret_val == SOCKET_ERROR)
    {
        cerr << "[Error]:Connect to Server fail with error code: " << WSAGetLastError() << endl;
        WSACleanup();
        ::getch();
        return 1;
    }
    //释放IP地址空间
    freeaddrinfo(result);
    cout << "<       Connect server              ...[OK]>" << endl;
    cout << "+------------------------------------------+" << endl;
    do{
        memset(buf_msg,0,MSG_BUF_SIZE);
        cout << ">> ";
        std::cin.getline(buf_msg,MSG_BUF_SIZE - 1);
        ret_val = ::send(sock_srv,buf_msg,MSG_BUF_SIZE,0);
        if(ret_val > 0)
        {
            cout << "[MSG]:Message Received: { " << buf_msg << " } from server" << endl;
            send_result = ::recv(sock_srv,buf_msg,MSG_BUF_SIZE,0);
            if(send_result == SOCKET_ERROR)
            {
                cerr << "[Error]:Send message to server failed with error code:"
                     << ::WSAGetLastError() << endl;
                ::closesocket(sock_srv);
                ::getch();
                return 1;
            }
        }
        else if(ret_val == 0)
        {
            cout << "[Note]:Closing socket < " << sock_srv << " > by server..." << endl;

        }
        else
        {
            cerr << "[Error]:Receive message from server failed with error code: "
                 << WSAGetLastError() << endl;
            ::closesocket(sock_srv);
            ::getch();
            return 1;
        }
    }while (ret_val > 0);

    return 0;
}
```
`main.cpp`
``` cpp
#include "client.h"

int main() {
    Client client("127.0.0.1","5000");
    client.ConnetServer();
    return 0;
}
```

##运行结果
运行截图如下
![][1]


  [1]: https://s1.ax1x.com/2018/12/24/Fc9uY6.png