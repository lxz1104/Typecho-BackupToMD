# 简介
数学建模培训的一个作业，感觉挺有意思。

# 代码
```
clear;
%画脸盘
t=linspace(0,2*pi,1000);
x1=70*sin(t);
y1=60*cos(t);
fill(x1,y1,'y');
hold on;
%画左眼
draw_eye(-35,12); 
%画右眼
draw_eye(35,12); 
%画嘴
t=linspace(0.5 * pi,1.5 * pi,1000);
x1=38 * sin(t);
y1=30 * cos(t) - 20;
plot(x1,y1,'k');
hold on;   
clear;
%画眼睛函数
function draw_eye(x,y)        %主函数必须位于最上方
    %上圆弧
    t=linspace(0.5 * pi,-0.5 * pi,1000);
    x1=25*sin(t) + x;
    y1=20*cos(t) + y;
    plot(x1,y1,'k');
    hold on;
    %下圆弧
    t=linspace(0.5 * pi,-0.5 * pi,1000);
    x2=15*sin(t) + x;
    y2=10*cos(t) + (y - 2);
    plot(x2,y2,'k');
    hold on;
    %左圆弧
    t=linspace(0.5 * pi,1.5 * pi,1000);
    x3=5*sin(t) + (x - 20);
    y3=5*cos(t) + y;
    plot(x3,y3,'k');
    hold on;
    %右圆弧
    t=linspace(0.5 * pi,1.5 * pi,1000);
    x4=5*sin(t) + (x + 20);
    y4=5*cos(t) + y;
    plot(x4,y4,'k');
    hold on;
    %眼仁
    alpha=0:pi/20:2*pi;    %角度[0,2*pi] 
    R=3.5;                   %半径 
    x3=R*cos(alpha) + (x - 19); 
    y3=R*sin(alpha) + y + 3;
    plot(x3,y3);
    fill(x3,y3,'k');
    %眼袋
    alpha=0:pi/20:2*pi;    %角度[0,2*pi] 
    R=4.5;                   %半径 
    x3=2.5 * R*cos(alpha) + x; 
    y3=R*sin(alpha) + y - 7;
    plot(x3,y3);
    fill(x3,y3,'m');
end
```

# 运行结果
![][1]


  [1]: https://cdn.sinaimg.cn.52ecy.cn/large/005BYqpgly1g33fq8fd9ij30ji0hgae5.jpg