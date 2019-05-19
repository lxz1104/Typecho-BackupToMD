# 简介
用数组描述的链表，即称为**静态链表**。在C语言中，静态链表的表现形式即为结构体数组，结构体变量包括**数据域**data和**游标**CUR。这种数据结构主要便于在没有指针类型的高级程序设计语言中使用链表结构。简单实现了一下常用的操作。

# 代码
**StaticLinkList.h**
``` C
//
// Created by longx on 2019/1/24.
//

/**
 * 静态链表（游标表示法）
 * 特点:
 * 1.数组的第一元素的next游标用来存放第一个空闲结点的下标（备用链表的下标）
 * 2.数组的最后一个元素next用来保存最新插入一个的元素
 * 基本操作:
 * 1.初始化:每个元素的next都指向下一个元素
 * 2.插入数据:
 *  （1）.分配内存（malloc）：①.获得第一个空节点下标，②.赋值，③.将第一个元素(下标为0)的next指向第一个空节点的next.
 *  （2）.将最后一个结点(MAX_SIZE_SSL - 1)的next指向新插入元素的下标
 * 优点：
 * 可以不使用指针实现链表操作。
 */

#ifndef STATICLINKLIST_STATICLINKLIST_H
#define STATICLINKLIST_STATICLINKLIST_H

//静态链表长度
#define MAX_SIZE_SSL 5
//插入成功
#define INSERT_SUCCESS 1
//插入错误
#define INSERT_ERROR 0
//分配失败
#define MALLOCSSL_ERROR 0
//删除成功
#define DELETE_SUCCESS 1
//删除失败
#define DELETE_ERROR 0

/** 数据元素 */
typedef struct {
    int id;
    char *data;
}ElementType;

/** 定义静态链表*/
typedef struct {
    ElementType data;
    int next;
}StaticLinkList[MAX_SIZE_SSL];

/**
 * 初始化静态链表
 * @param slList 要初始化的静态链表
 */
void InitStaticLinkList(StaticLinkList slList);

/**
 * 向指定位置插入元素
 * @param slList 要操作的静态链表
 * @param pos 插入的位置
 * @param element 插入的元素
 * @return 插入成功，返回INSERT_SUCCESS；插入失败，返回INSERT_ERROR。
 */
int InsertStaticLinkList(StaticLinkList slList,int pos,ElementType element);

/**
 * 获取静态链表的长度
 * @param slList 要操作的静态链表
 * @return 返回静态链表的长度
 */
int GetStaticLinkListLength(StaticLinkList slList);

/**
 * 为静态链表分配一个空间的内存
 * @param slList 要操作的静态链表
 * @return 分配成功，返回空闲结点；分配失败，返回MALLOCSSL_ERROR。
 */
int mallocSSL(StaticLinkList slList);

/**
 * 删除链表中指定元素
 * @param slList 要操作的静态链表
 * @param pos 删除元素的位置
 * @return 删除成功，返回DELETE_SUCCESS；插入失败，返回DELETE_ERROR。
 */
int DeleteStaticLinkList(StaticLinkList slList,int pos);

/**
 * 回收原始数组中指定下标的空间
 * @param slList 要操作的静态链表
 * @param index 要回收元素的下标
 */
void freeSSL(StaticLinkList slList,int index);

/**
 * 打印静态链表的所有元素
 * @param slList 要操作的静态链表
 */
void  PrintStaticLinkList(StaticLinkList slList);

/**
 * 按插入顺序打印数据
 * @param slList 要操作的静态链表
 */
void PrintStaticLinkListByInsert(StaticLinkList slList);
#endif //STATICLINKLIST_STATICLINKLIST_H

```
---

