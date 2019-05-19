#引言
`Node.js`是一个基于Chrome V8 JavaScript引擎构建的平台.Nodejs可用于轻松构建快速，可扩展的网络应用程序。最新版本node.js ppa由其官方网站维护。我们可以将这个PPA添加到Debian 9（Stretch） Debian 8（Jessie）和Debian 7（Wheezy）系统中。下面将讲解在Debian9和Centos7下的安装和配置方法。

#安装

##Debian9

###一、添加Node.js PPA
首先，您需要在我们的系统中由Nodejs官方网站提供node.js PPA。如果尚未安装，我们还需要安装python-software-properties软件包。您可以选择安装最新的Node.js版本或LTS版本。
- **最新版安装命令：**
``` shell
curl -sL https://deb.nodesource.com/setup_9.x | sudo bash -
```
- **安装LTS长期维护版：**
``` shell
sudo apt-get install curl python-software-properties
curl -sL https://deb.nodesource.com/setup_8.x |  bash -
```

###二、安装Node.js和NPM
添加所需的PPA文件后，可以安装Nodejs包。NPM也将与node.js一起安装。该命令还会在您的系统上安装许多其他相关软件包。
``` shell
sudo apt-get install nodejs
```

###三、检查Node.js和NPM版本
安装node.js后，验证并检查安装的版本。你可以在node.js 官方网站上找到关于当前版本的更多细节。
**检查Node.js版本**
``` shell
node -v 
```
**检查npm版本**
``` shell
npm -v 
```

## Centos
### 一、安装方式
这里我使用EPEL安装，这样比较快速；有精力的朋友推荐使用源码编译安装,这样更加灵活。先确认系统是否已经安装了`epel-release`包：
``` shell
yum info epel-release
```
如果有输出有关`epel-release`的已安装信息，则说明已经安装，如果提示没有安装或可安装，则安装:
``` shell
sudo yum install epel-release
```
安装完后，就可以使用`yum`命令安装`nodejs`了，安装的一般会是较新的版本，并且会将`npm`作为依赖包一起安装.
``` shell
sudo yum install nodejs
```

### 二、版本查看
安装完成后，验证是否正确的安装，node -v，如果输出如下版本信息，说明成功安装
``` shell
node -v
```

#更换镜像源
## 为何要更换镜像源
由于node安装插件是从国外服务器下载，受网络影响大，速度慢且可能出现异常。所以如果`npm`的服务器在中国就好了，所以我们乐于分享的淘宝团队（阿里巴巴旗下业务阿里云）干了这事。来自官网：“这是一个完整 `npmjs.org `镜像，你可以用此代替官方版本(只读)，同步频率目前为 10分钟 一次以保证尽量与官方服务同步。

## 更换方法
### 使用cnmp
1.使用阿里定制的 `cnpm` 命令行工具代替默认的`npm`，输入下面代码进行安装：
``` shell
npm install -g cnpm --registry=https://registry.npm.taobao.org
```
2.检测cnpm版本，如果安装成功可以看到cnpm的基本信息。
``` shell
cnpm -v
```
3.以后安装插件只需要使用`cnpm intall`即可

### 使用npm
假如你已经习惯了`npm install`的安装方式，不想去下载阿里的`cnpm`命令工具将命令变成`npm`，可以直接将`node`的仓库地址改成淘宝镜像的仓库地址。
#### 3.单次使用（重启失效）
``` shell
npm install --registry=https://registry.npm.taobao.org
```

#### 永久使用
设置成全局的下载镜像站点，这样每次install的时候就不用加--registry，默认会从淘宝镜像下载，设置方法如下：
``` shell
1.打开.npmrc文件（nodejs\node_modules\npm\npmrc，没有的话可以使用git命令行建一个( touch .npmrc)，用cmd命令建会报错）
2.增加 registry =https://registry.npm.taobao.org  即可。
```
**或:**
``` shell
npm config set registry https://registry.npm.taobao.org
```

### 检查是否更换成功
``` shell
// 配置后可通过下面方式来验证是否成功
npm config get registry
// 或
npm info express
```

**淘宝镜像官网地址：** https://npm.taobao.org
