# 简介
**智能指针**（英语：Smart pointer）是一种抽象的数据类型。在程序设计中，它通常是经由类模板来实现，借由模板来达成泛型，借由类别的析构函数来达成自动释放指针所指向的存储器或对象。
在**C++**中内存管理是非常严格的，若指针使用`new/new[]`来动态分配内存，那么用完之后就必须使用`delete/delete[]`来释放。否则就会导致**内存泄漏**。而所谓的智能指针则是指针动态分配内存后，不需要再进行手动回收(`delete/delete[]`)。C++标准模板库中也有拥有**智能指针**这一功能，在头文件`<memory>`中。其实智能指针可以理解为一个类，因为是有生命周期的，在类生命周期结束时会调用类的析构函数；我们便可利用这一原理实现对指针内存的动态回收。

# 代码
**思路**
主要思路就是，用`new`动态分配内存后，将内存的地址保存在动态指针类中，在析构函数中调用`delete`回收该内存。然后需要重载一下`*`和`->`运算符实现一下指针的基本操作。
```
#include <iostream>

using std::cout;
using std::endl;

class C
{
public:
	C(){};
	~C(){ cout << "C::~C()" << endl;};
	void b(){cout << "C::b()" << endl;}
	
};

template<class T_ptr>
class MyAutoPtr{
public:
	MyAutoPtr(void* obj_prt){
		this->ptr = (T_ptr*)obj_prt;
		cout << "分配内存成功,地址：" << this->ptr << endl;
	};
	~MyAutoPtr(){
		if(this->ptr != NULL)
		{
			delete ptr;
			this->ptr = NULL;
			cout << "回收内存成功" << endl;
		}
	};
	T_ptr * operator->()
	{
		return this->ptr;
	}
	T_ptr & operator*()
	{
		return this->ptr;
	}
private:
	//定义指针
	T_ptr *ptr;
};

int main(void)
{
	MyAutoPtr<C> a(new C[100]);
	a->b();
	return 0;
}
```