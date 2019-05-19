# 解决方法
使用`fromLocal8Bit` 和 `toLocal8Bit`方法。

**发送：**
``` cpp
void TcpS::btn_send()
{
     QByteArray datasend = ui->textEdit->toPlainText().toLocal8Bit();
     m_tcpsocket->write(datasend);
}
```

**接收：**
``` cpp
void TcpS::read_datagram()
{
    QByteArray dataread = m_tcpsocket->readAll();
    QString str = QString::fromLocal8Bit(dataread);
    ui->textBrowser->insertPlainText(str+"\n");
}
```