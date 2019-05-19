# 简介
这是我做的一个数据结构的练习，如有写的不好的地方，请指正。

# 代码
**`list.h`**

``` C
#ifndef _LIST_H
#define _LIST_H

//最大字符长度
#define MAXSIZE 256


typedef enum _bool{
	false = 0,ture = 1
}bool;

typedef struct _node{
	char *data;
	int key;
	struct _node *next;
}Node,*pNode;

//初始化链表
pNode InitList(pNode*);
//释放链表结点
void freeNode(pNode*);
//判断链表是否为空
bool IsEmpty(pNode);
//判断是否为链表的尾结点
bool IsLast(const pNode);
//判断某结点是否位于链表中
bool IsInList(const pNode,const pNode);
//在链表中查找元素
pNode FindKey(const int, const pNode);
//在链表中查找元素
pNode FindData(const char*, const pNode);
//查找前驱单元
pNode FindPreviousByKey(const int , const pNode);
//删除整个链表
bool DeleteList(pNode*);
//删除链表中某一结点
void DeleteNodeByKey(const int,pNode*);
//删除指定结点
bool DeleteNode(pNode,pNode*);
//在某一结点后面插入元素
bool Insert(const char*,pNode,pNode*);
//返回链表结点数
unsigned int ListLen(pNode);
//打印链表所有元素
void PrintList(pNode);

#endif /*_LIST_H*/
```

**`list.c`**
``` C
#include "list.h"

#include <stdlib.h>
#include <string.h>
#include <stdio.h>


//打印链表所有元素
void PrintList(pNode head)
{
    pNode temp;
    temp = head->next;
    while (temp != NULL)
    {
        printf("[key:%d]<data:%s>\n",temp->key,temp->data);
        temp = temp->next;
    }
}

//返回链表结点数
unsigned int ListLen(pNode head)
{
    return (unsigned int)head->key;
}

//插入元素
bool Insert(const char* data,pNode Position,pNode* head)
{
    pNode temp;
    temp = (pNode)malloc(sizeof(Node));
    if(!temp)
    {
        printf("Out of space!!!");
        return false;
    }
    if(data)
    {
        if(strlen(data) * sizeof(data) > MAXSIZE)
        {
            printf("Out of space!!!");
            return false;
        }
        temp->data = (char*)malloc(strlen(data) * sizeof(char));
        if(!temp->data)
        {
            printf("Out of space!!!");
            return false;
        }
    }
    (*head)->key++;
    temp->key = (*head)->key;
    strcpy(temp->data,data);
    temp->next = Position->next;
    Position->next = temp;

}

//删除指定结点
bool DeleteNode(pNode node,pNode* head)
{
    if(!IsInList(node,*head))
    {
        printf("The node<%p> is not in list<%p>\n",node,head);
        return false;
    }
    pNode temp = NULL;
    temp = FindPreviousByKey(node->key,*head);
    temp->next = node->next;
    (*head)->key--;
    freeNode(&node);
    return ture;
}

//删除链表中某一结点
void DeleteNodeByKey(const int key,pNode* head)
{
    pNode p,temp_del;
    p = FindPreviousByKey(key,*head);
    if(!IsLast(p))
    {
        temp_del = p->next;
        p->next = temp_del->next;
        freeNode(&temp_del);
        (*head)->key--;
    }
}
//查找前驱单元
pNode FindPreviousByKey(const int key, const pNode head)
{
    pNode temp;
    temp = head;
    while(temp->next != NULL &&  temp->next->key != key)
    {
        temp = temp->next;
    }
    return temp;
}
//删除链表
bool DeleteList(pNode* head)
{
    //判断是否为空链表
    if(IsEmpty(*head))
    {
        return false;
    }
    pNode temp = NULL;
    while ((*head)->next != NULL)
    {
        temp = (*head)->next;
        freeNode(head);
        *head = temp;
    }
    (*head)->key = 0;
    return ture;
}

//在链表中查找元素
pNode FindData(const char* data, const pNode head)
{
    pNode temp = NULL;
    temp = head->next;
    while (temp != NULL && strcmp(temp->data,data))
    {
        temp = temp->next;
    }
    return temp;
}

//在链表中查找元素
pNode FindKey(const int key,const pNode head)
{
    pNode temp = NULL;
    temp = head->next;
    while (temp != NULL && temp->key != key)
    {
        temp = temp->next;
    }
    return temp;
}

//判断某结点是否位于链表中
bool IsInList(const pNode node,const pNode head)
{
    pNode temp = head->next;
    while (temp != NULL)
    {
        if(temp == node)
        {
            return ture;
        }
        temp = temp->next;
    }
    return false;
}

//判断是否为链表的尾结点
bool IsLast(const pNode p)
{
    return p->next == NULL;
}

//判断链表是否为空
bool IsEmpty(pNode head)
{
    return head->next == NULL;
}

//释放链表结点
void freeNode(pNode* p)
{
    if((*p)->data != NULL)
    {
        free((*p)->data);
        (*p)->data = NULL;
    }
    if(*p != NULL)
    {
        free(*p);
        *p = NULL;
    }
}

//初始化链表
pNode InitList(pNode* p)
{
    *p = (pNode)malloc(sizeof(Node));
    (*p)->key = 0;
    (*p)->data = NULL;
    (*p)->next = NULL;
    return *p;
}
```

----------
**测试代码**
**`main.c`**
``` C
#include "list.h"

#include <stdlib.h>
#include <stdio.h>

/*定义头结点*/
static pNode List1 = NULL;

int main(void)
{
	pNode temp;
	//初始化结点
	InitList(&List1);

	//向结点插入数据
	Insert("data1",List1,&List1);
	Insert("data2",List1,&List1);
	Insert("data3",List1,&List1);
	Insert("data4",List1,&List1);

	//查找结点
	temp = FindData("data1",List1);
	printf("[temp->key = %d;temp->data = %s]\n",temp->key,temp->data);

	//打印所有结点
	printf("List len: %d\n",ListLen(List1));
	PrintList(List1);

	//通过键值删除结点
	DeleteNodeByKey(3,&List1);
	printf("--------------------\n");
	printf("List len: %d\n",ListLen(List1));
	PrintList(List1);

	//删除指定结点
	DeleteNode(FindData("data1",List1),&List1);
	printf("--------------------\n");
	printf("List len: %d\n",ListLen(List1));
	PrintList(List1);

	//清空链表
	DeleteList(&List1);
	printf("--------------------\n");
	printf("List len: %d\n",ListLen(List1));
	PrintList(List1);

	//释放链表
	freeNode(&List1);
	return 0;
}
```

# 运行截图
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwgy1fz6fyas8usj30vw0ey0t9.jpg