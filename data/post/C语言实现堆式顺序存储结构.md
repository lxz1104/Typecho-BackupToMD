# 简介
**串的堆式存储结构**类似于线性表的顺序存储结构，以一组地址连续的存储单元存放串值字符序列，其存储空间是在程序执行过程中动态分配的，而不是静态分配的。我简单实现了堆串的一些常用操作，还没来得及优化，效率比较低，但是逻辑结构简单。逻辑结构图如下

![][1]


# 代码

**StatusLib.h**
常用状态码和宏定义函数
``` C
//
// Created by longx on 2019/2/2.
//

#ifndef MYSTRING_STATUSLIB_H
#define MYSTRING_STATUSLIB_H

/**
 * 常用状态码以及宏函数定义
 */

/** 状态码 */
//出错
#define ERROR 0
//成功
#define SUCCESS 1
//真
#define TRUE 1
//假
#define FLASE 0
//相等
#define EQ 0
//大于
#define GT 1
//小于
#define LT -1
//如果系统中已经有了下面状态码的定义，就不在重复定义了。
#ifndef _STATUS_H_
    //堆栈上溢 超过所能表示的最大正数
    #define OVERFLOW -2
    //堆栈下溢 超过所能表示的最大负数
    #define UNDERFLOW -3
#endif // _STATUS_H_

//自定义状态码识别类型
typedef int Status;

#endif //MYSTRING_STATUSLIB_H

```

**SeqString.h**
``` C
//
// Created by longx on 2019/2/2.
//

#ifndef MYSTRING_SEQSTRING_H
#define MYSTRING_SEQSTRING_H

/**
 * 串的顺序结构
 */

#include "StatusLib.h"


/** 串的堆式顺序存储结构 */
typedef struct {
    //如果是非空串，那么就按照指定长度分配内存。
    char * ch;
    //串的当前长度
    int length;
}HString;

/**
 * 初始化堆串
 * @param str 要操作的堆串
 */
void InitString_HeapString(HString * str);

/**
 * 为字符串赋值
 * @param Str 要操作的堆串
 * @param chars 要赋值给字符串的内容
 * @return 返回对应状态码
 */
Status StrAssign_HeapString(HString * str,char * chars);

/**
 * 打印堆串
 * @param str 要操作的堆串
 */
void PrintHeapString(HString * str);

/**
 * 销毁堆串(清空堆串)
 * @param str 要操作的堆串
 */
void DelHeapString(HString * str);

/**
 * 赋值堆串
 * @param destStr 要复制到的目标堆串
 * @param srcStr 要复制的堆串
 * @return 返回状态码
 */
Status StrCopy_HeapString(HString * destStr,HString * srcStr);

/**
 * 判断字符串是否为空
 * @param str 要操作的堆串
 * @return 为空，返回TRUE；不为空，返回FLASE
 */
Status IsEmpty_HeapString(HString * str);

/**
 * 判断两个堆串的大小关系
 * @param str1 要比较的堆串1
 * @param str2 要比较的堆串2
 * @return str1 > str2,返回GT；str1 < str2,返回LT；str1 = str2，返回EQ
 */
Status StrCompare_HeapString(HString * str1,HString * str2);

/**
 * 连接堆串
 * @param destStr 要连接到的目标堆串
 * @param srcStr 要连接的堆串
 * @return 返回状态码
 */
Status StrConcat_HeapString(HString * destStr,HString * srcStr);

/**
 * 截取指定长度的堆串
 * @param destStr 截取的结果
 * @param str 要截取的目标字符串
 * @param pos 截取的起始位置（从1开始）
 * @param len 截取的长度(len ∈ [1,len - pos + 1])
 * @return 返回状态码
 */
Status SubString_HeapString(HString * destStr,HString * srcStr,int pos,int len);

/**
 * 查找子串在父串中第一次出现的位置(匹配子串)
 * @param parent 父串
 * @param child 子串
 * @param pos 开始查找的位置
 * @return 若查找到返回，第一次出现的位置；未查找到，返回-1
 */
int FindSubstr_HeapString(HString * parent,HString * child,int pos);

/**
 * 删除堆串中任意位置、任意长度的内容
 * @param str 要操作的堆串
 * @param pos 删除操作的起始位置（从1开始）
 * @param len 删除的长度
 * @return 返回状态码
 */
Status StrDelete_HeapString(HString * str,int pos,int len);

/**
 * 向指定位置插入串
 * @param str 插入到的目标串
 * @param pos 插入的位置
 * @param insert 插入的串
 * @return 返回状态码
 */
Status StrInsert_HeapString(HString * str,int pos,HString * insert);

/**
 * 堆串的替换
 * @param str 要操作的堆串
 * @param olderStr 待替换的字符串
 * @param newStr 用来替换的新字符串
 * @return 返回状态码
 */
Status StrReplace_HeapString(HString * str,HString * olderStr,HString * newStr);

#endif //MYSTRING_SEQSTRING_H
```

