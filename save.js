'use strict'

/** MySQL工具模块 */
var MySQL_tool = require('./controllers/MySQL_tool')
/** 文件管理模块 */
var file = require('./lib/file');
/** 配置文件模块 */
var config = require('./Config');
/** 文件库模块 */
const fs=require('fs');
/** 路径包模块 */
const path=require('path');

/** 保存大分类目录路径 */
var category_path = {
    /** 文章路径 */
    post    : config.file.path + '\/post',
    /** 静态页面路径 */
    page    : config.file.path + '\/page'
}

var g_parents = [];
var g_category = [];

/** 构建目录 */
function creatDir(){
    var mysql_tool = new MySQL_tool();
    // 创建两个大分类文件夹：post和page
    file.mkdir(config.file.path);
    file.mkdir(category_path.page);
    file.mkdir(category_path.post);
    // 获取分类信息并以此来创建文件夹
    mysql_tool.getAllCategory(function(category){
        var parents = [];
        for(var i = category.length - 1;i >=0;--i){
            parents.push(category[i].parent);
        }
        //去重并排序
        var parents = [...new Set(parents)].sort();
        g_parents = parents;
        g_category = category;
        //console.log(category);
        for(var i = 0;i < parents.length;++i){
            for(var j = 0;j < category.length;++j){
                if(category[j].parent == parents[i]){
                    var path = category_path.post;
                    if(!category[j].parent){
                        path += '\/' + category[j].name;
                    }else{
                        var stack = [];
                        var temp = category[j];
                        var index = j;
                        while(index > 0){
                            stack.push(index);
                            index = temp.parent - 1;
                            temp = category[index];
                        }
                        while(stack.length){
                            path += '\/' + category[stack.pop()].name;
                        }
                    }
                    file.mkdir(path);
                    // console.log(path);
                }
            }
        }
    });
}

/** 构建目录 */
function creatFile(){
    var mysql_tool = new MySQL_tool();
    mysql_tool.getAllId(function(reasult){
        //console.log(reasult);
        for(var i = reasult.length - 1;i >= 0;--i){
            mysql_tool.getContentById(reasult[i].cid,function(data){
                if(data[0].type == 'page'){
                    file.touch(category_path.page + '\/',data[0].title.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,""),data[0].text);
                }else{
                    //console.log(data[0]);
                    file.touch(category_path.post + '\/',data[0].title.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\<|\.|\>|\/|\?]/g,""),data[0].text);
                }
                
            });
            
        }
        
    });
}

//目标目录
function loadTree(target,deep){
  var prev=new Array(deep).join(' |');
  // 前面| 字符串
  var dirinfo=fs.readdirSync(target);
  var files=[];
  var dirs=[];
  //保存文件或者是文件夹
   
   //遍历将文件或者文件夹分开存储
  for (var i = 0; i < dirinfo.length; i++) {
    // console.log(path.join(target,dirinfo[i]))
    var state= fs.statSync(path.join(target,dirinfo[i]));
    if (state.isFile()) {
      files.push(dirinfo[i])
    }else{
      dirs.push(dirinfo[i])
    }
  }
 
  // 文件夹操作
  for (var i = 0; i < dirs.length; i++) {
     console.log(`${prev} ├─ ${dirs[i]}`)
     // 递归
     var nextPath=path.join(target,dirs[i])
     var nextdeep=deep+1;
     // 下一级的 文件目录 以及层级
     loadTree(nextPath,nextdeep)
     // 递归调用
      
  }
  // 文件操作
  for (var i =files.length-1 ; i >= 0; i--) {
     if (i===0) {
       console.log(`${prev} └─  ${files[i]}`)
     }else{
       console.log(`${prev} ├─  ${files[i]}`)
     }
    
  }
}

/** 设置接口 */
module.exports = {
    /** 创建文件夹 */
    creatDir    : creatDir,
    /** 生成目录树 */
    loadTree    : loadTree,
    /** 生成文件 */
    creatFile   : creatFile
}