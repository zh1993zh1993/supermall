<template>
  <div id="home" class="wrapper">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                  class="tab-control1" v-show="isTabFixed"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view />
      <tab-control :titles="['流行','新款','精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
<!--    监听组件根元素的原生事件，必须加上.native-->
<!-- v-show：是否显示，不能直接写true或者隐藏，最好找一个变量来接收   -->
    <back-top @click.native="backClick" v-show=" isShowBackTop"/>
  </div>
</template>

<script>
  // 子组件
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'

  //公共组件
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'
  //导入的方法
  // 只有用export default导出才能去掉{}
  import {getHomeMultidata,getHomeGoods} from 'network/home'
  import {debounce} from "common/utils"


  export default {
    name: "Home",
    components:{
      // 和引入文件的顺序保持一致
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    // 与存储接收的数据
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0 ,list:[]},
          'new':{page:0 ,list:[]},
          'sell':{page:0 ,list:[]},
        },
        currentType:'pop',
        isShowBackTop:false,
        tabOffsetTop:0,
        isTabFixed:false,
        saveY:0
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    activated(){
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated(){
    this.saveY=this.$refs.scroll.getScrollY()
    },
    created() {
      //   1.请求多个数据
    this.getHomeMultidata()
    //  2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted(){
    //   1.图片加载完成的事件监听
    const refresh=debounce(this.$refs.scroll.refresh,50)
      //  3 .监听item中图片加载完成
      this.$bus.$on('itemImageLoad',()=>{
      refresh()
      })
    },
    methods:{
      // 事件监听相关方法
      tabClick(index){
       switch (index) {
         case 0:
           this.currentType='pop'
           break
         case 1:
           this.currentType='new'
           break
         case 2:
           this.currentType='sell'
           break
       }
       this.$refs.tabControl1.currentIndex=index;
       this.$refs.tabControl2.currentIndex=index;
      },
      backClick(){
       this.$refs.scroll.scrollTo(0,0)
      },
      contentScroll(position){
       //  因为position打印出来是负数。所以需要他负负得正，当他大于一千的时候，他就会显示
       // 1.判断backTop是否显示
       this.isShowBackTop=(-position.y)>1000
      //  2.觉得tabControl是否吸顶（position：fixed）
        this.isTabFixed=(-position.y)>this.tabOffsetTop
      },
      loadMore(){
        this.getHomeGoods(this.currentType)
      },
      //  获取tabControl的offsetTop
      //  所有组件都有一个属性$el：用于获取组件中的元素
      swiperImageLoad(){
        this.tabOffsetTop=this.$refs.tabControl2.$el.offsetTop
      },
      //   1.请求多个数据
     getHomeMultidata(){
       // 网络请求相关方法
       getHomeMultidata().then(res =>{
         //  banner:横幅 recommend：介绍
         this.banners=res.data.banner.list
         this.recommends=res.data.recommend.list
       })
     },
      //  2.请求商品数据
      getHomeGoods(type){
       const page=this.goods[type].page+1
        getHomeGoods(type,page).then(res =>{
         this.goods[type].list.push(...res.data.list)
          this.goods[type].page +=1

        //  完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<!--scoped:作用域，类名一样但作用域不一样可以使用-->
<style scoped>
  #home{
    /*padding-top: 44px;*/
    /*vh:viewport height 视口高度  */
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: #f6f6f6;
    /* 在浏览器原生滚动时，为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }
  /*.tab-control{*/
  /*  !*移动端一般都支持此属性*/
  /*  当移动到44px的时候，会转变成fixed属性*/
  /*  *!*/
  /*  !*position: sticky;*!*/
  /*  top: 44px;*/
  /*  z-index: 9;*/
  /*}*/
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control{
    position: relative;
    z-index: 9;
  }

  /*.content{*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
</style>
