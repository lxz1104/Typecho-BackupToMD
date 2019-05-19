# 简介
这是我用C语言写的一个简易的**五子棋游戏**，游戏模式为**单机**。游戏的用**栈链**存储每次下棋的历史记录，通过出栈操作实现了五子棋的悔棋操作。启动程序时建议将控制台字体设置为**幼圆**，字体大小设置为**24**。

# 代码
**栈链部分**
**ChessData.h**
``` C
//
// Created by longx on 2019/1/25.
//

#ifndef CHESS_CHESSDATA_H
#define CHESS_CHESSDATA_H

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

//棋子类型
typedef enum{
    White,Black
}ChessType;

/** 棋子结构 */
typedef struct {
    //棋子坐标
    int y;
    int x;
    //棋子类型
    ChessType type;
}ChessMan;

/** 链栈结点结构 */
typedef struct linkedStackNode{
    //结点中保存的数据元素
    ChessMan data;
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
void InitLinkedStack(LinkedStack * linkedStack);

/**
 * 压栈
 * @param linkedStack 要操作的链栈
 * @param element 要压入栈中的元素
 * @return 压栈成功，返回PUSH_SUCCESS，压栈失败，返回PUSH_FAILURE.
 */
int PushLinkedStack(LinkedStack * linkedStack,ChessMan element);

/**
 * 出栈
 * @param linkedStack 要操作的链栈
 * @param element 接收出栈的元素
 * @return 出栈成功，返回POP_SUCCESS，出栈失败，返回POP_FAILURE.
 */
int PopLinkedStack(LinkedStack * linkedStack,ChessMan * element);

/**
 * 清空栈
 * @param linkedStack 要操作的链栈
 */
void ClearLinkedStack(LinkedStack * linkedStack);

/**
 * 销毁栈
 * @param linkedStack 要操作的链栈
 */
void DestoryLinkedStack(LinkedStack * linkedStack);

#endif //CHESS_CHESSDATA_H

```

**ChessData.c**
``` C
//
// Created by longx on 2019/1/25.
//

#include "ChessData.h"

#include <stdio.h>
#include <stdlib.h>

//后移结点
#define MoveToNext(node) node = node->next

void InitLinkedStack(LinkedStack * linkedStack)
{
    linkedStack->length = 0;
    linkedStack->top = NULL;
}

int PushLinkedStack(LinkedStack * linkedStack,ChessMan element)
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

int PopLinkedStack(LinkedStack * linkedStack,ChessMan * element)
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
    LinkedStackNode * tempNode;
    while (linkedStack->top)
    {
        tempNode = linkedStack->top;
        //栈顶指向下一个元素
        MoveToNext(linkedStack->top);
        free(tempNode);
        linkedStack->length--;
    }
}

void DestoryLinkedStack(LinkedStack * linkedStack)
{
    //1.清空栈
    ClearLinkedStack(linkedStack);
    //2.销毁栈
    free(linkedStack);
    linkedStack = NULL;
}
```
---
**游戏核心逻辑部分**
**GoBang.h**
``` C
//
// Created by longx on 2019/1/25.
//

#ifndef CHESS_GOBANG_H
#define CHESS_GOBANG_H

#include <afxres.h>
#include "ChessData.h"

//棋盘大小
#define BOARD_SIZE 20
//上移键值
#define MOVE_UP 119
//下移键值
#define MOVE_DOWN 115
//左移键值
#define MOVE_LEFT 97
//右移键值
#define MOVE_RIGHT 100
//悔棋
#define UNDO 'r'
//悔棋操作
#define UNDO_CHESS -1
//白棋获胜
#define WHITE_WIN 1
//黑棋获胜
#define BLACK_WIN 2
//平局
#define DRAW 3
//尚未结束
#define PLAYING 0

/** 棋盘数组 */
char * ChessBoard[BOARD_SIZE][BOARD_SIZE];

/** 游戏主进程 */
void GameProcess();

/**
 * 判断比赛状态
 * @return 比赛中返回PLAYING；平局返回DRAW；黑棋赢返回BLACK_WIN；白棋赢BLACK_WIN。
 */
int Judge(int x,int y,ChessType type);

/**
 * 初始化/及重置棋盘
 */
void InitChessBoard();

/**
 * 打印棋盘
 */
void PrintChessBoard();

/**
 * 悔棋操作
 * @param linkedStack 要操作的链栈
 */
void UndoChess(LinkedStack * linkedStack);

/**
 * 设置光标坐标
 * @param x X轴坐标
 * @param y Y轴坐标
 */
void SetPos(short int x,short int y);

/**
 * 隐藏光标
 */
void HideInputCursor();

/**
 * 显示光标
 */
void ShowInputCursor();

/**
 * 获取下棋的坐标
 * @param linkedStack 要操作的链表
 * @return 若为下棋，返回棋子对应的坐标；若为悔棋，返回坐标的X,Y值均为UNDO_CHESS。
 */
COORD GetChessPos(LinkedStack * linkedStack);
#endif //CHESS_GOBANG_H
```

