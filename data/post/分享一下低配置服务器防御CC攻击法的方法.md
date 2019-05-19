[Meting]
[Music server="netease" id="28221499" type="song"/]
[/Meting]


## 引言
CC攻击者借助**代理服务器**生成指向受害主机的合法请求，实现**DDOS**和**伪装**就叫：CC(Challenge Collapsar)

CC主要是用来攻击**页面**的。大家都有这样的经历，就是在访问论坛时，如果这个论坛比较大，访问的人比较多，打开页面的速度会比较慢，访问的人越多，论坛的页面越多，数据库压力就越大，被访问的频率也越高，占用的系统资源也就相当可观。

博主用的是阿里云的学生机，1h 2g 1M带宽。经过我的测试，我的主机被cc攻击，并不会占用太多系统资源（cpu占用大约在35%左右，RAM大约为60%）。原因是1M的带宽实际只有(128k/s左右)，再加上我配置了类似memcache这样的缓存服务，那么这点峰值数据量还不会导致我的服务器宕机，但是CC攻击还是会耗尽我的网络资源，导致网页长时间加载不出来，这对于网络服务器来说，与宕机没有什么区别。所以今天我在服务器上做了点**策略**可以尽可能小的降低CC攻击给我带来的影响。

## 防护策略

**配置详情：**
>阿里云学生机一台
>系统：centos7
>web架构：LNMP
>CMS：typecho
>其他软件：Firewalld 、fail2ban

### 1.防火墙配置
* **检查Firewalld是否启用**
``` shell
#如果您已经安装iptables建议先关闭
service iptables stop
#查看Firewalld状态
firewall-cmd --state
#启动firewalld
systemctl start firewalld
#设置开机启动
systemctl enable firewalld.service
```

**注：**启用Firewalld后会禁止所有端口连接，因此请务必放行常用的端口，以免被阻挡在外，以下是放行SSH端口（80,22,443）示例，供参考：
``` shell
#放行80端口
firewall-cmd --zone=public --add-port=80/tcp --permanent
#放行22端口
firewall-cmd --zone=public --add-port=22/tcp --permanent
#放行443端口
firewall-cmd --zone=public --add-port=443/tcp --permanent
#重载配置
firewall-cmd --reload
#查看已放行端口
firewall-cmd --zone=public --list-ports
```

* **安装fail2ban**
**fail2ban**可以监控系统日志，并且根据一定规则匹配异常IP后使用Firewalld将其屏蔽，尤其是针对一些爆破/扫描等非常有效。

``` shell
#CentOS内置源并未包含fail2ban，需要先安装epel源
yum -y install epel-release
#安装fial2ban
yum -y install fail2ban
```

安装成功后fail2ban配置文件位于**/etc/fail2ban**，其中**jail.conf**为主配置文件，相关的匹配规则位于**filter.d**目录，其它目录/文件一般很少用到，如果需要详细了解可自行搜索。

* **配置规则**
在**jail.conf**所在的目录下新建jail.local文件，如果原来有请**覆盖**：
``` shell
vi /etc/fail2ban/jail.local
``` 

*配置文件如下：*
``` shell
#默认配置
[DEFAULT]
ignoreip = 127.0.0.1/8
bantime  = 86400
findtime = 600
maxretry = 5
#这里banaction必须用firewallcmd-ipset,这是fiewalll支持的关键，如果是用Iptables请不要这样填写
banaction = firewallcmd-ipset
action = %(action_mwl)s
```
配置注解：
>* ignoreip：IP白名单，白名单中的IP不会屏蔽，可填写多个以（,）分隔
>* bantime：屏蔽时间，单位为秒（s）
>* findtime：时间范围
>* maxretry：最大次数
>* banaction：屏蔽IP所使用的方法，上面使用firewalld屏蔽端口

上面的配置意思是如果同一个IP，在**10分钟**内，如果连续超过**5次**错误，则使用Firewalld将他IP ban了。输入**systemctl start fail2ban**启动fail2ban来试试效果。

#### 防止SSH爆破配置
如果您还在使用默认SSH端口（22），可能每天都会被扫描，可以使用fail2ban将恶意IP屏蔽。

