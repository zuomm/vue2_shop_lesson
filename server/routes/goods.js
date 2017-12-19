var express = require('express');
var router = express.Router();

//引入数据库工具，用之前先安装
var mongoose = require('mongoose');

var Goods = require('./../models/goods');//引入表结构文件



//连接MongoDB数据库，后面会讲权限控制
mongoose.connect('mongodb://127.0.0.1:27017/vue2_shop_lesson');

//三个事件的监听：连接事件   (，错误事件，断开事件)
mongoose.connection.on("connected", function () {
    console.log("MongoDB connected success.")
});
//错误事件
mongoose.connection.on("error", function () {
    console.log("MongoDB connected fail.")
});
//断开事件
mongoose.connection.on("disconnected", function () {
    console.log("MongoDB connected disconnected.")
});
/* 数据库连接到此结束了 */



/* 功能一：查询商品列表数据 */
router.get('/list', function(req, res, next) {

  //res.send('用户路由'); 返回的并不是一个页面，而是一个字符串 //res.render是渲染的一个页面
  
  // Goods.find({},function(err,doc){ //{}写查询的条件
  //分页
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let priceLevel = req.param("priceLevel");//价格条件查询
  let sort = req.param("sort");
  let skip = (page-1)*pageSize;
  let params = {};//这里是无条件查询，之后会进行价格筛选
  
  let priceGt = '';
  let priceLte = '';

  if(priceLevel != 'all'){
    switch( priceLevel ){ 
      // priceLevel 是一个字符串类型，因为它还有等于'all'的时候
      case '0':
        priceGt = 0;  // ＞
        priceLte = 100; // ≤
        break;
      case '1':
        priceGt = 100;
        priceLte = 500;
        break;
      case '2':
        priceGt = 500;
        priceLte = 1000;
        break;
      case '3':
        priceGt = 1000;
        priceLte = 2000;
        break;
      case '4':
        priceGt = 2000;
        priceLte = 3000;
        break;
      case '5':
        priceGt = 3000;
        priceLte = 6000;
        break;
    };
    params = {
      salePrice:{
        $gt:priceGt, // , 是 且（and）
        $lte:priceLte
      }
    }
  } 
  //db.goods.find( { "salePrice" : { $gt : 70 , $lte : 500} } )

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err, doc) {
    if(err){
      res.json({
        status:'1',//状态值
        msg:err.message
      })
    }else{
      res.json({
        status:'0',
        result:{
          count:doc.length,//总长度
          list:doc
        }
      })
    }
  })

});

/* 功能二：加入购物车 */
router.post('/addCart',function(req,res,next){
  var userId = '100000077',productId = req.body.productId;
  var User = require('../models/user');//引入表结构文件
  User.findOne({userId:userId},function(err,userDoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      // console.log("userDoc"+userDoc);
      if(userDoc){
        //goodsItem 默认为空
        var goodsItem = '';

        //遍历购物车每一个商品的ID
        userDoc.cartList.forEach( function(item){
          if( item.productId == productId){
            //购物车商品已经存在，只做数量+1
            goodsItem = item;// 当前商品赋值给goodsItem保存起来
            item.productNum++;
          }
        });

        //goodsItem 有商品时，把商品存到数据库中去
        if(goodsItem){
          userDoc.save(function(err2,doc2){
            if(err2){
              res.json({
                status:'1',
                msg:err2.message
              })
            }else{
              res.json({
                status:'0',
                msg:'',
                result:'suc'
              })
            }
          })
        }else{
          //第二种情况：新增商品 到 购物车，先要确认下商品是否存在
          Goods.findOne({productId:productId},function(err1,doc){
            if(err1){ //商品不存在则报错
              res.json({
                status:'1',
                msg:err1.message
              })  
            }else{ // 商品存在时
              if(doc){ 
                doc.checked = 1;
                doc.productNum = 1;
                console.log(doc);
                userDoc.cartList.push(doc);//把商品数据doc直接插入cartList里面去
                userDoc.save(function(err2,doc2){ //用户保存商品
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    })
                  }else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'suc'
                    })
                  } 
                })
              }
            }
          })
        }
      }
    }
  })
});



module.exports = router;
