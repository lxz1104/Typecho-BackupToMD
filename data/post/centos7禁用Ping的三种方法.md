## 引言
**Ping**属于ICMP协议（即“Internet控制报文协议”），而ICMP协议是TCP/IP协议的一个子协议，工作在网际层。ICMP协议主要用于传输网络是否连通、主机是否可达以及路由是否可用等控制信息。Ping可以回显TTL生存时间，网络延迟等信息，而且响应Ping请求也会消耗服务器资源。因此，在服务器上禁用ICMP响应可以尽可能的隐藏服务器在Internet上的踪迹，降低受攻击面。本文介绍三种方法禁用（或启用）ICMP响应，即禁止（或允许）Ping.


## 操作环境：

**Centos7.5**


## 1. 临时禁用ICMP协议

修改文件`/proc/sys/net/ipv4/icmp_echo_ignore_all`的值。 

切换到**root**，输入命令：

``` shell
echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all
```

这样就将`/proc/sys/net/ipv4/icmp_echo_ignore_all`文件里面的0临时改为了1，从而实现禁止**ICMP报文**的所有请求，达到禁止Ping的效果，网络中的其他主机Ping改主机时会显示“请求超时”，但改服务器此时是可以Ping其他主机的。

如果想启用**ICMP**响应，则输入：

``` shell
echo 0 > /proc/sys/net/ipv4/icmp_echo_ignore_all
```

**注意**
>注0：由于/proc/sys/net/ipv4/icmp_echo_ignore_all这个文件是只读    的，即使我们使用root用户登录，vim打开/proc/sys/net/ipv4/icmp_echo_ignore_all，将里面的0改为1之后使用qw!强制保存也无法完成修改。因此上面这个方法只是临时的，一旦服务器重启就又会回到默认的0状态（假设修改前/proc/sys/net/ipv4/icmp_echo_ignore_all里面的值就是0）。如果想永久修改（当然也可以改回来，只是不再受服务器关机或重启的影响）请使用方法二或方法三。


## 2.永久禁用ICMP协议：

禁用**ICMP**协议，输入：
``` shell
vim /etc/sysctl.conf
```

在最后一行添加一条信息：
``` shell
net.ipv4.icmp_echo_ignore_all = 1
```

保存并退出。

使配置生效：
``` shell
sysctl -p
```


若启用ICMP协议，输入：
``` shell
vim /etc/sysctl.conf
```

将：
``` shell
net.ipv4.icmp_echo_ignore_all = 1
```
修改为：

``` shell
net.ipv4.icmp_echo_ignore_all = 0
```

如果没有`net.ipv4.icmp_echo_ignore_all = 1`就在最后一行添加：
``` shell
net.ipv4.icmp_echo_ignore_all = 0
```
保存并退出。 

输入：
``` shell
sysctl -p
```
使配置生效。


**注意：**
>如果想启用ICMP响应，不能直接在/etc/sysctl.conf里删除net.ipv4.icmp_echo_ignore_all> = 1之后sysctl -p. 这样做仍然是禁止Ping的状态，此时使用命令：vim /proc/sys/net/ipv4/icmp_echo_ignore_all查看发现其值仍然是1, 即仍处于拒绝ICMP响应的状态。

## 3.配置IPTABLES防火墙

Iptables防火墙是集成于Linux内核的IP信息包过滤系统。方法三不能和上面的方法一和方法二组合使用。即，在使用方法三时不能已经使用方法一或方法二禁止了Ping.


禁止Ping，输入：
``` shell
iptables -A INPUT -p icmp --icmp-type 8 -s 0/0 -j DROP
```

停止禁用Ping，输入：
``` shell
iptables -D INPUT -p icmp --icmp-type 8 -s 0/0 -j DROP
```

上面两条命令的简要解释：
``` shell
-A：添加防火墙规则.
INPUT：入站规则.
-p icmp：指定包检查的协议为ICMP协议.
--icmp-type 8：指定ICMP类型为8.
-s：指定IP和掩码，“0/0”表示此规则针对所有IP和掩码.
-j：指定目标规则，即包匹配则应到做什么，"DROP"表示丢弃.
```


**注意:**
>由于方法三是对防火墙进行的设置，所以使用方法三禁止Ping后只会阻止来自外网的Ping请求，内网主机的Ping请求仍然会正常响应。使用方法一和方法二禁止Ping后不仅会阻止外网的Ping请求也会阻止内网的Ping请求。



[参考文章](https://zhaokaifeng.com/?p=538)


