**配置清单**

> * 阿里云学生机一台
> * 系统:centos7.3
> * 软件及版本:nginx1.12 | mysql5.7 | php7.1

## 安装nginx
``` shell
#添加CentOS 7 Nginx yum资源库
sudo rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
#安装Nginx
yum update -y
#更新yum缓存
yum install nginx -y
#启动nginx服务
systemctl start nginx  
#设置为开机启动
systemctl enable nginx 
```

----------


## 安装mysql
**1.下载 Mysql yum包**
``` shell
wget http://repo.mysql.com/mysql57-community-release-el7-10.noarch.rpm
```
**2.安装软件源**
将platform-and-version-specific-package-name 替换为你下载的rpm名
> rpm -Uvh platform-and-version-specific-package-name.rpm

如:
``` shell
rpm -Uvh mysql57-community-release-el7-10.noarch.rpm
```
**3.安装mysql服务端**
``` shell
yum install  -y  mysql-community-server
```
**4.启动mysql**
``` shell
service mysqld start
systemctl enable mysqld #设置为开机启动
```
**5.检查mysql 的运行状态**
``` bash
service mysqld status
```
**6.获取mysql初始密码**
``` shell
grep 'temporary password' /var/log/mysqld.log
```

**7.初始化mysql并更改密码**
输入:
``` shell
mysql_secure_installation
```
输入刚才获得的密码,然后更改新密码后,一路Y就行了.

---
## 安装php
如果之前已经安装我们先卸载一下
``` shell
yum -y remove php*
```
由于linux的yum源不存在php7.x，所以我们要更改yum源
``` shell
rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm 
rpm -Uvh https://mirror.webtatic.com/yum/el7/webtatic-release.rpm
```
yum 安装php72w和各种拓展，选自己需要的即可
``` shell
yum -y install php72w php72w-cli php72w-common php72w-devel php72w-embedded php72w-fpm php72w-gd php72w-mbstring php72w-mysqlnd php72w-opcache php72w-pdo php72w-xml
```
也可以一次安装全部扩展
``` shell
yum install php72w* --skip-broken -y
```

