[Meting]
[Music server="netease" id="21157332" type="song"/]
[/Meting]



由于博主忘记了我的ownclod的密码，所以不得不进行密码重置．随便给大家分享以下重置密码的方法，如下：

忘记密码后，可通过管理员进行密码重置或修改，但当只有一个管理员或者管理员也忘记密码后可通?**owncloud安装目录**下的occ文件进行密码重置，方法如下：

``` shell
#输入如下指令，`admin`为要更改密码的用户的用户名
sudo -u apache php occ user:resetpassword admin  

Enter a new password:
Confirm the new password:
Successfully reset password for admin
```

注:如果不知道**owncloud安装目录**在哪，可以去nginx或apache的配置文件里查看，或者直接用**find**命令查看．