# 简介
这里简单实现了二叉树的链式储存结构，使用**递归**的方式创建二叉树；实现了一些常规的二叉树遍历算法：**前/中/后序遍历（递归）**，**非递归遍历**，**层序遍历**。

# 代码

**LinkedBinTree.h**
``` C
#ifndef LINKEDBINTREE_LINKEDBINTREE_H
#define LINKEDBINTREE_LINKEDBINTREE_H

/** 前序遍历
 * 1.若二叉树为空，则空操作
 * 2.不为空
 *  - 访问根结点
 *  - 前序遍历左子树
 *  - 前序遍历右子树
 * 特点:
 * 第一位一定是根结点。
 * 根 -> 左 -> 右
 */

/** 中序遍历
 * 1.若二叉树为空，则空操作
 * 2.不为空
 *  - 中序遍历左子树
 *  - 访问根结点
 *  - 中序遍历左子树
 * 特点：
 *  根结点必在中间
 * 左 -> 根 -> 右
 */

/** 后序遍历
 * 1.若二叉树为空，则为空操作
 * 2.不为空
 * - 后序遍历左子树
 * - 后序遍历右子树
 * - 访问根结点
 * 特点：
 *  最后一位一定是根结点
 *  左 -> 右 -> 根
 */

//字符最大长度
#define MAXSIZE 1024

/** 结点元素结构 */
typedef struct {
    int id;
    char name[MAXSIZE];
}ElementType;

typedef struct treeNode{
    //数据域
    ElementType data;
    //左子树（左孩子）
    struct treeNode * left;
    //右子树（右孩子）
    struct treeNode * right;
}TreeNode;

/** 二叉链表 */
typedef struct {
    //二叉链根节点
    TreeNode * root;
    //结点总数
    int nodeCount;
    //二叉链表的深度
    int depth;
    //直径:从叶结点到叶结点的最长路径
    int diameter;

}BinTree;

/**
 * 初始化空二叉树
 * @param tree 要操作的二叉树
 */
void InitBinTree(BinTree * tree);

/**
 * 构造二叉树:需要事先在外部为结点分配内存
 * @param root 根节点
 * @return 创建失败，返回0；创建成功，返回1
 */
int CreateBinTree(TreeNode * root);

/**
 * 数组构造二叉树:需要事先在外部为结点分配内存
 * @param root 根节点
 * @return 创建失败，返回0；创建成功，返回1
 */
int TestCreateBinTree(TreeNode * root,char ** nodeArray);

/**
 * 前序遍历（先序遍历，前序周游，先根遍历）
 * @param node 访问的节点
 */
void PreOrderTraverse(TreeNode * node);

/**
 * 中序遍历（中序周游，中根遍历）
 * @param node 访问的节点
 */
void MiddleOrderTraverse(TreeNode * node);

/**
 * 非递归方式中序遍历(使用链栈)
 * @param node 访问的节点
 */
void MiddleOrderTraverse_Re(TreeNode * node);

/**
 *后序遍历
 * @param node 访问的根结点
 */
void PostOrderTraverse(TreeNode * node);

/**
 * 层序遍历(队列)
 * @param node 访问的根结点
 */
void ZOrderTraverse(TreeNode * node);

#endif //LINKEDBINTREE_LINKEDBINTREE_H
```

