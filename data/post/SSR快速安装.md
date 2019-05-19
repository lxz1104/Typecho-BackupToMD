[Meting]
[Music server="netease" id="17271072" type="song"/]
[/Meting]

## 一.安装ssr
* **下载安装脚本**
``` shell
#下载安装脚本
wget https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocksR.sh

#添加可执行权限
chmod +x shadowsocksR.sh

#安装
./shadowsocksR.sh 2>&1 | tee shadowsocksR.log
```

## 二.安装锐速破解版

* **拉取一键安装脚本**
``` shell
wget https://raw.githubusercontent.com/wn789/serverspeeder/master/serverspeeder.sh
```

**注：锐速只支持kvm,不支持openvz **

* **运行脚本**
``` shell
chmod +x serverspeeder.sh

bash serverspeeder.sh
```

注：如果内核不支持，请参照这篇文章更换内核.[**传送门**](https://www.darkhat.xyz/linux/74.html)


**PS:**速锐是通过暴力发包来达到加速目的的,损人利己,不太推荐使用,建议使用**BBR**.[**传送门**](https://www.darkhat.xyz/linux/74.html)

## SSR客户端下载

[**安卓版**](https://cloud.darkhat.xyz/app/%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91/shadowsocksr.apk)

[**Windows版**](https://cloud.darkhat.xyz/software%20for%20windows/%E7%A7%91%E5%AD%A6%E4%B8%8A%E7%BD%91/shadowsocksR.rar)

[**更多版本**](https://github.com/erguotou520/electron-ssr/releases)