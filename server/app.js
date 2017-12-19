var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');//引入路由
var goods = require('./routes/goods');//引入路由
var users = require('./routes/users');//引入路由

var ejs = require('ejs');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//view engine视图模板修改为html 
app.engine('.html', ejs.__express);
app.set('view engine', 'html');//html模板引擎包含在了ejs里面

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev')); //日志中间件

//注意这两个顺序有要求
app.use(bodyParser.json());  //bodyParser中间件解析json数据，没有这个不能拿到json数据
app.use(bodyParser.urlencoded({ extended: false }));//urlencoded:是从请求里面拿url编码 ，key:value格式的数据会传到地址后面去

app.use(cookieParser());//拿请求的cookie
app.use(express.static(path.join(__dirname, 'public')));//配置了一个public公共资源的路径，主要是静态资源
/* 
  总结：你的请求会流水似的经过这些中间件，依次被这些中间件处理
*/

//跨域问题
app.all('*', function(req, res, next) {//跨域问题，开发阶段不使用此方式跨域
  // CORS配置
  res.header("Access-Control-Allow-Origin", "*");//任意来源都容许，但是不安全需要加token验证
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

//登录拦截 中间件 （针对8080端口下存在cookie）：对某些页面必须要登录才能访问
app.use(function (req,res,next) {
  if(req.cookies.userId){ //登录后就会有cookie
      next(); //直接跳到下一个中间件
  }else{
      console.log("url:"+req.originalUrl);

      if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.originalUrl.indexOf('/goods/list')>-1){
        //无需登录，其他页面全部要登录
        next();
      }else{
        res.json({
            status:'10001',
            msg:'当前未登录',
            result:''
        });
      }
  }
});


app.use('/', index);//请求/路径，调用的是index.js路由routes文件夹下
app.use('/goods', goods);//请求/users路径，调用的是users.js路由
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
