<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>下单成功</span>
        </nav-bread>
        <div class="container">
        <div class="page-title-normal">
            <h2 class="page-title-h2"><span>订单提交成功，请尽快付款！</span></h2>
        </div>
        <!-- 进度条 -->
        <div class="check-step">
            <ul>
                <li class="cur"><span>确认</span> 收货地址</li>
                <li class="cur"><span>核对</span> 订单信息</li>
                <li class="cur"><span>支付</span> 方式</li>
                <li class="cur"><span>成功提交</span> 订单</li>
            </ul>
        </div>

        <div class="order-create">
            <div class="order-create-pic"><img src="/static/ok-2.png" alt=""></div>
            <div class="order-create-main">
                <h3>恭喜! <br>订单提交成功，请尽快付款！</h3>
                <p>
                    <span>订单号：{{ orderId }}</span>
                    <span>应付金额：{{ orderTotal | currency('¥') }}</span>
                </p>
                <div class="order-create-btn-wrap">
                    <div class="btn-l-wrap">
                        <a href="javascript:;" class="btn btn--m">购物车列表</a>
                    </div>
                    <div class="btn-r-wrap">
                        <a href="javascript:;" class="btn btn--m">商品列表</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import './../assets/css/base.css'
import './../assets/css/checkout.css'
import NavHeader from './../components/NavHeader'
import NavFooter from './../components/NavFooter'
import NavBread from './../components/NavBread'
import Modal from './../components/Modal'
import {currency} from './../util/currency'
import axios from 'axios'

export default {
  name: '',
  components: {
      NavHeader,
      NavBread,
      NavFooter,
      Modal
  },
  data () {
    return {
        orderId:'',
        orderTotal:0
    }
  },
  filters:{
      currency:currency
  },
  mounted(){
    var orderId = this.$route.query.orderId;
    if( !orderId ){
        return;
    }
    axios.get('/users/orderDetail',{
        params:{
            orderId:orderId
        }
    }).then((response)=>{
        var res = response.data;
        if( res.status == '0' ){
            // console.log(res.result.orderId);
            // console.log(res.result.orderTotal);
            this.orderId = res.result.orderId;
            this.orderTotal = res.result.orderTotal;
        }
    }).catch((err)=>{
        console.log(err);
    });
  },
  methods:{
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
