# 引言
最近想要了解一下C++的`Boost`库，于是记录下配置`Boost`库的全过程。平台为**Windows10**,版本为**1803**，所使用到的编译器为**MinGW64**以及**VS17**。

# 配置步骤
## 下载源码
官网地址: https://www.boost.org  [传送门][1]
下载对应的版本，此时的最新版本为1.69
![][2]

## 解压
现在完成后进行解压，然后进入解压后的文件夹
![][3]

## 编译
双击文件夹的`路径地址栏`然后输入`cmd`后`回车`
![][4]
![][5]
进入命令行界面后输入`bootstrap.bat`进行预编译生成编译程序
![][6]
预编译完成后会生成两个编译程序（见下图），输入`.\b2.exe`进行编译，此过程较长需要大约半小时左右。
![][7]
![][8]

# 引入Boost
编译完成后生成的库文件在`boost_1_69_0\stage\lib`文件夹下，所需的头文件在`boost_1_69_0\boost`下。
![][9]
![][10]

在VS17中新建名为`boostest`的控制台应用程序并添加`boostest`工程的包含目录(include头文件)和库目录(lib库文件)：
```
工程名->配置属性->c/c++>常规->附加包含目录，添加： D:\path\to\boost_1_67_0
工程名->配置属性->链接器->常规->附加库目录，添加： D:\path\to\boost_1_67_0\stage\lib
```

**测试代码**
``` cpp
#include "pch.h"
#include <iostream>
#include <boost/lexical_cast.hpp>     
using namespace std;

int main()
{
    using boost::lexical_cast;
    int a = lexical_cast<int>("123");
    double b = lexical_cast<double>("123.0123456789");
    string s0 = lexical_cast<string>(a);
    string s1 = lexical_cast<string>(b);
    cout << "number: " << a << "  " << b << endl;
    cout << "string: " << s0 << "  " << s1 << endl;
    int c = 0;
    try {
        c = lexical_cast<int>("abcd");
    }
    catch (boost::bad_lexical_cast& e) {
        cout << e.what() << endl;
    }
}
```


  [1]: https://www.boost.org/users/history/version_1_69_0.htm，
  [2]: https://i.loli.net/2019/04/04/5ca5f665464d9.png
  [3]: https://i.loli.net/2019/04/04/5ca5f625802b1.png
  [4]: https://i.loli.net/2019/04/04/5ca5f80bd1ae1.png
  [5]: https://i.loli.net/2019/04/04/5ca5f825dda12.png
  [6]: https://i.loli.net/2019/04/04/5ca5f8b7e9db1.png
  [7]: https://i.loli.net/2019/04/04/5ca5f94b16c6f.png
  [8]: https://i.loli.net/2019/04/04/5ca5f93b6c9bd.png
  [9]: https://i.loli.net/2019/04/04/5ca5f94b16c6f.png
  [10]: https://i.loli.net/2019/04/04/5ca5fa8722675.png