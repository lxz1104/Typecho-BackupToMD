# 简介
**微软基础类库**（英语：Microsoft Foundation Classes，简称**MFC**）是一个微软公司提供的类库（class libraries），以C++类的形式封装了Windows API，并且包含一个（也是微软产品的唯一一个）应用程序框架，以减少应用程序开发人员的工作量。其中包含的类包含大量Windows句柄封装类和很多Windows的内建控件和组件的封装类。
简单来说就在微软提供的一些基于C++的windows平台下的图形界面开发工具。可惜的是**MFC**在很久以前便停止更新了(微软似乎已经放弃它了)。不过用它来开发一些小软件还是非常快速的。

# 开发环境
以下为我使用的环境:
**IDE:**Visual Studio 2017
**平台:**windows10 版本号1803


# 项目创建步骤

### 一、打开Visual Studio
![第一步][1]

### 二、点击文件->新建->项目
![第二步][2]

### 三、在Visual C++中找到MFC/ATL选中MFC应用程序->为项目命名->确定
![第三步][3]

### 四、配置MFC应用程序类型选项
- `应用程序类型`选择**基于对话框**。
- 找到`使用MFC`选项，选择**在静态库中使用MFC**(应为使用静态库便于程序转移到其他电脑，并且不用担心缺少**DLL**，但是生成的可执行文件略大)
- 点击**完成**
![第四步][4]

### 五、打开对话框设计界面
- 进入`资源视图`界面：依次点击打开**资源文件**->**XXX.rc**
![第五步（1）][5]

- 依次点击并打开**Dialog**->**IDD_XXX_DIALOG**。打开后现在就可以设计对话框了。
- 编译并运行：点击**本地Windows调试器**（或按下**F5**）开始编译并运行程序。
![第五步（2）][6]

### 六、运行截图
![运行截图][7]


### 总的步骤如下图:
![总体步骤][8]


  [1]: https://ws1.sinaimg.cn/large/007llElwly1fynzl3zbivj31ak0qi42i.jpg
  [2]: https://ws1.sinaimg.cn/large/007llElwly1fynzn8pb32j31ak0qiaee.jpg
  [3]: https://ws1.sinaimg.cn/large/007llElwly1fynzqjjbrxj31ak0qimzj.jpg
  [4]: https://ws1.sinaimg.cn/large/007llElwly1fynzyzgc6bj31ak0qiacs.jpg
  [5]: https://ws1.sinaimg.cn/large/007llElwly1fyo0d1knl7j31ak0qijtt.jpg
  [6]: https://ws1.sinaimg.cn/large/007llElwly1fyo0ff6r60j31ak0qi41a.jpg
  [7]: https://ws1.sinaimg.cn/large/007llElwly1fyo0iqu0jzj31ak0qigoj.jpg
  [8]: https://ws1.sinaimg.cn/large/007llElwly1fyo0jqgsz0g31980p2b2a.gif