<template>
  <div class="nav-bar">
    <div class="left"><slot name="left"></slot></div>
    <div class="center"><slot name="center"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>

<script>
  export default {
    name: "NavBar"
  }
</script>

<style scoped>
.nav-bar{
  display: flex;
  /* 导航的高度：一般都是44px*/
  line-height: 44px;
  text-align: center;
  box-shadow: 0 1px 1px rgba(100,100,100,0.1);
}
  .left,.right{
    width: 60px;

  }
  .center{
    /* 中间 的占剩余位置*/
    flex: 1;

  }
</style>
