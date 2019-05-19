## 引言
闲来无事写个小东西练练手。

##代码部分

**ATM.h**

``` cpp
#ifndef _ATM_H_
#define _ATM_H_

#include<stdlib.h>
#include<iostream>
#include <sstream>
#include<string>
#include<string.h>
#include<conio.h>
#include <WinSock2.h>
#include <cstring>
#include<Windows.h>
#include"include/mysql.h"



#pragma comment(lib,"wsock32.lib")
#pragma comment(lib,"libmysql.lib")
#pragma comment(lib, "ws2_32.lib")
typedef unsigned int uint;

//用户账户类
class ATM;

/**
*用户账户类
*/
class Account
{
public:
	//初始化用户类
	Account();
	~Account();
	//获取用户姓
	char* GetFirstName()
	{
		return FirstName;
	}
	//获取用户名
	char* GetLastName()
	{
		return LastName;
	}
	//获取用户账号
	uint GetID()
	{
		return ID;
	}
	//获取用户密码
	char* GetPasswd()
	{
		return passwd;
	}
	//设置用户姓
	void SetFirstName();
	//设置用户名
	void SetLastName();
	//设置用户密码
	bool SetPasswd();
	


protected:
	/**用户姓*/
	char *FirstName;
	/**用户名*/
	char *LastName;
	/**用户密码*/
	char *passwd;
	/**用户账号*/
	uint ID;
	/**用户余额*/
	double money;
	/**用户数量*/
	//static uint num;
	/**账户是否上锁*/
	bool OnLock;

	/**从屏幕中获取密码*/
	char* GetInput_Passwd(char*, const char str = '*');

	/**获取密码长度*/
	uint GetPasswdSize()
	{
		return sizeof(passwd) / sizeof(char);
	}
};

//枚举用户状态
typedef enum _userStatus
{
	//退出
	Exit,
	//进入查余额页面
	Jump_to_money,
	//进入取款页面
	Jump_to_withdrawal,
	//进入修改密码页面
	Jump_to_setPasswd,
	//进入冻结账号页面
	Jump_to_lock,
	//初始类型
	None,
	//登录成功
	Login_sucess,
	//登录失败
	Login_fail,
	//注册失败
	Register_fail,
	//注册成功
	Register_success,
	//跳转到注册界面
	Jump_to_register,
	//跳转到登录界面
	Jump_to_login,
	//显示主菜单
	Show_menu
	
}UserStatus;

typedef enum _accountStatus {
	//账号存在
	EXIST,
	//账号不存在
	UNEXIST,
	//账号冻结
	LOCKED
}AccountStatus;

/*
*ATM取款机对象
*/
class ATM:protected Account  //保护继承
{
public:
	ATM();
	~ATM();
	
	//欢迎界面
	_userStatus Welcom();

	//连接服务器
	//void ConnectServer(const char* IP =  "127.0.0.1",uint Port = 5099);
	
	
	//登录
	_userStatus Login();
	//注册
	_userStatus Register();
	/**显示主菜单*/
	void ShowMenu();
	//修改密码
	bool ChPasswd();
	//查询
	const void ShowMoney();
	//取款
	void GetMoney();
	//打印凭条
	void PrintList();
	//冻结账户
	void Lock();
	//退出
	void Quite();

	//获取用户状态
	_userStatus GetUserStatus()
	{
		return userStatus;
	}
	//ATM主进程
	void MainProcess();
	//连接数据库
	bool connectMysql(const char* IP = "127.0.0.1", 
		const char* user = "root", 
		const char* passwd = "root", 
		const char* databaseName = "Bank", 
		uint Port = 3306);
	
protected:
	//枚举用户状态
	UserStatus userStatus;
	

private:
	//记录密码尝试次数
	uint try_times;
	//记录用户选择功能
	short  choice;
	//mysql连接
	MYSQL mysql; 
	//行查询结果集
	MYSQL_RES *res;
	MYSQL_ROW column; //一个行数据的类型安全(type-safe)的表示，表示数据行的列
	
	//数字转换为string(模板函数)
	template<typename T> void digToString(const T digit, std::string &str);

	//初始化数据成员
	bool InitData(uint userId);
	//在mysql中新增用户信息
	bool InsertDatabase(const char* FirstName, const char* LastName, uint ID, const char* paswd, double moxeny, bool Lock);
	//修改数据
	bool UpdateData(const char* _feild, const uint id, const char* feild_value);
	
	//mysql查询函数(重载+1),查询某一字段的值,以id为查询条件
	char* QueryDatabase(const char* query_feild, uint id);
	//mysql查询函数(重载+2），查询某字段ID是否有值
	_accountStatus QueryDatabase(const uint userId);
	//删除mysql数据表的行
	bool DeleteDatabase(const uint ID);
	//初始化用户账号
	bool InitAccount(uint& userId);
	//释放mysql连接资源
	void freeMysqlConnect()
	{
		//释放资源
		mysql_free_result(res);
		mysql_close(&mysql);
	}
	
};
#endif // !_ATM_H_
```

