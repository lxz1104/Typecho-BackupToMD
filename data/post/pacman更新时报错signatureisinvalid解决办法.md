# 执行 pacman -Syu 时错误信息如下：
```
error: lib32-alsa-lib: signature from "Felix Yan <felixonmars@gmail.com>" is invalid

:: File /var/cache/pacman/pkg/lib32-alsa-lib-1.1.0-1-x86_64.pkg.tar.xz is corrupted (invalid or corrupted package (PGP signature)).

Do you want to delete it? [Y/n]

反正就是类似这种说签名不可用，

/var/cache/pacman/pkg/libx32-flex-2.6.0-1.1-x86_64.pkg.tar.xz is corrupted (invalid or corrupted package (PGP signature)).
```
问你是否删除，若选择是，再升级还会重新下载，仍旧那样，选择否直接退出无法升级。

**官方wiki说系统时间不正确会导致这个问题。也可能是多系统引起的问题。**

# 解决办法
**方法一**
``` shell
 rm -r /etc/pacman.d/gnupg/      # 删除gnupg目录及其文件
 pacman-key --init
 pacman-key --populate archlinux
 pacman-key --populate archlinuxcn    # 启用了archlinux中文软件库的还要执行这个
```
**方法二**
```
pacman-key --init
pacman-key --populate
```
然后就可以愉快地更新系统了：）
