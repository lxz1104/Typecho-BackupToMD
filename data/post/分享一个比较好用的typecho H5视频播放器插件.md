##　效果预览

<video poster="https://inwao.com/usr/uploads/2017/03/4008215693.jpg" src="http://cdn.darkhat.xyz//upload/Unbroken%20-%20Motivational%20Video.mp4"></video>



插件名：**Plyr**

作者：**Cyclists**

[作者博客](https://inwao.com)

**功能：**
* PC 端与手机端自适应
* 与 Plyr 官方控件样式同步。
* 只需一个插件，即可播放MP3/MP4

**安装：**

下载之后自行上传到 Typecho 插件目录修改插件名为：plyr 并启用。

[下载地址](https://down.inwao.com/plugins/plyr.zip)

**使用：**
MP4：
``` html
<video src="https://xxx.com/xxx.mp4"></video>
```

带封面：
``` html
<video poster="https://xxx.com/xxx.jpg" src="https://xxx.com/xxx.mp4"></video>
```

MP3:
``` html
<div><audio src="http://xxx.com/xxx.mp3"></audio></div>
```

注：此插件已集成 HTML 5 基本按钮元素控件，无需像原生 HTML 5 一样还要写入元素控件，只需一个视频地址即可播放。

注：启用了php opcache的朋友请清以下缓存，或者重启以下php-fpm才能生效!!!