# 描述
要实现利用`cout`和`cin`对虚数类进行输入输出，就需要利用到`ostream`和`istream`这两个类。实现过程也比较简单，直接用友元运算符重载函数就行了。

# 代码
``` cpp
#include <iostream>
#include <cmath>
#include <string>

using std::cout;
using std::endl;
/*
*简介：重载左移右移运算符，实现虚数类的输入输出
*实现方法：友元运算符重载函数
*/
class MyComplex
{
public:
	MyComplex():a(0),b(0){}
	MyComplex(double real,double img):a(real),b(img){}
	~MyComplex(){};
	//获取虚部值
	double Get_img(){return b;}
	//获取实部值
	double Get_real(){return a;}
	//重载<<运算符，通过cout格式化输出虚数
	friend std::ostream & operator<<(std::ostream & os,const MyComplex &C);
	//重载>>；通过cin获取虚数
	friend std::istream & operator>>(std::istream &input, MyComplex &comp);
private:
	//实部
	double a;
	//虚部
	double b;
};
//重载<<运算符，通过cout格式化输出虚数
std::ostream& operator<<(std::ostream & os,const MyComplex &C)
{
	if(!(C.b && C.a))
	{
		if(C.a == C.b)
		{
			return os;
		}
		if(!C.a)
		{
			os << C.b << "i";
			return os;
		}else
		{
			os << C.a;
			return os;
		}
	}
	os << C.a << std::string(C.b > 0 ? "+" : "-" ) << fabs(C.b) << "i";
	return os;
}

//重载>>；通过cin获取虚数
std::istream & operator>>(std::istream &input, MyComplex &comp)
{
	cout << "real:";
	input >> comp.a;
	cout << "img:";
	input >> comp.b;
}
int main(void)
{
	MyComplex a(-13,0);
	std::cin >> a;
	cout << a << endl;
	return 0;
}
```