<!-- 
    template :页面模板
    script  ：脚本
    <style scoped> ：样式
-->
<template>
  <div>
    <body>
        <nav-header></nav-header> 
        <nav-bread>
            <span>商品列表</span>
        </nav-bread>
        <div class="accessory-result-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">排序:</span>
                    <a href="javascript:void(0)" class="default cur" @click="defaultSortGoods()">默认</a>
                    <a href="javascript:void(0)" class="price" :class="{'sort-up':sortFlag}" @click="sortGoods()">价格 <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
                    <a href="javascript:void(0)" class="filterby" @click.stop="showFilterPop">筛选</a><!-- .stop阻止冒泡 -->
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter" id="filter" :class="{'filterby-show':filterBy}">
                        <dl class="filter-price">
                            <dt>价格区间:</dt>
                            <dd ><a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur':priceChecked=='all'}">选择价格</a></dd>
                            <dd v-for="(item,index) in priceFilter" :key="index">
                                <!-- index是变量，不能加引号 -->
                                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked==index}">￥ {{item.startPrice}} - {{item.endPrice}} 元</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <!--我们需要使用key来给每个节点做一个唯一标识，Diff算法就可以正确的识别此节点，找到正确的位置区插入新的节点。-->
                                <li v-for = "(item,index) in goodsList" :key="index">
                                    <div class="pic">
                                        <!-- <a href="#"><img v-bind:src="'/static/'+ item.productImage" alt=""></a> -->
                                        <!-- 图片懒加载 -->
                                        <a href="#"><img v-lazy="'/static/'+ item.productImage" alt=""></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.salePrice | currency('￥') }}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a><!-- productId作为实参传入 -->
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="view-more-normal"
                    v-infinite-scroll="loadMore" 
                    infinite-scroll-disabled="busy"
                    infinite-scroll-distance="20">
                    <img src="./../../static/loading-svg/loading-spinning-bubbles.svg" v-show="loading">
                </div>
            </div>
        </div>
        <div class="md-overlay" @click.stop="closePop" v-show="overLayFlag"></div><!--遮罩-->
        <nav-footer></nav-footer>
        <!-- 未登录弹框 -->
        <modal :mdShow ="mdShow" v-on:close="closeModal"><!--开关变量 mdShow-->
            <p slot="message">
                请先登录，否则无法加入到购物车中！
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:void(0);" @click="mdShow=false">关闭</a>
            </div>
        </modal>
        <!-- 加入购物车成功弹窗 -->
        <modal :mdShow ="mdShowCart" v-on:close="closeModal"><!--开关变量 mdShow-->
            <p slot="message">
                <svg class="icon-status-ok">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
                </svg>
                <span>加入购物车成功!</span>
            </p>
            <div slot="btnGroup">
                <a class="btn btn--m" href="javascript:void(0);" @click="mdShowCart = false">继续购物</a>
                <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
            </div>
        </modal>
    </body>
  </div>
</template>

<script>
//样式导入
import './../assets/css/base.css'
// import './../assets/css/nav-header.css'
// import './../assets/css/nav-bread.css'
// import './../assets/css/nav-footer.css'
import './../assets/css/goods-list.css'

//模块导入
import NavHeader from './../components/NavHeader.vue'
import NavFooter from './../components/NavFooter.vue'
import NavBread from './../components/NavBread.vue'
import Modal from './../components/Modal.vue'
import {currency} from './../util/currency'

//axios调用接口,ajax请求
import axios from 'axios'

export default {
  name: 'GoodsList',
  data () {
    return {
        goodsList: [],
        //价格区间
        priceFilter:[
            {
                startPrice:'0.00',
                endPrice:'100.00'
            },
            {
                startPrice:'100.00',
                endPrice:'500.00'
            },
            {
                startPrice:'500.00',
                endPrice:'1000.00'
            },
            {
                startPrice:'1000.00',
                endPrice:'2000.00'
            },
            {
                startPrice:'2000.00',
                endPrice:'3000.00'
            },
            {
                startPrice:'3000.00',
                endPrice:'6000.00'
            }
        ],
        //默认选中样式
        priceChecked:'all',
        filterBy : false,
        overLayFlag:false,
        page:1,//默认为第一页
        pageSize:8,//默认为8个
        sortFlag:true,//排序开关
        busy:true,
        loading:false,
        mdShow:false,
        mdShowCart:false,
    }
  },
  components:{
      NavHeader,
      NavFooter,
      NavBread,
      Modal
  },
  filters:{
      currency:currency
  },
  mounted(){
      this.getGoodsList();
  },
  methods:{
      //methods只是申明了这个方法
      getGoodsList(flag){
          /**
           * 法一：
           *  axios.get('/goods') 使用
           *  proxyTable: {
           *        '/goods':{//转发出去,代理
           *        target:'http://localhost:3000/'
           *    }
           * },
           * 法二：
           * axios.get('http://localhost:3000/goods')
           * 让后端处理跨域
           */
          var param = {
              //参数名称一定要保证和后台传值一样
              page: this.page,
              pageSize: this.pageSize, 
              sort: this.sortFlag?1:-1,  //排序做处理，点击排序改变 sortFlag 值
              priceLevel: this.priceChecked,
          }

          this.loading = true;//滚动缓冲动画

          axios.get('/goods/list',{
              params:param //params自动会把param编码到url地址中
          }).then( (result) => {
            console.log(result); // 拿到数据，然后取值
            //记得每次改过server都要重启服务端，改webpack配置文件需要重启前端服务
            
            // 拿到数据
            var res = result.data;
            this.loading = false;
            if(res.status == '0'){
                if(flag){
                   this.goodsList = this.goodsList.concat(res.result.list); 
                    if(res.result.count == 0){
                        this.busy = true;
                    }else{
                        this.busy = false;
                    }
                }else{
                    this.goodsList = res.result.list;
                    this.busy = false;
                }
            }else{
                this.goodsList = [];
            }

          })
      },
      defaultSortGoods(){
          this.sortFlag = true;
          this.page = 1;
          this.getGoodsList();
      },
      sortGoods(){
          this.sortFlag = !this.sortFlag;
          //点击一次从新拉数据了
          this.page = 1;
          this.getGoodsList();
      },
      loadMore(){
        this.busy = true;
        setTimeout(() => {
            this.page++;
            this.getGoodsList(true);
        }, 500)
      },
      setPriceFilter(index){
          console.log(index);
          this.priceChecked = index;
          //点击一次，发起一次数据请求
          this.page = 1;//初始化配置
          this.getGoodsList();
      },
      //加入购物车接口
      addCart(productId){
          axios.post("http://localhost:8080/goods/addCart",{
                productId:productId //传递参数值
          }).then((res)=>{
                // console.log(res); // 可以先把res打印出来看一下
                var res = res.data;
                if(res.status == 0 ){
                    // alert('加入成功！'); 
                    this.mdShowCart = true;   
                }else{
                    // alert('Error msg:'+ res.msg);
                    this.mdShow = true;
                }
          }).catch((err)=>{
               console.log(err); 
          })
      },
      closeModal(){
          this.mdShow = false;
          this.mdShowCart = false;   
      },
      showFilterPop(){
          this.filterBy = true;
          this.overLayFlag = true;
      },
      closePop(){
          this.filterBy = false;
          this.overLayFlag = false;
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

</style>
