# 简介
**队列**，又称为**伫列**，是`先进先出`的线性表。在具体应用中通常用`链表`或者`数组`来实现。队列只允许在后端进行插入操作，在前端进行删除操作。 队列的操作方式和堆栈类似，唯一的区别在于队列只允许新数据在后端进行添加。

# 代码
**Queue.h**
``` C
//
// Created by longx on 2019/2/2.
//

#ifndef QUEUE_QUEUE_H
#define QUEUE_QUEUE_H

/**
 * 队列（Queue）是只允许在一端进行插入操作，而在另一端进行删除操作的顺序表
 * - 队列是一种先进先出的线性表
 * - 允许插入的一段称为队尾，允许删除的一端称为队头
 * 特点:
 * - 先进先出
 * - 后进后出
 * 注意:队列是操作受限的线性表
 *
 * 循环链表处理队空、队满的两种方法:
 * 1.少用一个空间元素，即队列空间大小为MAX_SIZE时，有MAX_SIZE-1个元素就认为是满队
 * 2.单独设置一个标识位以便区别队列是否为满状态或空状态
 *
 * 判断方法；
 * - 队列为空:rear == front == 0
 * - 队列已满:(rear + 1) % MAX_SIZE == front
 */

/**
 * 下面使用游标实现循环队列
 */

//队列最大长度
#define MAX_SIZE 256

typedef enum {
    False,True
}Bool;

/** 数据元素结构体 */
typedef struct {
    int id;
    char * name;
}ElementType;
/** 循环队列 */
typedef struct seqQueue{
    ElementType data[MAX_SIZE];
    //头指针
    int front;
    //尾指针
    int rear;
    //当前队列长度
    unsigned int length;
}SeqQueue;

/**
 * 初始化循环队列
 * @param queue 要操作的循环队列
 */
void InitSeqQueue(SeqQueue * queue);

/**
 * 判断队列是否为空
 * @param queue 要操作的循环队列
 * @return 队列为空，返回True；队列已满，返回False
 */
Bool IsEmpty(SeqQueue * queue);

/**
 * 判断队列是否已满
 * @param queue 要操作的循环队列
 * @return 队列为空，返回False；队列已满，返回True
 */
Bool IsFull(SeqQueue * queue);

/**
 * 入队
 * @param queue 要操作的循环队列
 * @param element 入队的元素
 * @return 入队成功，返回True；入队失败，返回False
 */
Bool OfferSeqQueue(SeqQueue * queue,ElementType element);

/**
 * 出队
 * @param queue 要操作的循环队列
 * @param element 要出队的元素指针
 * @return 出队成功，返回True；出队失败，返回False
 */
Bool PollSeqQueue(SeqQueue *  queue,ElementType * element);

/**
 * 打印队列中的元素
 * @param queue 要操作的循环队列
 */
void PrintSeqQueue(SeqQueue * queue);

/**
 * 删除队列
 * @param queue 要操作的循环队列
 */
void DelSeqQueue(SeqQueue * queue);
#endif //QUEUE_QUEUE_H

```

**Queue.c**
``` C
//
// Created by longx on 2019/2/2.
//

#include "Queue.h"

#include <stdlib.h>
#include <stdio.h>

//初始化循环队列
void InitSeqQueue(SeqQueue * queue)
{
    if(queue == NULL)
    {
        queue = (SeqQueue *)malloc(sizeof(SeqQueue));
        if(queue == NULL)
        {
            printf("内存分配失败！\n");
            return;
        }
    }
    queue->data->name = NULL;
    queue->data->id = 0;
    queue->length = 0;
    queue->front = 0;
    queue->rear = 0;
}

//队列是否为空
Bool IsEmpty(SeqQueue * queue)
{
    return queue->front == queue->rear ? True : False;
}

//队列是否已满
Bool IsFull(SeqQueue * queue)
{
    return (queue->rear + 1) % MAX_SIZE == queue->front ? True : False;
}

//入队
Bool OfferSeqQueue(SeqQueue * queue,ElementType element)
{
    if(IsFull(queue))
    {
        printf("队列已满，入队失败！\n");
        return False;
    }
    queue->data[queue->rear] = element;
    queue->rear = (queue->rear + 1) % MAX_SIZE;
    queue->length++;
    return True;
}

//出队
Bool PollSeqQueue(SeqQueue *  queue,ElementType * element)
{
    if(IsEmpty(queue))
    {
        printf("队列为空，出队失败！\n");
        return False;
    }
    //取出对头元素
    *element = queue->data[queue->front];
    queue->data[queue->front].id = 0;
    queue->data[queue->front].name = NULL;
    queue->front = (queue->front + 1) % MAX_SIZE;
    queue->length--;
    return True;
}

//答应队列中的元素
void PrintSeqQueue(SeqQueue * queue)
{
    if(IsEmpty(queue))
    {
        printf("队列为空，打印失败!\n");
        return;
    }
    for (int i = queue->front; i < queue->rear; ++i) {
        printf("<%d>:[%s]\n",queue->data[i].id,queue->data[i].name);
    }
}

//删除循环队列
void DelSeqQueue(SeqQueue * queue)
{
    if(queue == NULL)
    {
        return;
    }
    if(IsEmpty(queue))
    {
        free(queue);
        queue = NULL;
        return;
    }
    for (int i = queue->front; i < queue->rear; ++i) {
        queue->data[i].id = 0;
        queue->data[i].name = NULL;
    }
    queue->length = 0;
    free(queue);
    queue = NULL;
}
```

**main.c**
``` C
#include "Queue.h"

#include <stdio.h>
#include <stdlib.h>

void TestSeqQueue();

int main(void) {
    TestSeqQueue();
    return 0;
}

void TestSeqQueue()
{
    //测试数据
    ElementType dataArray[] = {
            {1,"茕茕孑立"},{2,"沆瀣一气"},
            {3,"踽踽独行"},{4,"醍醐灌顶"},
            {5,"绵绵瓜瓞"},{6,"奉为圭臬"}
    };
    SeqQueue seq;
    ElementType * delElement = (ElementType *)malloc(sizeof(ElementType));
    InitSeqQueue(&seq);
    for (int i = 0; i < sizeof(dataArray) / sizeof(dataArray[0]); ++i) {
        OfferSeqQueue(&seq,dataArray[i]);
    }
    PrintSeqQueue(&seq);
    printf("------出队后------\n");
    PollSeqQueue(&seq,delElement);
    PrintSeqQueue(&seq);
    DelSeqQueue(&seq);
}
```

# 运行截图
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwly1fzsctwc5thj30qr0axwf3.jpg