**SeqString.c**
``` C
//
// Created by longx on 2019/2/2.
//

#include "SeqString.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//初始化堆串
void InitString_HeapString(HString * str)
{
    str->length = 0;
    str->ch = NULL;
}

//为堆串赋值
Status StrAssign_HeapString(HString * str,char * chars)
{
    int len  = strlen(chars);
    if(!len)
    {
        return ERROR;
    }
    if(!IsEmpty_HeapString(str))
    {
        DelHeapString(str);
    } else
    {
        InitString_HeapString(str);
    }
    str->ch = (char *)malloc(sizeof(char) * len);
    if(!str->ch)
    {
        printf("分配内存失败！\n");
        exit(OVERFLOW);
    }
    for (int i = 0; i < len; ++i) {
        str->ch[i] = chars[i];
    }
    str->ch[len] = '\0';
    str->length = len;
    return SUCCESS;
}

//打印堆串
void PrintHeapString(HString * str)
{
    if(IsEmpty_HeapString(str))
    {
        printf("堆字符为空！\n");
        str->length = 0;
        return;
    }
    for (int i = 0; i < str->length; ++i) {
        printf("%c",str->ch[i]);
    }
}

//销毁堆串
void DelHeapString(HString * str)
{
    if(!str->ch)
    {
        return;
    }
    free(str->ch);
    str->ch = NULL;
    str->length = 0;
}

//堆串复制
Status StrCopy_HeapString(HString * destStr,HString * srcStr)
{
    //判断目标字符串是否为空
    if(!IsEmpty_HeapString(destStr))
    {
        DelHeapString(destStr);
    } else
    {
        InitString_HeapString(destStr);
    }
    if(IsEmpty_HeapString(srcStr))
    {
        printf("要复制的字符串内容为空，复制失败！\n");
        return ERROR;
    }
    destStr->ch = (char *)malloc(sizeof(char) * srcStr->length);
    if(!destStr->ch)
    {
        printf("分配内存失败！\n");
        exit(OVERFLOW);
    }
    strcpy(destStr->ch,srcStr->ch);
    destStr->length = srcStr->length;
    return SUCCESS;
}

//判断堆串是否为空
Status IsEmpty_HeapString(HString * str)
{
    if(str->length == 0 || !str->ch)
    {
        str->length = 0;
        return TRUE;
    }
    return FLASE;
}

//堆串大小比较
Status StrCompare_HeapString(HString * str1,HString * str2)
{
    //先比较长度
    if(str1->length > str2->length)
    {
        return GT;
    } else if(str1->length < str2->length)
    {
        return LT;
    }
    //比较第一个不同的字符
    for (int i = 0; i < str1->length; ++i) {
        if(str1->ch[i] > str2->ch[i])
        {
            return GT;
        } else if(str1->ch[i] < str2->ch[i])
        {
            return LT;
        }
    }
    return EQ;
}

//连接堆串
Status StrConcat_HeapString(HString * destStr,HString * srcStr)
{
    if(IsEmpty_HeapString(srcStr))
    {
        printf("要连接的字符串内容为空，连接失败！\n");
        return ERROR;
    }
    if(destStr->ch)
    {
        //此处有点小问题
        destStr->ch = (char *)realloc(destStr->ch, sizeof(char) * (destStr->length + srcStr->length));
        if(!destStr->ch)
        {
            printf("分配内存失败！\n");
            exit(OVERFLOW);
        }
        for (int i = srcStr->length; i >= 0; --i) {
            destStr->ch[destStr->length + i] = srcStr->ch[i];
        }
        destStr->length += srcStr->length;
        destStr->ch[destStr->length] = '\0';
        return SUCCESS;
    }
    StrCopy_HeapString(destStr,srcStr);
    return SUCCESS;
}

//截取字符串
Status SubString_HeapString(HString * destStr,HString * srcStr,int pos,int len)
{
    InitString_HeapString(destStr);
    if(pos < 1 || pos > srcStr->length || len < 1 || pos + len - 1 > srcStr->length)
    {

        return ERROR;
    }
    destStr->ch = (char *)malloc(sizeof(char) * len);
    if(!destStr->ch)
    {
        printf("分配内存失败！\n");
        exit(OVERFLOW);
    }
    for (int i = 0; i < len; ++i) {
        destStr->ch[i] = srcStr->ch[pos - 1 + i];
    }
    destStr->length = len;
    return SUCCESS;
}

//查找子串
int FindSubstr_HeapString(HString * parent,HString * child,int pos)
{
    /**
     * 不停从父串中截取与子串相同的字符串与子串进行比较
     */
    if(pos < 1)
    {
        printf("pos取值非法！\n");
        return -1;
    }
    //记录起始位置
    int i = pos;
    HString * subStr = (HString *)malloc(sizeof(HString));
    if(!subStr)
    {
        printf("内存分配失败！\n");
        exit(OVERFLOW);
    }
    InitString_HeapString(subStr);
    while (i + child->length - 1 <= parent->length)
    {
        //截取子串
        SubString_HeapString(subStr,parent,i,child->length);
        if(StrCompare_HeapString(subStr,child) != EQ)
        {
            i++;
        } else
        {
            return i;
        }
    }
    free(subStr);
    return -1;
}

//删除任意位置字符
Status StrDelete_HeapString(HString * str,int pos,int len)
{
    if(pos < 1 || pos + len -1 > str->length || len < 1)
    {
        printf("pos值非法!\n");
        return ERROR;
    }
    if(IsEmpty_HeapString(str))
    {
        printf("字符串为空，删除失败！\n");
        return ERROR;
    }
    //执行删除操作
    for (int i = pos - 1; i + len < str->length; ++i) {
        str->ch[i] = str->ch[i + len];
    }
    str->length -= len;
    str->ch[str->length] = '\0';
    //缩小分配的内存空间
    str->ch = (char *)realloc(str->ch,sizeof(char) * str->length);
    if(!str->ch)
    {
        printf("内存分配失败!\n");
        exit(OVERFLOW);
    }
    return SUCCESS;
}

//在制定位置插入字符串
Status StrInsert_HeapString(HString * str,int pos,HString * insert)
{
    if(pos < 1 || pos > str->length + 1)
    {
        printf("pos值非法!\n");
        return ERROR;
    }
    if(IsEmpty_HeapString(str))
    {
        printf("字符串为空，插入失败！\n");
        return ERROR;
    }
    str->ch = (char *)realloc(str->ch,sizeof(char) * (str->length + insert->length));
    //为插入内容空出位置
    for (int i = str->length - 1; i >= pos - 1; --i) {
        str->ch[i + insert->length] = str->ch[i];
    }
    //插入每个字符
    for (int i = 0; i < insert->length; ++i) {
        str->ch[pos - 1 + i]  = insert->ch[i];
    }
    str->length += insert->length;
    str->ch[str->length] = '\0';
    return SUCCESS;
}

//字符串替换
Status StrReplace_HeapString(HString * str,HString * olderStr,HString * newStr)
{
    if(IsEmpty_HeapString(str) || IsEmpty_HeapString(olderStr) || IsEmpty_HeapString(newStr))
    {
        return ERROR;
    }
    //从第一个位置查找oldeStr的位置
    int  pos = FindSubstr_HeapString(str,olderStr,1);
    //判断是否存在指定的子串
    while (pos != -1)
    {
        StrDelete_HeapString(str,pos,olderStr->length);
        StrInsert_HeapString(str,pos,newStr);
        pos += newStr->length;
        pos = FindSubstr_HeapString(str,olderStr,pos);
    }
    return SUCCESS;
}
```

