## 前言
如何让服务器响应更快？如何避免应用出现内存不足的错误？最简单的方法就是增加交换空间。Swap是存储盘上的一块自留地，操作系统可以在这里暂存一些内存里放不下的东西。

这从某种程度上相当于增加了服务器的可用内存。虽然从swap读写比内存慢，但总比没有好，算是内存不够时的安全网。

如果没有swap，则服务器一旦内存不足，就会开始终止应用以释放内存，甚至会崩溃，这会让你丢失一些还没来得及保存的数据，或者造成当机。有些应用明确要求系统配置swap以确保数据访问的可靠性。

本文介绍如何在CentOS 7服务器上创建并启用swap文件。

注：swap通常在传统机械硬盘上表现更好，在SSD上使用swap可能会造成问题，尤其是硬件老化之后。所以，对于DigitalOcean以及其他使用基于SSD的云主机服务的用户，我们不推荐启用swap。这甚至会影响到跟你的虚拟机共用宿主机的其他用户。

对于DigitalOcean用户，提升性能的最佳方法就是更新Droplet。通常来说，升级后的主机表现都会有所提升，并且更不容易受到硬件问题的影响。


----------


## 准备工作
首先，你需要一台`CentOS 7`服务器，配置过具备sudo权限的非root用户（配置过程可参考这个教程的第一到第四步骤）。

准备就绪后，以该用户名SSH到你的CentOS服务器上，准备安装swap文件。

## 检查系统的Swap信息
首先我们需要检查系统的存储，看看是否已经配置过swap。一个系统可以设置多个swap文件或分区，不过一般来说一个就够了。

使用`swapon`命令可以检查系统是否已经配置过swap，这是一个通用的swap工具。使用-s标签可列出当前存储设备上的swap使用情况：
``` shell
swapon -s
```
如果该命令没有返回出结果，则代表该系统尚未配置过swap。
或者，我们也可以使用`free`工具来查看系统的整体内存使用情况，这里可以看到`内存`和`swap`的使用状态（显示单位为MB）：
```
free -m


             total       used       free     shared    buffers     cached
Mem:          3953        315       3637          8         11        107
-/+ buffers/cache:        196       3756
Swap:            0          0       4095
```
这里可以看到我们这个系统的total swap空间为0，即没有配置过`swap`。这与我们在`swapon`里看到的结果相符合。

## 检查可用的存储空间

通常，我们建立一个单独的分区作为swap。然而有时候由于硬件或软件的限制，新建分区的方式无法实现，这种情况下就可以建立一个swap文件来实现同样的功能。

开始之前，先检查一下磁盘的可用空间。输入如下指令：
``` shell
df -h


Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        59G  1.5G   55G   3% /
devtmpfs        2.0G     0  2.0G   0% /dev
tmpfs           2.0G     0  2.0G   0% /dev/shm
tmpfs           2.0G  8.3M  2.0G   1% /run
tmpfs           2.0G     0  2.0G   0% /sys/fs/cgroup

```

这里的`-h`标记是为了告诉`dh`将信息输出为对人类友好的格式，比如以`MB`或`GB`为单位输出空间使用和空余情况，而不是直接输出内存块的个数。

从第一行可以看到我们的存储分区上还有59GB的空间剩余，这足够我们操作了。（我这是一台中等规模的新建云主机，每个人的情况可能有很大不同。）

合适的swap空间是多大？关于这个问题有很多种选择，这取决于你的应用需求和你个人的偏好。一般来说，内存容量的两倍就是个不错的起点。(根据我本人的经验最好为本机实际`物理内存`的`1.5`到`2`倍)

我的系统内存有4GB，如果设置8GB的swap会占据太多空间，所以我决定只设置4GB就好。

## 创建Swap文件

接下来我们将在文件系统上创建`swap`文件。我们要在根目录（`/`）下创建一个名叫`swapfile`的文件，当然你也可以选择你喜欢的文件名。该文件分配的空间将等于我们需要的`swap`空间。

最快捷的创建方式是`fallocate`命令，该命令能够创建一个预分配指定大小空间的文件。输入如下指令创建一个4GB的文件：
``` shell
sudo fallocate -l 4G /swapfile
```

输入密码后，该`swap`文件将立即创建完毕。我们可以用`ls`命令检查文件大小：

``` shell
ls -lh /swapfile


-rw-r--r-- 1 root root 4.0G Oct 30 11:00 /swapfile
```

至此，我们的`swap`文件就创建完毕了。

## 启用Swap文件

现在我们已经有了`swap`文件，但系统还不知道应该使用该文件作为`swap`，这就需要我们告知系统将该文件`格式化`为`swap`并启用起来。

首先我们需要更改`swap`文件的权限，确保只有`root`才可读，否则会有很大的安全隐患。使用`chmod`命令进行权限操作：

``` shell
sudo chmod 600 /swapfile
```

