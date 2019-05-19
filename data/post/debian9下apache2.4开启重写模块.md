## 引言
由于博主使用的是**apt**安装的**Apache2**所以选择**a2enmod**命令来启用**已安装的**模块。

## 使用方法

**以启用重写模块为例：**

在shell中输入以下命令：
``` shell
sudo a2enmod rewrite
```

启用重写后需要修改配置文件例如：**/etc/apache2/apache2.conf**
将其中的：
**AllowOverride None**
修改为：
**AllowOverride All**

然后使用来更新Apache配置:
``` shell
service apache2 reload
```

## 补充

**apache启用与停用虚拟主机配置**

使用命令来启用虚拟主机的配置
``` shell
a2ensite site.conf
```

使用a2dissite命令来取消配置
``` shell
a2dissite site.conf
```

