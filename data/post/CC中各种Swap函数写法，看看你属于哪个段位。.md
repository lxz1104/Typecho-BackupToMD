# 引言
在许多应用程序中，都有交换相同类型的两个变量内容的需要。例如，在对整数数组进行排序时，将需要一个函数来交换两个变量的值。下面博主总结了我所学到的各种`Swap()函数`的写法，并按执行效率和支持类型多少等因素进行排位，看看你属于哪个段位吧。（PS：以下排位仅供娱乐）

# 排位对照
**塑料组**
额...这组选手估计是来卖萌的。。。
``` C
//从某种意义上来说是对的...
int main(void)
{
	int a = 10,b = 5;
	printf("a = %d,b = %d\n",a,b);
	printf("after swap...\n");
	printf("a = %d,b = %d\n",b,a);
}
```
**黑铁组**
黑铁段位中的交换算法都比较基础，通常都是大家第一个接触到的交换算法。
``` C
//通过一个中间变量来完成交换
void Swap(int* pa, int* pb)
{
    int temp = *pa;
    *pa = *pb;
    *pb = temp;
}
```

**青铜组**
到了青铜段位后交换算法逐渐增加了一些小技巧，比如只用两个变量完成交换。但是却存在很大的局限性。
``` C
//此方法只能适用于整型(具体原理见离散数学),不过效率高
void Swap(int* pa, int* pb)
{
    *pa ^= *pb;
    *pb ^= *pa;
    *pa ^= *pb;
}
//此方法利用异或运算，也实现了数据的翻转，其实就是上面方法的变体
void Swap(int* a, int* b)
{
    *pa ^= *pb ^= *pa ^= *pb;
}
//此方法只适用于int，char，double等类型，
//无法用于自定义类型(通过耗费时间来节约空间)，而且会发生溢出。
void Swap(int* pa, int* pb)
{
    *pa += *pb;
    *pb = *pa - *pb;
    *pa = *pa - *pb;
}
//这个的原理也和上面的类似
void Swap(int* pa, int* pb)
{
    *pa = *pa * *pb;
    *pb = *pa / *pb;
    *pa = *pa / *pb;
}
//这个利用了C语言运算符的优先级来实现的，感觉比上面几种巧妙多了；
//但是，此方法还是无法应用于自定义类型；不过内存溢出的问题得到了改善。
void Swap(int* pa, int* pb)
{
    *pa = *pa + *pb - (*pb = *pa);
}
```

**白银组**
到了白银后会逐渐考虑到代码的可重用性，逐渐在代码中添加一些泛型编程的思想。
``` cpp
//原理和黑铁组的一样，只是以拷贝内存的方式来替代直接赋值，
//从而可以支持更多类型的交换，包括一些自定义类型等。
/**
 * 用法
 * char a[] = "aaa",b[] = "bbb";
 * cout << a << '\t' << b << endl;
 * Swap(&a,&b,sizeof(char*));
 */
void Swap(void* pa, void* pb, size_t size)
{
    void* temp = (void*)malloc(size);
    assert(temp != NULL);
    
    memcpy(temp, pa, size);
    memcpy(pa, pb, size);
    memcpy(pb, temp, size);
 
    free(temp);
}
```

**黄金组**
在C++中学习了类后，白银组的算法似乎已经满足不了我们的需求了，于是我们需要借助一下**模板(template)技术**的帮助。例如，STL中提供的一些交换的方法,甚至我们还可以根据需求特化STL中的Swap版本
``` cpp
//这是STL中提供的一种方法，此方法一般用于内置类型以及普通class和struct的交换
template<typename T>
void Swap(T &a,T &b) {
    T temp(a);
    a = b;
    b = temp;
}
//我们还可以通过移交临时对象对资源的控制权的方式
//来对上面的算法进行优化（实例化模板的类必须含右移动构造和移动赋值运算等函数才能得到效率上的提升）
template<typename T>
void swap(T& a,T&b) {
    T temp(std::move(a));
    a = std::move(b);
    b = std::move(temp);
}
//对于模板类可以在自定义的命名空间内定义swap函数
//更多用法见《Effective C++》 条款25
namespace AWidget {
    template<typename T>
    class A {
    ...
    ...
    };
    template<typename T>
    void swap(A<T>&a,A<T> &b) {
        a.swap(b);
    }

};
```

**铂金组**
如果说上面的实现方式都还算很常见的话，那么下面的实现方式只能用丧心病狂来形容。
``` cpp
//在linux下，gcc版本4.8编译通过，但是部分linux版本可能已无法运行
//这是一种用字符串来实现函数的方法，简单来说字符串就是一段内存空间，
//把一个字符串指针强转成函数指针，那么这个指针所指向的内容就是各种指令，
//因此，那堆乱七八糟的东西说白了就是汇编代码。
#include <stdio.h>
void(*swap)(int*,int*) = (void(*)(int*,int*)) "\x8b\x44\x24\x04\x8b\x5c\x24\x08\x8b\x00\x8b\x1b\x31\xc3\x31\xd8\x31\xc3\x8b\x4c\x24\x04\x89\x01\x8b\x4c\x24\x08\x89\x19\xc3";
 
int main(){ // works on GCC 3+4
        int a = 37, b = 13;
        swap(&a, &b);
 
        printf("%d %d\n",a,b);
        return 0;
}
```
   
**砖石组**
``` cpp
//这里的答案就交给大家吧
//还有什么奇淫技巧可以在评论区提出
```
---
*未完待续...*