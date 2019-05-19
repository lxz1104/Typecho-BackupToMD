# 简介
**串的顺序结构存储**：   
        1.顺序结构存储的串简称顺序串，是以一组连续的存储单元进行存储串中的字符序列。
        2.一个字节需要8个字节，因此一个内存单元可以存储多个字符，如一个32位的内存单元可以存储4个字符，因此，串的顺序存储方式有两种：非紧缩格式和紧缩格式；
        3.非紧缩格式是每个存储单元只存储一个字符，紧缩格式是一个存储单元可以存储多个字符；
        4.一般采用的是非紧缩格式的定长存储，即直接按预定的大小，为每个串分配固定长度的存储区;
#代码
**StatusLib.h**
``` C
#ifndef LINKEDSTRING_STATUSLIB_H
#define LINKEDSTRING_STATUSLIB_H

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

//如果系统中已经有了下面状态码的定义，就不在重复定义了。
#ifndef _MAX_H_
//堆栈上溢 超过所能表示的最大正数
#define OVERFLOW -2
//堆栈下溢 超过所能表示的最大负数
#define UNDERFLOW -3
#endif // _MAX_H_

//自定义状态码识别类型
typedef int Status;

/**宏函数*/

//结点后移
#define MoveToNext(node) node = node->next

//点击键盘回车键继续
#define PressEnter()\
{\
  fflush(stdin);\
  printf("Press Enter to continue...\n");\
  getchar();\
  fflush(stdin);\
}\

#endif //LINKEDSTRING_STATUSLIB_H
```


**LinkedString.h**
``` C
//
// Created by longx on 2019/2/11.
//

#ifndef LINKEDSTRING_LINKEDSTRING_H
#define LINKEDSTRING_LINKEDSTRING_H

#include "StatusLib.h"

/** 块大小的定义*/
#define BLOCK_SIZE 80 //块的长度决定了存储密度(串值所占的存储位/实际分配的存储位)，BLOCK_SIZE越大，存储密度越大

/** 定义块的结构 */
typedef struct block{
    //块的数据
    char ch[BLOCK_SIZE];
    //指向下一个块
    struct block * next;
}Blocks;

/** 串的链式储存结构 */
typedef struct {
    //串的头指针
    Blocks *head;
    //串的尾指针
    Blocks *tail;
    //串当前的长度
    unsigned int length;
}LString;

/**
 * 初始化链串
 * @param LinkedStr 要操作的链串
 */
void initString_L(LString * LinkedStr);

/**
 * 给链串添加内容
 * @param LinkedStr 要操作的链串
 * @param chs 要添加的内容
 * @return 添加成功，返回SUCCESS，添加失败，返回ERROR
 */
Status strAssign_L(LString * LinkedStr,char *chs);

/**
 * 复制链串
 * @param LinkedStr 要操作的链串
 * @param s 复制的目标链串
 * @return 复制成功，返回SUCCESS，复制失败，返回ERROR
 */
Status strCopy_L(LString * LinkedStr,LString * s);

/**
 * 判断链串是否为空
 * @param LinkedStr 要操作的链串
 * @return 为空，返回TRUE;不为空，返回FLASE
 */
Status IsEmpty_L(LString LinkedStr);

/**
 * 比较两个链串的大小
 * @param LinkedStr1 要比较的链串
 * @param LinkedStr2 要比较的链串
 * @return LinkedStr1 == LinkedStr2,返回0；LinkedStr1 > LinkedStr2,返回正数；LinkedStr1 < LinkedStr2返回负数
 */
Status strCompare_L(LString LinkedStr1,LString LinkedStr2);

/**
 * 计算链串长度
 * @param LinkedStr 要操作的链串
 * @return 链串LinkedStr长度
 */
unsigned int strLength_L(LString LinkedStr);

/**
 * 清空链串
 * @param LinkedStr 要操作的链串
 */
void clearString_L(LString * LinkedStr);

/**
 * 连接两个链串
 * @param NewStr 连接后的链串
 * @param s1 前一个链串
 * @param s2 后一个链串
 */
void strConcat_L(LString * NewStr,LString s1,LString s2);

/**
 * 截取链串
 * @param sub 截取的结果
 * @param LinkedStr 要截取的链串
 * @param pos 截取的起始位置（最小为1）
 * @param length 截取的长度（最小为1）
 * @return 状态码
 */
Status subString_L(LString * sub,LString LinkedStr,unsigned int pos,unsigned int length);

/**
 * 链串的子串匹配
 * @param parent 父串
 * @param child 子串
 * @param pos 匹配的起始位置
 * @return 匹配成功，返回子串第一个字符第一次出现的位置；匹配失败，
 */
unsigned int index_L(LString parent,LString child,unsigned int pos);

/**
 * 链串的替换
 * @param LinkedStr 要操作的链串
 * @param s1 父串中要被替换的部分
 * @param s2 用来替换的链串
 * @return 状态码
 */
Status strReplace_L(LString * LinkedStr,LString s1,LString s2);

/**
 * 在指定位置插入字符
 * @param LinkedStr 要操作的链串
 * @param pos 要插入的位置（最小为1）
 * @param L 要插入的链串
 * @return 状态码
 */
Status strInsert_L(LString * LinkedStr, unsigned int pos,LString L);

/**
 * 删除链串中指定位置指定长度的内容
 * @param LinkedStr 要操作的链串
 * @param pos 要删除的起始位置（最小为1）
 * @param length 要删除的长度
 * @return 状态码
 */
Status strDelete_L(LString * LinkedStr, unsigned int pos, unsigned int length);

/**
 * 销毁链串
 * @param LinkedStr 要销毁的链串
 */
void destoryString(LString * LinkedStr);

/**
 * 打印链串的内容
 * @param LinkedStr 要操作的链串
 */
void printString_L(LString LinkedStr);
#endif //LINKEDSTRING_LINKEDSTRING_H

```

