## 引言

这篇文章主要讲解安装完LNMP后对nginx和php的一些配置．

## 准配

* 安装好LNMP环境，没有安装的同学请看[这里](https://www.darkhat.xyz/linux/21.html).

* 准备好mysql的数据库和数据库账号,没有弄好的同学请看[这里](https://www.darkhat.xyz/blo* g/34.html)．

* 确保mysql,php-fpm,nginx都能正常启动

## 开搞　=￣ω￣=

以下是以目录`/var/share/blog`为例,目录自己随意选就行了，但是别太奇葩，在`/var`,`/usr`下选就行了．

**１．为网站创建根目录**
``` shell
mkdir -p /usr/share/blog
```

**２．下载typecho源码**
``` shell
cd /usr/local/src
yum install wget -y
wget http://typecho.org/downloads/1.1-17.10.30-release.tar.gz
tar -zxvf 1.1-17.10.30-release.tar.gz && mv bulid/* /usr/share/blog/
chown nginx:nginx -R /usr/share/blog/            #更改目录所有者
```

**３．更改`php-fpm`的用户**
``` shell
vim /etc/php-fpm.d/www.conf
#找到usr,group，并将其改为如下内容（与`nginx`的用户和组相同即可）

usr = nginx
group = nginx

#重启php
systemctl restart php-fpm
```　

**３．配置`nginx`（80端口（http））**
先查看nginx配置
``` shell
vim /etc/nginx/nginx.conf
```

如果你的配置是如下形式：
``` 
http{
    ...
    include /etc/nginx/conf.d/*.conf;
    ...
}
```

则在`/etc/nginx/conf.d`目录下新建一个配置文件，
``` 
touch /etc/nginx/conf.d/blog.conf
```

并填上如下内容：
```
    server {
        listen       80 default_server;
        #listen       [::]:80 default_server;
        server_name    example.com;             　　　　　　　　　　#修改为你的域名，无需加www
        root           /usr/share/blog;         　　　　　　　　　　#你网站根目录
        #rewrite ^(.*)$ https://$host$1 permanent;　　　　　　　　　#http强制跳转htpps(选择开启)　
        add_header Strict-Transport-Security "max-age=31536000;includeSubDomains";
    
        location / { 
                        index index.html index.htm index.php;
　　　　　　　　　　　　　　 #nginx重写规则，便于以后开启伪静态
                        #if (-f $request_filename/index.html){
                        #       rewrite (.*) $1/index.html break;
                        #}
                        #if (-f $request_filename/index.php){
                        #        rewrite (.*) $1/index.php;
                        #}
                        #if (!-e $request_filename){
                        #        rewrite (.*) /index.php;
                        #}
        }
    　　
　　　　　#开启php支持
　　　　　location ~ \.php$ {
        　　　　root        　　/usr/share/blog;         　　　　　　　　　　#你网站根目录
        　　　　fastcgi_pass   127.0.0.1:9000;
      　　　　　fastcgi_index  index.php;
        　　　　fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name; 
        　　　　include        fastcgi_params;
   　　　}   




        location ~ /\.ht {
            deny  all;
        }
        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }   

```

如果过你的**nginx.conf**中已经含有了
```
server{
      listen 80;
　　　　．．．
}
```
等内容，参照上面改一下就行了．


**４．配置`nginx`（443端口（https））**
https的配置如下(阿里云，腾讯云适用)：
```
    server {
        listen       443 ssl http2 default_server;
        #listen       [::]:443 ssl http2 default_server;   
        server_name  　example.com;                       #修改为你的域名，无需加www
        root         /usr/share/blog;                     #你网站根目录

        ssl_certificate "/etc/nginx/cert/blog.pem";  　　　 #你的ssl证书所在位置
        ssl_certificate_key "/etc/nginx/cert/blog.key";　　　#你的ssl密钥所在位置　　
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout  60m;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
        ssl_prefer_server_ciphers on; 
        
        location / { 
                        index index.html index.htm index.php;
                        #nginx重写规则，便于以后开启伪静态
                        #if (-f $request_filename/index.html){
                        #       rewrite (.*) $1/index.html break;
                        #}
                        #if (-f $request_filename/index.php){
                        #        rewrite (.*) $1/index.php;
                        #}
                        #if (!-e $request_filename){
                        #        rewrite (.*) /index.php;
                        #}

        }

        #开启php支持
　　　　　location ~ \.php$ {
        　　　　root        　　/usr/share/blog;         　　　　　　　　　　#你网站根目录
        　　　　fastcgi_pass   127.0.0.1:9000;
      　　　　　fastcgi_index  index.php;
        　　　　fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name; 
        　　　　include        fastcgi_params;
   　　　} 


        location ~ /\.ht {
            deny  all;
        }


        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
}
```


**检查语法错误**
``` shell
nginx -t
```

**重启nginx**
``` shell
systemctl restart nginx
```

**在防火墙中方通80和443端口**
``` shell
systemctl restart firewalld
firewall-cmd --add-port=80/tcp --permanent --zone=public
firewall-cmd --add-port=443/tcp --permanent --zone=public
firewall-cmd --reload
```

**现在去浏览器输入你的域名**
``` shell
http://example.com
```

这之间可能会报错，提示**No input file specified**
你只要找到**php.ini**
把**cgi.fix_pathinfo = 0**改为1就好了
``` shell
find / -name php.in
```

如果出现如下内容则表示配置无误：

![typecho安装界面][2]

然后进入安装界面(如下图)，`数据库适配器`选择`mysql`的，用[这个教程](https://www.darkhat.xyz/blo* g/34.html)获得数据库名和数据库账户来补全下面数据库的内容．

![typecho安装界面][1]

信息填写完后，typecho就会进行数据库配置，如果没有报错就代表安装成功了！Ｏ（∩＿∩）Ｏ～～

  [1]: https://ws1.sinaimg.cn/large/007llElwly1fvwc5qe9t8j317u0jlwfw.jpg
  [2]: https://ws1.sinaimg.cn/large/007llElwly1fvwc929mklj30rs0cbglp.jpg