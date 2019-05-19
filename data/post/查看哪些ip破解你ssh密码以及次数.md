# 简介
在互联网中,总有一些无聊的人,每天不断的猜解别人服务器的密码!作为linux服务器的管理员，我们应该了解哪些IP经常不断地扫描我们的SSH端口以尝试暴力破解，下面我们用一条命令简单列出哪些IP破解你SSH密码以及次数。

# 代码
用下列awk语句输出并排序破解你SSH密码的IP以及破解次数
**Centos/Redhat**
``` shell
cat  | awk '/Failed/{print $(NF-3)}' /var/log/secure | sort | uniq -c | sort -rn
```
**Debian/Ubuntu**
``` shell
grep "Failed password for root" /var/log/auth.log | awk '{print $11}' | sort | uniq -c | sort -nr | more
```

# 建议
1.建议大家修改一下服务器的远程连接端口,以免被真的扫描到你的密码影响服务器的安全!有条件的话可以只允许固定的IP可以连接SSH远程连接端口，这样会安全很多。也可以自己写一个脚本在连续扫描次数达到指定值时将IP加入文件`hosts.deny`中并在`hosts.allow`中开启对`sshd`的过滤比如：
``` shell
sshd : /etc/hosts.deny : deny   
sshd : ALL : allow  
```

2.修改ssh端口，禁止root用户登录
需要修改`/etc/ssh/sshd_config`文件就好了
``` shell
sudo vi /etc/ssh/sshd_config
#这里就该为你认为别人猜不到的端口号
Port 4484
#这里改为no即为禁止root登陆
PermitRootLogin no
```

最后保存，重启
``` shell
sudo /etc/init.d/ssh restart
```

最后推荐几个防御软件：

[**sshfilter**][1]
[**Fail2Ban**][2]
[**DenyHosts**][3]



  [1]: https://www.csc.liv.ac.uk/~greg/sshdfilter/
  [2]: https://fail2ban.sourceforge.net/
  [3]: https://denyhosts.sourceforge.net/