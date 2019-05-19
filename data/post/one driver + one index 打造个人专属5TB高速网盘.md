[Meting]
[Music server="netease" id="409872465" type="song"/]
[/Meting]

## 引言
**OneDrive**，全名Microsoft OneDrive，前称Windows Live SkyDrive，是微软所推出的网络硬盘及云端服务。由于与BSkyB存在商标争议，2014年1月，微软宣布SkyDrive更名为OneDrive。OneDrive前身是SkyDrive，开始于2007，目前已经运行了十几年。

**OneIndex**是一个类似与PHP目录的程序，其主要功能是将OneDrive的文件目录给列出来，仅仅需要将程序部署在服务器上，不占用太大的空间，索引中的文件并不占用服务器空间，仅仅占用OneDrive容量，流量也不用走服务器流量。OneIndex将OneDrive的文件列出目录来，可以提供文件直连下载。最早的OneIndex仅仅支持企业版与教育版的OneDrive，不过最近版本的OneIndex已经开始了对个人版OneDrive的支援。

下面我们将用这两个东西搭建私人大容量网盘。可以提前参考一下博主已经搭好的效果。[**传送门**](https://cloud.darkhat.xyz/)

## 搭建过程

### 注册OneDrive账户

支持OneDrive个人账户和商业账户，个人账户只有5GB存储空间，如何获得OneDrive商业账户？

**方法一：**用钱购买。

**方法二：**用edu教育邮箱免费加入Office 365教育版。[**免费.edu邮箱获取方法**][2]

**方法三：**申请Office 365开发者计划。[**传送门**][1]

**方法四：**去淘宝买，5元左右，而且比较方便。


### 部署OneIndex

部署环境要求:
* PHP空间，PHP5.6+打开Curl支持
* OneDrive账号
* OneIndex程序
* 如需绑定自己的域名，那么必须部署HTTPS支持
* nginx等

LNMP或LAMP的安装教程我就不再赘述了。不知道的可以参看这篇文章。[**传送门**](https://www.darkhat.xyz/linux/21.html)

**1.下载OneIndex源码**
[GitHub地址][3]

``` shell
#为OneIndex创建根目录
mkdir -p /usr/share/nginx/oneindex
cd /usr/share/nginx/oneindex

#下载源码
##centos
sudo yum install git
##debian
sudo apt install git

##克隆源码
git clone https://github.com/donwa/oneindex.git
```

**2.在nginx下添加你的网站根目录**
这一步很简单，不用多说。

**3.安装OneIndex**
配置网nginx后，在你的浏览器中访问你配置好的域名，会看到如下画面：
![][4]

看看是否通过安装环境检测，如果没问题直接下一步。

![OneIndex安装][5]

点击蓝色按钮，并通过页面登陆你的OneDrive账号，获取client_id与client_secret，注意看最下面一览的域名，如果你的域名没有支援SSL，那么会有个默认域名而不是自定义域名。

关于client_id与client_secret的获取，可以参考下图。

![client_id与client_secret的获取][6]

填写好client_id与client_secret，继续下一步。


最后一步，绑定你的OneDrive账号，并且授权给OneIndex。

![][7]

大功告成！

![Finish][8]


### 添加计划任务，定时更新缓存

``` shell
#编辑计划任务
crontab -e

#添加以下内容
## 每小时刷新一次token
0 * * * * /具体路径/php /程序具体路径/one.php token:refresh
## 每十分钟后台刷新一遍缓存
*/10 * * * * /具体路径/php /程序具体路径/one.php cache:refresh

```

更多功能，请参看GitHub项目地址。[**传送门**][3]


[参考文章](https://www.xzymoe.com/oneindex/)
  [1]: https://dev.office.com/devprogram
  [2]: https://wzfou.com/edu-email/
  [3]: https://github.com/donwa/oneindex
  [4]: https://ww1.sinaimg.cn/large/007llElwly1fw4gj4fo7gj30m80ayt8o.jpg
  [5]: https://ws1.sinaimg.cn/large/007llElwly1fw4gme84bej30lc0bo0ur.jpg
  [6]: https://ws1.sinaimg.cn/large/007llElwly1fw4gnx7eowg30qe0nm1ky.gif
  [7]: https://ws1.sinaimg.cn/large/007llElwly1fw4gphsuo4j30da0f50sy.jpg
  [8]: https://ws1.sinaimg.cn/large/007llElwly1fw4gq9ea68j30lc06kaau.jpg