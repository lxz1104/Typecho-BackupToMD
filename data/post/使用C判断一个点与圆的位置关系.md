# 代码
其实即使一个简单的类的操作，定义一个`坐标类`和一个`圆类`就可以解决，代码如下：
``` cpp
#include <iostream>
#include <cmath>

class Point{
public:
    //x点坐标
    double x;
    //y点坐标
    double y;
    Point():x(0),y(0){}
    Point(double X, double Y):x(X),y(Y){}
    ~Point(){}
};

class AdvCircle{
public:
    AdvCircle():r(0),pos(0,0){}
    AdvCircle(double X, double Y, double R):pos(X,Y),r(R){}
    ~AdvCircle(){}
    //判断是否在圆内
    bool IsInCircle(const Point& point)
    {
    	//注意:这里需要将类型强制转换成double，否则判断不准确
        return double_t(pow(point.x - this->pos.x,2) + pow(point.y - this->pos.y,2)) - pow(this->r,2) < 0 ;
    }
    //判断是否在圆上
    bool IsOnCircle(const Point& point)
    {
    	//注意:这里需要将类型强制转换成double，否则判断不准确
        return double_t(pow(point.x - this->pos.x,2) + pow(point.y - this->pos.y,2)) - pow(this->r,2) == 0 ;
    }
    //判断是否在圆外
    bool IsOutsideCircle(const Point& point)
    {
        return !(IsOnCircle(point) || IsInCircle(point));
    }
    //输出位置
    void PrintPos(const Point& point)
    {
    	std::cout << std::string(IsInCircle(point) ? "在圆内" : IsOnCircle(point) ? "在圆上" : "在圆外") << std::endl;
    }
private:
	//圆心坐标
    Point pos;
    //圆半径
    double r;
};

int main(void) {
    AdvCircle c1(10,10,5);
    std::cout << c1.IsInCircle(Point(10,15)) << std::endl;
    std::cout << c1.IsOutsideCircle(Point(10,16)) << std::endl;
    std::cout << c1.IsOnCircle(Point(10,16)) << std::endl;
    c1.PrintPos(Point(9,15));
    return 0;
}
```