 1. 列表项目

## 引言
网络文件系统（英语：Network File System，缩写作 NFS）是一种分布式文件系统协议，最初由Sun Microsystems公司开发，并于1984年发布[1]。其功能旨在允许客户端主机可以像访问本地存储一样通过网络访问服务器端文件。
NFS和其他许多协议一样，是基于开放网上运算远程过程调用（ONC RPC）协议之上的。它是一个开放、标准的RFC协议，任何人或组织都可以依据标准实现它。

### 安装

**安装RPC主程序**
``` shell
sudo yum install rpcbind
```

**安装NFS主程序**
``` shell
sudo yum install nfs-utils
```

### 配置

配置文件：`/etc/exports`
NFS文件系统维护命令：`/usr/bin/exportfs`
日志文件：`/var/lib/nfs/*tab`
客户端查询服务器共享资源命令：`/etc/sbin/showmount`

- `/etc/exports`配置文件参数

|参数值|内容说明|
|:----:|:----:|
|rw | 该目录的共享权限为可读写(最终是否能读写与文件系统的rwx权限有关)|
| ro|该目录的共享权限为只读|
|sync | 数据会同步写入到内存于硬盘中|
|async| 数据会暂时存于内存中，不会直接写入硬盘|
|no_root_squash | 开放客户端使用root身份来操作服务器的文件系统|
|root_squash|客户端的root身份会根据root_squash的设置被压缩成nfsnobody|
|all_squash | 无论登录NFS的用户身份为何，他身份都会被压缩成匿名用户，通常也就是nobody(nfsnobody)|
|anonuid、anongid| 自定义匿名用户的UID和GID，必须要存在于/etc/passwd当中。|

- **格式**
> [共享文件目录]　[第一台主机(权限)]　
> 注: 主机可用**IP**、**域名**或**带有通配符的域名**表示

**例：**
``` shell
$ sudo cat /etc/passwd
/tmp 192.168.1.88(ro) www.darkhat.xyz(rw) *.skyup.xyz(ro,sync)

```

### 启动NFS

**启动服务**

``` shell
#启动RPC服务来监听端口
/etc/init.d/rpcbind start

#启动NFS服务
/etc/init.d/nfs start

#启动nfslock
/etc/init.d/nfslock start

#查看nfs和RPC是否启动
netstat -tulnp|grep -E '(rpc|nfs)'

```

**查看服务端口**
``` shell
rpcinfo -p localhost
```

**客服端扫描服务端分享的所有目录**
``` shell
showmount -e host
```

**客服端查看服务端连接状态**
``` shell
showmount -ａ host
```

### 更新NFS挂载信息

重新修改了`/etc/exports`文件后，可以通过**exportfs**来更新NFS的配置，而不是通过重启NFS服务

``` shell
exportfs [-aruv]
选项与参数：
-a：全部挂载（或卸载）/etc/exports文件中的设置
-r：重新挂载/etc/exports里面的设置，此外，同步更新/etc/exports以及/var/lib/nfs/xtab的内容
-u：卸载某一目录
-v：在export的时候，将共享的目录显示到屏幕上

＃重新挂载一次/etc/exports的设置
$ sudo exportfs -arv

# 将已经共享的NFS目录资源，全部卸载
$ sudo exportfs -auv

```
**注意：**如果NFS服务器想要关机需要先关掉**rpcbind**和**nfs**这两个守护进程，否则在nfs还在建立连接时服务器就无法关机。

###　客户端挂载NFS服务器共享的资源

- **挂载**
格式:
``` shell
mount -t nfs host:/shared/dir 
```

例:将IP为192.168.1.88的服务器上的/home/nfs/public挂载到本地
``` shell
#建立挂载目录
mkdir -p /home/nfs/public

#挂载NFS共享目录（方式一）
mount -t nfs 192.168.1.88:/home/nfs/public

#挂载NFS共享目录（方式二）
mount -t nfs 192.168.1.88:/home/nfs/public /local/dir
```

**带有参数的挂载**
``` shell
#挂载文件系统使只能进行访问，不能执行其中的二进制文件
$ sudo mount -t nfs -o nosuid,noexec,nodev,rw 192.168.1.88:/home/nfs/public
```

**避免因网络问题拖慢文件系统**
``` shell
$ sudo mount -t nfs -o nosuid,noexec,nodev,rw -o bg,soft,rsize=32768,wsize=32768 192.168.1.88:/home/nfs/public
```

**客户端开机挂载**
修改文件`/etc/rc.d/rc.local`
``` shell
$ sudo /etc/rc.d/rc.local

#在最后一行添加如下内容:
mount -t nfs -o nosuid,noexec,nodev,rw -o bg,soft,rsize=32768,wsize=32768 192.168.1.88:/home/nfs/public /mnt
```

### autofs
**autofs**是一个自动挂载NFS目录的工具,会根据系统对文件的使用情况，自动挂载和卸载目录。配置文件为`/etc/auto.master`。

**配置**
``` shell
#修改/etc/auto.master文件
$ sudo vim /etc/auto.master
＃添加如下内容：
#[本地要挂载NFS目录的最上层路径（不需要提前建立，会在使用时自动建立，提前建立会出错）]	[该目录子路径挂载信息]

/home/nfsfile /etc/auto.master.d/auto.nfs

#添加子目录挂载信息
$ sudo vim /etc/auto.master.d/auto.nfs
#添加如下信息
#[挂载的子目录名称]	[NFS服务器共享的目录]

public -rw,bg,soft,rsize=32768,wsize=32768	192.168.1.88:/home/nfs/public

test -rw,bg,soft,rsize=32768,wsize=32768	192.168.1.88:/home/nfs/test

temp -rw,bg,soft,rsize=32768,wsize=32768	192.168.1.88:/home/nfs/temp

```

**启动**
``` shell
/etc/init.d/autofs start
```
