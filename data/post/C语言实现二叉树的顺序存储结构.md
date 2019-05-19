# 简介
**二叉树的顺序存储结构**就是用`一维数组`存储二叉树中的结点。将二叉树的每个结点按顺序存储在数组中，空结点用在数组中储存为`'\0'`。


# 代码
**SeqTree.h**
``` C
#ifndef SEQBINTREE_SEQTREE_H
#define SEQBINTREE_SEQTREE_H

/**
 * 树的顺序储存结构：一般用于完全二叉树或满二叉树，这样可以避免内存浪费
 */

/** 一位数组能存放的最大结点数 */
#define MAX_SIZE 1024

/** 定义顺序数类型 */
typedef char SeqTree[MAX_SIZE + 1];

/**
 * 初始化空二叉树
 * @param tree 要操作的二叉树
 */
void InitSeqTree(SeqTree tree);

/**
 * 创建完全二叉树
 * @param tree 要操作的二叉树
 * @param i 数组中的下标
 */
void CreateSeqTree(SeqTree tree, int i);

/**
 * 打印二叉树
 * @param tree 要操作的二叉树
 */
void PrintSeqTree(SeqTree tree);

/**
 * 获取根节点元素
 * @param tree 要操作的二叉树
 * @return 根节点元素
 */
char GetSeqTreeRoot(SeqTree tree);

/**
 * 获取树的结点总数
 * @param tree 要操作的二叉树
 * @return 结点总数
 */
int GetSeqTreeLength(SeqTree tree);

/**
 * 获取树的深度
 * @param tree 要操作的二叉树
 * @return 二叉树的深度
 */
int GetSeqTreeDepth(SeqTree tree);
#endif //SEQBINTREE_SEQTREE_H
```

**SeqTree.c**
``` C
//
// Created by longx on 2019/2/15.
//

#include "SeqTree.h"

#include <stdio.h>
#include <math.h>

/** 初始化空二叉树 */
void InitSeqTree(SeqTree tree)
{
    for (int i = 0; i <= MAX_SIZE; ++i) {
        tree[i] = '\0';
    }
}

//创建完全二叉树
void CreateSeqTree(SeqTree tree, int i)
{
    char ch;
    if(i == 0)
    {
        printf("根节点:");
    }
    scanf("%c",&ch);
    fflush(stdin);

    //若输入^号表示结束当前结点的输入
    if(ch == '^')
    {
        tree[i] = '\0';
        return;
    }

    tree[i] = ch;
    //结点输入完毕后，让用户输入左孩子和右孩子
    printf("左孩子结点:");
    //递归调用
    CreateSeqTree(tree,2 * i + 1);

    printf("右孩子结点");
    CreateSeqTree(tree,2 * (i + 1));
}

//打印二叉树
void PrintSeqTree(SeqTree tree)
{
    int count = 0;
    int node_count = GetSeqTreeLength(tree);
    for (int i = 0; i < MAX_SIZE; ++i) {
        if(tree[i] != '\0')
        {
            printf("%c  ",tree[i]);
            count++;
            if(count == node_count)
            {
                break;
            }
        }
    }
    printf("\n");
}

//获取根节点元素
char GetSeqTreeRoot(SeqTree tree)
{
    if(GetSeqTreeLength(tree) == 0)
    {
        return '\0';
    }
    return tree[0];
}

//获取树的结点总数
int GetSeqTreeLength(SeqTree tree)
{
    int len = 0;
    for (int i = 0; i < MAX_SIZE; ++i) {
        if(tree[i] == '\0')
        {
            continue;
        }
        ++len;
    }
    return len;
}

//获取树的深度
int GetSeqTreeDepth(SeqTree tree)
{
    //深度为k的二叉树最多有2^k-1个结点
    int depth = 0;  //深度
    int len = GetSeqTreeLength(tree);

    while ((int)pow(2,depth) - 1 < len){
        ++depth;
    }
    return depth;
}
```

**main.c**
``` C
#include "SeqTree.h"
#include <stdio.h>

void TestSeqTree();

int main() {
    TestSeqTree();
    return 0;
}

void TestSeqTree()
{
    SeqTree tree;
    InitSeqTree(tree);
    CreateSeqTree(tree,0);
    PrintSeqTree(tree);
    printf("树的结点总数为：%d\n",GetSeqTreeLength(tree));
    printf("树的深度为:%d\n",GetSeqTreeDepth(tree));
    getchar();
    fflush(stdin);
}
```

# 运行结果
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwgy1g07e6ydhmbj30i308i3yu.jpg