**GoBang.c**
``` C
//
// Created by longx on 2019/1/25.
//

#include "GoBang.h"

#include <stdlib.h>
#include <stdio.h>
#include <windows.h>
#include <conio.h>

//游戏主进程
void GameProcess() {
    //用于判断下棋顺序
    int flag = 1;
    //游戏状态
    int gameStatus = -1;
    //下棋回合数
    unsigned int Count = 1;
    //棋子元素
    ChessMan chess;
    //棋子位置
    COORD chessPos;
    //存储棋子的链栈
    LinkedStack *linkedStack = (LinkedStack *) malloc(sizeof(LinkedStack));
    //初始化链栈
    InitLinkedStack(linkedStack);

    //
    //隐藏光标
    HideInputCursor();
    while (flag) {
        chessPos = GetChessPos(linkedStack);
        //检测是否有悔棋操作
        if(chessPos.X == UNDO_CHESS || chessPos.Y == UNDO_CHESS)
        {
            if(Count > 1) {
                Count--;
                flag = -flag;
                SetPos(BOARD_SIZE * 2 + 2,1);
                printf("<[第%d回合]>",Count);
                SetPos(BOARD_SIZE * 2 + 2,2);
                printf("<%s>",flag > 0 ? "白棋玩家下棋..." : "黑棋玩家下棋...");
            }
            PrintChessBoard();
            continue;
        }
        chess.x = chessPos.X;
        chess.y = chessPos.Y;
        chess.type = flag > 0 ? White : Black;

        //打印侧边栏信息
        SetPos(BOARD_SIZE * 2 + 2,0);
        printf("{<---状态栏--->}");
        SetPos(BOARD_SIZE * 2 + 2,1);
        printf("<[第%d回合]>",Count);
        SetPos(BOARD_SIZE * 2 + 2,2);
        printf("<%s>",flag > 0 ? "白棋玩家下棋..." : "黑棋玩家下棋...");
        SetPos(BOARD_SIZE * 2 + 2,6);
        printf("---游戏帮助---");
        SetPos(BOARD_SIZE * 2 + 2,7);
        printf("按[w,a,s,d]键移动");
        SetPos(BOARD_SIZE * 2 + 2,8);
        printf("按[Enter]键下棋");
        SetPos(BOARD_SIZE * 2 + 2,9);
        printf("按[r]键悔棋");
        //该位置是否已有棋
        if(strcmp("十",ChessBoard[chess.y - 1][chess.x - 1]) != 0)
        {
            continue;
        }
        PushLinkedStack(linkedStack, chess);
        //修改棋盘
        switch (chess.type) {
            case White:
                ChessBoard[chess.y - 1][chess.x - 1] = "○";
                break;
            case Black:
                ChessBoard[chess.y - 1][chess.x - 1] = "●";
                break;
        }

        PrintChessBoard();
        gameStatus = Judge(chessPos.X,chessPos.Y,chess.type);
        flag = -flag;
        Count++;
        if(gameStatus == PLAYING)
        {
            continue;
        } else if(gameStatus == WHITE_WIN)
        {
            SetPos(0,BOARD_SIZE / 2);
            printf("###################################\n");
            printf("#           白棋获胜!              #\n");
            printf("###################################\n");
            break;
        } else if(gameStatus == BLACK_WIN)
        {
            SetPos(0,BOARD_SIZE / 2);
            printf("###################################\n");
            printf("#           黑棋获胜!              #\n");
            printf("###################################\n");
            break;
        } else if(gameStatus == DRAW)
        {
            SetPos(0,BOARD_SIZE / 2);
            printf("###################################\n");
            printf("#             平局!               #\n");
            printf("###################################\n");
            break;
        }
    }
    DestoryLinkedStack(linkedStack);
}

//判断游戏状态
int Judge(int x,int y,ChessType type)
{
    int i,j;
    char *str = type != Black ? "○" : "●";
    //将坐标转换为下标
    x--;
    y--;
    x ^= y;
    y ^= x;
    x ^= y;
    //横向判断
    for(i = x - 4,j = y;i <= x;++i)
    {
        if(i >= 0 && i <= BOARD_SIZE - 5 && !strcmp(str,ChessBoard[i][j]) && !strcmp(str,ChessBoard[i + 1][j]) && !strcmp(str,ChessBoard[i + 2][j]) && !strcmp(str,ChessBoard[i + 3][j]) && !strcmp(str,ChessBoard[i + 4][j]))
        {
            return type != Black ? BLACK_WIN : WHITE_WIN;
        }
    }
    //纵向判断
    for(i = x,j = y - 4;j <= y;++j)
    {
        if(j >= 0 && j <= BOARD_SIZE - 5 && !strcmp(str,ChessBoard[i][j]) && !strcmp(str,ChessBoard[i][j + 1]) && !strcmp(str,ChessBoard[i][j + 2]) && !strcmp(str,ChessBoard[i][j + 3]) && !strcmp(str,ChessBoard[i][j + 4]))
        {
            return type != Black ? BLACK_WIN : WHITE_WIN;
        }
    }
    //斜向判断
    for(i  = x - 4,j = y - 4;i <= x || j <= y;++i,++j)
    {
        if(i >= 0 && i <= BOARD_SIZE - 5 && j >= 0 && j <= BOARD_SIZE - 5  && !strcmp(str,ChessBoard[i][j]) && !strcmp(str,ChessBoard[i + 1][j + 1]) && !strcmp(str,ChessBoard[i + 2][j + 2]) && !strcmp(str,ChessBoard[i + 3][j + 3]) && !strcmp(str,ChessBoard[i + 4][j + 4]))
        {
            return type != Black ? BLACK_WIN : WHITE_WIN;
        }
    }
    for(i  = x - 4,j = y + 4;i <= x || j >= 0;++i,--j)
    {
        if(i >= 0 && i <= BOARD_SIZE - 5 && j >= 0 && j <= BOARD_SIZE - 5 && !strcmp(str,ChessBoard[i][j]) && !strcmp(str,ChessBoard[i + 1][j - 1]) && !strcmp(str,ChessBoard[i + 2][j - 2]) && !strcmp(str,ChessBoard[i + 3][j - 3]) && !strcmp(str,ChessBoard[i + 4][j - 4]))
        {
            return type != Black ? BLACK_WIN : WHITE_WIN;
        }
    }
    //判断棋盘是否已满
    for (i = 0; i < BOARD_SIZE; ++i) {
        for (j = 0; j < BOARD_SIZE; ++j) {
            if(!strcmp("十",ChessBoard[i][j]))
            {
                return PLAYING;
            }
        }
    }
    //棋盘已满，平局
    return DRAW;
}

//初始化棋盘
void InitChessBoard(){

    for (int i = 0; i < BOARD_SIZE; ++i) {
        for (int j = 0; j < BOARD_SIZE; ++j) {
            ChessBoard[i][j] = "十";
        }
    }
}

//打印棋盘
void PrintChessBoard()
{
    SetPos(0,0);
    for (int i = 0; i < BOARD_SIZE; ++i) {
        for (int j = 0; j < BOARD_SIZE; ++j) {
            printf("%s",ChessBoard[i][j]);
        }
        printf("\n");
    }
}

//设置棋子下标
COORD GetChessPos(LinkedStack * linkedStack)
{
    /** 棋子坐标 */
    COORD ChessPos = {BOARD_SIZE,BOARD_SIZE / 2};
    char key = '0';
    SetPos(ChessPos.X,ChessPos.Y);
    printf("⊙");
    while (key != '\r')
    {
        fflush(stdin);
        key = (char)getch();
        switch (key)
        {
            case MOVE_UP:
                ChessPos.Y--;
                break;
            case MOVE_DOWN:
                ChessPos.Y++;
                break;
            case MOVE_LEFT:
                ChessPos.X-=2;
                break;
            case MOVE_RIGHT:
                ChessPos.X+=2;
                break;
            case UNDO:
                UndoChess(linkedStack);
                ChessPos.X = UNDO_CHESS;
                ChessPos.Y = UNDO_CHESS;
                return ChessPos;
            default:
                continue;
        }
        if(ChessPos.X > BOARD_SIZE * 2 - 1)
        {
            ChessPos.X = 0;
        } else if(ChessPos.X < 0)
        {
            ChessPos.X = BOARD_SIZE * 2 - 1;
        }
        if(ChessPos.Y > BOARD_SIZE - 1)
        {
            ChessPos.Y = 0;
        } else if(ChessPos.Y < 0)
        {
            ChessPos.Y = BOARD_SIZE - 1;
        }
        if(ChessPos.X % 2 != 0 || ChessPos.X == 1)
        {
            ChessPos.X--;
        }
        PrintChessBoard();
        SetPos(ChessPos.X,ChessPos.Y);
        printf("⊙");
    }
    ChessPos.X  = (SHORT)((int)ChessPos.X / 2 + 1);
    ChessPos.Y++;
    return ChessPos;
}


//悔棋操作
void UndoChess(LinkedStack * linkedStack)
{
    ChessMan popChess;
    if(linkedStack->top)
    {
        PopLinkedStack(linkedStack,&popChess);
        ChessBoard[popChess.y - 1][popChess.x - 1] = "十";
    } else
    {
        SetPos(BOARD_SIZE * 2 + 2,11);
        printf("\a已回到开始界面!");
    }
}

//设置光标位置
void SetPos(short int x,short int y)
{
    //定义输出句柄
    HANDLE winHandle;
    COORD pos = { x,y };
    winHandle = GetStdHandle(STD_OUTPUT_HANDLE);
    //设置光标位置
    SetConsoleCursorPosition(winHandle, pos);
}

//隐藏光标
void HideInputCursor()
{
    CONSOLE_CURSOR_INFO cursor_info = { 1, 0 };
    SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &cursor_info);//隐藏输入符号
}

//显示光标
void ShowInputCursor()
{
    CONSOLE_CURSOR_INFO cursor_info = { 1, 1 };
    SetConsoleCursorInfo(GetStdHandle(STD_OUTPUT_HANDLE), &cursor_info);//隐藏输入符号
}
```
---
**调用部分**
**main.c**
``` C
#include "GoBang.h"

#include <stdio.h>
#include <stdlib.h>
#include <conio.h>

int main() {
    InitChessBoard();
    PrintChessBoard();
    //打印侧边栏信息
    SetPos(BOARD_SIZE * 2 + 2,0);
    printf("按[Enter]键开始...");
    GameProcess();
    system("pause");
    return 0;
}
```

# 运行截图
**1.开始界面**
![][1]

**2.下棋界面**
![][2]

**3.游戏结束**
![][3]

**游戏过程**
![][4]

**悔棋操作**
![][5]


  [1]: https://ws1.sinaimg.cn/large/007llElwgy1fzljsloun8j30qv0hp0su.jpg
  [2]: https://ws1.sinaimg.cn/large/007llElwgy1fzljtnviwuj30py0hmwf7.jpg
  [3]: https://ws1.sinaimg.cn/large/007llElwgy1fzlju9t6pqj30qi0h63ze.jpg
  [4]: https://ws1.sinaimg.cn/large/007llElwgy1fzljuv2w06g30r60jwju8.gif
  [5]: https://ws1.sinaimg.cn/large/007llElwgy1fzljz93ovvg30r60jwaca.gif