**LinkedBinTree.c**
``` C
#include "LinkedStack.h"
#include "LinkedQueue.h"
#include "LinkedBinTree.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>


/** 结点id */
static int id = 0;
/** 访问nodeArray数组用的下标 */
static int nodeIndex = 0;

//层序遍历
void ZOrderTraverse(TreeNode * node)
{
    LinkedQueue queue;
    InitLinkedQueue(&queue);
    //根结点入队
    EnterQueue(&queue,node);
    while (!IsLinkedQueueEmpty(&queue))
    {
        node = DeQueue(&queue);
        printf("{%d, %s}-",node->data.id,node->data.name);
        if(node->left != NULL)
        {
            EnterQueue(&queue,node->left);
        }
        if(node->right != NULL)
        {
            EnterQueue(&queue,node->right);
        }
    }
    DestroyQueue(&queue);
}

//后序遍历
void PostOrderTraverse(TreeNode * node)
{
    if(node)
    {
        //遍历左子树
        PostOrderTraverse(node->left);
        //遍历右子树
        PostOrderTraverse(node->right);
        //访问根结点
        printf("{%d, %s}-",node->data.id,node->data.name);
    }
}

//非递归中序遍历
void MiddleOrderTraverse_Re(TreeNode * node)
{
    /**
     * 思路：
     * 1.根据中序遍历的顺序，对任意结点来说，优先访问左孩子，而左孩子又可以看做一个根结点
     * 2.继续访问左孩子结点为空的结点，按照相同规则访问右孩子
     */

    LinkedStack linkedStack;
    InitLinkedStack(&linkedStack);
    TreeNode * root = node;
    //currNode用来保存每个出栈的结点指针
    TreeNode * currNode = (TreeNode *)malloc(sizeof(TreeNode));
    //用来确保释放掉currNode分配的内存。
    TreeNode * tempNode = currNode;

    while (root || !IsLinkedStackEmpty(&linkedStack))
    {
        if(root)
        {
            Push(&linkedStack,root);
            root = root->left;
        } else{
            Pop(&linkedStack,&currNode);
            printf("{%d, %s}-",currNode->data.id,currNode->data.name);
            root = currNode->right;
        }
    }

    free(tempNode);
    tempNode = NULL;
    DestoryLinkedStack(&linkedStack);
}

//中序遍历
void MiddleOrderTraverse(TreeNode * node)
{
    if(node){
        //遍历左子树
        MiddleOrderTraverse(node->left);
        //访问根结点
        printf("{%d, %s}-",node->data.id,node->data.name);
        //遍历右子树
        MiddleOrderTraverse(node->right);
    }
}

//前序遍历
void PreOrderTraverse(TreeNode * node)
{
    //先访问根结点，然后遍历左子树，最后遍历右子树
    if(node)
    {
        //访问根结点
        printf("{%d, %s}-",node->data.id,node->data.name);
        //遍历左子树
        PreOrderTraverse(node->left);
        //遍历右子树
        PreOrderTraverse(node->right);
    }
}

int TestCreateBinTree(TreeNode * root,char ** nodeArray) {
    if (!root) {
        return 0;
    }
    //用户输入的结点名
    char inputName[MAXSIZE] = {'\0'};

    strcpy(inputName, nodeArray[nodeIndex++]);

    //用户输入回车表示结束当前子树创建
    if (strcmp(inputName, "#") == 0) {
        return 0;
    }

    //创建当前结点
    root->data.id = ++id;
    strcpy(root->data.name, inputName);

    //为左右结点分配内存
    root->left = (TreeNode *) malloc(sizeof(TreeNode));
    root->right = (TreeNode *) malloc(sizeof(TreeNode));
    if (!root->left || !root->right) {
        printf("内存分配失败!\n");
        exit(EXIT_FAILURE);
    }

    //分别递归创建左子树和右子树
    if (TestCreateBinTree(root->left,nodeArray) == 0) {
        free(root->left);
        root->left = NULL;
    }
    if (TestCreateBinTree(root->right,nodeArray) == 0){
        free(root->right);
        root->right = NULL;
    }
    return 1;
}

//初始化空二叉树
void InitBinTree(BinTree * tree)
{
    tree->root = NULL;
    tree->depth = 0;
    tree->diameter = 0;
    tree->nodeCount = 0;
}

//构造二叉树
int CreateBinTree(TreeNode * root)
{
    if(!root){
        return 0;
    }
    //用户输入的结点名
    char inputName[MAXSIZE] = {'\0'};
    gets(inputName);
    fflush(stdin);
    //用户输入回车表示结束当前子树创建
    if(strcmp(inputName,"\0") == 0){
        return 0;
    }

    //创建当前结点
    root->data.id = ++id;
    strcpy(root->data.name,inputName);

    //为左右结点分配内存
    root->left = (TreeNode *)malloc(sizeof(TreeNode));
    root->right = (TreeNode *)malloc(sizeof(TreeNode));
    if(!root->left || !root->right)
    {
        printf("内存分配失败!\n");
        exit(EXIT_FAILURE);
    }

    //分别递归创建左子树和右子树
    printf("左结点:");
    if(CreateBinTree(root->left) == 0)
    {
        free(root->left);
        root->left = NULL;
    }
    printf("右结点:");
    if(CreateBinTree(root->right) == 0)
    {
        free(root->right);
        root->right = NULL;
    }
    return 1;
}
```