**main.c**
``` C
#include "SeqString.h"

#include <stdio.h>

void TestHString();

int main() {
    TestHString();
    return 0;
}

void TestHString()
{
    HString str;
    HString str2;

    StrAssign_HeapString(&str2,"This is for str2!");

    printf("------初始化堆串------\n");
    StrAssign_HeapString(&str,"hello world!");
    printf("str的值为:");
    PrintHeapString(&str);
    printf("\n");
    printf("str2的值为:");
    PrintHeapString(&str2);
    printf("\n");

    printf("\n------连接堆串------\n");
    printf("连接后的str的值为:");
    StrConcat_HeapString(&str,&str2);
    PrintHeapString(&str);
    printf("\n");

    printf("\n------堆串比较------\n");
    if(StrCompare_HeapString(&str,&str2) == GT)
    {
        printf("str > str2\n");
    }

    printf("\n------堆串复制------\n");
    StrCopy_HeapString(&str,&str2);
    printf("将str2复制给str后，str的值为:");
    PrintHeapString(&str);
    printf("\n");

    printf("\n------堆串截取------\n");
    HString str3;
    SubString_HeapString(&str3,&str,6,2);
    printf("截取后的堆串为:");
    PrintHeapString(&str3);
    printf("\n");
    DelHeapString(&str3);

    printf("\n------查找子串------\n");
    HString parent,child;
    StrAssign_HeapString(&parent,"123 321 654 789");
    StrAssign_HeapString(&child,"321");
    printf("父串为:");
    PrintHeapString(&parent);
    printf("\t子串为:");
    PrintHeapString(&child);
    printf("\n子串在父串中第一次出现的位置为:%d\n",FindSubstr_HeapString(&parent,&child,1)) ;
    DelHeapString(&parent);
    DelHeapString(&child);


    printf("\n------删除堆串中指定内容------\n");
    printf("str删除前:");
    PrintHeapString(&str);
    StrDelete_HeapString(&str,6,2);
    printf("\nstr删除指定内容后:");
    PrintHeapString(&str);

    printf("\n\n------在堆串中添加指定内容------\n");
    HString newStr;
    StrAssign_HeapString(&newStr,"is");
    printf("str添加前:");
    PrintHeapString(&str);
    StrInsert_HeapString(&str,6,&newStr);
    printf("\nstr添加指定内容后:");
    PrintHeapString(&str);
    DelHeapString(&newStr);

    printf("\n\n------替换堆串中指定内容------\n");
    HString oldStr;
    StrAssign_HeapString(&oldStr,"str2");
    StrAssign_HeapString(&newStr,"me");
    printf("str替换前:");
    PrintHeapString(&str);
    StrReplace_HeapString(&str,&oldStr,&newStr);
    printf("\nstr替换指定内容后:");
    PrintHeapString(&str);

    DelHeapString(&str2);
    DelHeapString(&str);
}
```

# 运行截图
![][2]


  [1]: https://ws1.sinaimg.cn/large/007llElwly1fzsl6qjiatj30fg04kwe9.jpg
  [2]: https://ws1.sinaimg.cn/large/007llElwly1fzsl2mkrdfj30k80lz75z.jpg