## 引言
在gnome下安装conky后想添加开启自启动，但是ｃｏｎｋｙ需要在进入图形化界面后才正常启动，所以需要在ｇｎｏｍｅ里添加开机自启动。

## 操作

* 为conky启动脚本添加ｇｎｏｍｅ下的快捷方式
``` shell
sudo vim /usr/share/applications/conky.desktop
```

* 添加如下内容：
``` shell
[Desktop Entry]
Type=Application 
Name=Conky 
Comment=Start conky script 
Exec=/home/longxinzheng/.conky/conkyrc/startconky.sh  #conky启动脚本的绝对路径，需要有可执行权限
Terminal=false 
OnlyShowIn=GNOME 
X-GNOME-Autostart-Phase=Application 
Name[zh_CN]=conky.desktop
```

* 添加入开机启动列表
``` shell
sudo ln -s /usr/share/applications/conky.desktop ~/.config/autostart/conky.desktop
```

**大功告成！**