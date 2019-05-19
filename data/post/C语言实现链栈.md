# 简介
栈的链式存储结构，简称为**链栈**。栈因为只是栈顶来做插入和删除操作，所以比较好的方法是将栈顶放在单链表的头部，栈顶指针和单链表的指针合二为一。这里简单实现了**出栈**、**入栈**、**清空栈**、**销毁栈**等操作。同时引入了内存测试，看起来更直观。

# 代码
**LinkedStack.h**
``` C
#ifndef LINKEDSTACK_H
#define LINKEDSTACK_H

/**
 * 链栈（链栈是一个以top为头结点、从栈顶向栈底的单链表。）
 * - 链栈的结构与链表相似
 * - 插入与删除等操作都在链表头部
 */

//压栈成功
#define PUSH_SUCCESS 1
//压栈失败
#define PUSH_FAILURE 0
//出栈成功
#define POP_SUCCESS 1
#define POP_FAILURE 0

/** 数据元素结构 */
typedef struct {
    int id;
    char *name;
}ElementType;

/** 链栈结点结构 */
typedef struct linkedStackNode{
    //结点中保存的数据元素
    ElementType data;
    struct linkedStackNode * next;
}LinkedStackNode;

/** 链栈结构 */
typedef struct linkedStack{
    LinkedStackNode * top;
    int length;
}LinkedStack;

/**
 * 初始化链栈
 * @param linkedStack 要操作的链栈
 */
void InitLinkedStack(LinkedStack ** linkedStack);

/**
 * 压栈
 * @param linkedStack 要操作的链栈
 * @param element 要压入栈中的元素
 * @return 压栈成功，返回PUSH_SUCCESS，压栈失败，返回PUSH_FAILURE.
 */
int PushLinkedStack(LinkedStack * linkedStack,ElementType element);

/**
 * 出栈
 * @param linkedStack 要操作的链栈
 * @param element 接收出栈的元素
 * @return 出栈成功，返回POP_SUCCESS，出栈失败，返回POP_FAILURE.
 */
int PopLinkedStack(LinkedStack * linkedStack,ElementType * element);

/**
 * 清空栈
 * @param linkedStack 要操作的链栈
 */
void ClearLinkedStack(LinkedStack * linkedStack);

/**
 * 销毁栈
 * @param linkedStack 要操作的链栈
 */
void DestoryLinkedStack(LinkedStack ** linkedStack);

/**
 * 打印栈中的元素
 * @param linkedStack 要操作的链栈
 */
void PrintLinkedStack(LinkedStack * linkedStack);
#endif //LINKEDSTACK_H
```
---
**LinkedStack.c**
``` C
#include "LinkedStack.h"

#include <stdio.h>
#include <stdlib.h>

//后移结点
#define MoveToNext(node) node = node->next

void InitLinkedStack(LinkedStack ** linkedStack)
{
    //这里存在一点小问题，无法判断*linkedStack是否在函数外已指向在heap中分配的内存，可能引起内存泄漏
    *linkedStack = (LinkedStack *)malloc(sizeof(LinkedStack));
    (*linkedStack)->length = 0;
    (*linkedStack)->top = NULL;

}

int PushLinkedStack(LinkedStack * linkedStack,ElementType element)
{
    //创建新结点
    LinkedStackNode * newNode = (LinkedStackNode *)malloc(sizeof(LinkedStackNode));
    if(!newNode)
    {
        printf("内存分配失败！\n");
        return PUSH_FAILURE;
    }
    newNode->data = element;
    //新结点指向当前的栈顶
    newNode->next = linkedStack->top;
    linkedStack->top = newNode;
    linkedStack->length++;
    return PUSH_SUCCESS;
}

int PopLinkedStack(LinkedStack * linkedStack,ElementType * element)
{
    if(linkedStack->top == NULL || linkedStack->length == 0)
    {
        printf("空栈，出栈失败！\n");
        linkedStack->length = 0;
        return POP_FAILURE;
    }
    //返回栈顶元素
    *element = linkedStack->top->data;
    //记录出栈操作前的栈顶指针
    LinkedStackNode * tempNode = linkedStack->top;
    //栈顶指针下移一位
    MoveToNext(linkedStack->top);
    //释放原栈点
    free(tempNode);
    tempNode = NULL;
    linkedStack->length--;
    return POP_SUCCESS;
}

void ClearLinkedStack(LinkedStack * linkedStack)
{
    LinkedStackNode * tempNode = NULL;
    while (linkedStack->top)
    {
        tempNode = linkedStack->top;
        //栈顶指向下一个元素
        MoveToNext(linkedStack->top);
        free(tempNode);
        linkedStack->length--;
    }
}

void DestoryLinkedStack(LinkedStack ** linkedStack)
{
    //1.清空栈
    ClearLinkedStack(*linkedStack);
    //2.销毁栈
    free(*linkedStack);
    *linkedStack = NULL;
}

void PrintLinkedStack(LinkedStack * linkedStack)
{
    if(linkedStack->top == NULL || linkedStack->length == 0)
    {
        printf("空栈，打印失败！\n");
        linkedStack->length = 0;
        return;
    }
    LinkedStackNode * node = linkedStack->top;
    for (int i = 0; node && i < linkedStack->length; ++i) {
        printf("<%d>:[%s]\n",node->data.id,node->data.name);
        MoveToNext(node);
    }
}
```
---
**main.c**
``` C
#include "LinkedStack.h"

#include <stdio.h>
#include <stdlib.h>
#include <windows.h>
#include <psapi.h>

//显示内存信息
void showMemoryInfo(void);

//测试函数
void TestLinkedStack();
void TestLinkedStack2();

int main() {
    TestLinkedStack();
    TestLinkedStack2();
    return 0;
}

void TestLinkedStack()
{
    //测试数据
    ElementType dataArray[] = {
            {1,"茕茕孑立"},{2,"沆瀣一气"},
            {3,"踽踽独行"},{4,"醍醐灌顶"},
            {5,"绵绵瓜瓞"},{6,"奉为圭臬"}
    };
    ElementType * popNode = (ElementType *)malloc(sizeof(ElementType));
    LinkedStack * stack;

    //初始化栈
    InitLinkedStack(&stack);
    //还有一种解决方法是采用malloc函数相似的实现形式：
    // InitLinkedStack()返回LinkedStack*类型，LinkedStack * stack = InitLinkedStack();

    //入栈
    for (int i = 0; i < sizeof(dataArray) / sizeof(dataArray[0]); ++i) {
        PushLinkedStack(stack,dataArray[i]);
    }
    printf("-----入栈后-----\n");
    PrintLinkedStack(stack);

    //出栈
    PopLinkedStack(stack,popNode);
    printf("-----出栈后-----\n");
    PrintLinkedStack(stack);
    printf("出栈元素为: {%d,%s}\n",popNode->id,popNode->name);

    //清空栈
    ClearLinkedStack(stack);
    printf("-----清空栈后-----\n");
    PrintLinkedStack(stack);

    //销毁栈
    DestoryLinkedStack(&stack);
    free(popNode);
    popNode = NULL;
}

void TestLinkedStack2()
{
    printf("\n#########内存测试#########\n\n");

    //测试数据
    ElementType dataArray = {1,"茕茕孑立"};
    //显示内存信息
    printf("-----入栈前-----\n");
    showMemoryInfo();
    ElementType * popNode = (ElementType *)malloc(sizeof(ElementType));
    LinkedStack * stack = NULL;

    //初始化栈
    InitLinkedStack(&stack);
    //还有一种解决方法是采用malloc函数相似的实现形式：
    // InitLinkedStack()返回LinkedStack*类型，LinkedStack * stack = InitLinkedStack();    

    //入栈
    for (int i = 0; i < 100000; ++i) {
        PushLinkedStack(stack,dataArray);
    }
    printf("-----入栈后-----\n");
    //显示内存信息
    showMemoryInfo();

    //出栈
    PopLinkedStack(stack,popNode);
    printf("-----出栈后-----\n");
    //显示内存信息
    showMemoryInfo();

    //清空栈
    ClearLinkedStack(stack);
    printf("-----清空栈后-----\n");
    //显示内存信息
    showMemoryInfo();

    //入栈
    for (int i = 0; i < 100000; ++i) {
        PushLinkedStack(stack,dataArray);
    }
    printf("-----入栈后-----\n");
    //显示内存信息
    showMemoryInfo();

    //销毁栈
    DestoryLinkedStack(&stack);
    free(popNode);
    popNode = NULL;
    //显示内存信息
    printf("-----销毁栈后-----\n");
    showMemoryInfo();
}

void showMemoryInfo(void)
{
    HANDLE handle = GetCurrentProcess();
    PROCESS_MEMORY_COUNTERS pmc;
    GetProcessMemoryInfo(handle,&pmc,sizeof(pmc));
    printf("内存使用:[%ldK/%ldK] 虚拟内存使用:[%ldK/%ldK]\n",pmc.WorkingSetSize/1000,pmc.PeakWorkingSetSize/1000,pmc.PagefileUsage/1000,pmc.PeakPagefileUsage/1000);
}
```

# 运行截图
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwgy1fzix0arq05j30m90n0764.jpg