**StaticLinkList.c**
``` C
//
// Created by longx on 2019/1/24.
//

#include "StaticLinkList.h"

#include <stdio.h>
#include <stdlib.h>

void InitStaticLinkList(StaticLinkList slList)
{
    for(int i = 0;i < MAX_SIZE_SSL;++i)
    {
        slList[i].next = i + 1;
        slList[i].data.data = NULL;
        slList[i].data.id = 0;
    }
    //将最后一个结点置空
    slList[MAX_SIZE_SSL - 1].next = 0;
    //将备用的链表的尾结点置空
    slList[MAX_SIZE_SSL - 2].next = 0;
}

int InsertStaticLinkList(StaticLinkList slList,int pos,ElementType element)
{
    //判断位置是否合法
    if(pos < 1 || pos > GetStaticLinkListLength(slList) + 1)
    {
        printf("位置不合法，插入失败！\n");
        return INSERT_ERROR;
    }
    //拿到第一个元素的下标
    int cursor = MAX_SIZE_SSL - 1;
    //判断cursor的范围是否合法
    //分配内存
    int newIndex = mallocSSL(slList);
    if(newIndex != MALLOCSSL_ERROR)
    {
        slList[newIndex].data = element;
        //找到newIndex的前缀结点
        for (int i = 1; i <= pos - 1; ++i) {
            cursor = slList[cursor].next;
        }
        slList[newIndex].next = slList[cursor].next;
        slList[cursor].next = newIndex;
        return INSERT_SUCCESS;
    }
    return INSERT_ERROR;
}

int GetStaticLinkListLength(StaticLinkList slList)
{
    int count = 0;
    int cursor = slList[MAX_SIZE_SSL - 1].next;
    while (cursor)
    {
        //游标后移
        cursor = slList[cursor].next;
        count++;
    }
    return count;
}

int mallocSSL(StaticLinkList slList)
{
    //拿到第一个空闲结点的下标（备用链表）
    int cursor = slList[0].next;
    if(cursor)
    {
        slList[0].next = slList[cursor].next;

    }
    return cursor;
}

int DeleteStaticLinkList(StaticLinkList slList,int pos)
{
    //判断位置是否合法
    if(pos < 1 || pos > GetStaticLinkListLength(slList) + 1)
    {
        printf("位置不合法，删除失败！\n");
        return DELETE_ERROR;
    }
    int cursor = MAX_SIZE_SSL - 1;
    //获取删除位置的前缀结点
    for (int i = 1; i < pos - 1; ++i) {
        cursor = slList[cursor].next;
    }
    int delIndex = slList[cursor].next;
    slList[cursor].next = slList[delIndex].next;
    slList[delIndex].data.data = NULL;
    slList[delIndex].data.id = 0;
    //释放空间
    freeSSL(slList,delIndex);
    return DELETE_SUCCESS;
}

void freeSSL(StaticLinkList slList,int index)
{
    //将下标为index的空闲结点回收到备用链表
    slList[index].next = slList[0].next;
    //0号元素的next结点指向备用结点的第一个结点，表示index结点空闲
    slList[0].next = index;
}

void  PrintStaticLinkList(StaticLinkList slList)
{
    printf("数组下标     数据域                  next(游标)\n");
    for (int i = 0; i < MAX_SIZE_SSL; ++i) {
        printf("[%d]       {id = %d,data = %s}   [%d]\n",i,slList[i].data.id,slList[i].data.data,slList[i].next);
    }
}

void PrintStaticLinkListByInsert(StaticLinkList slList)
{
    printf("数组下标     数据域                  next(游标)\n");
    int cursor = slList[MAX_SIZE_SSL - 1].next;
    while (cursor)
    {
        printf("[%d]       {id = %d,data = %s}   [%d]\n",cursor,slList[cursor].data.id,slList[cursor].data.data,slList[cursor].next);
        //游标后移
        cursor = slList[cursor].next;
    }
}
```
---

**main.c**
``` C
#include "StaticLinkList.h"

#include <stdio.h>

void TestStaticLinkList();
int main() {
    TestStaticLinkList();
    return 0;
}

void TestStaticLinkList()
{
    //测试数据
    ElementType dataArray[] = {
            {1,"茕茕孑立"},{2,"沆瀣一气"},
            {3,"踽踽独行"},{4,"醍醐灌顶"},
            {5,"绵绵瓜瓞"},{6,"奉为圭臬"}
    };
    StaticLinkList slList;
    InitStaticLinkList(slList);
    InsertStaticLinkList(slList,1,dataArray[0]);
    InsertStaticLinkList(slList,1,dataArray[1]);
    InsertStaticLinkList(slList,1,dataArray[2]);


    PrintStaticLinkList(slList);
    printf("-----已用链表-----\n");
    PrintStaticLinkListByInsert(slList);
    printf("-----删除后-----\n");
    DeleteStaticLinkList(slList,1);
    PrintStaticLinkList(slList);

}
```

# 运行结果
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwgy1fzi5bcjtttj30pg0e7gmv.jpg