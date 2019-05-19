# 安装条件
- **内核要求:** linux kernel >= 3.8；amd64
``` shell
uname -a
```
 
- **CPU架构：**64位
- **内核支持一种适合的储存驱动器：**　Device Manager等
``` shell
 sudo ls -l /sys/class/misc/device-mapper
 #输出内容
 lrwxrwxrwx 1 root root 0 May 13 23:20 /sys/class/misc/device-mapper -> ../../devices/virtual/misc/device-mapper
```
 
# 安装Docker
## 脚本安装
下载安装脚本并执行
``` shell
curl https://get.docker.com/ | sudo sh
```

启动Docker守护进程,并检查它是否正在运行：
``` shell
# 启动守护进程
sudo systemctl start docker
# 查看守护进程状态
sudo systemctl status docker
# 设置开机启动
sudo systemctl enable docker
```

## Debian9/Ubuntu
 更新现有的包列表：
 ``` shell
 sudo apt update
 ```
 
 安装一些允许`apt`使用包通过HTTPS的必备软件包：
 ``` shell
 sudo apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common
 ```
 
 将官方Docker存储库的`GPG密钥`添加到系统：
 ``` shell
 curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
 ```
 
 将Docker存储库添加到`APT`源：
``` shell
 sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
```

使用新添加的repo中的Docker包更新包数据库：
``` shell
sudo apt update
```

从Docker repo而不是默认的Debian repo进行安装：
``` shell
apt-cache policy docker-ce 
```

虽然Docker的版本号可能不同，但您会看到这样的输出：
``` shell
docker-ce:
  Installed: (none)
  Candidate: 18.06.1~ce~3-0~debian
  Version table:
     18.06.1~ce~3-0~debian 500
        500 https://download.docker.com/linux/debian stretch/stable amd64 Packages
```
请注意，`docker-ce`未安装，但安装的候选者来自Debian 9（`stretch`）的Docker存储库。

安装Docker：
``` shell
sudo apt install docker-ce
```

启动Docker守护进程,并检查它是否正在运行：
``` shell
# 启动守护进程
sudo systemctl start docker
# 查看守护进程状态
sudo systemctl status docker
# 设置开机启动
sudo systemctl enable docker
```

输出应类似于以下内容，表明该服务处于活动状态并正在运行：
``` shell
● docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
   Active: active (running) since Mon 2019-05-13 18:57:31 CST; 4h 36min ago
     Docs: https://docs.docker.com
 Main PID: 31951 (dockerd)
    Tasks: 11
   Memory: 261.0M
      CPU: 13.750s
   CGroup: /system.slice/docker.service
           └─31951 /usr/bin/dockerd -H fd:// --containerd=/run/containerd/containerd.sock
```

## RedHat/Centos
更新现有的包列表：
 ``` shell
 sudo yum update
 ```
 
 安装需要的软件包， yum-util 提供yum-config-manager功能，另外两个是devicemapper驱动依赖的
``` shell
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

设置yum源
``` shell
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

可以查看所有仓库中所有docker版本，并选择特定版本安装
``` shell
sudo yum list docker-ce --showduplicates | sort -r
# 输出内容
已加载插件：fastestmirror, langpacks
可安装的软件包
 * updates: centos.ustc.edu.cn
Loading mirror speeds from cached hostfile
 * extras: mirrors.aliyun.com
docker-ce.x86_64            18.06.1.ce-3.el7                    docker-ce-stable
docker-ce.x86_64            18.06.0.ce-3.el7                    docker-ce-stable
docker-ce.x86_64            18.03.1.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            18.03.0.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.12.1.ce-1.el7.centos             docker-ce-stable
docker-ce.x86_64            17.12.0.ce-1.el7.centos             docker-ce-stable
```

安装Docker，命令：yum install docker-ce-版本号，我选的是17.12.1.ce，如下:
``` shell
sudo yum install docker-ce-17.12.1.ce
```

验证安装是否成功
``` shell
docker version
```

启动Docker守护进程,并检查它是否正在运行：
``` shell
# 启动守护进程
sudo systemctl start docker
# 查看守护进程状态
sudo systemctl status docker
# 设置开机启动
sudo systemctl enable docker
```

## Arch
直接使用`pacman`安装`docker`及其依赖：
```
sudo pacman -S docker
```

启动Docker守护进程,并检查它是否正在运行：
``` shell
# 启动守护进程
sudo systemctl start docker
# 查看守护进程状态
sudo systemctl status docker
# 设置开机启动
sudo systemctl enable docker
```

# 获取镜像
**操作方法**
``` shell
sudo docker pull 镜像名称
```
例如：
``` shell
sudo docker pull centos
```

如果下载过慢或者下载出错可以尝试更换镜像源：

- 修改配置文件`/etc/docker/daemon.json`
``` shell
sudo vim  /etc/docker/daemon.json
```
- 添加如下内容
``` json
{
  "registry-mirrors": ["https://docker.mirrors.ustc.edu.cn"]
}
#或
{
  "registry-mirrors": ["https://registry.docker-cn.com"]
}
```
 - 然后重新下载镜像
 
# 启动Docker
进行完上面的操作就可以开始使用`Docker`了。
**查看Docker信息**
``` shell
 docker info
 ```
 **启动Docker的tty**
``` shell
 sudo docker run -it centos /bin/bash
 ```
 
 **输出hello world**
 ``` shell
 sudo docker run -it centos echo "hello world"
 ```

 