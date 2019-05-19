## 引言
在很多时候我们需要多nginx进行归档，不然的话以后查看日志很不方便，所以我们需要进行日志切割。

## 代码

**代码如下：**
``` shell

#!/bin/bash

#auto backup nginx log

#by kivii 2018-10-21

S_LOG=/var/log/nginx/access.log           #连接日志路径
D_LOG=/data/backup/log/nginx/access/`date +%Y%m%d`/   #及切割后的日志放置的路径

echo -e "\033[32mPlease wait start cut shell script\033[0m"

sleep 2

if [ ! -d $D_LOG ];then
        mkdir -p $D_LOG
fi

mv $S_LOG $D_LOG

#重新生成PID
kill -USR1 `cat /run/nginx.pid`

echo "successfully!!!"
```


**添加定时任务：**
``` shell
crontab -e

#添加如下内容
0 0 * * * /your/path/nginx_log.sh

```