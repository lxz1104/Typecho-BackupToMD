## 引言

**gawk**程序是**Unix**中原始程序的GUN版本。gawk可以进行以下操作:
- 定义变量来保存数据
- 使用算数和字符串操作符来处理数据
- 使用结构化编程概念(eg:if-then,循环)来为数据处理增加处理逻辑
- 通过提取数据文件中的数据元素，将其重新排列或者格式化，生成格式化报告


**命令格式**
``` shell
gawk options program file
```

<center>gawk选项</center>

|选项|描述|
|------|-----|
|-F fs | 指定行中划分数据字段的字段分隔符|
|-f file| 从指定的文件中读取程序|
|-v var=value|定义gawk程序中的一个变量及其默认值|
|-mf N|指定要处理的数据文件的最大字段数|
|-mr N|指定文件中的最大数据行数|
|-w keyword|指定gawk的兼容模式或警告等级|


### 从命令行读取脚本
格式:
``` shell
$ gawk '{command}'
```

eg:
``` shell
$ gawk '{print "hello"}'
```
### 使用数据字段变量
**gawk**会将如下变量分配给它在文本行中发现的数据字段：

- $0 代表整个文本的一行数据
- $1 代表文本中的第一个数据字段
- $2 代表文本中的第二个数据字段
...
- $n 代表文本中的第n个数据字段

**字段的分隔：**gawk的默认分隔字符为任意空白字符（Tab键、空格键），也可以自己设定。

`eg：`
``` shell
$ gawk -F: '{print "$1"}' /etc/passwd
```

#### 在gawk程序脚本中使用多个命令

``` shell
$ echo "I'm very happy" | gawk '{$2="not"; print "$0"}'
```

输出结果如下:
``` shell
I'm not happy
```

#### 从文件中读取程序

``` shell
$ gawk -F: -f script.gawk /etc/passwd
```

### 在处理数据前运行脚本
默认情况下，gawk会从输入中读取一行文本，然后针对该行数据执行程序脚本。有时可能需要在处理数据前运行脚本，比如为报告创建标题等。**BEGIN**关键字就是用来干这个的，它会强制gawk在读取数据前执行**BEGIN**关键字后之指定的程序脚本。

`eg:`
``` shell
$ gawk 'BEGIN {print "hello"} {print $0} temp.txt' 
```

运行结果：
``` shell
hello
...
```

### 在处理数据后运行脚本
此情况与上面的相反，关键字为**EDN**。

`eg:`
``` shell
$ gawk 'BEGIN {print "The start"} {print $0} END {print "The End"}' temp.txt
```

运行结果：
``` shell
The start
...
The End
``` 


**小案例：**
``` shell
$ cat showShell.gawk

BEGIN {
        print "---show user's shell dir---"
        print " User             \t ShellDir"
        print "------            \t ------"
        FS=":"
}

{
        print $1 "                \t " $7
}

END {
        print "------The End------"
}


$ gawk -f showShell.gawk /etc/passwd
```

输出结果如下：

![](https://ws1.sinaimg.cn/large/007llElwly1fwsxa2nw0bj30fy04yt8p.jpg)