在**jail.local**这个配置文件中，加入如下内容：
``` shell
[sshd]
enabled = true
filter  = sshd
port    = 22
action = %(action_mwl)s
logpath = /var/log/secure
```
配置注解：
>* [sshd]：名称，可以随便填写
>* filter：规则名称，必须填写位于filter.d目录里面的规则，sshd是fail2ban内置规则
>* port：对应的端口
>* action：采取的行动
>* logpath：需要监视的日志路径

#### 防止CC攻击
Nginx为例，使用fail2ban来监视**nginx日志**，匹配短时间内频繁请求的IP，并使用firewalld将其IP屏蔽，达到CC防护的作用。

在**filter.d**目录下新建一个nginx日志匹配规则:
``` shell
vim /etc/fail2ban/filter.d/nginx-cc.conf
```

填入如下内容：
``` shell
[Definition]
failregex = <HOST> -.*- .*HTTP/1.* .* .*$
ignoreregex =
```

然后在**jail.local**追加如下内容：
``` shell
#这里的nginx-cc要与filter.d目录下的文件名对应
[nginx-cc]
enabled = true
port = http,https
filter = nginx-cc
action = %(action_mwl)s
maxretry = 20
findtime = 60
bantime = 3600
logpath = /var/log/nginx/access.log   #这里是nginx的连接日志，需要自己更改
```
上面的配置意思是如果在60s内，同一IP达到20次请求，则将其IP ban 1小时，请根据自己的实际情况修改。logpath为nginx日志路径。

#### 防止typecho后台爆破（WordPress也类似）
先新建一个nginx日志匹配规则：
``` shell
vim /etc/fail2ban/filter.d/typecho.conf
```

填写如下内容:
``` shell
[Definition]
failregex = ^<HOST> -.* /admin/index.php.* HTTP/1\.."
ignoreregex =
```

然后在**jail.local**追加如下内容：
``` shell
[typecho]
enabled = true
port = http,https
filter = typecho
action = %(action_mwl)s
maxretry = 20
findtime = 60
bantime = 3600
logpath = /var/log/nginx/access.log
```

输入**systemctl restart fail2ban**重启fail2ban使其生效。

#### fail2ban常用命令
``` shell
#启动
systemctl start fail2ban
#停止
systemctl stop fail2ban
#开机启动
systemctl enable fail2ban
#查看被ban IP，其中sshd为名称，比如上面的[wordpress]
fail2ban-client status sshd
#删除被ban IP
fail2ban-client set sshd delignoreip 192.168.111.111
#查看日志
tail /var/log/fail2ban.log
```

### 2.nginx配置
* **访问频率限制**
访问频率限制使用到的是**ngx_http_limit_req_module**，需要在两个地方配置，首先在**HTTP段**中，声明好这个模块一些参数，设置如下：
``` conf

http{
...
limit_req_zone $binary_remote_addr zone=one:10m rate=10r/s;##平均10r/s 每秒10个请求

server {
...
}
```

注解：
>第一个代表的是需要限制的ip群，这个很好理解，第二个**zone=one**表示这个**limit_zone**的名字叫做one，后面的使用中
>可以用这个one来进行指代，后面的10m，代表为这个zone分配10m的内存，1m可以保存16000的**$binary_remote_addr**。最后>一个是频率，如>果要按分来算可以设置10r/m这样。

最后是配置到Nginx的php的解析段
``` conf

location ~ \.php$ {
...
limit_req zone=one burst=5 nodelay;
...
}
```
指定了使用名字为one的zone，然后缓冲队列为5，无延迟，如果不设置无延迟，访问会卡住。

* **访问连接限制**
访问连接限制使用到的是**ngx_http_limit_conn_module**，也是需要在两个地方配置，首先在**HTTP段**中，声明好这个模块一些参数,设置如下:
``` conf
http{
...
limit_conn_zone $binary_remote_addr zone=addr:10m;
...
}
``` 
参数的意思跟上面的差不多也就不多解释了。
后面的就是在server段中进行设置了，可以具体到某个目录:
``` shell

server {
    location /download/ {
        limit_conn addr 5;  #限制每个IP只能发起5个并发连接
        #limit_rate 300k     #对每个连接限速300k. 注意，这里是对连接限速，而不是对IP限速。如果一个IP允许两个并发连接，那么这个IP就是限速limit_rate×2。
    }
```

重启nginx使配置生效
``` shell
systemctl restart nginx
```

## 总结
上面列出的各种方法只能降低CC攻击带来的影响，并不能完全消除。解除该攻击最有效的方法就是取消域名绑定。
