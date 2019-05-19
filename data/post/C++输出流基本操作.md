**代码如下：**
``` c++
#include <iostream>
#include <iomanip>
#include <cmath>

using namespace std;

const double PI = 3.1415926535;
const double SPEED_OF_LIGHT = 2.99792458E+8;
const double FINE_STRUTYRE = 7.2573525E-3;

void print_Table();

int main(int argc, char const *argv[])
{
	cout << uppercase << right;
	cout << "Default format:" << endl << endl;
	print_Table();
	cout << endl << "Fixed format:" << fixed << endl << endl;
	print_Table();
	cout << endl << "Secientific format:" << scientific << endl << endl;
	print_Table();
	return 0;
}


void print_Table()
{
	cout << "prec	|		pi 		|	speed of light |	fine structure" << endl;
	cout << "--------+---------------+------------------+------------------" << endl;
	for(int i = 0;i <=6;++i)
	{
		cout << setw(7) << i << " |";
		cout << " " << setw(13) << setprecision(i) << PI << " |";
		cout << " " << setw(16) << setprecision(i) << SPEED_OF_LIGHT << " |";
		cout << " " << setw(14) << setprecision(i) << FINE_STRUTYRE << endl;
	}

}
```

**运行结果：**
![运行结果][1]


  [1]: https://ws1.sinaimg.cn/large/007llElwly1fwg2q2ny9vj30nq0lpwfw.jpg