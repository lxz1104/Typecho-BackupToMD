# 简介
**KMP算法**是对BF算法的改进和升级。**KMP**算法的关键是利用匹配失败后的信息，尽量减少**模式串（子串）**与**主串**的匹配次数，以达到快速匹配的目的。
**原理:**每趟匹配过程中出现字符比较不相等时，`不回溯指针`，利用已得到的“部分匹配”结果将模式串向右滑动尽可能远一段的距离，然后继续进行比较。

# 实现
## 概念补充

> **前缀:**除了最后一个字符外，一个字符串的全部头部`组合`。
>  **后缀:**除了第一个字符外，一个字符串的全部尾部`组合`。
>  **最大共有长度（部分匹配值）：**前缀和后缀中相同的组合中最大的一个组合的字符个数。

**示例**
| 字符串 | 前缀      | 后缀     | 最大共有长度 |   
|--------|-----------|----------|--------------|
| bb     | b         | b        | 1          |   
| bbb    | b，bb     | b，bb    | 2            |   
| bbbc   | b，bb.bbb | c,cb,cbb | 0            |  

# 实现步骤
1. 在KMP算法中，i(主串下标)不会先前移动(回溯)，需要移动的是j(子串下标)，所以我们需要知道j应该如何进行移动。
2. 在代码实现过程中，子串下标有如下关系:
 > **`j`(表示子串下标)移动后的位置 = 模式串T的起始位置 + 部分匹配值**
 > 通常起始位置为0，所以
 > **`j`(表示子串下标)移动后的位置 = 部分匹配值**
 > **j = next[j]** , next[j]就是部分匹配函数，j为失配时的位置
 
所以我们需要另写一个函数**Get_Next()**来初始化**next**。以子串**"aaaac"**为例，具体过程如下:
![](https://ws1.sinaimg.cn/large/007llElwgy1g06eys8qlcj308p05wwel.jpg)
![](https://ws1.sinaimg.cn/large/007llElwgy1g06eys8r86j308905zt8t.jpg)
![](https://ws1.sinaimg.cn/large/007llElwgy1g06eys8jw8j308e05pglp.jpg)
![](https://ws1.sinaimg.cn/large/007llElwgy1g06eyscr70j308h05tglq.jpg)
![](https://ws1.sinaimg.cn/large/007llElwgy1g06eysv1svj308l05y74f.jpg)
![](https://ws1.sinaimg.cn/large/007llElwgy1g06f25mk34j30a704mt8x.jpg)


# 代码
``` cpp
#include <stdio.h>
#include <string.h>

#define MAXSIZE 255

//KMP算法实现
int KMP(char * parent, char * child, int pos);
/** 部分匹配函数 */
void Get_Next(const char * child,int cLen,int * next);

int main() {
    char * str1 = "--hello123---";
    char  * str2 = "he";
    printf("\"%s\"在\"%s\"中第一次出现的位置为:%d\n",str1,str2,KMP(str1,str2,1));
    return 0;
}

int KMP(char * parent, char * child, int pos)
{
    //部分匹配表
   int next[MAXSIZE];
   //记录主串下标
   int i = pos;
   //子串的起始位置
   int j = 0;
   //主串长度
   int  pLen = strlen(parent);
   //子串长度
   int  cLen = strlen(child);

   //获取部分匹配表
   Get_Next(child,cLen,next);
   while (i < pLen && j < cLen)
   {
       if(j == 0 || parent[i] == child[j])
       {
           ++i;
           ++j;
       } else
       {
           //i不变，j后退（核心部分）
           j = next[j];
       }
   }
   if(j == cLen)
   {
       return (i + 1) - j;
   }
   return 0;
}

void Get_Next(const char * child,int cLen,int * next)
{
    //next的下标
    int i = 0;
    int j = -1;
    //此位置的值不会被用到
    next[0] = -1;

    while (i < cLen)
    {
        if(j == -1 || child[i] == child[j])
        {
            ++i;
            ++j;
            next[i] = j;
        } else{
            j = next[j];
        }
    }

}
```

# 运行截图
![](https://ws1.sinaimg.cn/large/007llElwgy1g06f4wadcoj30hg071gln.jpg)