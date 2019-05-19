## 原理

1）先检测MYSQL的3306端口（如有更改请替换）是否正常；
2）使用帐号连接数据库并执行show databases命令；
3）如以上两点都能正常工作则表示数据库运行正常，不正常则记录日志并重启，重启不成功使用Email通知管理人员。


## 代码
``` sell
#!/bin/bash  

#此处需要自己调试，每个人的都可能不同
MYSQLPORT=`netstat -na|grep "LISTEN"|grep "3306"|awk -F[:" "]+ '{print $5}'`  
  
function checkMysqlStatus(){  
    /usr/bin/mysql -uroot -p11111 --connect_timeout=5 -e "show databases;" &>/dev/null 2>&1  
    if [ $? -ne 0 ]  
    then  
        restartMysqlService  
        if [ "$MYSQLPORT" == "3306" ];then  
            echo "mysql restart successful......"   
        else  
            echo "mysql restart failure......"   
            #mail -s "WARN! server: $MYSQLIP  mysql is down" admin@yourdomain.com < /var/log/mysqlerr  
        fi  
    else  
        echo "mysql is running..."  
    fi  
}  
  
function restartMysqlService(){  
    echo "try to restart the mysql service......"  
    killall mysqld &>/dev/null
    /bin/systemctl start mysqld 
}  
  
if [ "$MYSQLPORT" == "3306" ]  
then  
    checkMysqlStatus  
else  
    restartMysqlService  
fi
```

## 加入定时任务
``` shell
crontab -e
#填入如下内容,每5分钟执行一次
*/5 * * * * /.../mysql.sh #你脚本的绝对路径
```