## URL跳转

这里说的URL跳转就是用户在访问一个URL时将其跳转到另一个URL上。
常见的应用场景是让多个域名跳转到同一个URL上，（例如让旧域名跳转到新域名上）
将静态文件请求跳转到cdn上等
根据用户设备跳转到不同站点（pc版，wap版）等。
URL跳转可以通过js在页面上设置的window.location实现
也可以通过php设置header来实现
当然也可以用nginx 的 rewrite功能实现

## nginx rewrite模块

rewrite 是 nginx的静态重写模块
基本用法是 rewrite patten replace flag
patten是正则表达式，与patten匹配的URL会被改写为replace，flag可选

例如将旧域名跳转到新域名上
```
server
{
    listen 80;
    server_name www.old.com;
    rewrite ".*" http://www.new.com;
}

```

若跳转到新域名上时需要**保留路径**，则进行如下配置：
```
server
{
    listen 80;
    server_name www.old.com;
    rewrite "^/(.*)$" http://www.new.com/$1;
}
```

## 实例
**rewrite与location配合实现图片文件跳转到cdn**
```
location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$ {
	 expires 30d;
	 rewrite "^/uploadfile\/(.*)$" http://cdn.XXX.com/uploadfile/$1;
}
```

是不是很简单（＊＾＿＿＾＊）　嘻嘻……

**补充：**
rewrite 后面可以加flag，flag标记有：
last 相当于Apache里的[L]标记，表示完成rewrite
break 终止匹配, 不再匹配后面的规则
redirect 返回302临时重定向 地址栏会显示跳转后的地址
permanent 返回301永久重定向 地址栏会显示跳转后的地址


[参考文章](https://blog.csdn.net/zaqwsx20/article/details/53128590)


