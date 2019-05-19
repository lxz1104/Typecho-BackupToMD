## Typecho的gzip压缩
开启Typecho的gzip功能很简单，是和wordpress一样的，只要在根目录下的index.php文件里面加上下面这一句就可以了：
```
ob_start('ob_gzhandler'); 
```
注意，是整个网站根目下的index.php文件，不是在主题目录下的。上面这句话建议加在最上面，当然其他位置也可以，可以自行尝试，下面是我修改以后的。
```
<?php   
/**  
 * Typecho Blog Platform  
 *  
 * @copyright  Copyright (c) 2008 Typecho team (http://www.typecho.org)  
 * @license    GNU General Public License 2.0  
 * @version    $Id: index.php 1153 2009-07-02 10:53:22Z magike.net $  
 */  
    
/** 开启gzip压缩, add by yovisun */  
ob_start('ob_gzhandler');  
```
另外，细心的人可能注意到了，在数据库中，typecho_options表下有个字段为gzip，默认值为0。我猜应该是和gzip功能有关系。我试着将其修改为1或0，都没有看到效果（不管是否加了ob_start()），故尚不知该字段的具体作用。


[参考文章](http://www.yovisun.com/archive/open-typecho-gzip.html)