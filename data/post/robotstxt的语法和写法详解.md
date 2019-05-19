# 简介
**robots.txt**是一个纯文本文件，是搜索引擎蜘蛛爬行网站的时候要访问的第一个文件，当蜘蛛访问一个站点时，它会首先检查该站点根目录下是否存在**robots.txt**，如果存在，搜索机器人就会按照该文件中的内容来确定访问的范围，相当于网站与搜索引蜘蛛遵循协议，如果该文件不存在，所有的搜索蜘蛛将能够访问网站上所有没有被屏蔽的网页，作为站长，我们就可以通过**robots.txt**文件屏蔽掉错误的页面和一些不想让蜘蛛爬取和收录的页面，下面将介绍一些基本的配置方法。

# 基本语法
- **User-agent** 定义搜索引擎。
一般情况下，网站里面都是：`User-agent: *`，这里*****的意思是所有，表示定义所有的搜索引擎。比如，我想定义**百度**，那么就是`User-agent: Baiduspider`;定义**google**，`User-agent: Googlebot`。

- **Disallow** 禁止爬取。
``` robots.txt
#若想禁止爬取我的**admin**文件夹。
Disallow: /admin/
#若想禁止爬取**admin**文件夹下的**login.html**。
Disallow: /admin/login.html。
```

- **Allow** 允许。
我们都知道，在默认情况下，都是允许的。那为什么还要允许这个语法呢?举个例子：我想禁止**admin**文件夹下的**所有文件**，除了**.html**的网页，那怎么写呢?我们知道可以用**Disallow**一个一个禁止，但那样太费时间很精力了。这时候运用Allow就解决了复杂的问题，就这样写：
``` robots.txt
Allow: /admin/.html$
Disallow: /admin/
```

- **$** 结束符。
例：`Disallow: .php$` 这句话的意思是，**屏蔽**所有的以**.php**结尾的文件，不管前面有多长的URL，如abc/aa/bb//index.php也是屏蔽的。

- ***** 通配符符号0或多个任意字符。例：`Disallow: *?*` 这里的意思是屏蔽所有带“**?**”文件，也是屏蔽所有的**动态URL**。

- 声明网站地图**sitemap**。
这个将告诉搜索引擎你的sitemap在哪，如：
``` robots.txt
Sitemap： http://www.AAAA.com/sitemap.xml
```


# 举例说明
- 禁止Google/百度等所有搜索引擎访问整个网站
``` robots.txt
User-agent: *
Disallow: /
```

- 允许所有的搜索引擎spider访问整个网站(`Disallow:`可以用`Allow: /`替代)
``` robots.txt
User-agent: *
Disallow:
```

- 禁止Baiduspider访问您的网站，Google等其他搜索引擎不阻止
``` robots.txt
User-agent: Baiduspider
Disallow: /
#只允许Google spider： Googlebot访问您的网站，禁止百度等其他搜索引擎
User-agent: Googlebot
Disallow:
User-agent: *
Disallow: /
```

- 禁止搜索引擎蜘蛛spider访问指定目录
``` robots.txt
#spider不访问这几个目录。每个目录要分开声明，不能合在一起
User-agent: *
Disallow: /cgi-bin/
Disallow: /admin/
Disallow: /~jjjj/

#禁止搜索引擎spider访问指定目录，但允许访问该指定目录的某个子目录
User-agent: *
Allow: /admin/far
Disallow: /admin/

#使用通配符星号"*"设置禁止访问的url
#禁止所有搜索引擎抓取/cgi-bin/目录下的所有以".html"格式的网页(包含子目录)
User-agent: *
Disallow: /cgi-bin/*.html

#使用美元符号"$"设置禁止访问某一后缀的文件
#只允许访问以".html"格式的网页文件。
User-agent: *
Allow: .html$
Disallow: /

#阻止google、百度等所有搜索引擎访问网站中所有带有?的动态网址页面
User-agent: *
Disallow: /*?*
```
　　
- 阻止Google spider：Googlebot访问网站上某种格式的图片
``` robots.txt
#禁止访问.jpg 格式的图片
User-agent: Googlebot
Disallow: .jpg$

#只允许Google spider：Googlebot抓取网页和.gif格式图片
#Googlebot只能抓取gif格式的图片和网页，其他格式的图片被禁止；其他搜索引擎未设置
User-agent: Googlebot
Allow: .gif$
Disallow: .jpg$
　　
#只禁止Google spider：Googlebot抓取.jpg格式图片
#其他搜索引擎和其他格式图片没有禁止
User-agent: Googlebot
Disallow: .jpg$
```
　　
# 附录
Google对robots.txt文件的介绍：[**传送门**][1]
百度对robots.txt文件的介绍：[**传送门**][2]

**国内外蜘蛛名称合集**

国内的搜索引擎蜘蛛
百度蜘蛛：**baiduspider**
搜狗蜘蛛：**sogou spider**
有道蜘蛛：**YodaoBot和OutfoxBot**
搜搜蜘蛛： **Sosospider**

国外的搜索引擎蜘蛛
google蜘蛛： **googlebot**
yahoo蜘蛛：**Yahoo! Slurp**
alexa蜘蛛：**ia_archiver**
bing蜘蛛（MSN）：**msnbot**

**本站robots.txt写法**
``` robots.txt
#
# robots.txt for typecho
#
User-agent: *
Disallow: .php$
Disallow: /*?*
Disallow: /admin/
Disallow: /install/
Disallow: /var/
sitemap:https://www.darkhat.xyz/sitemap.xml
```

  [1]: https://support.google.com/webmasters/answer/6062608?hl=zh-Hans
  [2]: https://ziyuan.baidu.com/robots/index