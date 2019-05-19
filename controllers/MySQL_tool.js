'use strict'

/** MySQL模块 */
var mysql = require('mysql'); 
/** 配置文件模块 */
var config = require('../Config');
/** 日志管理模块 */
var log = require('../lib/log');

/** MySQL工具模块 */
function MySQL_tool (_config = config) {
    /** 文章数据表名 */
    this.content_table          = _config.mysql.prefix + "contents",
    /** 用户数据表名 */
    this.user_table             = _config.mysql.prefix + "users",
    /** 标签/分类数据表名 */
    this.meta_table             = _config.mysql.prefix + "metas",
    /** 文章-标签对应关系数据表名 */
    this.relationship_table     = _config.mysql.prefix + "relationships",
    /** MySQL连接池对象 */
    this.connect_pool           = mysql.createPool(_config.mysql),
    /** 关闭连接池 */
    this.close                  = function(){
        this.connect_pool.end(function(error){
            if(!error){
                log.out('Close ConnectPool','successful','The all MySQL connections has been closed.');
            }else{
                log.out('Close ConnectPool','failure',error);
            }
        });
    }
    /** 通过文章ID获取文章内容 */
    this.getTextById            = function(cId,callback){
        /** 文章数据表  */
        var table = this.content_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT text FROM ' + table +  ' WHERE cid = ' + cId,
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                } 
                //console.log('The results:',results);
                connection.release();
                return callback(results[0].text.substring(15,results[0].text.length));
            });
            
        });
        
    },
    /** 通过文章ID获取文章作者 */
    this.getAuthorById           = function(cId,callback){
        /** 文章数据表  */
        var content_table = this.content_table;
        /** 用户信息数据表  */
        var user_table = this.user_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT screenName FROM ' + user_table + 
                ' WHERE uid = ( SELECT authorId FROM ' + 
                content_table + ' WHERE cid = ' + cId + ' ) ',
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                } 
                // console.log('The results:',results);
                connection.release();
                return callback(results[0].screenName);
            });
            
        });
    },
    /** 通过文章ID获取写作日期 */
    this.getCreateTimeById       = function(cId,callback){
        
        /** 文章数据表  */
        var table = this.content_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT created FROM '+ table + ' WHERE cid = ' + cId,
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                } 
                // console.log('The results:',results);
                var date = new Date(results[0].created * 1000);
                var createTime = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                
                connection.release();
                return callback(createTime);
            });
            
        });
    },
    /** 通过文章ID获取上一次修改时间 */
    this.getModifyTimeById       = function(cId,callback){
        /** 文章数据表  */
        var table = this.content_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT modified FROM '+ table + ' WHERE cid = ' + cId,
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                } 
                // console.log('The results:',results);
                var date = new Date(results[0].modified * 1000);
                var modifyTime = date.getFullYear() + "-" + (date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1)) + "-" + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                
                connection.release();
                return callback(modifyTime);
            });
            
        });
    },
    /** 通过文章ID获取文章类型：独立页面或常规文章 */
    this.getContentTypeById      = function(cId,callback){
        /** 文章数据表  */
        var table = this.content_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT type FROM ' + table +  ' WHERE cid = ' + cId,
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                } 
                connection.release();
                return callback(results[0].type);
            });
            
        });
    },
    /** 通过文章ID获取文章标题 */
    this.getContentTitleById    = function(cId,callback){
        /** 文章数据表  */
        var table = this.content_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT title FROM '+ table + ' WHERE cid = ' + cId,
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                }
                connection.release();
                return callback(results[0].title);
            });
            
        });
    },
    /** 获取所有文章的所有内容信息 */
    this.getAllContent          =   function(callback){
        /** 文章数据表  */
        var table = this.content_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT cid,title,created,modified,authorId,type,parent,text FROM '+ table,
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                } 
                connection.release();
                return callback(results);
            });
            
        });
    },
    /** 获取所有文章的所有内容信息 */
    this.getAllId          =   function(callback){
        /** 文章数据表  */
        var table = this.content_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT cid FROM '+ table,
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                } 
                connection.release();
                return callback(results);
            });
            
        });
    },
     /** 通过ID获取文章的所有信息 */
    this.getContentById         =   function(cId,callback){
        /** 文章数据表  */
        var table = this.content_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT cid,title,created,modified,authorId,type,parent,text FROM '+ table + ' WHERE cid = ' + cId,
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                } 
                connection.release();
                for(var i = results.length - 1;i >= 0;--i){
                    results[i].text = results[i].text.substring(15,results[0].text.length);
                }
                return callback(results);
            });
            
        });
    },
    /** 通过ID获取文章标签 */
    this.getTagById             = function(cId,callback){
        /** 标签/文章分类数据表 */
        var metas_table = this.meta_table;
        /** 文章-标签对应关系数据表 */
        var relationships_table = this.relationship_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT name FROM ' + metas_table +  
                ' WHERE mid = ANY ( SELECT mid FROM ' + relationships_table + 
                ' WHERE cid = ' + cId + ' ) AND type = \'tag\'',
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                }
                /** 记录标签的数组 */
                var tags = [];
                for(var i = results.length - 1;i >= 0;--i){
                    tags.push(results[i].name);
                }
                connection.release();
                return callback(tags);
            }); 
        });
    },
    /** 通过ID获取文章所处分类 */
    this.getCategoryById             = function(cId,callback){
        /** 标签/文章分类数据表 */
        var metas_table = this.meta_table;
        /** 文章-标签对应关系数据表 */
        var relationships_table = this.relationship_table;
        // 从创建的连接池中获取到一个连接
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT name FROM ' + metas_table +  
                ' WHERE mid = ANY ( SELECT mid FROM ' + relationships_table + 
                ' WHERE cid = ' + cId + ' ) AND type = \'category\'',
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                }
                /** 记录标签的数组 */
                var category = [];
                for(var i = results.length - 1;i >= 0;--i){
                    category.push(results[i].name);
                }
                connection.release();
                return callback(category);
            });
            
        });
    },
    /** 获取所有文章分类 */
    this.getAllCategory         = function(callback){
        /** 标签/文章分类数据表 */
        var metas_table = this.meta_table;
        this.connect_pool.on('connection' ,function(connection){
            log.out('Get ConnectPool','successful', __filename + ':getAllCategory()');
        });
        // 从创建的连接池中获取到一个连接
        var temp = this.connect_pool;
        this.connect_pool.getConnection(function(error, connection){
            // 判断是否成功获取到连接
            if(error){
                log.out('Get ConnectPool','failure',error);
                throw error;
            }
            // 使用SQL语句查询
            connection.query(' SELECT name,parent FROM ' + metas_table +  
                ' WHERE type = \'category\' ',
            function(error,results){
                if(error){
                    log.out('Query','failure',error);
                    return;
                }
                //temp.releaseConnection(connection);
                connection.release();
                return callback(results);
            });
        });
    }
};



/** 设置接口 */
/** MySQL工具模块 */
module.exports = MySQL_tool;