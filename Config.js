'use strict'

/** MySQL配置信息 */
var configure_mysql = {
    /** 主机地址 */
    host     : 'localhost',
    /** 端口 */
    port     : '3306',
    /** MySQL用户名 */
    user     : 'root',
    /** MySQL密码 */
    password : 'lxz1120140123@root',
    /** MySQL数据库名 */
    database : 'typecho_data',
    /** 数据表前缀 */
    prefix   : 'Blog_',

    /************ 以下内容不建议修改 *************/
    /** 一次性建立的最大连接数目 */
    connectionLimit     : 20,
    /** 
     * 在连接池的所有连接没有可用的时候，
     * 如果 是true 就让申请连接的排队等待
     * 如果false 则返回一个错误，默认 true 
     */
    waitForConnections  : true,
    /** 获取连接时的超时 */
    acquireTimeout      : 3000
};

/** GitHub配置信息 */
var configure_github = {
    /** GitHub用户名 */
    user        : 'userName',
    /** GitHub邮箱 */
    email       : 'example@mail.com',
    /** GitHub账户密码 */
    password    : 'passwd',
    /** GitHub仓库名 */
    repository  : 'repositoryName'
};

/** 文章输出配置 */
var configure_output_file = {
    /** 路径:md文件输出的路径,默认为源码路径下的data文件夹 */
    path        : __dirname + '\/data'
}

/** 设置接口 */
module.exports = {
    /** MySQL配置信息 */
    mysql  : configure_mysql,
    /** GitHub配置信息 */
    github : configure_github,
    /** 文章输出配置 */
    file   : configure_output_file
} ;
