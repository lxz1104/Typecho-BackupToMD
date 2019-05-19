## nginx的rewrite方法

**思路**
> 这应该是大家最容易想到的方法，将所有的http请求通过rewrite重写到https上即可

配置nginx
```shell
[root@VM_0_2_centos nginx]# vim /etc/nginx/nginx.conf
```
修改配置如下:
``` shell
server {
	listen	192.168.1.111:80;
	server_name	test.com;
	#重写http请求
	rewrite ^(.*)$	https://$host$1	permanent;
}
```
检查配置是否正确(出现successful则代表配置无误):
``` shell
[root@VM_0_2_centos nginx]# nginx -t
```
重启nginx:
``` shell
[root@VM_0_2_centos nginx]# serive nginx restart
```