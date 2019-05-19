## 引言
一般情况下，我会使用U盘安装Linux和其他操作系统。使用U盘安装系统需要把U盘做成启动盘。现在教大家用Linux自带的**dd**命令制做Linux启动盘。

## 操作

### 1）格式化U盘
* 查看U盘设备
``` shell
sudo fdisk -l
```
结果如下：
![][1]

* 为了格式化我们首先需要**umount**U盘
``` shell
sudo umount /dev/sdb*
```

* 格式化U盘：
``` shell
sudo mkfs.vfat /dev/sdb –I
```

### 2）制作启动U盘

* 使用**dd**命令把ISO镜像写入到U盘
``` shell
sudo dd if=./debian-9.5.0-amd64-xfce-CD-1.iso of=/dev/sdb
```

耐心等待几分钟启动盘就制作完成了

![][2]


  [1]: https://ws1.sinaimg.cn/large/007llElwly1fweszv1qdwj30k803adgb.jpg
  [2]: https://ws1.sinaimg.cn/large/007llElwly1fwet5c5pnrj30i702f74l.jpg