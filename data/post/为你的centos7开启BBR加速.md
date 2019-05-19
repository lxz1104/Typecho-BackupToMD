## 开启TCP BBR拥塞控制算法
BBR 目的是要尽量跑满带宽, 并且尽量不要有排队的情况, 效果并不比速锐差,可以说是科学上网的加速神器．

Linux kernel 4.9+ 已支持 tcp_bbr 下面简单讲述基于KVM架构VPS如何开启

## Centos7开启方法：

**1.更新系统**
``` shell
yum update -y
```

**2.安装内核**
``` shell
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-2.el7.elrepo.noarch.rpm
yum --enablerepo=elrepo-kernel install kernel-ml
```

**3.查看安装内核并设置**
``` shell
awk -F\' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg
``` 
返回结果如下：
``` shell
0 : CentOS Linux (4.9.10-1.el7.elrepo.x86_64) 7 (Core)
1 : CentOS Linux (3.10.0-514.2.2.el7.x86_64) 7 (Core)
2 : CentOS Linux (4.9.0-1.el7.elrepo.x86_64) 7 (Core)
3 : CentOS Linux (3.10.0-327.36.3.el7.x86_64) 7 (Core)
4 : CentOS Linux (3.10.0-327.36.2.el7.x86_64) 7 (Core)
5 : CentOS Linux (3.10.0-327.28.3.el7.x86_64) 7 (Core)
6 : CentOS Linux (3.10.0-327.28.2.el7.x86_64) 7 (Core)
```

**启动设置(切换为4.9版本的内核) （0号位需要启动的内核，默认安装内核均是0）**
``` shell
grub2-set-default 0
```

**4.重启**
``` shell
reboot
```

**5.开启BBR**

查看内核
``` shell
uname -a
```

删除旧内核
``` shell
yum -y remove kernel kernel-tools
```

编辑/etc/sysctl.conf
``` shell
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
```

保存执行
``` shell
sysctl -p 
```

查看是否开启
``` shell
lsmod | grep bbr 
```