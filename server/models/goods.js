var mongoose = require('mongoose');
//mongoose：放的通通是表结构，映射mongoDB的
var Schema = mongoose.Schema;//表的语法

var productSchema = new Schema({//定义表
    "productId":{type:String},
    "productName":String,
    "salePrice":Number,
    "checked":String,
    "productNum":Number,
    "productImage":String
});

module.exports = mongoose.model('Good',productSchema);

/**
 * mondoDB数据类型：
 * 
 */