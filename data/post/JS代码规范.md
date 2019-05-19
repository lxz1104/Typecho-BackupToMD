_这篇博文会持续更新。_

  * **JS在HTML中的编写位置**

> 在编写web项目时，通常把CSS放在BODY的上面，把JS放在BODY的末尾。 
    
``` html  
    <html>
    <head>
        <link rel="stylesheet" href="css/css">
    </head>
    <body>
        ...
    </body>
    <script src="js/1.js">
    <script>
        alert('hello world!');
    </script>
    </html>
```   

**这样做的目的：**

  * 浏览器中页面加载的顺序按代码行是从上到下加载的。
  * 这样将CSS放在BODY前面保证浏览器先加载CSS，即让网页从一开始就带有样式，然后再加载BODY，这样可以保证在网速较慢的时候，网页还是跟我们预期的效果一样。
  * JS很多时候需要操作这些元素，首先我们要保证元素加载成功，才可以在JS中获取到。这样将JS放到BODY后面即将JS放在结构之后加载，保证了DOM结构先加载完，再加载JS。 **补充** _如果把JS放在HTML标签前面，如何等到结构加载完成再加载JS_

> 1.原生JS可以使用window.onload=function(){}（页面中的所有资源文件都加载完成执行操作）
>     
``` html
     <html>
     <head>
         <title>window.onload世界 你好！</title>
         <script>
             alert("hello world!");
         </script>
     </head>
     <body>
         ...
     </body>
     </html>  
```   
> 
> [参考博文](https://www.cnblogs.com/gaogaoxingxing/p/6108485.htm)
>
>> 2.使用JS的常用类库JQ。(document).ready(function(){}) 页面中的结构加载完成就会执行操作。