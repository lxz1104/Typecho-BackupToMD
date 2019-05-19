## 引言
Debian9原来用的是UFW防火墙，之前没接触过这种类型防火墙，懵逼了半天，这里记录一下简单的使用规则，后期在使用过程中慢慢完善UFW防火墙的使用操作方法。其实UFW的用法比firewall的用法简单多了。

##操作方法

* **查看防火墙现有规则：**
``` shell
ufw status
```

* **开启/关闭防火墙：**
``` shell
ufw enable   //开启
ufw disable   //关闭
```

* **开启指定tcp或者udp端口：**
``` shell
ufw allow 22/tcp
```

* **同时开启tcp与udp端口：**
``` shell
ufw allow 445
```

* **删除53端口：**
``` shell
ufw delete allow 53
```

* **拒绝指定tcp或者udp端口：**
``` shell
allow/deny 20/tcp
allow/deny 20/udp
```
