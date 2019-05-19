'use strict'

/** 文件操作对象 */
var fs = require('fs');
/** 文件路径对象 */
var path = require('path');
/** 日志管理模块 */
var log = require('../lib/log');

/** 创建文件夹：第二个参数可忽略 */
function mkdir(dirPath,dirName){
    /** 判断是否是第一次调用 */
    if(typeof dirName == "undefined"){
        if(fs.existsSync(dirPath)){
            return;
        }else{
            //递归创建文件
            mkdir(dirPath,path.dirname(dirPath));
        }
    }else{
        //判断第二个参数是否合法
        if(dirName != path.dirname(dirPath)){
            mkdir(dirPath);
            return;
        }
        if(fs.existsSync(dirName)){
            fs.mkdirSync(dirPath);
        }else{
            mkdir(dirName,path.dirname(dirName));
            fs.mkdirSync(dirPath);
        }
    }
}

/** 创建文件 */
function touch(dir_path,file_name,file_data){

    //创建一个可以写入的流，写入到文件file_name.md中
    var writeStream = fs.createWriteStream(dir_path + file_name + '.md');

    //使用utf-8编码写入数据
    writeStream.write(file_data,'UTF8');

    //标记文件末尾
    writeStream.end();

    //处理事件 --> file_data, end, and err
    writeStream.on('finish',function(){
        log.out('Write File','successful','Write { ' + file_name + '.md } to ' + dir_path);
    })

    writeStream.on('error',function(err){
        log.out('Write File','failure',err.stack);
    });

}

/** 设置接口 */
module.exports = {
    /** 创建文件夹 */
    mkdir   : mkdir,
    /** 创建文件 */
    touch   : touch
};