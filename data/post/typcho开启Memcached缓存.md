[请输入链接描述][1]## Memcached 简介
* Memcached 是一个高性能的分布式内存对象缓存系统，用于动态Web应用以减轻数据库负载。它通过在内存中缓存数据和对象来减少读取数据库的次数，从而提高动态、数据库驱动网站的速度。Memcached基于一个存储键/值对的hashmap。其守护进程（daemon ）是用C写的，但是客户端可以用任何语言来编写，并通过memcached协议与守护进程通信
* Memcached [官方地址](https://memcached.org)
* [Memcached 教程](https://www.runoob.com/Memcached/Memcached-tutorial.html)

## 安装Memcached服务(`centos7`)
* yum安装Memcached
``` shell
[root@linuxprobe ~]# yum -y install memcached
[root@linuxprobe ~]# cat /etc/sysconfig/memcached #查看memcache配置
PORT="11211"
USER="memcached"
MAXCONN="1024"
CACHESIZE="64"
OPTIONS=""
```
* 源码安装Memcached
``` shell
wget http://memcached.org/latest                    #下载最新版本
tar -zxvf memcached-1.x.x.tar.gz                    #解压源码
cd memcached-1.x.x                                  #进入目录
./configure --prefix=/usr/local/memcached           #配置
make && make test                                   #编译
sudo make install                                   #安装
```
> 注意：如果使用自动安装 memcached 命令位于 /usr/local/bin/memcached。 
>  启动选项： 
>      -d 是启动一个守护进程； 
>      -m 是分配给Memcache使用的内存数量，单位是MB； 
>      -u 是运行Memcache的用户； 
>      -l 是监听的服务器IP地址，可以有多个地址； 
>      -p 是设置Memcache监听的端口，，最好是1024以上的端口； 
>      -c 是最大运行的并发连接数，默认是1024； 
>      -P 是设置保存Memcache的pid文件。

## 启动memcached
``` shell
[root@linuxprobe ~]#  systemctl start memcached 
[root@linuxprobe ~]# systemctl enable memcached
Created symlink from /etc/systemd/system/multi-user.target.wants/memcached.service to /usr/lib/systemd/system/memcached.service.

```

* 防火墙开启情况下，执行下面命令
``` shell
[root@linuxprobe ~]# firewall-cmd --add-port=11211/tcp --permanent
success
[root@linuxprobe ~]# firewall-cmd --reload
success
```

## 下载typecho缓存插件
**下载插件上传并解压到你的根目录下**
> 插件[下载地址](https://github.com/phpgao/TpCache)

**直接使用git安装**
``` shell
cd 你的网站根目录/usr/plugins
yum install git -y
git clone https://github.com/phpgao/TpCache.git
```
**在后台启用并配置插件**
1.进入typecho后台开启插件.

2.点击设置对插件进行配置.
根据你的memcache配置信息对插件进行配置,默认配置如下:
![默认配置][1]


  [1]: https://www.darkhat.xyz/usr/uploads/memcache.png