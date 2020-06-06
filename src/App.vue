<template>
  <div id="app" class="wrapper">
<!--keep-alive：让Home不要随意销毁掉-->
<!--    exclude="Detail":将这个组件排除在外，点击返回销毁-->
    <keep-alive exclude="Detail">
      <router-view/>
    </keep-alive>
   <main-tab-bar/>
  </div>
</template>
<script>
import MainTabBar from 'components/content/mainTabbr/MainTabBar'
  export default {
    name:'app',
    components:{
      MainTabBar
    }
  }
</script>
<style>
@import "./assets/css/base.css";
</style>
