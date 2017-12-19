// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
//import router from './router/index' 与上一样
// nodejs模块查找机制，先找到router目录下的index.js文件
import Vuex from 'vuex'
import axios from 'axios'

import VueLazyload from 'vue-lazyload' //懒加载
Vue.use(VueLazyload,{//中间件来做
  //加载时候的过渡图片
  loading:'static/loading-svg/loading-bars.svg',
  // try:3 //default 1
  attempt:3 //default 1 替代了try
})

import infiniteScroll from  'vue-infinite-scroll'//滚动分页
Vue.use(infiniteScroll);
Vue.use(Vuex);

Vue.config.productionTip = false

const store = new Vuex.Store({
    state:{
      nickName:'',
      cartCount:0
    },
    mutations:{
      //更新用户信息
      updateUserInfo(state,nickName){
        state.nickName = nickName;
      },
      //更新购物车信息
      updateCartCount(state,cartCount){
        state.cartCount += cartCount;
      }
    }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  mounted(){
    this.checkLogin();
    this.getCartCount();
  },
  methods:{
    checkLogin(){
      axios.get("/users/checkLogin").then(res=> {
        var res = res.data;
        if (res.status == "0") {
          this.$store.commit("updateUserInfo", res.result);
        }else{
          if(this.$route.path!="/goods"){
            this.$router.push("/goods");
          }
        }
      });
    },
    getCartCount(){
      axios.get("/users/getCartCount").then(res=>{
        var res = res.data;
        if(res.status=="0"){
          this.$store.commit("updateCartCount",res.result);
        }
      });
    }
  },
  template: '<App/>',
  components: { App }
})
