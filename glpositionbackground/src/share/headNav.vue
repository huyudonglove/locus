<template>
  <div class="nav-common">
    <div class="nav-common" >
      <div class="logo">
        <div>Locus</div>
      </div>
      <div class="user">
        <span class="logoTitle">Locus后台</span>
        <span>{{userName}}</span>
        <span class="btn_logout cur" @click="loginOut()" >退出</span>
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
    };
  },
  mounted(){
      function getCookie(name)
    {
      var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  　　 return (arr=document.cookie.match(reg))?unescape(arr[2]):null;
    }
    let  token = getCookie('glpositionBackgroundToken')
    if(token){
    let arr=token.split('.')
    let tokenMsg=arr[1];
    let tokens = Base64.decode(tokenMsg);
    let Obj=JSON.parse(tokens)
    this.loginName=Obj.loginName
    this.roleCode = Obj.userCode
    this.userName = Obj.userName
     }
  this.$store.dispatch("navMenu/menuInit")
  },
  computed:{
    ...mapState('navMenu',{menus:'menus'}),
  },
  methods: {
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
.nav-common{background:#fff;color: #FF644E; overflow: hidden; height:60px;overflow:hidden}
  .logo{ float:left; width: 210px;background: #fff;height:59px;border-bottom:2px solid #f0f0f0}
  .logo div{ background: url("../assets/logo.png") no-repeat center  center;text-indent:-999px;width: 100%; height: 100%;}


  .user{padding-left:200px;margin-top:20px;text-align: right; font-size: 14px;border-bottom: 2px solid #f0f0f0;height: 39px; line-height: 22px}
  .logoTitle{
    font-size:22px;font-weight: 500;text-align: left;float: left;margin-left: 20px
  }
  .user span{margin-right:10px;position:relative; }
  .user span.logout{ font-size:16px}
  .cur{ cursor: pointer;
  }
  /* .icon_user_default{background: url("../assets/icon_user_default.png") no-repeat center  center;display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px}
  .icon_user_admin{background: url("../assets/icon_user_admin.png") no-repeat center  center;display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px}
  .icon_user_supadmin{background: url("../assets/icon_user_supadmin.png") no-repeat center  center;display: inline-block;width: 34px;height: 34px;position:absolute; left:-50px;top: -8px} */
</style>