**LinkedString.c**
``` C
//
// Created by longx on 2019/2/11.
//

#include "LinkedString.h"

#include <stdlib.h>
#include <stdio.h>
#include <string.h>

//初始化链串
void initString_L(LString * LinkedStr)
{
    LinkedStr->head = NULL; //头指针置空
    LinkedStr->tail = NULL; //尾指针置空
    LinkedStr->length = 0;  //长度置零
}

//给链串添加内容
Status strAssign_L(LString * LinkedStr,char *chs)
{
    //初始化链串
    clearString_L(LinkedStr);

    //获取字符的长度
    unsigned int len = strlen(chs);
    if(!len)
    {
        //chs为空字符时返回ERROR
        return ERROR;
    }

    //根据块长度划分字符数组
    int i = len / BLOCK_SIZE;   //i为整块数
    int j = len % BLOCK_SIZE;   //j为整块之外多余的字符

    //如果有多余部分，需要进1
    if(j > 0)
    {
        i++;
    }

    /*遍历划分好的块编号，创建新的块并添加到链串中*/
    int count = 0;
    for (int k = 1; k <= i; ++k) {
        //构建新的块并分配内存
        Blocks * p = (Blocks *)malloc(sizeof(Blocks));
        if(!p)
        {
            printf("Malloc error!\n");
            exit(OVERFLOW);
        }
        //next置空
        p->next = NULL;

        //构建链串:只有一个块时，头指针和尾指针都指向新的块
        if(k == 1)
        {
            LinkedStr->head = LinkedStr->tail = p;
        } else{
            //链串当前最后一个块的next指针指向新的块
            LinkedStr->tail->next = p;
            //链串的尾指针改为指向最后一个块p
            LinkedStr->tail = p;
        }
        /*按照划分，将chs字符数组对应的部分遍历给当前块的数据域*/
        for (count = 0; count < BLOCK_SIZE && (count + (k - 1) * BLOCK_SIZE < len); ++count) {
            LinkedStr->tail->ch[count] = chs[count + (k - 1) * BLOCK_SIZE];
        }
    }

    /*如果最后一个块被复制的字符数组长度不满一个块的自定义长度，则需要在末尾添加结束符*/
    while (count < BLOCK_SIZE)
    {
        LinkedStr->tail->ch[count++] = '\0';
    }

    //记录链串的长度
    LinkedStr->length = len;

    return SUCCESS;
}

//复制链串
Status strCopy_L(LString * LinkedStr,LString * s)
{
    /* 清空链串 */
    clearString_L(LinkedStr);

    /* 遍历链串s给LinkedStr赋值 */
    for (Blocks * p = s->head; p != NULL ; MoveToNext(p)) {
        /* 构建链串的块 */
        Blocks *node = (Blocks *)malloc(sizeof(Blocks));
        if(!node)
        {
            printf("Malloc error!\n");
            exit(OVERFLOW);
        }
        //next置空
        node->next = NULL;

        /* 只有一个块时，链串LinkedStr的头指针和尾指针都指向新的块node */
        if(p == s->head)
        {
            LinkedStr->head = LinkedStr->tail = node;
        } else
        {
            LinkedStr->tail->next = node;
            LinkedStr->tail = node;
        }

        /* 给块node赋值 */
        for (int i = 0; i < BLOCK_SIZE; ++i) {
            node->ch[i] = p->ch[i];
        }
    }
    /* 记录链串的长度 */
    LinkedStr->length = s->length;
    return SUCCESS;
}

//判断链串是否为空
Status IsEmpty_L(LString LinkedStr)
{
    if(LinkedStr.head == NULL && LinkedStr.tail == NULL && LinkedStr.length == 0)
    {
        return TRUE;
    } else{
        return FLASE;
    }
}

//比较两个链串的大小
Status strCompare_L(LString LinkedStr1,LString LinkedStr2)
{
    /* 从头指针开始遍历LinkedStr1和LinkedStr2 */
    Blocks *p = LinkedStr1.head;
    Blocks *q = LinkedStr2.head;

    /* 若其中一个链串结束，则遍历结束 */
    while (p && q)
    {
        /* 比较当前p和q的字符数组是否相等 */
        for (int i = 0; i < BLOCK_SIZE; ++i) {
            /* 如果不相等时，返回连个ASCII码的差值 */
            if(p->ch[i] != q->ch[i]) {
                return p->ch[i] - q->ch[i];
            }
        }
        MoveToNext(p);
        MoveToNext(q);
    }

    /* 遍历结束,返回两链串的差值，差值为0，两链串相等 */
    return LinkedStr1.length - LinkedStr2.length;
}

//计算链串长度
unsigned int strLength_L(LString LinkedStr)
{
    return LinkedStr.length;
}

//清空链串
void clearString_L(LString * LinkedStr)
{
    if(IsEmpty_L(*LinkedStr))
    {
        return;
    }

    Blocks *p = NULL,*q = NULL;
    p = LinkedStr->head;

    /* 遍历释放链串所有的块 */
    while (p)
    {
        q = p->next;
        free(p);
        p = q;
    }

    /* 重置链串 */
    LinkedStr->head = NULL;
    LinkedStr->tail = NULL;
    LinkedStr->length = 0;
}

//连接两个链串
void strConcat_L(LString * NewStr,LString s1,LString s2)
{
    /* 清空链串 */
    clearString_L(NewStr);

    /* 构建链串并赋值 */
    Blocks *r = NewStr->head;
    Blocks *p = s1.head;
    Blocks *q = s2.head;
    int i = 0;  //链串LinkedStr块的字符字符数组下标变量
    int j = 0;  //链串s1块的字符字符数组下标变量
    int k = 0;  //链串s2块的字符字符数组下标变量

    while (p || q)
    {
        /* 构建新块r并添加到链串LinkedStr中 */
        if(!r)
        {
            r = (Blocks *)malloc(sizeof(Blocks));
            if(!r)
            {
                printf("Malloc error!\n");
                exit(OVERFLOW);
            }
            //next置空
            r->next = NULL;

            if(!NewStr->head)
            {
                NewStr->head = NewStr->tail = r;
            } else{
                NewStr->tail->next = r;
                NewStr->tail = r;
            }
        }

        /* 先遍历链串s1，s1所有的块复制到链串NewStr中后再遍历链串s2 */
        if(p)
        {
            /* 块p的数据域复制给块r */
            while (p && p->ch[j])
            {
                r->ch[i] = p->ch[j];
                i = (i + 1) % BLOCK_SIZE;
                j = (j + 1) % BLOCK_SIZE;

                /* 链串s1当前块结束 */
                if(!j || !(p->ch[j]))
                {
                    MoveToNext(p);
                }

                /* 链串NewStr当前块结束 */
                if(!i)
                {
                    MoveToNext(r);
                    break;
                }

            }
        } else{
            /* 块q的数据域复制给块r */
            while (q && q->ch[k])
            {
                r->ch[i] = q->ch[k];
                i = (i + 1) % BLOCK_SIZE;
                k = (k + 1) % BLOCK_SIZE;

                /* 链串s2当前块结束 */
                if(!k || !(q->ch[k]))
                {
                    MoveToNext(q);
                }

                /* 链串NewStr当前块结束 */
                if(!i)
                {
                    MoveToNext(r);
                    break;
                }
            }
        }
    }
}

//截取链串
Status subString_L(LString * sub,LString LinkedStr,unsigned int pos,unsigned int length)
{
    /* 初始化链串 */
    initString_L(sub);

    /* LinkedStr为空串时返回ERROR */
    if(IsEmpty_L(LinkedStr))
    {
        return ERROR;
    }

    /* 判断截取位置是否越界 */
    if(pos < 1 || pos > LinkedStr.length || pos + length - 1 > LinkedStr.length)
    {
        printf("pos位置非法！\n");
        return ERROR;
    }

    /* 查找链串LinkedStr的第pos位置的块 */
    Blocks *p = LinkedStr.head;
    int count = 1;
    for (count = 1; pos > count * BLOCK_SIZE ; ++count) {
        MoveToNext(p);
    }

    /* 构建链串sub并赋值 */
    Blocks *r = sub->head;
    int i = 0;                      //i记录从pos开始的字符串个数
    int j = 0;                      //j遍历sub
    int k = (pos % BLOCK_SIZE) - 1; //k遍历s

    /* 长度达到length结束遍历 */
    while (i < length)
    {
        /* 新建块r并添加到链串sub中 */
        if(!r)
        {
            r = (Blocks *)malloc(sizeof(Blocks));
            if(!r)
            {
                printf("Malloc error!\n");
                exit(OVERFLOW);
            }
            //next置空
            r->next = NULL;

            if(!sub->head)
            {
                sub->head = sub->tail = r;
            } else{
                sub->tail->next = r;
                sub->tail = r;
            }
        }

        /* 长度达到length时，结束遍历 */
        while (i < length)
        {
            r->ch[j] = p->ch[k];
            j = (j + 1) % BLOCK_SIZE;
            k = (k + 1) % BLOCK_SIZE;
            i++;

            /* p块结束 */
            if(!k)
            {
                MoveToNext(p);
            }

            /* r块结束 */
            if(!j)
            {
                MoveToNext(r);
                break;
            }
        }
    }
    /* 设置链串sub长度 */
    sub->length = length;

    /* 找到第一个空闲位置，添加结束符 */
    count = (sub->length - 1) % BLOCK_SIZE + 1;
    while (count < BLOCK_SIZE)
    {
        sub->tail->ch[count++] = '\0';
    }
    return SUCCESS;
}

//链串的子串匹配
unsigned int index_L(LString parent,LString child,unsigned int pos)
{
    if(pos > 0 && pos <= parent.length)
    {
        unsigned int i = pos;
        while (i + child.length - 1 <= parent.length)
        {
            LString sub;
            //sub为从parent的第一个字符起，长度为child.length的子串
            subString_L(&sub,parent,i,child.length);

            if(strCompare_L(sub,child) != 0)
            {
                i++;
            } else{
                return i;
            }
        }
    }
    return ERROR;
}

//链串的替换
Status strReplace_L(LString * LinkedStr,LString s1,LString s2)
{
    if(IsEmpty_L(*LinkedStr))
    {
        return ERROR;
    }

    /* 从链串的第一个字符开始匹配 */
    unsigned int i = index_L(*LinkedStr,s1,1);
    while (i)
    {
        //删除在链串LinkedStr中出现的第一个链串s1
        strDelete_L(LinkedStr,i,strLength_L(s1));
        //在链串LinkedStr中的i位置插入s2
        strInsert_L(LinkedStr,i,s2);
        //匹配起始位置移动
        i += strLength_L(s2);
        //重新匹配字符串，直至全部替换
        i = index_L(*LinkedStr,s1,i);
    }
    return SUCCESS;
}

//在指定位置插入字符
Status strInsert_L(LString * LinkedStr, unsigned int pos,LString L)
{
    int i,j,k,count;
    Blocks *r,*p1,*p2,*q;
    LString temp;

    //判断pos是否合法
    if(pos < 1 || pos > LinkedStr->length + 1)
    {
        return ERROR;
    }
    initString_L(&temp);

    r = temp.head;
    p1 = LinkedStr->head;
    p2 = NULL;
    q = L.head;
    i = j = k = 0;
    count = 1;

    while (p1 || p2 || q){
        if(!r){
            r = (Blocks *)malloc(sizeof(Blocks));
            if(!r){
                printf("Malloc error!\n");
                exit(OVERFLOW);
            }
            //next置空
            r->next = NULL;

            if(!temp.head){
                temp.head = temp.tail = r;
            } else{
                temp.tail->next = r;
                temp.tail = r;
            }
        }

        if(p1){
            while (p1 && count < pos){
                r->ch[i] = p1->ch[j];
                i = (i + 1) % BLOCK_SIZE;
                j = (j + 1) % BLOCK_SIZE;
                count++;

                if(!j || !(p1->ch[j])){
                    MoveToNext(p1);
                }
                if(!i){
                    MoveToNext(r);
                    break;
                }
            }
            if(count == pos){
                p2 = p1;
                p1 = NULL;
            }
        } else if(q){
            while (q && q->ch[k]){
                r->ch[i] = q->ch[k];
                i = (i + 1) % BLOCK_SIZE;
                k = (k + 1) % BLOCK_SIZE;

                if(!k || !(q->ch[k])){
                    MoveToNext(q);
                }
                if(!i)
                {
                    MoveToNext(r);
                    break;
                }
            }
        } else{
            while (p2 && p2->ch[j]){
                r->ch[i] = p2->ch[j];
                i = (i + 1) % BLOCK_SIZE;
                j = (j + 1) % BLOCK_SIZE;

                if(!j || !(p2->ch[j])){
                    MoveToNext(p2);
                }
                if(!i){
                    MoveToNext(r);
                    break;
                }
            }
        }
    }

    temp.length = LinkedStr->length + L.length;

    count = (temp.length - 1) % BLOCK_SIZE + 1;
    while (count < BLOCK_SIZE){
        temp.tail->ch[count++] = '\0';
    }

    clearString_L(LinkedStr);

    LinkedStr->length = temp.length;
    LinkedStr->head = temp.head;
    LinkedStr->tail = temp.tail;

    return SUCCESS;
}

//删除链串中指定位置指定长度的内容
Status strDelete_L(LString * LinkedStr, unsigned int pos, unsigned int length)
{
    if(IsEmpty_L(*LinkedStr))
    {
        return ERROR;
    }

    int count,first,last,m,n;
    Blocks *r,*p,*q;

    if(pos < 1 || pos > LinkedStr->length || pos + length - 1 > LinkedStr->length || length < 0){
        return ERROR;
    }
    if(pos == 1 && length == LinkedStr->length){
        clearString_L(LinkedStr);
    }

    first = pos;
    last = pos + length - 1;

    //使p指向first所在的块
    for (count = 1, p = LinkedStr->head; first > count * BLOCK_SIZE ; ++count,MoveToNext(p));
    //使q指向last所在的块
    for (q = p;last > count * BLOCK_SIZE;++count,MoveToNext(q));

    m = (first - 1) % BLOCK_SIZE;
    n = (last - 1) % BLOCK_SIZE;
    n = (n + 1) % BLOCK_SIZE;
    if(!n){
        MoveToNext(q);
    }

    while (q && q->ch[n]){
        p->ch[m] = q->ch[n];
        m = (m + 1) % BLOCK_SIZE;
        n = (n + 1) % BLOCK_SIZE;

        if(!m){
            MoveToNext(p);
        }
        if(!n){
            MoveToNext(q);
        }
    }

    LinkedStr->length -= length;

    //r指向删除完后的终点结点
    for(count = 1,LinkedStr->tail = LinkedStr->head;LinkedStr->length > count * BLOCK_SIZE;++count,MoveToNext(LinkedStr->tail));

    count = (LinkedStr->length - 1) % BLOCK_SIZE + 1;
    while (count < BLOCK_SIZE){
        LinkedStr->tail->ch[count++] = '\0';
    }

    r = LinkedStr->tail->next;
    while (r){
        LinkedStr->tail->next = r->next;
        free(r);
        r = LinkedStr->tail->next;
    }
    return SUCCESS;
}

//销毁链串
void destoryString(LString * LinkedStr)
{
    if(IsEmpty_L(*LinkedStr))
    {
        LinkedStr = NULL;
    } else
    {
        clearString_L(LinkedStr);
        LinkedStr = NULL;
    }
}

//打印链串的内容
void printString_L(LString LinkedStr)
{
    if(IsEmpty_L(LinkedStr))
    {
        printf("链串为空，输出失败!\n");
        return;
    }

    Blocks *p = LinkedStr.head;
    int i = 0;

    while (p)
    {
        if(p->ch[i])
        {
            printf("%c",p->ch[i]);
        }

        /* 若余数不为0，则说明块没有结束 */
        i = (i + 1) % BLOCK_SIZE;
        if(!i)
        {
            MoveToNext(p);
        }
    }
}
```

# 运行截图
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwly1g02tn2ex1nj30st0ks75y.jpg