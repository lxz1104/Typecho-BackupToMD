##引言
Linux下因缺少tkinter模块而无法使用pyhton的**matplotlib**绘图。

##解决方法
**Arch Linux**
``` shell
sudo pacman -S python-pmw
```

**centos或fedora**
``` shell
sudo dnf install python3-tkinter
#或者
sudo yum install python3-tkinter
```

**debian或ubuntu**
``` shell
sudo apt-get update
sudo apt install python3-tk
```