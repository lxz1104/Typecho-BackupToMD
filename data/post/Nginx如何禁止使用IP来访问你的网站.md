[Meting]
[Music server="netease" id="20110049" type="song"/]
[/Meting]


## 引言
我们在使用的时候会遇到很多的恶意IP攻击，这个时候就要用到Nginx 禁止IP访问了。

## 解决方法

在**nginx**配置中添加如下内容:
``` conf
server 
{ 
    listen 80 default; 
    server_name _; 
    return 404; 
}
```

重启nginx
``` shell
#检查语法错误
nginx -t
#重启nginx
systemctl restart nginx
```

现在就无法通过IP地址来访问你的网站了．