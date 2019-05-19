# 简介
顺序表是在计算机内存中以数组的形式保存的线性表，是指用一组地址连续的存储单元依次存储数据元素的线性结构。用C语言简单实现了一下，代码如下。

# 代码
**SequenceList.h**
``` C
//
// Created by longx on 2019/1/24.
//

#ifndef SEQUENCELIST_SEQUENCELIST_H
#define SEQUENCELIST_SEQUENCELIST_H

//定义数据元素最多个数
#define MAX_SIZE 1024

//定义数据元素
typedef struct {
    int id;
    char *data;
}ElementType;

//定义顺序表结构
typedef struct {
    //顺序表中的数据元素集合
    ElementType datas[MAX_SIZE];
    //当前顺序表中的元素个数
    int length;
}SeqList;

/**
 * 初始化链表
 * @param seqList 要初始化的顺序表
 * @param elementType 初始化时要添加的元素内容数组
 * @param length 初始化时添加的元素个数
 */
void InitList(SeqList *seqList,ElementType *element, int length);

/**
 * 向顺序表中的index下标处插入某个元素
 * @param seqList 执行插入操作的顺序表
 * @param index 要插入的位置的下标
 * @param element 要插入的元素
 */
void InsertElement(SeqList *seqList,int index,ElementType element);

/**
 * 删除顺序表中指定下标的元素
 * @param seqList 要操作的顺序表
 * @param index 要删除元素的下标
 * @return 返回删除的元素，如果删除失败，返回NULL
 */
ElementType * DeleteElement(SeqList *seqList,int index);

/**
 * 查找指定下标的元素
 * @param seqList 要操作的顺序表
 * @param index 要返回元素的下标
 * @return 返回指定下标的元素，如果查找失败，返回NULL
 */
ElementType * FindElement(SeqList *seqList,int index);

/**
 * 查找指定元素的下标
 * @param seqList 要操作的顺序表
 * @param element 要查找的元素
 * @return 返回指定元素的下标，若查找失败，返回-1
 */
int FindIndex(SeqList *seqList, const ElementType * element);

/**
 * 为顺序表排序
 * @param seqList 要操作的顺序表
 */
void SortList(SeqList *seqList);

/**
 * 打印顺序表中的所有元素
 * @param seqList 要打印的顺序表
 */
void PrintList(SeqList *seqList);
#endif //SEQUENCELIST_SEQUENCELIST_H

```

**SequenceList.c**
``` C
//
// Created by longx on 2019/1/24.
//

#include "SequenceList.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void InitList(SeqList *seqList,ElementType *element, int length)
{
    if(length > MAX_SIZE)
    {
        printf("超出了数组的最大容量[%d]，初始化失败！\n",MAX_SIZE);
        return;
    }
    seqList->length = 0;
    for (int i = 0; i < length; ++i) {
        //每次循环都在下标为i的位置插入一个元素
        InsertElement(seqList,i,element[i]);
    }
    
}

void InsertElement(SeqList *seqList,int index,ElementType element)
{
    //1、验证插入后元素空间是否超过MAX_SIZE
    //2、index的值是否合法，index∈[0,MAX_SIZE - 1]
    //3、插入的index应该在length内
    //4、从第length-1下标开始，前面的一个元素赋值给后面一个元素

    if(seqList->length + 1 > MAX_SIZE) {
        printf("数组已满，插入失败！\n");
        return;
    }
    if(index < 0 || index > MAX_SIZE - 1) {
        printf("index下标不合法,插入失败！合法范围:[0,%d]\n", MAX_SIZE - 1);
        return;
    }
    if(index > seqList->length) {
        printf("插入的下标超过当前数组的长度，插入失败！length = %d\n", seqList->length);
        return;
    }
    //开始插入元素
    for (int i = seqList->length -1; i >= index; --i) {
        seqList->datas[i + 1] = seqList->datas[i];
    }
    seqList->datas[index] = element;
    seqList->length++;
}

ElementType * DeleteElement(SeqList *seqList,int index)
{
    if(index < 0 || index > MAX_SIZE - 1)
    {
        printf("index下标不合法,插入失败！合法范围:[0,%d]\n", MAX_SIZE - 1);
        return NULL;
    }
    //1、找到要删除的元素
    //2、从指定位置删除，后面一个元素赋值给前面一个元素
    //3、顺序表总长度-1
    ElementType * delElement = (ElementType*)malloc(sizeof(ElementType));
    *delElement = *FindElement(seqList,index);
    for (int i = index; i < seqList->length; ++i) {
        seqList->datas[i] = seqList->datas[i + 1];
    }
    seqList->length--;
    return delElement; //使用完后需要进行free
}

ElementType * FindElement(SeqList *seqList,int index)
{
    if(index < 0 || index > MAX_SIZE - 1)
    {
        printf("index下标不合法,插入失败！合法范围:[0,%d]\n", MAX_SIZE - 1);
        return NULL;
    }
    ElementType * element;
    element = &seqList->datas[index];
    return element;
}

int FindIndex(SeqList *seqList, const ElementType * element)
{
    for (int i = 0; i < seqList->length; ++i) {
        if(element->id == seqList->datas[i].id && !strcmp(element->data,seqList->datas[i].data))
        {
            return i;
        }
    }
    return -1;
}

void SortList(SeqList *seqList)
{
    for(int i  = 0;i < seqList->length;++i)
    {
        for(int j = i + 1;j < seqList->length;++j)
        {
            if(seqList->datas[i].id > seqList->datas[j].id)
            {
                ElementType temp;
                temp = seqList->datas[j];
                seqList->datas[j] = seqList->datas[i];
                seqList->datas[i] = temp;
            }
        }
    }
}

void PrintList(SeqList *seqList)
{
    for (int i = 0; i < seqList->length; ++i) {
        printf("<%d>:[%s]\n",seqList->datas[i].id,seqList->datas[i].data);
    }
}
```

**main.c**
``` C
#include "SequenceList.h"

#include <stdio.h>

//测试函数
void TestSequenceList();

int main(void) {
    TestSequenceList();
    return 0;
}

void TestSequenceList()
{
    //测试数据
    ElementType dataArray[] = {
            {1,"茕茕孑立"},{2,"沆瀣一气"},
            {3,"踽踽独行"},{4,"醍醐灌顶"},
            {5,"绵绵瓜瓞"},{6,"奉为圭臬"}
    };
    ElementType dataArray2[] = {
            {3,"踽踽独行"},{1,"茕茕孑立"},
            {2,"沆瀣一气"},{4,"醍醐灌顶"},
            {6,"奉为圭臬"},{5,"绵绵瓜瓞"}
    };

    ElementType data = {6,"奉为圭臬"};
    //定义顺序表
    SeqList seqList;
    //初始化顺序表
    InitList(&seqList,dataArray, sizeof(dataArray) / sizeof(dataArray[0]));
    PrintList(&seqList);
    DeleteElement(&seqList,0);
    printf("----------------\n");
    PrintList(&seqList);
    printf("{6,\"奉为圭臬\"}的下标为:%d\n",FindIndex(&seqList,&data));

    //排序测试
    InitList(&seqList,dataArray2, sizeof(dataArray2) / sizeof(dataArray2[0]));
    PrintList(&seqList);
    SortList(&seqList);
    printf("----------------\n");
    PrintList(&seqList);

}
```

# 运行截图
![][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwgy1fzh2xsx42lj30pd0hnwfp.jpg