**ATM.cpp(核心代码部分)**

``` cpp
#include "ATM.h"
using namespace std;

ATM::ATM()
{
	userStatus = None;
	try_times = 0;
	choice = -1;
}

ATM::~ATM()
{

}


//ATM主进程
void ATM::MainProcess()
{

	switch (GetUserStatus())
	{
	case None:
		userStatus = Welcom();
		break;
	case Jump_to_login: case Register_success:
		userStatus = Login();
		break;
	case Login_sucess:
		if (InitData(ID))
		{
			userStatus = Show_menu;
		}
		else
		{
			userStatus = Exit;
		}
		break;
	case Show_menu:
		ShowMenu();
		break;
	case Jump_to_register: case Register_fail:
		userStatus = Register();
		break;
	case Login_fail:
		userStatus = Jump_to_login;
		break;
	case Jump_to_lock:
		Lock();
		break;
	case Jump_to_money:
		ShowMoney();
		break;
	case Jump_to_withdrawal:
		GetMoney();
		break;
	case Jump_to_setPasswd:
		ChPasswd();
		break;
	case Exit:
		freeMysqlConnect();
		exit(0);
		break;
	}
}


//欢迎界面
_userStatus ATM::Welcom()
{
	cout << "这是欢迎界面" << endl;
	return Jump_to_login;
}

//登录
_userStatus ATM::Login()
{
	uint n = GetPasswdSize();
	uint temp_id = 0;
	char *temp_passwd = new char[n];
	cout << "请输入你的ID:";
	cin >> temp_id;

	//str_temp_id = new char[temp_id];
	//_itoa_s(temp_id, str_temp_id, temp_id,10);
	_accountStatus AccountStatus = QueryDatabase(temp_id);
	if (AccountStatus == UNEXIST)
	{
		char choose;
		cout << "\a此用户不存在，是否前往注册(Y or N):";
		cin >> choose;
	     
		cin.sync();
		cin.clear();
		//处理用户输入
		while (choose != 'y' && choose != 'Y' && choose != 'n' && choose != 'N')
		{
			
			 cout << "\a请输入“Y”or “N:";
			 cin >> choose;
			 cin.sync();
			 cin.clear();	 
		}
		if (choose == 'Y' || choose == 'y')
		{
			delete[] temp_passwd;
			return Jump_to_register;
		}
		else
		{
			delete[] temp_passwd;
			return Login_fail;
		}
	}
	else if (AccountStatus == LOCKED)
	{
		cout << "\a该账号已禁止登陆！！！" << endl;
		delete[] temp_passwd;
		return Login_fail;
	}
	cout << endl << "请输入您的密码:";
	GetInput_Passwd(temp_passwd);
	cout << endl;
	passwd = QueryDatabase("passwd", temp_id);
	for (uint i = 0; i < n; ++i)
	{
		if (temp_passwd[i] != passwd[i])
		{
			cout << "密码错误!!!\a" << endl;
			delete[] temp_passwd;
			return Login_fail;
		}
	}
	ID = temp_id;
	delete[] temp_passwd;
	return Login_sucess;
}

//初始化数据成员
bool ATM::InitData(uint userId)
{
	int line; //字段个数
	string str2;
	digToString<uint>(userId, str2);
	string QueryCommand = "select * from Account where ID = " + str2;
	const char* sqlCode = (char*)QueryCommand.data();

	mysql_query(&mysql, "set names gbk");
	//返回0 查询成功，返回1查询失败
	if (mysql_query(&mysql, sqlCode))        //执行SQL语句
	{
		cout << "数据库查询失败，返回错误代码:" << mysql_error(&mysql) << endl;
		return false;
	}
	if (!(res = mysql_store_result(&mysql)))
	{
		cout << "Couldn't get result from " << mysql_error(&mysql) << endl;
		return false;
	}
	line = mysql_num_fields(res);   // 获取列数
	column = mysql_fetch_row(res);

	//cout << line << endl;
	if (line == 6)
	{
		FirstName = (char*)column[0];
		LastName  = (char*)column[1];
		//char*类型转浮点型
		money = atof(column[4]);
		money = ((int)(money * 1000)) / 1000.0;
	}
	else
	{
		return false;
	}
	return true;

}
 
//注册
_userStatus ATM::Register()
{
	cout << "------欢迎来到注册界面------" << endl;
	SetFirstName();
	SetLastName();
	if (!SetPasswd())
	{
		return Register_fail;
	}
	InitAccount(ID);
	InsertDatabase(FirstName, LastName, ID, passwd, 0, false);
	return Register_success;
}
void ATM::ShowMenu()
{
	cout << "----------------------------------------------" << endl;
	cout << "                    主菜单                    " << endl;
	cout << "1.查询余额                              2.取款" << endl;
	cout << "3.修改密码                          4.冻结账号" << endl;
	cout << "                    0.退出                    " << endl;
	cout << "----------------------------------------------" << endl;
	cout << "请输入您的选择:";
	cin >> choice;
	if (choice >= 0 && choice <= 4)
	{
		userStatus = (_userStatus)choice;
	}
}
//修改密码
bool ATM::ChPasswd()
{
	uint n = GetPasswdSize();
	char *temp_passwd = new char[n];
	char choose;
	cout << "------修改密码界面--------" << endl;
	cout << "确定要修改密码吗？(Y or N):";
	cin >> choose;
	cin.sync();
	cin.clear();
	//处理用户输入
	while (choose != 'y' && choose != 'Y' && choose != 'n' && choose != 'N')
	{
		cout << "\a请输入“Y”or “N:";
		cin >> choose;
		cin.clear();
		cin.sync();
	}
	if (choose == 'Y' || choose == 'y')
	{
		cout << endl << "请输入您的密码进行验证:";
		GetInput_Passwd(temp_passwd);
		cout << endl;
		for (uint i = 0; i < n; ++i)
		{
			if (temp_passwd[i] != passwd[i])
			{
				cout << "密码错误，冻结账号失败，返回主菜单!!!\a" << endl;
				delete[] temp_passwd;
				userStatus = Show_menu;
				return false;
			}
		}
		cout << "验证成功！\n" << endl;
		SetPasswd();
		if (UpdateData("passwd", ID, passwd))
		{
			cout << "您的密码修改成功，即将返回主菜单" << endl;
			_getch();
			userStatus = Exit;
			delete[] temp_passwd;
			return true;
		}
		else
		{
			cout << "\a修改数据库连接失败！" << endl;
			_getch();
			userStatus = Show_menu;
			delete[] temp_passwd;
			return false;
		}

	}
	else
	{
		userStatus = Show_menu;
		delete[] temp_passwd;
		return false;
	}


}
//查询
const void ATM::ShowMoney()
{
	cout << "您的余额为：" << money << endl;
	userStatus = Show_menu;
}
//取款
void ATM::GetMoney()
{
	double num = 0;
	char* str = new char[sizeof(double)];
	cout << "------取款界面--------" << endl;
	cout << "请输入您的取款金额:";
	cin >> num;
	if (num > money)
	{
		cout << "\a余额不足！" << endl;
		_getch();
		userStatus = Show_menu;
		return;
	}
	else
	{
		money -= num;
	}
	_gcvt_s(str, sizeof(str), money, 3);
	ATM::UpdateData("Money",ID,str);
	cout << "取款成功!!!" << endl;
	userStatus = Show_menu;
}
//打印凭条
void ATM::PrintList()
{
	cout << "------打印凭条界面--------" << endl;
	userStatus = Show_menu;
}
//冻结账户
void ATM::Lock()
{
	uint n = GetPasswdSize();
	char *temp_passwd = new char[n];
	char choose;
	cout << "------冻结账户界面--------" << endl;
	cout << "确定要冻结账号吗？(Y or N):";
	cin >> choose;
	cin.sync();
	cin.clear();
	//处理用户输入
	while (choose != 'y' && choose != 'Y' && choose != 'n' && choose != 'N')
	{
		cout << "\a请输入“Y”or “N:";
		cin >> choose;
		cin.clear();
		cin.sync();
	}
	if (choose == 'Y' || choose == 'y')
	{
		cout << endl << "请输入您的密码进行验证:";
		GetInput_Passwd(temp_passwd);
		cout << endl;
		for (uint i = 0; i < n; ++i)
		{
			if (temp_passwd[i] != passwd[i])
			{
				cout << "密码错误，冻结账号失败，返回主菜单!!!\a" << endl;
				delete[] temp_passwd;
				userStatus = Show_menu;
				return;
			}
		}
		if (UpdateData("OnLock", ID, "1"))
		{
			cout << "您的账号冻结成功，即将强制下线" << endl;
			_getch();
			userStatus = Exit;
			delete[] temp_passwd;
			return;
		}
		else
		{
			cout << "\a修改数据库失败！" << endl;
			_getch();
			userStatus = Show_menu;
			delete[] temp_passwd;
			return;
		}
		
	}
	else
	{
		userStatus = Show_menu;
		delete[] temp_passwd;
		return;
	}
	

}
//退出
void ATM::Quite()
{
	cout << "------退出界面--------" << endl;
	exit(0);
}


//连接MySQL数据库
bool ATM::connectMysql(const char* IP,const char* user,const char* passwd,const char* databaseName,uint Port)
{
	//初始化mysql
	mysql_init(&mysql);  //连接mysql，数据库

	//返回false则连接失败，返回true则连接成功
	//中间分别是主机，用户名，密码，数据库名，端口号（可以写默认0或者3306等）
	if (!(mysql_real_connect(&mysql, IP, user, passwd, databaseName, Port, NULL, 0))) 
	{
		cout << "数据库连接失败，错误代码:" << mysql_error(&mysql) << endl;
		return false;
	}
	else
	{
		cout << "数据库连接成功！" << endl;
		return true;
	}
}

//mysql查询函数
char* ATM::QueryDatabase(const char* query_feild, const  uint id)
{
	string str1(query_feild, query_feild + strlen(query_feild));
	string str_id;
	char* str;
	digToString<uint>(id,str_id);
	//string str2(feild_value, feild_value + strlen(feild_value));
	string QueryCommand = "select " + str1 + " from Account where ID = " + str_id;
	const char* sqlCode = (char*)QueryCommand.data();
	
	mysql_query(&mysql, "set names gbk");
	//返回0 查询成功，返回1查询失败
	if (mysql_query(&mysql, sqlCode))        //执行SQL语句
	{
		cout << "数据库查询失败，错误代码:" << mysql_error(&mysql) << endl;
		return NULL;
	}
	res = mysql_store_result(&mysql);
	column = mysql_fetch_row(res);
	str = (char*)column[0];
	return str;
}


//查看用户是否存在
_accountStatus ATM::QueryDatabase(const uint userId)
{
	string str1;
	digToString<uint>(userId, str1);
	string QueryCommand = "select * from Account where ID = " + str1;
	const char* sqlCode = (char*)QueryCommand.data();

	mysql_query(&mysql, "set names gbk");
	//返回0 查询成功，返回1查询失败
	if (mysql_query(&mysql, sqlCode))        //执行SQL语句
	{
		cout << "数据库查询失败，错误代码:" << mysql_error(&mysql) << endl;
		return UNEXIST;
	}
	res = mysql_store_result(&mysql);
	char* str;
	column = mysql_fetch_row(res);
	if (column == NULL)
	{
		return UNEXIST;
	}
	str = (char*)column[5];
	if (!strcmp(str,"1"))
	{
		return LOCKED;
	}
	return EXIST;
}

bool ATM::InsertDatabase(const char* FirstName,const char* LastName,uint ID,const char* paswd,double moeny,bool Lock)
{
	string str_FirstName(FirstName, FirstName + strlen(FirstName));
	string str_LastName(LastName, LastName + strlen(LastName));
	string str_paswd(paswd, paswd + strlen(paswd));
	string str_id;
	string str_money;
	string str_lock;
	string quot = "\'";
	//合成后的sql语句
	const char* sqlCode;

	//数字转换为string对象
	digToString<uint>(ID, str_id);
	digToString<double>(money, str_money);

	//布尔类型转string
	if (Lock)
	{
		str_lock = "1";
	}
	else
	{
		str_lock = "0";
	}

	string QueryCommand = "insert into Account values (" + quot + str_FirstName + quot + "," + quot + str_LastName + quot + "," + str_id + "," + quot + str_paswd + quot + "," + str_money + "," + str_lock + ");";
	sqlCode = (char*)QueryCommand.data();

	
	if (mysql_query(&mysql, sqlCode))        //执行SQL语句
	{
		cout << endl << "插入数据出错:" << mysql_error(&mysql) << endl;
		return false;
	}
	else
	{
		cout << endl << "添加账户成功!" << endl;
		return true;
	}
}
bool ATM::DeleteDatabase(const uint ID)
{
	string str1;
	digToString<uint>(ID, str1);
	string QueryCommand = "delete from user where ID = " + str1;
	const char* sqlCode = (char*)QueryCommand.data();

	mysql_query(&mysql, "set names gbk");
	//返回0 查询成功，返回1查询失败
	if (mysql_query(&mysql, sqlCode))        //执行SQL语句
	{
		cout << "数据库操作失败，错误代码:" << mysql_error(&mysql) << endl;
		return false;
	}
	cout << "账号注销成功！" << endl;
	return true;
}
bool ATM::InitAccount(uint & userId)
{
	string str1;
	digToString<uint>(ID, str1);
	const char* sqlCode = "select count(*) from Account;";
	int num;
	mysql_query(&mysql, "set names gbk");
	//返回0 查询成功，返回1查询失败
	if (mysql_query(&mysql, sqlCode))        //执行SQL语句
	{
		cout << "数据库操作失败，错误代码:" << mysql_error(&mysql) << endl;
		return false;
	}
	res = mysql_store_result(&mysql);
	column = mysql_fetch_row(res);
	//char*类型转浮点型
	num = atof(column[0]);
	userId += (num + 1);
	return true;
}
bool ATM::UpdateData(const char* _feild,const uint id,const char* feild_value)
{
	string str_feild(_feild, _feild + strlen(_feild));
	string str_feild_value(feild_value, feild_value + strlen(feild_value));
	string str_id;
	string quot = "\'";
	//合成后的sql语句
	const char* sqlCode;

	digToString<uint>(id, str_id);

	string QueryCommand = "update Account set " + str_feild  + "=" + quot + str_feild_value + quot + " where ID = " + str_id;
	
	sqlCode = (char*)QueryCommand.data();

	if (mysql_query(&mysql, sqlCode))        //执行SQL语句
	{
		cout << "更新数据出错:" << mysql_error(&mysql) << endl;
		return false;
	}
	else
	{
		cout << "更新数据成功!" << endl;
		return true;
	}
}




//数字转换为string
template<typename T>
inline void ATM::digToString(const T digit, std::string & str)
{
	stringstream stream;
	stream << digit;
	str = stream.str();
}

//初始化用户数量
//uint Account::num = 0;



//设置用户姓
void Account::SetFirstName()
{
	cout << "请输入您的姓氏：";
	cin >> FirstName;
}
//设置用户名
void Account::SetLastName()
{
	cout << "请输入您的名：";
	cin >> LastName;
}
//设置用户密码
bool Account::SetPasswd()
{
	uint n = GetPasswdSize();
	char *temp1 = new char[n];
	char *temp2 = new char[n];
	int temp1_len = 0, temp2_len = 0;
	cout << "请输入您的密码:";
	GetInput_Passwd(temp1);
	cout << endl;
	cout << "请确认您的密码:";
	GetInput_Passwd(temp2);
	cout << endl;

	temp1_len = int(strlen(temp1));
	temp2_len = int(strlen(temp2));

	if (temp1_len != temp2_len)
	{
		//密码不一致抛出错误
		delete[] temp1;
		delete[] temp2;
		return false;
	}
	
	for (uint i = 0; i < uint(temp1_len); i++)
	{
		if (temp1[i] != temp2[i])
		{
			//密码不一致抛出错误
			cout << "\a密码输入不一致!" << endl;
			delete[] temp1;
			delete[] temp2;
			return false;
		}
	}
	//复制内存
	strcpy_s(passwd, n, temp1);
	delete[] temp1;
	delete[] temp2;
	return true;
}

//从屏幕中获取密码
char* Account::GetInput_Passwd(char *pass,const char str)
{
	uint maxCount = GetPasswdSize();
	uint i = 0;
	char temp;
	bool lock = false;
	cin.sync();
	memset(pass, 0, maxCount); //清零
	for (i = 0; i < maxCount; ++i)
	{
		temp = _getch();
		if (temp == '\r')
		{
			if (i == 0)
			{
				cout << "\a";
				//接收回车缓存
				_getch();
				return NULL;
			}
			else
			{
				//接收回车缓存
				_getch();
				break;
			}
		}
		if (temp == '\b')
		{
			if (i > 0)
			{		
				if (lock == false)
				{
					cout << "\b \b";
					i-=2;
				}
				else
				{
					i -= 2;
					cout << "\a";
				}
				
					
			}
			else
			{
				cout << "\a";
				lock = true;
				i = 0;
			}
		}
		else
		{
			pass[i] = temp;
			cout << str;
			lock = false;

		}
		//接收回车缓存
		_getch();
	}
	pass[i] = '\0';
	return pass;
}


//初始化用户类
Account::Account()
{
	ID = 10000;
	passwd = new char[20];
	OnLock = false;
	/**用户姓*/
	FirstName = new char[20];
	/**用户名*/
	LastName = new char[20];
}

Account::~Account()
{
	delete[] passwd;
	delete[] FirstName;
	delete[] LastName;
}
```

**main.cpp（主函数）**

``` cpp
#include "ATM.h"


int main(void)
{
	ATM atm;
	atm.connectMysql("192.168.1.88", "ATM", "Test@ATM.data001", "Bank", 3306);
	while (true)
	{
		atm.MainProcess();
	}
	return 0;
}
```