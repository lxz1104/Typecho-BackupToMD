## 引言
**Visual Studio Code**是微软公司推出的一款可以跨平台（Mac OS X、Windows、Linux）的轻量级IDE，支持C/C++/C#/Python等多种语言环境，与其说它是IDE，还不如说是代码编辑器，只不过可以进行合理的配置，来实现IDE的功能。默认的界面风格类似于Sublime，我比较喜欢，与一些重量级C++IDE相比，也比较小巧，是非常值得推荐的一块编译调试工具。

## 安装

[**官网**](https://code.visualstudio.com)

去官网下载后自行安装。

## 插件安装
* **安装基本的g++环境**
``` shell
sudo apt install gcc g++ gdb make -y 
```

* **VScode插件安装**

1.**CMake Tools Helper**

![][1]


2.**C/C++ for Visual Studio Code**

![VScode插件安装][2]


## 配置

*修改配置文件如下：*


**launch.json**

``` json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "C++ Launch",
            "type": "cppdbg",
            "request": "launch",
            "program": "${workspaceRoot}/a.out",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${workspaceRoot}",
            "environment": [],
            "externalConsole": true,
            "MIMode": "gdb",
            "preLaunchTask": "build",
            "setupCommands": [
                {
                    "description": "C++ Attach",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ]
        }
    ]
}
```


**tasks.json**
``` json
{
    "version": "2.0.0",
    "tasks": [
        {
            "label": "build",
            "type": "process",
            "command": "make",
            "args": [
                "all"
            ],
            "group": "build",
            "presentation": {
                "echo": true,
                "reveal": "silent",
                "focus": false,
                "panel": "shared",
                "showReuseMessage": true
            },
            "problemMatcher": "$msCompile"
        }
    ]
}
```

## 使用方法

* **需要自己写一个Makefile**

* **按下`F5`编译并运行**

* **`F9`设置断点**


  [1]: https://ws1.sinaimg.cn/large/007llElwly1fwknr4rhdsj30kc07s3zh.jpg
  [2]: https://ws1.sinaimg.cn/large/007llElwly1fwknso80rzj30k208lmy0.jpg