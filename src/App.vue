<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> logo图标-->
    <!-- router-view 写的是所有的组件在main.js引入，所有的页面由router-view进行控制 -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
</style>
