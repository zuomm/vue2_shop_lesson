var mongoose = require('mongoose');
//mongoose：放的通通是表结构，映射mongoDB的
var Schema = mongoose.Schema;//表的语法

var userSchema = new Schema({//定义表
    "userId":{type:String},
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[
        {
            "productId":String,
            "productName":String,
            "salePrice":String,
            "productImage":String,
            "productNum":String,
            "checked":String,

        }
    ],
    "addressList":[
        {
           "addressId":String,
           "userName": String,
           "streetName":String,
           "postCode":Number,
           "tel":Number,
           "isDefault":Boolean
        } 
    ]
});

module.exports = mongoose.model('User',userSchema);

/**
 * mondoDB数据类型：
 * 
 */