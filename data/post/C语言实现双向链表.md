# 简介
**双向链表**，又稱為双链表，是链表的一种，它的每个数据结点中都有两个指针，分别指向直接后继和直接前驱。 所以，从双向链表中的任意一个结点开始，都可以很方便地访问它的前驱结点和后继结点,减少了时间开销，增大了空间开销。下面我简单实现了双链表的**增删**操作。

# 代码
**DoublelyLinkList.h**
``` C
//
// Created by longx on 2019/1/25.
//

#ifndef DOUBLELYLINKLIST_DOUBLELYLINKLIST_H
#define DOUBLELYLINKLIST_DOUBLELYLINKLIST_H

/** 数据域定义 */
typedef struct {
    int id;
    char *data;
}ElementType;

/** 双向链表的结点，包含一个数据域，两个指针域 */
typedef struct doublelyLinkNode{
    ElementType data;
    //指向前缀结点
    struct doublelyLinkNode * prev;
    //指向后继结点
    struct doublelyLinkNode * next;
}DoublelyLinkNode;

/** 双向链表（头结点） */
typedef struct doublelyLinkList{
    //结点数量
    int length;
    //指向下一节点
    DoublelyLinkNode * next;
}DoublelyLinkList;

/**
 * 初始化双向链表
 * @param dlList 要操作的双链表
 * @return 初始化成功，返回头结点指针；初始化失败，返回NULL
 */
DoublelyLinkList * InitDoublelyLinkList(DoublelyLinkList * dlList);

/**
 * 释放双链表
 * @param dlList 要操作的双链表
 */
void FreeDoublelyLinkList(DoublelyLinkList * dlList);

/**
 * 置空双链表
 * @param dlList 要操作的双链表
 */
void EmptyeDoublelyLinkList(DoublelyLinkList * dlList);

/**
 * 向双向链表中的指定位置插入元素
 * @param dlList 要操作的双链表
 * @param pos 插入的位置
 * @param element 插入的元素
 * @return 插入成功，返回插入位置的结点指针；插入失败，返回NULL。
 */
DoublelyLinkNode * InsertDoublelyLinkList(DoublelyLinkList * dlList,int pos,ElementType element);

/**
 * 删除指定位置的元素
 * @param dlList 要操作的双链表
 * @param pos 要删除元素的位置
 * @return 删除成功，返回删除的元素，删除失败，返回空元素({0,NULL})。
 */
ElementType DeleteDoublelyLinkList(DoublelyLinkList * dlList,int pos);

/**
 * 打印双向链表的所有元素
 * @param dlList 要操作的双链表
 */
void PrintDoublelyLinkList(DoublelyLinkList * dlList);
#endif //DOUBLELYLINKLIST_DOUBLELYLINKLIST_H

```
---
**DoublelyLinkList.c**
``` C
//
// Created by longx on 2019/1/25.
//

#include "DoublelyLinkList.h"

#include <stdlib.h>
#include <stdio.h>

//后移结点
#define MoveToNext(node) node = node->next

DoublelyLinkList * InitDoublelyLinkList(DoublelyLinkList * dlList)
{
    dlList = (DoublelyLinkList *)malloc(sizeof(DoublelyLinkList));
    if(!dlList)
    {
        printf("分配内存失败!!!\n");
        return NULL;
    }
    dlList->next = NULL;
    dlList->length = 0;
    return dlList;
}

void FreeDoublelyLinkList(DoublelyLinkList * dlList)
{
    if(dlList)
    {
        EmptyeDoublelyLinkList(dlList);
        free(dlList);
        dlList = NULL;
    }
}

void EmptyeDoublelyLinkList(DoublelyLinkList * dlList)
{
    DoublelyLinkNode * node = dlList->next;
    DoublelyLinkNode * temp = NULL;
    if(!node || dlList->length == 0)
    {
        printf("链表已为空，置空失败！\n");
        dlList->length = 0;
        return;
    }
    for(int i = 0; node && i < dlList->length; ++i)
    {
        temp = node;
        MoveToNext(node);
        free(temp);
    }
    dlList->next = NULL;
    dlList->length = 0;
}

DoublelyLinkNode * InsertDoublelyLinkList(DoublelyLinkList * dlList,int pos,ElementType element) {
    /**
     * 插入时的两种情况：
     * 1.插入的是第一个元素，pos = 1
     * node->prev = NULL
     * node->next = dlList->next;
     * dlList->next = node;
     * node->next->prev = node;
     * 2.插入的位置不是第一个元素，pos ∈ (1,length + 1]
     * node->prev = preNode;
     * if(preNode->next != NULL) { preNode->next->prev = node; }
     * node->next = preNode->next;
     * preNode->next = node;
     */

    if(pos < 1 || pos > dlList->length + 1)
    {
        printf("位置非法，添加失败！pos ∈ (1,%d]\n",dlList->length + 1);
        return NULL;
    }

    //创建空节点
    DoublelyLinkNode *node = (DoublelyLinkNode *) malloc(sizeof(DoublelyLinkNode));
    if(!node)
    {
        printf("分配内存失败!!!\n");
        return NULL;
    }
    node->next = NULL;
    node->prev = NULL;
    node->data = element;

    //在第一个位置插入结点
    if(1 == pos)
    {
        if(dlList->length == 0)
        {
            dlList->next = node;
            dlList->length++;
            return node;
        }
        node->next = dlList->next;
        dlList->next = node;
        node->next->prev = node;
        dlList->length++;
        return node;
    } else if(pos > 1)
    {
        //插入的不是第一个元素
        //插入位置的前缀结点
        DoublelyLinkNode *preNode = dlList->next;
        for (int i = 1; preNode && i < pos - 1; ++i) {
            MoveToNext(preNode);
        }
        if(preNode)
        {
            node->prev = preNode;
            //如果前缀结点非空（为空表示没有后继结点）
            if(preNode->next)
            {
                //将插入位置处的前缀结点指向新结点
                preNode->next->prev = node;
            }
            node->next = preNode->next;
            preNode->next = node;
            dlList->length++;
            return preNode->next;
        }
    }
    free(node);
    node = NULL;
    return NULL;
}

ElementType DeleteDoublelyLinkList(DoublelyLinkList * dlList,int pos)
{
    ElementType element = {0,NULL};
    if(!dlList->next || dlList->length == 0)
    {
        printf("链表为空，删除失败！\n");
        dlList->length = 0;
        return element;
    }
    if(pos < 1 || pos > dlList->length)
    {
        printf("位置非法，删除失败！pos ∈ (1,%d]\n",dlList->length);
        return element;
    }
    if(1 == pos)
    {
        DoublelyLinkNode * node = dlList->next;
        if(node)
        {
            element = node->data;
            dlList->next = node->next;
            //如果有第二结点
            if(node->next)
            {
                node->next->prev = NULL;
            }
            free(node);
            dlList->length--;
        }
    } else if(pos > 1)
    {
        DoublelyLinkNode * node = dlList->next;
        for (int i = 1; node && i < pos; ++i) {
            MoveToNext(node);
        }
        if(node)
        {
            element = node->data;
            if(node->next)
            {
                node->next->prev = node->prev;
            }
            node->prev->next = node->next;
            free(node);
            dlList->length--;
        }
    }
    return element;
}

void PrintDoublelyLinkList(DoublelyLinkList * dlList)
{
    DoublelyLinkNode * node = dlList->next;
    if(!node || dlList->length == 0)
    {
        printf("链表为空，打印失败！\n");
        dlList->length = 0;
        return;
    }
    for (int i = 0; i < dlList->length; ++i) {
        printf("<%d>:[%s]\n",node->data.id,node->data.data);
        MoveToNext(node);
    }
}
```
---
**main.c**
``` C
#include <stdio.h>
#include "DoublelyLinkList.h"


void TestDoublelyLinkList();

int main() {
    TestDoublelyLinkList();
    return 0;
}

void TestDoublelyLinkList()
{
    //测试数据
    ElementType dataArray[] = {
            {1,"茕茕孑立"},{2,"沆瀣一气"},
            {3,"踽踽独行"},{4,"醍醐灌顶"},
            {5,"绵绵瓜瓞"},{6,"奉为圭臬"}
    };
    DoublelyLinkList *dlList = NULL;
    dlList = InitDoublelyLinkList(dlList);
    for (int i = 0; i < sizeof(dataArray) / sizeof(dataArray[0]); ++i) {
        InsertDoublelyLinkList(dlList,1,dataArray[i]);
    }
    PrintDoublelyLinkList(dlList);
    DeleteDoublelyLinkList(dlList,1);
    printf("-----删除后-----\n");
    PrintDoublelyLinkList(dlList);
    FreeDoublelyLinkList(dlList);
}
```

# 运行结果
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwgy1fzipw2wx2zj30oe0aswf3.jpg