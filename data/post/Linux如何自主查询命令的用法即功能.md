* **使用man page查询** >在终端输入“man #”并回车，这里的“#”代表你要查询的命令。以下以_date_命令作为示范。
    
 ```　bash   
     root@kali:~# man date
```    

**注:**

> 如果你的Linux默认语言是中文，为了避免出现乱码，在输入上面命令前需输入以下命令更改语言。 
    
```　bash
     root@kali:~# LANG='en'
```

完成上述指令操作后就会出现“date”命令的用法（即进入man page页面），如下图所示： [gallery type="columns" size="full" ids="129"] （图一）

> 在第三处划线的地方就详细的描述了命令“date -d/date --date"的功能，查看其它命令的功能也可以以此类推。 首先注意一下图中第一行(即第一处画线的地方)括号中的数字，它代表的是指令的类型；其对照表如下： [gallery type="columns" size="full" ids="120"] 第一行中的”DATE(1)“就代表**一般用户可使用的命令** man page的内容也分成好几个部分来加以介绍该挃令，图一中第二处划线的地方“NAME”，表示简短的指令、数据名称说明，其它的对应表如下: [gallery type="columns" size="full" ids="124"] 在man page下的一些操作命令如下： [gallery type="columns" size="full" ids="117"]