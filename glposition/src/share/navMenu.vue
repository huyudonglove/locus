<template>
  <div>
    <!-- 一级菜单 -->
    
    <template v-for="item in menus"  >
      <el-submenu v-if="item.childs && item.childs.length" :index="item.url" :key="item.url"  ref="myMenu" id="first"  >
        <template slot="title">
          <span >{{item.menuName}}</span>
        </template>
        <!-- 二级菜单 -->
        <template v-for="itemChild in item.childs">
          <el-submenu v-if="itemChild.childs && itemChild.childs.length" :index="itemChild.url" :key="itemChild.url" id="second">
            <template slot="title">
               <i :style="{'background':`url(${icon[itemChild.childs.url]}) no-repeat left center`}"></i>
              <span>{{itemChild.menuName}}</span>
            </template>
            <!-- 三级菜单 -->
            <el-menu-item v-for="itemChild_Child in itemChild.childs" :index="itemChild_Child.url" :key="itemChild_Child.url">
              <span slot="title">{{itemChild_Child.menuName}}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="itemChild.url" :key="itemChild.url" style="margin-left:-10px" ref="menuUl">
            <i :style="{'background':`url(${icon2[itemChild.url]}) no-repeat left center`}" v-if="$route.path==itemChild.url"></i>
            <i :style="{'background':`url(${icon[itemChild.url]}) no-repeat left center`}" v-else></i>
            <span slot="title">{{itemChild.menuName}}</span>
          </el-menu-item>
        </template>
      </el-submenu>
      
      <el-menu-item v-else :index="item.url" :key="item.url">
       <span slot="title">{{item.menuName}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "navMenu",
  props: ["menus"],
  data() {
    return {
      show:false,
      icon:{
        '/licenseManage':require('../assets/sq-2.png'),
        '/service/apikeyList':require('../assets/apiKey-2.png'),
        '/mapManageList':require('../assets/mapIcon-2.png'),
        '/cloudRecognitionList':require('../assets/cloud-2.png'),
        '/localRecognitionList':require("../assets/local-2.png"),
      },
      icon2:{
        '/licenseManage':require('../assets/sq.png'),
        '/service/apikeyList':require('../assets/apiKey.png'),
        '/mapManageList':require('../assets/mapIcon.png'),
        '/cloudRecognitionList':require('../assets/cloud.png'),
        '/localRecognitionList':require("../assets/local.png"),
      }
    };
  },
  methods: {
  },
  created(){
    
  },
  updated(){
    this.$nextTick(()=>{
      this.menuHeight = window.innerHeight - this.$refs.myMenu.offsetTop-60;
    })
  }

};
</script>
<style >
.el-menu{
    border-right:0px none !important;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #343261 !important;
}
.el-menu-item,.el-submenu__title{
  font-size: 16px ;
}


.el-submenu__title,.el-menu-item>span{
  color: #fff !important;
}

.el-menu>.el-menu-item>span{
  color: #8488D1 !important;
  font-weight: bold !important;
}

.el-menu>.is-active>span{
  color: #fff !important;
}

.el-submenu__title:hover{
   background-color:#343261 !important; 

}
.el-menu-item:hover {
  background-color:#343261 !important;

}
.el-menu .is-active:hover {
  background-color:#343261 !important;

}


ul.el-menu li.is-active{
   background: url('../assets/menuactive.png') no-repeat;
   font-weight: bold;
}

ul.el-menu>div>li.is-opened{
   background: none !important;
}
</style>
<style scoped>
/* .el-menu .el-menu-item:first-child{
  background-color: #F0F0F0;
  border-radius: 10px 10px 0px 0px;
  border-bottom: 1px solid rgba(223,220,220,1);
} */

/* .el-menu .el-menu-item{
  width: 100%;
  background-color: #F0F0F0;
  border-bottom: 1px solid rgba(223,220,220,1);
} */
/* .el-menu-vertical-demo>div>.el-menu-item{
  background-color: #FFF;
  border-bottom:none;
} */
/* .el-menu .el-menu-item:last-child{
  background-color: #F0F0F0;
  border-radius: 0px 0px 10px 10px; 
} */
.el-menu i{
  display: inline-block;width: 22px;height: 22px;
}
.blur{
    filter:alpha(opacity=0);
    opacity:1;
    position: absolute;
    width: 260px;
    height: 50px;
    background: red;
    top:-38px;
    z-index: 999;
    -webkit-pointer-events: none;
    -moz-pointer-events: none;
    -ms-pointer-events: none;
    -o-pointer-events: none;
    pointer-events: none;
    cursor: default;
}
</style>
