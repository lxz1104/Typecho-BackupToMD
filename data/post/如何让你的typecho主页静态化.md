[Meting]
[Music server="netease" id="16846088" type="song"/]
[/Meting]


## 引言
网页静态化可以减少服务器处理压力，和动态页面不同，静态化后，客户端只需要加载已经处理好的html就可以了，当然这只适用于一部分站点和页面；另一个静态化就是数据静态化，也就是把数据库中的数据以文件的形式存储在硬盘上，这样可以减少数据库查询请求等．同样我们可以利用代码，定时生成html静态页面，以达到动态更新的目的．typecho下将主页静态化方法也很简单．*这不是伪静态，是真静态化页面!!!*


## 方法

１．复制下面的代码**站点根目录**(不是主题根目录)下创建或上传**build_index.php**（名字随意取，但是一定要是php文件,而且要在**调用更新**那里将**build_index.php**改为你的自定义的名称），访问这个文件就可以在根目录生成静态文件了。

２．更新缓存：访问**http://test.com/build_index.php?password=123456**（可以在脚本里面设置你的密码，防止被他人利用发起CC攻击，频繁写文件造成服务器IO过高。）

３．如果不想使用过期更新，可以从脚本里面去掉调用更新那句**script**代码，缓存过期时间修改**$expire**变量。

４．另外需要注意的是你的**index.html**要在**index.php**前面，否则不生效。**Apache**修改**DirectoryIndex**，**Nginx**修改**index，**IIS**配置默认文档。

**代码如下：**
``` php
<?php
/**
 * 首页静态化脚本
 * Author: Yusure
 * Blog: yusure.cn
 */
ini_set( 'date.timezone', 'PRC' );
/* 缓存过期时间 单位：秒 */
$expire = 86400;
/* 主动刷新密码  格式：http://test.com/build_index.php?password=123456 */
$password = '123456';
$file_time = @filemtime( 'index.html' );
time() - $file_time > $expire && create_index();
isset( $_GET['password'] ) && $_GET['password'] == $password && create_index();
/**
 * 生成 index.html
 */
function create_index()
{
    ob_start();
    include( 'index.php' );
    $content = ob_get_contents();
    $content .= "\n<!-- Create time: " . date( 'Y-m-d H:i:s' ) . " -->";
    /* 调用更新 */
    $content .= "\n<script language=javascript src='build_index.php'></script>";
    ob_clean();
    $res = file_put_contents( 'index.html', $content );
    if ( $res !== false )
    {
        die( 'Create successful' );
    }
    else
    {
        die( 'Create error' );
    }
}
```
如果你的网站根目录下出现了**index.html**文件，则说明代码执行成功．


[出处](http://yusure.cn/php/202.html)
[GitHub](https://gist.github.com/yusureabc/34564707391b6275864b94b3cdc0088f)