# 简介
**栈**（stack）又名堆栈，它是一种运算受限的线性表。 其限制是仅允许在表的一端进行插入和删除运算。 这一端被称为栈顶，相对地，把另一端称为栈底。这里用结构体数组简单实现了顺序栈。

# 代码
**Stack.h**
``` C
//
// Created by longx on 2019/1/25.
//

#ifndef STACK_STACK_H
#define STACK_STACK_H

/**
 * 栈(Stack)是仅限定在表尾插入和删除操作的线性表（LIFO结构）。
 * - 允许插入和删除的一段称为栈顶(top),另一端称为栈底(bottom)。
 * - 不含任何元素的栈称为空栈
 * 特点:
 * - 先进后出
 * - 后出先进
 * 常见操作:
 * - 栈的插入操作，称为进栈(压栈、入栈、push)。
 * - 栈的删除操作。称为出栈(弹栈、pop)。
 */

 /**
  * 利用数组实现顺序栈
  */


 //栈的最大长度
#define MAX_SIZE 10
//空栈
#define EMPTY_STACK -1
//压栈成功
#define PUSH_SUCCESS 1
//压栈失败
#define PUSH_FAILURE 0



/** 定义数据元素结构 */
typedef struct {
    int id;
    char *name;
}ElementType;

/** 定义顺序栈结构 */
typedef struct seqStack{
    //数据域
    ElementType element[MAX_SIZE];
    //栈顶（数组的下标）
    int top;
    //当前栈的元素个数
    int length;
}SeqStack;

/**
 * 初始化栈
 * @param seqStack 要操作的栈
 */
void InitSeqStack(SeqStack * seqStack);

/**
 * 向栈中压入元素
 * @param seqStack 要操作的栈
 * @param element 要压人栈中的数据元素
 * @return 压栈成功，返回PUSH_SUCCESS；压栈失败，返回PUSH_FAILURE。
 */
int PushSeqStack(SeqStack * seqStack,ElementType element);

/**
 * 出栈
 * @param seqStack 要操作的栈
 * @return 出栈成功，返回出栈的元素；出栈失败，返回空元素({0,NULL})
 */
ElementType PopSeqStack(SeqStack * seqStack);

/**
 * 清空栈
 * @param seqStack 要操作的栈
 */
void ClearSeqStack(SeqStack * seqStack);

/**
 * 打印栈的所有元素
 * @param seqStack 要操作的栈
 */
void PrintSeqStack(SeqStack * seqStack);

/**
 * 获取栈顶元素
 * @param seqStack 要操作的栈
 * @return 出栈成功，返回出栈的元素；出栈失败，返回空元素({0,NULL})
 */
ElementType GetSeqStackTop(SeqStack * seqStack);

/**
 * 获取栈的元素个数
 * @param seqStack 要操作的栈
 * @return 栈的元素个数
 */
int GetSeqStackLength(SeqStack * seqStack);
#endif //STACK_STACK_H

```
---

**Stack.c**
``` C
//
// Created by longx on 2019/1/25.
//

#include "Stack.h"

#include <stdlib.h>
#include <stdio.h>
#include <string.h>

void InitSeqStack(SeqStack * seqStack)
{
    //栈顶置空
    seqStack->top = EMPTY_STACK;
    //长度置零
    seqStack->length = 0;
    //数据元素置零
    memset(seqStack->element, 0 , sizeof(seqStack->element[0]) * MAX_SIZE);
}

int PushSeqStack(SeqStack * seqStack,ElementType element)
{
    if(seqStack->top == MAX_SIZE - 1)
    {
        printf("栈已满，压栈失败！\n");
        return PUSH_FAILURE;

    }
    seqStack->top++;
    //将新插入的元素赋值给栈顶
    seqStack->element[seqStack->top] = element;
    seqStack->length++;
    return PUSH_SUCCESS;
}

ElementType PopSeqStack(SeqStack * seqStack)
{
    ElementType element = {0,NULL};
    if(seqStack->top == EMPTY_STACK)
    {
        printf("空栈，出栈失败！\n");
        return element;
    }
    element = seqStack->element[seqStack->top];
    seqStack->element[seqStack->top].name = NULL;
    seqStack->element[seqStack->top].id = 0;
    seqStack->top--;
    seqStack->length--;
    return element;
}

void ClearSeqStack(SeqStack * seqStack)
{
    seqStack->top = EMPTY_STACK;
    seqStack->length = 0;
    //数据元素置零
    memset(seqStack->element, 0 , sizeof(seqStack->element[0]) * MAX_SIZE);
}

void PrintSeqStack(SeqStack * seqStack)
{
    if(seqStack->top == EMPTY_STACK)
    {
        printf("空栈，打印失败！\n");
        return;
    }
    for(int i = seqStack->top;i >= 0;--i)
    {
        printf("<%d>:[%s]\n",seqStack->element[i].id,seqStack->element[i].name);
    }
}

ElementType GetSeqStackTop(SeqStack * seqStack)
{
    ElementType element = {0,NULL};
    if(seqStack->top == EMPTY_STACK)
    {
        printf("空栈，获取失败！\n");
        return element;
    }
    return seqStack->element[seqStack->top];
}

int GetSeqStackLength(SeqStack * seqStack)
{
    return seqStack->length;
}
```
--- 
**main.c**
``` C
#include "Stack.h"

#include <stdio.h>

void TestSeqStack();

int main() {
    TestSeqStack();
    return 0;
}

void TestSeqStack()
{
    //测试数据
    ElementType dataArray[] = {
            {1,"茕茕孑立"},{2,"沆瀣一气"},
            {3,"踽踽独行"},{4,"醍醐灌顶"},
            {5,"绵绵瓜瓞"},{6,"奉为圭臬"}
    };
    ElementType element = {0,NULL};
    SeqStack stack;

    InitSeqStack(&stack);
    //入栈
    for (int i = 0; i < sizeof(dataArray) / sizeof(dataArray[0]); ++i) {
        PushSeqStack(&stack,dataArray[i]);
    }
    printf("当前栈的长度为:%d\n",GetSeqStackLength(&stack));
    PrintSeqStack(&stack);
    //出栈
    element = PopSeqStack(&stack);
    printf("-----出栈后-----\n");
    printf("当前栈的长度为:%d\n",GetSeqStackLength(&stack));
    PrintSeqStack(&stack);
    printf("出栈元素:{%d,%s}\n",element.id,element.name);
    //清空栈
    ClearSeqStack(&stack);
    printf("-----清空栈后-----\n");
    printf("当前栈的长度为:%d\n",GetSeqStackLength(&stack));
    PrintSeqStack(&stack);
}
```

# 运行截图
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwgy1fzitk34l2fj30kl0dxgmm.jpg