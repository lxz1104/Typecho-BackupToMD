# 引言
我们或多或少都知道一些关于`new`和`delete`的用法，通常来说`new/new []`，`delete/delete[]` 必须要配对使用，否则会造成严重的后果。那么`delete`和`delete[]`有什么区别呢？

# C++内存分配释放机制
简要说明一下C++的内存**分配机制**
当 C++ 程序从空余内存块中找出分配出 size 大小的内存并且使用完之后，在释放这块内存的时候，程序如何得知你当初申请了多大的内存呢？事实上，当使用 `malloc/new/new[]` 申请了一块内存的时候，编译器实际上会在这块内存的头部保存一个 `size_t` 信息，记录了这块内存的大小。这个`size`信息是需要占用额外的空间的，也就是说:
``` cpp
int *ptr = new int[5];
```
这行语句实际上从系统空闲内存中索取了`sizeof(int) * 5 + sizeof (size_t)` 大小的空间。也用就是说大概是这个样子：
| memory size(20)  | int[0] | int[1] | ... | int[4] |
|------------------|--------|:------:|-----|--------|

C++中的堆内存**释放机制**
在对`ptr`指针进行`free/delete/delete []`操作的时候，实际上会先通过 `*(p-sizeof(size_t))`来获得这块内存的大小，然后将内存归还给系统。从这一步上来说，`free`，`delete`，`delete []` 没有任何区别——也就是说，对于下面的两行代码：
``` cpp
int * ptr = new int[10];
delete ptr;
```
虽然没有使用`delete []`，但内存是可以正确地被归还的，**不会**引起**内存泄漏**之类的后果（但是，某些编译器可能会报错）。

**注意：**`delete/delete[]`不能单独用来释放`new`分配的一块内存区域中的其中的某一部分内存。如
``` cpp
int *ptr = new int[5];
//此处是错误的，不能单独释放某一个元素
delete ptr+5;
```

# delete[]与delete
上面提到了`delete`和`delete[]`都能正确的释放内存，那他们之间有什么区别呢？
实际上是，对于C++程序，`delete` 不仅用于回收内存，还用于正确地析构对象(调用要释放对象的析构函数)。`delete`只会调用(对象)数组的第一个对象的析构函数，而`delete[]`会调用(对象)数组中的每一个成员的析构函数。举个栗子：

**栗子1.使用`delete`**
``` cpp
class C
{
public:
	C(){cout << "C::C()" << endl;}
	~C(){ cout << "C::~C()" << endl;}	
};
int main(void)
{
	C *obj = new C[5];
	delete obj;
	return 0;
}
```
运行结果
```
C::C()
C::C()
C::C()
C::C()
C::C()
C::~C()
```
可见，使用`delete`释放`obj`的内存时只调用了`obj[0]`的析构函数。

**栗子2.使用`delete[]`**

```
class C
{
public:
	C(){cout << "C::C()" << endl;}
	~C(){ cout << "C::~C()" << endl;}	
};
int main(void)
{
	C *obj = new C[5];
	delete[] obj;
	return 0;
}
```
运行结果
```
C::C()
C::C()
C::C()
C::C()
C::C()
C::~C()
C::~C()
C::~C()
C::~C()
C::~C()
```
可见，使用`delete[]`释放`obj`的内存时会调用了`obj`中**所有元素**的析构函数。


# 注意
**不要**用`delete[]`释放`new`分配的内存。**切记**！！！比如以下代码
```
class C
{
public:
	C(){cout << "C::C()" << endl;}
	~C(){ cout << "C::~C()" << endl;}	
};
int main(void)
{
	C *obj = new C;
	delete[] obj;
	return 0;
}
```
运行结果
```
C::C()
C::~C()
C::~C()
C::~C()
...
```
这样使用`delete[]`释放`obj`的内存，会导致程序不停调用`obj`的析构函数，直至程序崩溃。