**LinkedStack.h**
``` C
#ifndef LINKEDBINTREE_LINKEDSTACK_H
#define LINKEDBINTREE_LINKEDSTACK_H

#include "LinkedBinTree.h"

/** 栈结点 */
typedef struct stackNode{
    //数据域
    TreeNode * data;
    //指针域
    struct stackNode * next;
}StackNode;

typedef struct {
    //栈顶指针
    StackNode * top;
    //栈长度
    int length;
}LinkedStack;

/**
 * 初始化链栈
 * @param LStack 要操作的链栈
 */
void InitLinkedStack(LinkedStack * LStack);

/**
 * 入栈
 * @param LStack 要操作的链栈
 * @param node 要入栈的元素
 * @return 成功，返回1；失败，返回0
 */
int Push(LinkedStack * LStack,TreeNode * node);

/**
 * 出栈
 * @param LStack 要操作的链栈
 * @param node 接收出栈元素
 * @return 成功，返回1；失败，返回0
 */
int Pop(LinkedStack * LStack,TreeNode ** node);

/**
 * 判断栈是否为空
 * @param LStack 要操作的链栈
 * @return 为空，返回1；不为空，返回0
 */
int IsLinkedStackEmpty(LinkedStack * LStack);

/**
 * 清空栈
 * @param linkedStack 要操作的链栈
 */
void ClearLinkedStack(LinkedStack * LStack);
/**
 * 销毁栈
 * @param linkedStack 要操作的链栈
 */
void DestoryLinkedStack(LinkedStack * LStack);
#endif //LINKEDBINTREE_LINKEDSTACK_H
```

**LinkedStack.c**
``` C
#include "LinkedStack.h"

#include <stdio.h>
#include <stdlib.h>

#define MoveToNext(node) node = node->next


void InitLinkedStack(LinkedStack * LStack)
{
    LStack->length = 0;
    LStack->top = NULL;
}

int Push(LinkedStack * LStack,TreeNode * node)
{
    StackNode * tempNode = (StackNode *)malloc(sizeof(StackNode));
    if(!tempNode){
        return 0;
    }
    tempNode->data = node;
    tempNode->next = LStack->top;
    LStack->top = tempNode;
    LStack->length++;
    return 1;
}

int Pop(LinkedStack * LStack,TreeNode ** node)
{
    StackNode * tempNode = NULL;
    if(LStack->top == NULL || LStack->length == 0)
    {
        LStack->length = 0;
        return 0;
    }
    //返回栈中的数据域
    *node = LStack->top->data;
    tempNode = LStack->top;
    MoveToNext(LStack->top);
    free(tempNode);
    tempNode = NULL;
    LStack->length--;
    return 1;
}

int IsLinkedStackEmpty(LinkedStack * LStack)
{
    if(LStack->top == NULL || LStack->length == 0)
    {
        return 1;
    }
    return 0;
}

void ClearLinkedStack(LinkedStack * LStack)
{
    StackNode * tempNode;
    while (LStack->top)
    {
        tempNode = LStack->top;
        //栈顶指向下一个元素
        MoveToNext(LStack->top);
        free(tempNode);
        LStack->length--;
    }
}
void DestoryLinkedStack(LinkedStack * LStack)
{
    //1.清空栈
    ClearLinkedStack(LStack);
    InitLinkedStack(LStack);
}
```

