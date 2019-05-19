# 简介
**git**是一个分布式版本控制软件，最初由`林纳斯·托瓦兹`创作，于2005年以GPL发布。最初目的是为更好地管理Linux内核开发而设计。 git最初的开发动力来自于BitKeeper和Monotone。
**GitHub**是通过Git进行版本控制的软件源代码托管服务，由GitHub公司（曾称Logical Awesome）的开发者Chris Wanstrath、PJ Hyett和Tom Preston-Werner使用Ruby on Rails编写而成。GitHub同时提供`付费账户`和`免费账户`。这两种账户都可以创建公开的代码仓库，但是付费账户还可以创建私有的代码仓库。

# Git用法
**Git工作流**
本地仓库由 git 维护的三棵“树”组成。第一个是你的 `工作目录`，它持有实际文件；第二个是 `缓存区（Index）`，它像个缓存区域，临时保存你的改动；最后是 `HEAD`，指向你最近一次提交后的结果。
**创建新仓库**
进入或创建一个`文件夹`，然后输入以下命令，初始化本地Git仓库。
```
git init
```

**将文件提交到缓存区**
```
#提交单个文件
git add <filename>
#提交所有文件
git add *
```

**将文件提交到本地Git仓库**
```
   git commit -m "文件的描述（便于以后查找代码）"
```

**查看Git仓库状态**
```
git status
```

## 克隆本地仓库
 
 执行如下命令以创建一个本地仓库的克隆版本： 
```
git clone /path/to/repository
```

## 将GitHub上的代码克隆到本地
执行如下命令将GitHub上的代码仓库克隆到本地
```
   git clone https://github.com/userName/repositoryName.git
```

## 将代码推送到GitHub
 1. 先从github创建一个空的仓库
	先从github创建一个空的仓库，并复制`链接地址`
	![enter image description here](https://ws1.sinaimg.cn/large/007llElwly1fyv1y0x42pj31ns1947dv.jpg)

2. 复制仓库链接
 ![](https://ws1.sinaimg.cn/large/007llElwly1fyv1zc9mduj31pg110amb.jpg)

3. 初始化本地仓库，并提交内容到本地
4. 连接到远程仓库，并将代码同步到远程仓库
	 -  **git remote add origin 远程仓库地址**
> 连接到远程仓库并为该仓库创建别名 , 别名为origin . 这个别名是自定义的，通常用origin ; 远程仓库地址，就是你自己新建的那个仓库的地址，复制地址的方法参考 第二张图。 
> 如：git remote add origin `https://github.com/userName/repositoryName.git`.git 这段代码的含义是： 连接到github上`https://github.com/userName/repositoryName.git` 这个仓库，并创建别名为`origin` . （之后push 或者pull 的时候就需要使用到这个 origin 别名）

	- **git push -u origin master**
	> 创建一个 `upStream` （上传流），并将本地代码通过这个 `upStream` 推送到 别名为 `origin` 的仓库中的 `master` 分支上。
	> `-u` ，就是创建 `upStream` 上传流，如果没有这个上传流就无法将代码推送到 `github`；同时，这个 `upStream` 只需要在初次推送代码的时候创建，以后就不用创建了。
	> 另外，在初次 `push` 代码的时候，可能会因为网络等原因导致命令行终端上的内容一直没有变化，耐心等待一会就好。


# 分支
**分支**是用来将特性开发绝缘开来的。在你创建仓库的时候，`master` 是“默认的”。在其他分支上进行开发，完成后再将它们合并到主分支上。

**创建分支**
创建一个叫做“feature_x”的分支，并切换过去：

```
git checkout -b feature_x
```

**切换回主分支**

```
git checkout master
```

**再把新建的分支删掉**

```
git branch -d feature_x
```

**将分支推送到远程仓库**
```
git push origin <branch>
```

# 更新与合并
**更新你的本地仓库至最新改动**
```
git pull
```
以在你的工作目录中 获取（fetch） 并 合并（merge） 远端的改动。
要合并其他分支到你的当前分支（例如 master）。
```
git merge <branch>
```