# 简介
最近没事自己实现了一下**C++**中`string`类的一些功能，用来加深一下运算符重载函数的理解。实现了`string`类的基本功能，重载了以下运算符：`=`、`==`、`!=` 、`+=`、`*`、`<<`、`>>`、`[]`、`>`、`<`；以及实现了一个字符串倒置的成员函数。

# 代码
``` cpp
#include <iostream>
#include <cstring>
#include <cassert>

class MyString
{
public:
	

	MyString():len(0),str(NULL) {}
	//C字符串初始化string
	MyString(const char*);
	//拷贝构造函数
	MyString(const MyString&);
	//析构函数，回收内存
	~MyString();
	//重载<<
	friend std::ostream & operator<<(std::ostream & ,const MyString &);
	//重载>>
	friend std::istream & operator>>(std::istream & ,MyString &);

	/*
	*运算符重载部分
	*/
	//重载=，右边的对象拷贝到左边
	MyString operator=(const MyString &);
	//重载=，右边的字符串赋值给左边
	MyString operator=(const char*);
	//重载[],利用下标访问修改字符串内容
	char & operator[](const unsigned int &);
	//重载+,字符串拼接
	MyString operator+(const MyString &);
	//重载*,字符多次自身拷贝
	MyString operator*(const unsigned int&);
	//重载==，比较两字符串是否相等
	inline bool operator==(const MyString &);
	//重载!=，比较两字符串是否不等
	inline bool operator!=(const MyString &);
	//重载>，判断字符串长短
	inline bool operator>(const MyString &);
	//重载<，判断字符串长短
	inline bool operator<(const MyString &);
	//重载+=，字符串拼接
	void operator+=(const MyString &);
	//重载+=，字符串拼接
	void operator+=(const char *);

	/*
	*成员函数部分
	*/
	//获取字符串长度
	unsigned int length(){return len;}
	//获取字符串内容
	const char* Str(){return str;}
	//字符串倒置(修改原来内容)
	void reverse_save();
	//字符串倒置(不修改原来内容)
	char* reverse();
private:
	unsigned int len;
	char* str;
};

//字符串倒置(不修改原来内容)
char* MyString::reverse()
{
	if(this->str == NULL)
	{
		return NULL;
	}
	int length = this->len;
	char *temp = new char[this->len];
	for (int i = 0; i < length / 2 + 1; ++i)
	{
		temp[i] = this->str[length - 1 - i];
		temp[length - 1 - i] = this->str[i];
	}
	temp[length] = '\0';
	//存在内存泄漏
	return temp;
}
//字符串倒置
void MyString::reverse_save()
{
	if(this->str == NULL)
	{
		return;
	}
	int length = this->len - 1;
	for (int i = 0; i < this->len / 2; ++i,--length)
	{
		this->str[i] ^= this->str[length];
		this->str[length] ^= this->str[i];
		this->str[i] ^= this->str[length];
	}
}
//重载=，右边的字符串赋值给左边
MyString MyString::operator=(const char*another_str)
{
	if(this->str != NULL)
	{
		delete[] this->str;
		this->str = NULL;
		this->len = 0;
	}
	if(another_str == NULL)
    {
        return *this;
    }
	this->len = strlen(another_str);
	this->str = new char[this->len + 1];
	strcpy(this->str,another_str);
	return *this;
}
//重载+=，字符串拼接
void MyString::operator+=(const char *another_str)
{
	int len = this->len + strlen(another_str);
	MyString temp_str = *this;
	//回收原来的内存
	if(this->str != NULL)
	{
		delete[] this->str;
		this->str = NULL;
		this->len = 0;
	}
	this->len = len;
	this->str = new char[this->len + 1];
	memset(this->str,0,this->len + 1);
	strcat(this->str,temp_str.str);
	strcat(this->str,another_str);
}
//重载+=，字符串拼接
void MyString::operator+=(const MyString &another_str)
{
	int len = this->len + another_str.len;
	MyString temp_str = *this;
	//回收原来的内存
	if(this->str != NULL)
	{
		delete[] this->str;
		this->str = NULL;
		this->len = 0;
	}
	this->len = len;
	this->str = new char[this->len + 1];
	memset(this->str,0,this->len + 1);
	strcat(this->str,temp_str.str);
	strcat(this->str,another_str.str);
}
//重载>，判断字符串长短
bool MyString::operator>(const MyString &another_str)
{
	return this->len > another_str.len;
}
//重载<，判断字符串长短
bool MyString::operator<(const MyString &another_str)
{
	return this->len < another_str.len;
}
//重载==，比较两字符串是否相等
bool MyString::operator==(const MyString &another_str)
{
	return !strcmp(this->str,another_str.str);
}
//重载==，比较两字符串是否相等
bool MyString::operator!=(const MyString &another_str)
{
	return !(*this == another_str);
}
//重载*,字符多次自身拷贝
MyString MyString::operator*(const unsigned int& num)
{ 
	int len  = this->len * (num > 4096 ? 0 : num);
	MyString temp;
	if(len == 0)
	{
		return temp;
	}else if(len == this->len)
	{
		return *this;
	}else{
		temp.str = new char[len + 1];
		memset(temp.str,0,len + 1);
		for(int i = 0;i < num;++i)
		{
			strcat(temp.str,this->str);
		}
		temp.len = len;
		return temp;
	}

}
//重载+,字符串拼接
MyString MyString::operator+(const MyString &another_str)
{
	MyString temp;
	int len = this->len + another_str.len;
	temp.len = len;
	temp.str = new char[len + 1];
	memset(temp.str,0,len + 1);
	strcat(temp.str,this->str);
	strcat(temp.str,another_str.str);
	return temp;
}
//重载[]
char & MyString::operator[](const unsigned int &index)
{
	//设置断言，用于检查下标是否越界
	//assert(index < this->len - 1);
	//检查下标是否越界
	if(index >= this->len)
	{
		return this->str[this->len - 1];
	}
	return this->str[index];
}
//重载=
MyString MyString::operator=(const MyString &another_str)
{
	if(this == &another_str)
	{
		return *this;
	}
	if(this->str != NULL)
	{
		delete[] this->str;
		this->str = NULL;
		this->len = 0;
	}
	if(another_str.str == NULL)
    {
        return *this;
    }
	this->len = another_str.len;
	this->str = new char[this->len + 1];
	strcpy(this->str,another_str.str);
	return *this;
}
//重载>>
std::istream & operator>>(std::istream &is,MyString &Str)
{
	//将字符串提前释放掉
	if(Str.str != NULL)
	{
		delete[] Str.str;
		Str.str = NULL;
		Str.len = 0;
	}
	//临时变量，用于作为字符输入缓冲区间
	char temp_str[4096] = {0};
	is >> temp_str;
	int len = strlen(temp_str);
	Str.str = new char[len + 1];
	strcpy(Str.str,temp_str);
	Str.len = len;
	return is;
}
//重载<<
std::ostream & operator<<(std::ostream &os,const MyString &Str)
{
	os << Str.str ;
	return os;
}
//C字符串初始化string
MyString::MyString(const char* str_in)
{
	if(NULL == str_in)
	{
		return;
	}
	this->len = strlen(str_in);
	this->str = new char[this->len + 1];
	strcpy(this->str,str_in);
}
//拷贝构造函数
MyString::MyString(const MyString& str_in)
{
	this->len = str_in.len;
	this->str = new char[this->len + 1];
	strcpy(this->str,str_in.str);
}
MyString::~MyString()
{
	if(this->str != NULL)
	{
		delete this->str;
		this->str = NULL;
		this->len = 0;
	}
}

int main(void)
{
	MyString str1("hello") ,str2(" world!"),str3,str4;
	str3 = str1 + str2;
	std::cout << str3 << std::endl;

	std::cout << str2.reverse() << std::endl;

	str4 = str1 * 5;
	std::cout << str4 << std::endl;

	str1 = "123";
	std::cout << str1 << std::endl;

	str1 += "123";
	std::cout << str1 << std::endl;

	std::cout << (str1 != str2) << '\t' << (str1 == str2) << std::endl;

	std::cout << (str1 > str2) << '\t' << (str1 < str2) << std::endl;

	return 0;
}
```

