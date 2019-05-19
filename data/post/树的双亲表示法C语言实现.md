# 简介
在使用树结构描述实际问题时，大多数不是二叉树，更多的是普通的树结构，在存储之间具有普通树结构的数据时，经常使用的方法有3种：**双亲表示法**、**孩子表示法**、**孩子兄弟表示法**。这里主要实现了双亲表示法。

# 代码
**ParentTree.h**
``` C
#ifndef PARENTTREE_PARENTTREE_H
#define PARENTTREE_PARENTTREE_H

/**
 * 数的双亲表示法
 * 此方式与二叉树的最大不同是其结点组成为：数据域 + 双亲（根结点）位置/下标
 */

#define MAX_TREE_SIZE 1024

/** 数据域结构 */
typedef struct {
    int id;
    char * name;
}ElementType;

/** 双亲结点 */
typedef struct pNode{
    ElementType data;   //数据域
    int parent;         //双亲下标/位置
}PNode;

/** 双亲表示法的树的结构 */
typedef struct {
    PNode node[MAX_TREE_SIZE];    //数的结点数组
    int root;                     //根结点位置
    int length;                   //当前结点数
}PTree;

/**
 * 初始化空树
 * @param tree 要操作的树的指针
 */
void InitPTree(PTree * tree);

/**
 * 构造树
 * @param tree 要操作的树的指针(需在传参前使用InitPTree()初始化)
 */
void CreateTree(PTree * tree);

/**
 * 为树结点赋值
 * @param node 要进行赋值的结点指针
 * @param parent 要进行赋值的结点的父结点(根结点)的位置（下标）
 * @param data 要进行赋值的数据
 */
void AssignPTree(PNode * node,int parent,ElementType data);

/**
 * 判断数是否为空
 * @param tree 要操作的树的指针(需在传参前使用InitPTree()初始化)
 * @return 为空，返回1；不为空，返回0
 */
int IsEmpty(PTree * tree);

/**
 * 打印树的所有结点
 * @param tree 要操作的树的指针(需在传参前使用InitPTree()初始化)
 */
void PrintPTree(PTree * tree);

/**
 * 销毁树
 * @param tree 要操作的树的指针
 */
void DestroyPTree(PTree * tree);
#endif //PARENTTREE_PARENTTREE_H
```

**ParentTree.c**
``` C
#include "ParentTree.h"

#include <stdio.h>
#include <stdlib.h>

//初始化结构
void InitPTree(PTree * tree)
{
    if(!tree)
    {
        printf("Init failed!\n");
        return;
    }
    tree->root = -1;
    tree->length = 0;
}

//销毁树
void DestroyPTree(PTree * tree)
{
    if(tree)
    {
        free(tree);
        tree = NULL;
    }
}

//构造树
void CreateTree(PTree * tree)
{
    printf("请输入结点个数:");
    if(scanf("%d",&(tree->length)) == 0)
    {
        printf("请输入正整数!\n");
        tree->length = 0;
        //return;
    }
    fflush(stdin);
    if(tree->length <= 0 || tree->length > MAX_TREE_SIZE)
    {
        printf("结点树范围出错!\n");
        fflush(stdin);
        tree->length = 0;
        return;
    }

    printf("----输入结点的值和双亲的序号----\n");

    tree->root = 0;
    int parentPos = 0;

    for (int i = tree->root; i < tree->length; ++i) {

        ElementType * element = (ElementType *)malloc(sizeof(ElementType));
        if(!element)
        {
            printf("malloc failed!\n");
            exit(-1);
        }
        element->id = i + 1;
        printf("请输入第%d个结点的值: ",i + 1);
        scanf("%s",element->name);
        fflush(stdin);
        tree->node[i].data = *element;
        printf("请输入第%d个结点的双亲位置: ",i + 1);
        scanf("%d",&parentPos);
        fflush(stdin);
        //为结点赋值
        AssignPTree(&(tree->node[i]),parentPos,*element);

    }
    //根结点双亲位置设为-1
    tree->node[tree->root].parent = -1;
    printf("创建成功!数的长度为:%d\n",tree->length);

}

//为树节点赋值
void AssignPTree(PNode * node,int parent,ElementType data)
{
    node->data = data;
    node->parent = parent;
}

//打印树的所有结点
void PrintPTree(PTree * tree)
{
    if(IsEmpty(tree))
    {
        printf("树结点为空，打印失败！\n");
        return;
    }
    printf("结点总数为:%d\n",tree->length);

    for (int i = 0; i < tree->length; ++i) {
        printf("{结点双亲的下标 = %d, 结点数据域: [%d,%s]}\n",
                tree->node[i].parent,tree->node[i].data.id,tree->node[i].data.name);
    }
}

//判断数是否为空
int IsEmpty(PTree * tree)
{
    return (tree->root == -1 || tree->length == 0) ? tree->length = 0, 1 : 0;
}
```

**main.c**
``` C
#include "ParentTree.h"
#include <stdio.h>

void TestPTree();

int main() {
    TestPTree();
    return 0;
}

void TestPTree()
{
    PTree pTree;
    InitPTree(&pTree);
    CreateTree(&pTree);
    PrintPTree(&pTree);
    DestroyPTree(&pTree);
    getchar();
}
```