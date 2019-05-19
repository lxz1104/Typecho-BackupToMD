# 简介
**循环链表**是一种链式存储结构，它的最后一个结点指向头结点，形成一个环。因此，从循环链表中的任何一个结点出发都能找到任何其他结点。循环链表的操作和单链表的操作基本一致，差别仅仅在于算法中的循环条件有所不同。我简单实现了循环链表的**插入**、**删除**、**遍历**等操作。

# 代码
**CircularLinkList.h**
``` C
//
// Created by longx on 2019/1/24.
//

#ifndef CIRCULARNODE_CIRCULARNODE_H
#define CIRCULARNODE_CIRCULARNODE_H

/**
 * 循环链表
 * 特点：
 * 1.带有头结点的循环链表，尾节点的指针域同样指向第一个结点，而不是头结点。
 * head->node1->node2->...->nodeN->node1
 * 优点:
 * 能够通过任意结点往后遍历整个链表结构。
 */

/** 定义数据域 */
typedef struct {
    int id;
    char *str;
}ElemType;

/** 定义循环链表的结点 */
typedef struct cirularNode{
    //数据域
    ElemType data;
    //指向下一个结点的指针域
    struct cirularNode *next;
}CirularNode,*pCirularNode;

/** 循环链表的结构 */
typedef struct cirularLinkList{
    //指向第一个结点的指针，头指针
    CirularNode *next;
    //链表长度
    int length;
}CirularLinkList;

/**
 * 初始化循环链表(创建循环链表)
 * @param clList 要操作的链表
 * @return 初始化成功，返回头结点；初始化失败，返回NULL。
 */
CirularLinkList * InitCirularLinkList(CirularLinkList * clList);

/**
 * 在循环链表的指定位置插入元素
 * @param clList 要操作的循环链表
 * @param pos 要插入的位置
 * @param element 要插入的数据
 * @return 插入成功，返回插入位置结点；插入失败，返回NULL。
 */
pCirularNode InsertCirularLinkList(CirularLinkList * clList,int pos,ElemType element);


/**
 * 根据元素内容返回对应的结点指针
 * @param clList 要操作的循环链表
 * @param element 要查找的元素
 * @return 查找成功，返回对应的结点指针；查找失败，返回NULL。
 */
pCirularNode FindCirularLinkListNode(CirularLinkList *clList,ElemType element);

/**
 * 根据位置删除链表的对应结点
 * @param clList 要操作的循环链表
 * @param pos 要删除结点的位置
 * @return 删除成功，返回删除的元素。
 */
ElemType DeleteCirularLinkListNode(CirularLinkList *clList,int pos);

/**
 * 打印循环链表的所有结点
 * @param clList 要打印的循环链表
 */
void PrintCirularLinkList(CirularLinkList * clList);

/**
 * 根据某个节点遍历整个链表
 * @param clList 要操作的循环链表
 * @param node 遍历的起始结点
 */
void PrintCirularLinkListByNode(CirularLinkList * clList,CirularNode * node);
#endif //CIRCULARNODE_CIRCULARNODE_H

```
---