**LinkedQueue.h**
``` C
#ifndef LINKEDBINTREE_LINKEDQUEUE_H
#define LINKEDBINTREE_LINKEDQUEUE_H

/**
 * 链式队列实现
 */

#include "LinkedBinTree.h"

/** 链队结点 */
typedef struct queueNode{
    TreeNode * data;    //数据域
    struct queueNode * next;    //指针域
}QueueNode;

/** 链队列结构 */
typedef struct {
    QueueNode * qFront; //队列头指针
    QueueNode * qRear;  //队列尾指针
}LinkedQueue;

/**
 * 初始化队列
 * @param linkedQueue 要操作的队列
 */
void InitLinkedQueue(LinkedQueue * linkedQueue);

/**
 * 入队
 * @param linkedQueue 要操作的队列
 * @param data 要入队的元素
 */
void EnterQueue(LinkedQueue * linkedQueue,TreeNode * data);

/**
 * 出队
 * @param linkedQueue 要操作的队列
 * @return 出队的元素
 */
TreeNode * DeQueue(LinkedQueue * linkedQueue);

/**
 * 判断队列是否为空
 * @param linkedQueue 要操作的队列
 * @return 为空，返回1；不为空，返回0
 */
int IsLinkedQueueEmpty(LinkedQueue * linkedQueue);

/**
 * 销毁队列
 * @param linkedQueue 要操作的队列
 */
void DestroyQueue(LinkedQueue * linkedQueue);
#endif //LINKEDBINTREE_LINKEDQUEUE_H
```

**LinkedQueue.c**
``` C
#include "LinkedQueue.h"

#include <stdlib.h>

/**
 * 初始化队列
 */
void InitLinkedQueue(LinkedQueue * linkedQueue)
{
    linkedQueue->qFront = (QueueNode *)malloc(sizeof(QueueNode));
    linkedQueue->qFront->next = NULL;
    linkedQueue->qRear  = linkedQueue->qFront;
}

/**
 * 入队
 */
void EnterQueue(LinkedQueue * linkedQueue,TreeNode * data)
{
    QueueNode * node = (QueueNode *)malloc(sizeof(QueueNode));
    node->data = data;
    node->next = NULL;
    linkedQueue->qRear->next = node;
    linkedQueue->qRear = node;
}

/**
 * 出队
 */
TreeNode * DeQueue(LinkedQueue * linkedQueue)
{
    TreeNode * data = NULL; //返回出队元素
    if(linkedQueue->qFront == linkedQueue->qRear){
        return data;
    }
    QueueNode * node = linkedQueue->qFront->next;
    data = node->data;
    linkedQueue->qFront->next = node->next;
    if(linkedQueue->qRear == node)
    {
        linkedQueue->qRear = linkedQueue->qFront;
    }
    free(node);
    node = NULL;
    return data;
}

/**
 * 判断队列是否为空
 */
int IsLinkedQueueEmpty(LinkedQueue * linkedQueue)
{
    return linkedQueue->qFront == linkedQueue->qRear ? 1 : 0;
}

/**
 * 销毁队列
 */
void DestroyQueue(LinkedQueue * linkedQueue)
{
    while (DeQueue(linkedQueue));
    if(linkedQueue->qFront != NULL)
    {
        free(linkedQueue->qFront);
        linkedQueue->qFront = NULL;
        linkedQueue->qRear = NULL;
    }
}
```

**main.c**
``` C
#include "LinkedBinTree.h"
#include <stdio.h>
#include <stdlib.h>

void TestBinTree();

int main() {
    TestBinTree();
    return 0;
}

void TestBinTree()
{
    BinTree tree;
    InitBinTree(&tree);
    char * nodeArray[] = {"A","B","D","#","#","E","#","#","C","F","#","#","G","#","#"};

    printf("二叉树结构:\n");
    printf("         A         \n");
    printf("      /     \\          \n");
    printf("     B       C        \n");
    printf("   /   \\   /   \\       \n");
    printf("  D     E F     G     \n");

    //printf("请输入根结点: ");
    tree.root = (TreeNode *)malloc(sizeof(TreeNode));
    //CreateBinTree(tree.root);
    TestCreateBinTree(tree.root,nodeArray);

    //前序遍历
    printf("前序遍历结果:\n");
    PreOrderTraverse(tree.root);
    //中序遍历
    printf("\n中序遍历结果:\n");
    MiddleOrderTraverse(tree.root);

    //非递归中序遍历
    printf("\n非递归中序遍历:\n");
    MiddleOrderTraverse_Re(tree.root);

    //后序遍历
    printf("\n后序遍历:\n");
    PostOrderTraverse(tree.root);

    //层序遍历
    printf("\n层序遍历:\n");
    ZOrderTraverse(tree.root);

    free(tree.root);
    tree.root = NULL;

}
```

# 运行结果
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwly1g0m1y3lntdj30r00e5gmd.jpg