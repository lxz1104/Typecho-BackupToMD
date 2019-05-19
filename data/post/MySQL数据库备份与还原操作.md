## 从MySQL中导出数据库并备份

*  远程
``` SQL
格式：mysqldump -h主机名  -P端口 -u用户名 -p密码 –database 数据库名 > 文件名.sql ;
```

* 备份MySQL数据库为带删除表的格式
``` SQL
mysqldump  --add-drop-table -uusername -ppassword -database databasename > backupfile.sql;
```

* 直接将MySQL数据库压缩备份
``` SQL
mysqldump -hhostname -uusername -ppassword -database databasename | gzip > backupfile.sql.gz;
```

* 备份MySQL数据库某个(些)表
``` SQL
mysqldump -hhostname -uusername -ppassword databasename specific_table1 specific_table2 > backupfile.sql;
```

* 备份服务器上所有数据库
``` SQL
mysqldump –all-databases > allbackupfile.sql;
```

## 还原MySQL数据库的命令

* 还原单个数据库
``` SQL
mysql -hhostname -uusername -ppassword databasename < backupfile.sql;
```

* 还原压缩的MySQL数据库
``` SQL
gunzip < backupfile.sql.gz | mysql -uusername -ppassword databasename;
```

* 将数据库转移到新服务器
``` SQL
mysqldump -uusername -ppassword databasename | mysql –host=*.*.*.* -C databasename;
```

[参考文章](https://www.cnblogs.com/Cherie/p/3309456.html)
