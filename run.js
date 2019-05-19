'use strict'

/** MySQL工具模块 */
var MySQL_tool = require('./controllers/MySQL_tool');
/** 文件管理模块 */
var file = require('./lib/file');
/** 保存文件模块 */
var save = require('./save');
/** 配置文件模块 */
var config = require('./Config');

//save.loadTree(config.file.path,1);
save.creatDir();

save.creatFile();



