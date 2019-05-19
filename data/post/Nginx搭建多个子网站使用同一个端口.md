### 以本站搭建[book.darkhat.xyz](https://book.darkhat.xyz)子网站为例,给大家讲解一下如何在同一个服务器上搭建多个网站

**材料:**
* 腾讯云学生机一台
* LNMP环境
* 一个域名

### 搭建过程
1. 创建二级域名
> 去各自的域名控制台添加域名解析,选择`A`记录,让后填入二级域名的前缀,如想创建book.example.com的二级域名,就在主机记录中填写填写book,接着在记录值中填写你主机的公网IP.

2. 创建网站的根目录
> 如网站一(example.com)的根目录为/var/www/site1; 网站二(book.example.com)的更目录为/var/www/site2

3. 配置nginx
**首先看一下nginx.conf的大致结构**
```
....
http{
        ....
     server {
            ....
        location / {
               ....
        }
            ....
        location ~ \.php$ {
               ....
       }
           ....
    }

}
....
```
可以看到http包含了一个server，server中定义了一个站点的基本信息。所以nginx得多站点配置方法即为将server部分写进一个独立的文件中。然后在nginx.conf中的http大括号内引入这个的独立的server部分的配置文件。

在配置文件中我们可以看到如下内容:
```
http {
    ...
    include /etc/nginx/conf.d/*.conf;#引入conf.d目录下的配置文件
    server {
    ...
```
这样我们只需在`conf.d`目录下写每个网站各自的配置文件就行了(不同的环境可能内容不一样,没有的自行添加上去就行了).

### 添加网站配置文件
以配置网站`example.com`为例:
> 在`conf.d`目录下添加文件site1.conf,内容如下

```
server {
        listen       80;
        #listen       [::]:80 default_server;
        server_name   example.com; #更改为网站的域名
        root         /var/www/site2; #网站的根目录
        #rewrite ^(.*)$  https://$host$1 permanent;

        # Load configuration files for the default server block.
        #include      /etc/nginx/default.d/*.conf;
        #include             typecho.conf;

        location / {
                        index index.html index.htm index.php;
        }
        location ~ \.php$ {
                root           /var/www/site1;
                fastcgi_pass   127.0.0.1:9000;
                fastcgi_index  index.php;
                fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
                include        fastcgi_params;
        }


        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
}

```
**其他网站进行类似的配置就行了.**

配置完成后输入:
``` shell
nginx -t
```
检查配置是否有语法错误

然后重启nginx:
``` shell
systemctl restart nginx
```

