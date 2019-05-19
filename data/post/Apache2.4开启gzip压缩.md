## 引言
**Gzip**是一种流行的文件压缩算法，现在的应用十分广泛，尤其是在Linux平台。当应用Gzip压缩到一个纯文本文件时，效果是非常明显的，大约可以减少70％以上的文件大小。这取决于文件中的内容。但是开启 Gzip 压缩会消耗额外的 CPU 资源，所以图片类等大文件不适合开启gzip压缩。

## 实施步骤

### 在Apache中开启模块
在开启 Gzip 之前，需先确认 Apache 的配置文件中有没有加载**mod_deflate**和**mod_headers**模块。

找到**httpd.conf**或**apache2.conf**并打开此文件查找如下两行代码：
``` conf
LoadModule deflate_module modules/mod_deflate.so
LoadModule headers_module modules/mod_headers.so
```
前面没有#符号即为正常的，若是有#符号则表示被注释掉了，删除前面的#符号即可。

**如果是在Debian下使用apt安装的Apache，则输入以下命令即可：**
``` shell
a2enmod headers
a2enmod deflate
```

### 添加配置
在 Apache 配置文件**httpd.conf**或**apache2.conf**的最后添加：
``` shell
<IfModule deflate_module>
    SetOutputFilter DEFLATE
    SetEnvIfNoCase Request_URI .(?:gif|jpe?g|png)$ no-gzip dont-vary
    SetEnvIfNoCase Request_URI .(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    SetEnvIfNoCase Request_URI .(?:pdf|mov|avi|mp3|mp4|rm)$ no-gzip dont-vary
    AddOutputFilterByType DEFLATE text/*
    AddOutputFilterByType DEFLATE application/ms* application/vnd* application/postscript application/javascript application/x-javascript
    AddOutputFilterByType DEFLATE application/x-httpd-php application/x-httpd-fastphp
    BrowserMatch ^Mozilla/4 gzip-only-text/html
    BrowserMatch ^Mozilla/4.0[678] no-gzip
    BrowserMatch \bMSIE !no-gzip !gzip-only-text/html
</IfModule>
```

### 检测配置文件
``` shell
apache2 -t
```

重启Apache：
``` shell
systemctl restart apache2
```

## 效果检验
![gzip][1]


  [1]: https://www.centos.bz/wp-content/uploads/2017/08/2-40.png