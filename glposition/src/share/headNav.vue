<template>
  <div class="nav-common">
    <div class="nav-common" >
      <div class="logo">
        <div>LocusAR</div>
      </div>
      <div class="user">
        <!-- <span class="logoTitle">LocusAR</span>
        <span>{{userName}}</span>
        <span class="btn_logout cur" @click="loginOut()" >退出</span> -->
        <span style="margin-right:100px;color:#8488D1;cursor: pointer;" @click="$router.push({path:'/sdkList'});">SDK下载</span>
        <div @mouseover="block()" @mouseout="block2()" style="height:50px;float:right;margin-right:20px">
          <span class="goBack" ><i class="icon_user_default">{{userName.substring(0,1).toUpperCase()}}</i>{{userName}}</span>
          <div class="showBox" :class="{'display':display,'show':show}"  @mouseenter="block()" @mouseleave="block2()">
          <span class="btn_logout cur" @click="$router.push({path:'/system/userManager'})"><i class="account"></i>账号管理</span>
          <span  class="btn_logout cur" @click="loginOut()" ><i class="loginOut"></i>退出登录</span>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Base64 } from 'js-base64';
import {mapState,mapActions} from 'vuex'
export default {
  name: "headNav",
  data() {
    return {
        roleCode:'',
        userName:'',
        subjectCode:"3",
        display: false,
        show: true
    };
  },
  mounted(){
      function getCookie(name)
    {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  　　 return (arr=document.cookie.match(reg))?unescape(arr[2]):null;
    }
    let  token = localStorage.getItem('locationMiddlegroundToken')
    if(token){
    let arr=token.split('.')
    let tokenMsg=arr[1];
    let tokens = Base64.decode(tokenMsg);
    let Obj=JSON.parse(tokens)
    this.loginName=Obj.loginName
    this.roleCode = Obj.userCode
    this.userName = Obj.userName
     }
  this.$store.dispatch("navMenu/menuInit",{subjectCode:this.subjectCode,roleCode:this.roleCode}).then(res=>{
    this.$emit('showheadNav',this.menus)
  })
  },
  computed:{
    ...mapState('navMenu',{menus:'menus'}),
  },
  methods: {
    block () {
      this.display = true
      this.show = false
    },
    block2 () {
      this.display = false
      this.show = true
    },
    loginOut(){
      this.$confirm('确认退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push('/logout')
      }).catch(() => {
        return
      });

    }

  },

};
</script>

<style scoped>
.nav-common{background:#fff;color: #0F0D32; overflow: hidden;}
  .logo{ float:left; width: 260px;background: #343261;height:70px}
  .logo div{ background: url("../assets/logo.png") no-repeat center  center;text-indent:-999px;width: 100%; height: 100%;}


  .user{padding-left:200px;margin-top:20px;text-align: right; font-size: 14px;height: 44px; line-height: 22px}
  .logoTitle{
    font-size:22px;font-weight: 500;text-align: left;float: left;margin-left: 20px
  }
  .user span{margin-right:10px;position:relative; }
  .user span.logout{ font-size:16px}
  .cur{ cursor: pointer;
  }
  .icon_user_default{display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px;-moz-border-radius: 34px;-webkit-border-radius: 34px;border-radius: 34px;background: #8488D1;text-align: center;line-height: 34px;color: #fff;}
  /* .icon_user_default{display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px;text-align: center;line-height: 34px;color: #8488d1;font-weight: bold;} */
  .goBack{
    cursor: pointer;
  }
  .goBack:after {
    content: " ";
    display: inline-block;
    height: 10px;
    width: 10px;
    border-width: 0px 2px 2px 0;
    border-color: #8488D1;
    border-style: solid;
    -webkit-transform: matrix(-0.71, 0.71,0.71, 0.71, 0, 0);
    transform: matrix(-0.71, 0.71, 0.71, 0.71, 0, 0);
    position: absolute;
    right: -25px;
}
.display{
  display: block
}
.show{
  display: none
}
.showBox{
  text-align: center;
  top:50px;
  width: 100px;
  height: 76px;
  border: 1px solid #ccc;
  z-index: 999;
  position: absolute;
  right: 20px;
  background: #fff;
  line-height: 36px;
  padding: 5px 10px;
}
.account{
 width:14px;height: 14px;background: url("../assets/zhanghaoguanli.png") no-repeat center  center;display: inline-block;margin-right: 10px;
}
.loginOut{
  width:14px;height: 14px;background: url("../assets/tuichu1.png") no-repeat center  center;display: inline-block;margin-right: 10px;
}
  /* .icon_user_default{background: url("../assets/icon_user_default.png") no-repeat center  center;display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px}
  .icon_user_admin{background: url("../assets/icon_user_admin.png") no-repeat center  center;display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px}
  .icon_user_supadmin{background: url("../assets/icon_user_supadmin.png") no-repeat center  center;display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px} */
</style>
