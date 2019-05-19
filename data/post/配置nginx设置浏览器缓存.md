## 引言
**浏览器缓存**（Browser Caching） 是为了加速浏览并节约网络资源，浏览器在用户磁盘上对最近请求过的文档进行存储。

**原理**：nginx可以通过 expires 指令来设置浏览器的Header

**语法**： expires [time|epoch|max|off]

**默认值**： expires off

**作用域**： http, server, location

使用本指令可以控制HTTP应答中的“Expires”和“Cache-Control”的头标，（起到控制页面缓存的作用）。

可以在time值中使用正数或负数。“Expires”头标的值将通过当前系统时间加上您设定的 time 值来获得。

epoch 指定“Expires”的值为 1 January, 1970, 00:00:01 GMT。

max 指定“Expires”的值为 31 December 2037 23:59:59 GMT，“Cache-Control”的值为10年。

-1 指定“Expires”的值为 服务器当前时间 -1s,即永远过期．

```
server{
      ...
     #设置图像资源保存７天
     location ~.*\.(jpg|png|jpeg)$
     {
        expires 7d;
     }
     #js css缓存一小时
     location ~.*\.(js|css)?$
     {
        expires 1h;
     }
      ...
      
}
```

## 总结
按理来说通过这种方法可以优化你的网站的整体体验,至于实际上有没有这个还有待检验．