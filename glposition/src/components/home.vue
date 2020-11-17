<template>
  <div>
    <headNav @showheadNav='showheadNav'></headNav>
    <div class="pa_body">
        <div class="body-menu">
        <el-row class="tac">
          <el-col :span="24" >
            <el-menu 
            style="margin-top:35px"
            class="el-menu-demo"
            text-color="#8488D1"
            active-text-color="#FFFFFF"
            router
            :default-active="$route.path"
            :default-openeds='openeds'
            @close="handleClose"
            >
            <navMenu :menus="menus"></navMenu>
            </el-menu>
          </el-col>
        </el-row>
         <!-- <span  class="span_title" style="padding-left: 20px;color: rgb(51, 51, 51);vertical-align: middle;font-size:14px;cursor:pointer;padding: 0 20px;display:block;height: 56px;
    line-height: 56px;" @click="down()">SDK下载</span> -->
    </div>
        <div class="body-content">
        <div class="contentDiv">
           <el-main>
            <router-view/>
          </el-main>
        </div>
       
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

      },
      openeds:['/licenseManage','/cloudRecognitionList','/mapManageList','/service/apikeyList','/localRecognitionList']
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
    // console.log(this.menus,'this.menus')
   
    
	},
  mounted(){
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
    // down(){
    //   this.dialogVisible=true
    // },
    showheadNav(val){
      if(this.menus.length){
      this.openeds=this.menus.map(v=>v.url)
      // console.log(this.openeds,'openeds')
      }
    },
    handleClose(){
      console.log(11,222)
    }
	},
   components: {
    navMenu,
    headNav
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .contentDiv{
      background-color:#fff;
      height: 100%;
      box-sizing: border-box;
  }
  .pa_body .body-menu{
    position:absolute;
    top:60px;
    left:0;
    bottom:0;
    width:260px;
    background-color:#343261;
/* background: url("../assets/menu-bg.jpg") repeat-y ; */
      }
  .pa_body .body-content{
     position:absolute;
      top:60px;
      left:260px;
      right:0;
      background-color: #f0f3fa !important;
      bottom:0;
      overflow:auto;
      border-left: 1px solid #eeeeee;
      padding: 30px 30px 30px 30px;
      }
  .pa_body .body-content>.el-main{
    /* padding-top: 10px; */
    /* height: 100%; */
    
  }
.cur{ cursor: pointer;}
.el-menu{
  /* padding-left:50px; */
  /* background: url("../assets/menu-bg.jpg") repeat-y ; */
}

.span_title:hover {
    background-color: red;
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