如此，该文件的读写都只有`root`才能操作。使用`ls -lh`命令检查一下：
``` shell
ls -lh /swapfile


-rw------- 1 root root 4.0G Oct 30 11:00 /swapfile
```

然后，使用如下命令告知系统将该文件用于`swap`：
``` shell
sudo mkswap /swapfile


Setting up swapspace version 1, size = 4194300 KiB
no label, UUID=b99230bb-21af-47bc-8c37-de41129c39bf
```

现在，这个`swap`文件就可以作为`swap`空间使用了。输入如下命令开始使用该`swap`：

``` shell
sudo swapon /swapfile
```

我们可以输入如下命令来确认一下设置是否已经生效：
``` shell
swapon -s


Filename                Type        Size    Used    Priority
/swapfile               file        4194300 0     -1
```

可以看到返回的结果中已经有我们刚才设置`swap`。再使用`free`工具确认一下：

``` shell
free -m


             total       used       free     shared    buffers     cached
Mem:          3953        315       3637          8         11        107
-/+ buffers/cache:        196       3756
Swap:         4095          0       4095
```
至此，我们的`swap`已经设置完毕，操作系统会在需要的时候使用它。

##　使Swap文件永久生效
至此我们已经在系统中启用了`swap`文件，然而一旦系统重启后，服务器还不能自动启用该文件。要让系统在重启后自动生效`swap`，我们可以通过修改`fstab`文件来实现（这是一个管理文件系统和分区的表）。

用｀sudo｀权限打开该文件编辑：
``` shell
sudo vim /etc/fstab
```
在文件末尾加入下面这行内容，告诉操作系统自动使用刚才创建的`swap`文件：
``` shell
/swapfile   swap    swap    sw  0   0
```
添加完毕后，保存退出。以后服务器每次重启都会检查该文件并自动启用`swap`。


----------

## 更改Swap配置（可选）

有几个涉及swap的选项可能会影响到系统的性能表现。大部分情况下这些选项是可选的，具体要修改成什么样则取决于你的应用需求以及个人偏好。

## Swappiness

`swappiness`参数决定了系统将数据从内存交换到swap空间的频率，数值设置在0到100之间，代表系统将数据从内存交换到swap空间的力度。

该数值越接近于0，系统越倾向于不进行swap，仅在必要的时候进行swap操作。由于swap要比内存慢很多，因此减少对swap的依赖意味着更高的系统性能。

该数值越接近于100，系统越倾向于多进行swap。有些应用的内存使用习惯更适合于这种情况，这也于服务器的用途有关。

输入如下命令查看当前的swappiness数值：

``` shell
cat /proc/sys/vm/swappiness


30
```

CentOS 7默认设置了30的swappiness，这对于大部分桌面系统和本地服务器是比较中庸的数值。对于VPS系统而言，可能接近于0的值是更加合适的。

使用`sysctl`命令可以修改swappiness。比如将swappiness设为10：
``` shell
sudo sysctl vm.swappiness=10


vm.swappiness = 10
```

本次修改将一直生效到下次重启前。如果希望永久修改该数值，则需要编辑`sysctl`配置文件：

``` shell
sudo vim /etc/sysctl.conf
```

将以下内容粘贴到文件末尾：
``` shell
vm.swappiness = 10
```
编辑完成后，保存退出，之后服务器每次重启的时候会将`swappiness`设置为该值。

## 缓存压力（Cache Pressure ）

另一个可以考虑更改的配置项是`vfs_cache_pressure`，该配置项涉及特殊文件系统元文件条目的存储。对此类信息的频繁读取是非常消耗性能的，所以延长其在缓存的保存时间可以提升系统的性能。

通过`proc`文件系统查看缓存压力的当前设定值：
``` shell
cat /proc/sys/vm/vfs_cache_pressure


100
```
这个数值是比较高的，意味着系统从缓存中移除inode信息的速度比较快。一个保守一些的数值是50，使用sysctl命令进行设置：

``` shell
sudo sysctl vm.vfs_cache_pressure=50


vm.vfs_cache_pressure = 50
```
这条命令仅在重启前有效。要让该设置永久有效，需要编辑`sysctl`配置文件：
``` shell
sudo vim /etc/sysctl.conf
```

在文件末尾添加如下内容：

``` shell 
vm.vfs_cache_pressure = 50
```
保存退出，服务器就会在每次重启后都自动将缓存压力设置为50了。


----------


## 总结

至此，我们的系统内存就获得了一些喘气的空间。有了`swap`空间可以有效避免一些常见的问题。

如果你仍然会遇到内存不足（OOM，out of memory）的错误信息，或者你的系统不能运行你需要的应用，那么最好的方法是优化你的应用配置或者升级你的服务器，不过配置swap空间也不失为一个灵活的节省方案。

原文[链接](https://blog.csdn.net/zstack_org/article/details/53258588),略有改动．