<template>
  <div>
    <!--模态框-->
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
        <div class="md-modal-inner">
            <div class="md-top">
                <!-- <div class="md-title">登录</div> -->
                <button class="md-close" @click="closeModal">Close</button>
            </div>

            <div class="md-content">
                <div class="confirm-tips">
                    <slot name="message"></slot>
                </div>
                <div class="btn-wrap">
                    <slot name="btnGroup"></slot>
                </div>
            </div>
        </div>
    </div>
    <!--遮罩层-->
    <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
  </div>
</template>

<script>
export default {
  name: '',
  props:['mdShow'],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods:{
    closeModal(){
      this.$emit('close'); //触发close事件 
       /**
        * close事件接收
        * 在父级组建中
        * v-on:close="closeModal"
        */
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
