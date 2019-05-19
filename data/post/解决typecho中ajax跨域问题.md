[Meting]
[Music server="netease" id="740530" type="song"/]
[/Meting]

## 引言
`typecho`后台只能设置一个域名，比如我设置了个`https://www.darkhat.xyz`，嗯这个域名就是被程序认知的域名，但是呢，这个`https://www.darkhat.xyz`不带`www`的域名访问我的博客会出现问题，因为程序只认`https://www.darkhat.xyz`,所以会导致不带www的域名访问无法加载字体文件等文件，例如我的`血小板`看板娘就会因此而加载不出来（问题截图如下），那么如何解决这个问题呢？

![问题截图][1]

## 解决方案

* **方法一（不推荐）:**
> 利用`nginx`让`https://darkhat.xyz`重定向到`https://www.darkhat.xyz`，这样确实能解决问题(但是确实管用)，但是这个方法不太好，重定向会拖慢网页速度．所以我并`不推荐`．

**配置如下**
在nginx server段内添加如下代码，并重启Nginx即可：
```
location /{
    add_header 'Access-Control-Allow-Origin' *;
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Headers' 'Authorization,Content-Type,Accept,Origin,User-Agent,DNT,Cache-Control,X-Mx-ReqToken,X-Requested-With';
    add_header 'Access-Control-Allow-Methods' 'GET,POST';
}
```

* **方法二(推荐):**
> 在config.inc.php中定义Helper::options()->siteUrl='https://darkhat.xyz';（要放在数据库初始化之后，也就是最后）

*　**方法三（也不太不推荐）：**
> 修改typecho的源代码.[参考地址](http://note.yurenchen.com/archives/typecho_siteUrl.html)
> 

步骤一
> 打开程序目录的这个文件`/var/Widget/Options.php`

步骤二
> 使用搜索找到这个位置
``` php
 /** 初始化站点信息 */
        if (defined('__TYPECHO_SITE_URL__')) {
            $this->siteUrl = __TYPECHO_SITE_URL__;
        }
```
步骤三
在步骤二中的代码最前面加入下面的代码（域名改成你自己的）
``` php
if($_SERVER['SERVER_NAME']=='https://darkhat.xyz'){//chen added
    $this->siteUrl = 'https://darkhat.xyz';    
}
```
步骤四
保存修改，这种方法步骤比较繁琐，不建议使用．

## 最后

**注意：**安装了缓存插件的同学，一定要记得**刷新缓存**！！！不然看不到效果．

[参考文章](https://qqdie.com/archives/typecho_siteUrl-add.html)

  [1]: https://cndssl.darkhat.xyz/ajax.png