**CirularLinkList.c**
``` C
//
// Created by longx on 2019/1/24.
//

#include "CircularLinkedList.h"

#include <stdlib.h>
#include <stdio.h>
#include <string.h>

//结点后移
#define MoveToNext(node) node = node->next

CirularLinkList * InitCirularLinkList(CirularLinkList * clList)
{
    if(clList)
    {
       free(clList);
       clList = NULL;
    }
    clList = (CirularLinkList *)malloc(sizeof(CirularNode));
    if(!clList)
    {
        printf("分配堆内存失败,内存空间不足!!!\n");
        return NULL;
    }
    clList->next = NULL;
    clList->length = 0;
    return clList;
}

pCirularNode InsertCirularLinkList(CirularLinkList * clList,int pos,ElemType element)
{
    if(pos <= 0)
    {
        printf("位置非法，插入失败！pos∈[1,%d]\n",clList->length);
        return NULL;
    }

    /**
     * 一、插入的是第一个结点,pos = 1时
     * 插入时的两种情况：
     * 1.插入的链表长度为0
     * node->next = node;
     * 2.插入的链表长度不为0
     * node->next = clList->next;
     * lastNode->next = node;
     * 二、插入的不是第一个结点,pos > 1时
     * 两种情况：
     * 1.currNode != NULL时
     * node->next = currNode->next;
     * currNode->next = node;
     * 2.若插入的结点是最后一个位置时。
     * node->next = currNode->next;
     * currNode->next = node;
     * //尾结点next指向第一个结点
     * node->next = clList->next
     */

    //创建一个空节点
    CirularNode *node = (CirularNode *)malloc(sizeof(CirularNode));
    if(!node)
    {
        printf("分配堆内存失败,内存空间不足!!!\n");
        return NULL;
    }
    node->data = element;
    node->next = NULL;
    //插入的是第一个结点
    if(1 == pos)
    {
        node->next = clList->next;
        //如果插入的链表结点不为0
        if(!node->next)
        {
            node->next = node;
        } else{
            //如果长度不为0，就要找到链表最后的一个结点并改变其指针位置
            CirularNode * lastNode = clList->next;
            //找到尾节点
            for(int i = 0;i < clList->length;++i)
            {
                MoveToNext(lastNode);
            }
            lastNode->next = node;
        }
        clList->next = node;
        clList->length++;
        return clList->next;
    } else if(pos > 1)
    {
        //插入的不是第一个结点
        //定义当前结点
        CirularNode * currNode = clList->next;
        for (int i = 0; currNode && i < pos - 1; ++i) {
            MoveToNext(currNode);
        }
        if(currNode)
        {
            node->next = currNode->next;
            currNode->next = node;
            clList->length++;
            if(pos == clList->length)
            {
                node->next = clList->next;
            }
        }
        return currNode->next;
    }

    return NULL;
}

pCirularNode FindCirularLinkListNode(CirularLinkList *clList,ElemType element)
{
    CirularNode * node = clList->next;
    if(!node)
    {
        return NULL;
    }
    //不使用for遍历
    do{
        if(element.id == node->data.id && strcmp(element.str,node->data.str) == 0)
        {
            return node;
        }
        MoveToNext(node);
    }while (node != clList->next);
    //未找到
    return NULL;
}

ElemType DeleteCirularLinkListNode(CirularLinkList *clList,int pos)
{
    ElemType element;
    element.id = -1;
    element.str = NULL;
    if(pos <= 0)
    {
        return element;
    }
    //若删除的为第一个结点
    if(1 == pos)
    {
        CirularNode * node = clList->next;
        if(node){
            element = node->data;
            //找到最后一个结点
            CirularNode * lastNode = clList->next;
            for (int i = 1; i < clList->length; ++i) {
                MoveToNext(lastNode);
            }
            clList->next = node->next;
            lastNode->next = clList->next;
            free(node);
            node = NULL;
            clList->length--;
        }
    } else if(pos > 1)
    {
        //删除其他结点
        //要删除结点的前一个结点
        CirularNode * preNode;
        CirularNode * node = clList->next;
        for(int i = 1;node && i < pos;++i)
        {
            preNode = node;
            MoveToNext(node);
        }
        if(node)
        {
            element = node->data;
            preNode->next = node->next;
            free(node);
            node = NULL;
            clList->length--;
        }
    }
    return element;
}

void PrintCirularLinkList(CirularLinkList * clList)
{
    if(clList->length == 0 || !clList->next)
    {
        printf("当前链表为空，打印失败！[CirularLinkList = %p]\n",clList);
        clList->length = 0;
        return;
    }
    CirularNode * node = clList->next;
    for(int i = 0; i < clList->length; ++i)
    {
        printf("<%d>:[%s]\n",node->data.id,node->data.str);
        MoveToNext(node);
    }
}

void PrintCirularLinkListByNode(CirularLinkList * clList,CirularNode * node)
{
    if(!node || !clList->next)
    {
        printf("当前链表为空，打印失败！[CirularLinkList = %p]\n",clList);
        clList->length = 0;
        return;
    }
    //记录初始结点指针
    CirularNode * origNode = node;
    do{
        printf("<%d>:[%s]\n",node->data.id,node->data.str);
        MoveToNext(node);
    }while (node != origNode);
}
```
---

**main.c**
``` C
#include "CircularLinkedList.h"

#include <stdio.h>

void TestCircularLinkList();
int main() {
    TestCircularLinkList();
    return 0;
}

void TestCircularLinkList()
{
    //测试数据
    ElemType dataArray[] = {
            {1,"茕茕孑立"},{2,"沆瀣一气"},
            {3,"踽踽独行"},{4,"醍醐灌顶"},
            {5,"绵绵瓜瓞"},{6,"奉为圭臬"}
    };
    //定义循环链表
    CirularLinkList *clList;
    clList = InitCirularLinkList(clList);
    InsertCirularLinkList(clList,1,dataArray[0]);
    InsertCirularLinkList(clList,2,dataArray[1]);
    InsertCirularLinkList(clList,2,dataArray[2]);
    PrintCirularLinkList(clList);
    printf("-----遍历方法二-----\n");
    PrintCirularLinkListByNode(clList,FindCirularLinkListNode(clList,dataArray[1]));
    printf("-----删除后-----\n");
    DeleteCirularLinkListNode(clList,1);
    PrintCirularLinkList(clList);
}
```

# 运行结果
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwgy1fzi0ssh0cpj30nh0aw74q.jpg