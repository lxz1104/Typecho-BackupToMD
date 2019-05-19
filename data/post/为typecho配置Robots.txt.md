## 引言
很多建站新手对robots.txt文件的重要作用不是很清楚，下面来普及一下

Robots协议（也称为爬虫协议、机器人协议等）的全称是“网络爬虫排除标准”（Robots Exclusion Protocol），网站通过Robots协议告诉搜索引擎哪些页面可以抓取，哪些页面不能抓取。

搜索引擎机器人访问网站时，首先会寻找站点根目录有没有 robots.txt文件，如果有这个文件就根据文件的内容确定收录范围，如果没有就按默认访问以及收录所有页面。另外，当搜索蜘蛛发现不存在robots.txt文件时，会产生一个404错误日志在服务器上，从而增加服务器的负担，因此为站点添加一个robots.txt文件还是很重要的。

**注：**typecho默认是没有robots.txt的（╯﹏╰）.

## 配置内容

在网站根目录下新建一个robots.txt文件（如果已存在，请跳过～～～），填上以下内容：
```
#
# robots.txt for typecho
#
User-agent: *
Allow: /*.html$
Allow: /usr
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jepg$
Allow: /*.gif$
Allow: /*.bmp$
Disallow: /admin/
Disallow: /install/
Disallow: /var/
Disallow: /config.inc.php
Disallow: /install.php
sitemap:https://www.darkhat.xyz/sitemap.xml　　　#这里替换为你的网站的网址和你的sitemap所在路径（默认一般在根目录下）

```

[百度robots写法](https://ziyuan.baidu.com/college/courseinfo?id=267&page=12#h2_article_title28)
[参考文章](https://i97.me/44.html)