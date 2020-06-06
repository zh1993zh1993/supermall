<template>
<!--
ref:明确的拿到某个组件，通过this.$refs.组件名
children：明确的拿到某个子组件
-->
  <div class="wrapper" ref="wrapper">
   <div class="content">
     <slot></slot>
   </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "Scroll",
    props:{
      probeType:{
        type:Number,
        default:0
      },
      pullUpLoad:{
        type:Boolean,
        default: false
      }
    },
    data(){
      return {
        scroll:null
      }
    },
    mounted(){
    //   1.创建BScroll对象
    this.scroll =new BScroll((this.$refs.wrapper),{
      click:true,
      // probeType:3 直接写影响性能
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad
    })
    //  2.监听滚动的位置
      if (this.probeType===2 || this.probeType===3) {
      this.scroll.on('scroll',(position)=>{
        //$emit：通过自定义事件将事件传递出去，哪里需要接收直接@scroll="事件名称"
        this.$emit('scroll',position)
      })
      }
    //  监听scroll滚动到底部
      if (this.pullUpLoad){
          this.scroll.on('pullingUp',()=>{
           this.$emit('pullingUp')
          })
      }
    },
    methods:{
      scrollTo(x,y,time=300){
       // 判断是否为空，有值的情况下再进行下一步
       this.scroll && this.scroll.scrollTo(x,y,time)
      },
      finishPullUp(){
       this.scroll && this.scroll.finishPullUp()
      },
      refresh(){
        this.scroll && this.scroll.refresh()
      },
      getScrollY(){
        return this.scroll ? this.scroll.y : 0
      }
    }
  }
</script>

<style scoped>

</style>
