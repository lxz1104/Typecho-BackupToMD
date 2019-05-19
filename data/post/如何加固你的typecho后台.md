[Meting]
[Music server="netease" id="404610" type="song"/]
[/Meting]


## 引言
虽然**typecho**经过几年的磨炼已经更新到1.1版本了，但是typecho的安全性并不是太高，所以我们需要进行一些设置来加固你的typecho后台.

## 更改博客后台地址

* **进入你的网站根目录**
* **更改`后台`文件夹的名称**
``` shell
mv admin newName
```

* **修改文件 config.inc.php**
在*config.inc.php*中找到**__TYPECHO_ADMIN_DIR__**所在的位置

将如下内容：
``` php
define('TYPECHO_ADMIN_DIR', '/admin/');
```
修改为：
``` php
#newName为你更改后的后台名称
define('TYPECHO_ADMIN_DIR', '/newName/');
```

##　删除多余文件
``` shell
rm -rf install install.php
```

##　更改网站根目录权限
``` shell
cd YOUR_WEB_PATH
#www为你的nginx或apache的用户所在的用户组
find . -type d | xargs chown -R root:www
find . -type d | xargs chmod 750
find . -type f | xargs chmod 644
```


