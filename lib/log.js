'use strict'

/** 控制台颜色对象 */
var styles = {
    'bold'          : ['\x1B[1m',  '\x1B[22m'],
    'italic'        : ['\x1B[3m',  '\x1B[23m'],
    'underline'     : ['\x1B[4m',  '\x1B[24m'],
    'inverse'       : ['\x1B[7m',  '\x1B[27m'],
    'strikethrough' : ['\x1B[9m',  '\x1B[29m'],
    'white'         : ['\x1B[37m', '\x1B[39m'],
    'grey'          : ['\x1B[90m', '\x1B[39m'],
    'black'         : ['\x1B[30m', '\x1B[39m'],
    'blue'          : ['\x1B[34m', '\x1B[39m'],
    'cyan'          : ['\x1B[36m', '\x1B[39m'],
    'green'         : ['\x1B[32m', '\x1B[39m'],
    'magenta'       : ['\x1B[35m', '\x1B[39m'],
    'red'           : ['\x1B[31m', '\x1B[39m'],
    'yellow'        : ['\x1B[33m', '\x1B[39m'],
    'whiteBG'       : ['\x1B[47m', '\x1B[49m'],
    'greyBG'        : ['\x1B[49;5;8m', '\x1B[49m'],
    'blackBG'       : ['\x1B[40m', '\x1B[49m'],
    'blueBG'        : ['\x1B[44m', '\x1B[49m'],
    'cyanBG'        : ['\x1B[46m', '\x1B[49m'],
    'greenBG'       : ['\x1B[42m', '\x1B[49m'],
    'magentaBG'     : ['\x1B[45m', '\x1B[49m'],
    'redBG'         : ['\x1B[41m', '\x1B[49m'],
    'yellowBG'      : ['\x1B[43m', '\x1B[49m']
};

/** 日志管理对象 */
var log = {
    /** 输出日志信息 */
    out : function(title = '\0',status = '\0',content = '\0'){
        /** 时间对象 */
        var time = new Date();
        if(status == "failure"){
            console.log("[\x1B[36m%s\x1B[39m]<\x1B[31m%s\x1B[39m>(\x1B[35m%s\x1B[39m): " + content,
                title,status,time.toLocaleString('en-US', { hour12: false }));
        }else if(status == "successful"){
            console.log("[\x1B[36m%s\x1B[39m]<\x1B[32m%s\x1B[39m>(\x1B[35m%s\x1B[39m): " + content,
                title,status,time.toLocaleString('en-US', { hour12: false }));
        }
    }
}

/** 公开接口 */
module.exports = log;