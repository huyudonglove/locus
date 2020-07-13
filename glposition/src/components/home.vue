<template>
  <div>
    <headNav></headNav>
    <div class="pa_body">
        <div class="body-menu">
        <el-row class="tac">
          <el-col :span="24" >
            <el-menu 
            class="el-menu-demo"
            text-color="#333"
            active-text-color="#0074E4"
            router
            :default-active="$route.path"
            >
            <navMenu :menus="menus"></navMenu>
            </el-menu>
          </el-col>
        </el-row>
         <!-- <span  class="span_title" style="padding-left: 20px;color: rgb(51, 51, 51);vertical-align: middle;font-size:14px;cursor:pointer;padding: 0 20px;display:block;height: 56px;
    line-height: 56px;" @click="down()">SDK下载</span> -->
    </div>
        <div class="body-content">
      <el-main>
        <router-view/>
      </el-main>
      </div>
    </div>
    <!-- <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      >
      <p style="text-align:center;font-size:16px;">是否确定下载{{formSize.name}}<span style="padding-left:10px;">{{formSize.version}}</span></p>
      <div style="width:180px;margin:0px auto;margin-top:30px;">
        <a href="javascript:void(0)" download="" style="text-decoration:none" class="downBtn" @click="dialogVisible = false" >取消</a>
        <a :href="`/static${formSize.downloadUrl}`" download="" style="text-decoration:none" class="downBtn downBtn-primary" @click="dialogVisible = false;">下载</a>
      </div>
    </el-dialog> -->

  </div>

</template>

<script>
import navMenu from "@/share/navMenu.vue";
import headNav from "@/share/headNav.vue";
import {mapActions} from 'vuex';
import {sdkInfo} from "../http/request";
export default {
  name: "Home",
  data() {
    return {
      dialogVisible: false,
      formSize:{

      }
    };
  },
  created(){
    // this.getUserPower();
    // sdkInfo({}).then(res=>{
    //    if(res.code){
    //         this.$message.error(res.msg);
    //       }else{
    //         this.formSize=res.data
    //       } 
    // })
	},

  computed:{
	//  menus(){
	//  	 return this.$store.state.navMenu.menus.filter(v=>v.url==this.$route.path)
  //  }
   	 menus(){
	 	 return this.$store.state.navMenu.menus
	 }
  },
  methods: {
    // ...mapActions('currentUserPower',['getUserPower']),
    down(){
      this.dialogVisible=true
    },
    
	},
   components: {
    navMenu,
    headNav
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-main{
    padding-top: 10px;
  }
  .pa_body .body-menu{
  position:absolute;
  top:60px;
  left:0;
  bottom:0;
  width:232px;
  /* background-color:#545c64; */
/* background: url("../assets/menu-bg.jpg") repeat-y ; */
      }
  .pa_body .body-content{
  position:absolute;
  top:66px;
  left:230px;
  right:0;
  background-color:#fff;
  bottom:0;
  overflow:auto;
  border-left: 1px solid #eeeeee;
  }
.cur{ cursor: pointer;}
.el-menu{
  /* padding-left:50px; */
  /* background: url("../assets/menu-bg.jpg") repeat-y ; */
}

.span_title:hover {
    background-color: #ecf5ff;
}
.downBtn{
   display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    margin-right:10px
}
.downBtn-primary {
    color: #FFF;
    background-color: #409EFF;
    border-color: #409EFF;
}
</style>
