<template>
  <div >
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <el-page-header @back="$router.push({path:'/recognitionInfo',query:JSON.parse($route.query.msg)})" content="识别图详情" style="font-size:20px;font-weight:bold;color:#000;"></el-page-header>
    </div>
    <el-row :gutter="20" style="margin-top:20px;">
    <el-col :span="6">
      <el-form  :model="formSize" label-width="120px">
        <el-form-item label="识别图名称：">
          {{formSize.name}}
        </el-form-item>
        <el-form-item label="识别图ID：">
          {{formSize.identifiedImageId}}
        </el-form-item>
        <el-form-item label="状态：" >
          <span v-if="formSize.status==1">正常</span>
          <span v-if="formSize.status==0">待生效</span>
          <span v-if="formSize.status==2">异常</span>
          <span v-if="formSize.status==3">更新</span>
          <span v-if="formSize.status==4">停止</span>
        </el-form-item>
        <el-form-item label="类型：" >
          <span v-if="formSize.type==1">单张图片</span>
          <span v-if="formSize.type==2">双面图片</span>
          <span v-if="formSize.type==3">正三棱柱</span>
          <span v-if="formSize.type==4">长方体</span>
        </el-form-item>
        <el-form-item label="创建时间：">
          {{formSize.createTime}}
        </el-form-item>
        <el-form-item label="修改时间：" >
          {{formSize.updateTime}}
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="6">
      <el-form  :model="formSize" label-width="120px" :style="{'margin-left':'90px','margin-top':type==4?'0px':'70px'}">
      <el-form-item label="长度：" v-if="type ==2||type ==4">
        {{formSize.identifiedImageLength}}米
      </el-form-item>
       <el-form-item label="宽度：" v-if="type !==3" >
        {{formSize.identifiedImageWidth}}米
       </el-form-item>
      <el-form-item label="高度："  v-if="type ==3 || type ==4">
        {{formSize.identifiedImageHeight}}米
      </el-form-item>
       <el-form-item label="底⾯边⻓："  v-if="type ==3">
        {{formSize.identifiedImageBottomSideLength}}米
      </el-form-item>
    <showImgScore @showDialogClose="showDialogClose" :id="formSize.id" :types="formSize.type" ></showImgScore>
    </el-form>
    </el-col>
    <el-col :span="12">
      <div>
        <el-button type="primary" @click="isShowUp=true;">查看识别度和识别点</el-button>
        <el-button type="danger" @click="del(formSize.id,formSize.name)">删除</el-button>
      </div>
      <div style="margin-top:20px;position:relative">
         <div  id="myImageEchart2" style="overflow:hidden">
            <div v-if="type==1">
            <div   :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="width:250px;height:250px;border:#606266 solid 1px;background-size:100% 100%;background-repeat:no-repeat;">
             </div>
            </div>
            <div v-if="type==2">
              <div :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="width:200px;height:200px;border:#606266 solid 1px;float:left;margin-right:10px;text-align:center;line-height:200px;background-size:100% 100%;background-repeat:no-repeat;" class="infoPicD">
               <span class="infoPicSpan">正</span>
              </div>
              <div :style="{'background-image':backImgUrl?`url(/static/${backImgUrl})`:''}" style="width:200px;height:200px;border:#606266 solid 1px;float:left;text-align:center;line-height:200px;background-size:100% 100%;background-repeat:no-repeat;" class="infoPicD">
               <span class="infoPicSpan">背</span>
              </div>
              <div style="position:absolute;left:-20px;top:-33px;word-wrap:break-word;width:10px;height:150px;line-height:90px;">↑宽↓</div>
              <div style="position:absolute;left:0px;bottom:-22px;">←<span style="padding-left:77px;padding-right:77px">长</span>→</div>
            </div>
            <div v-if="type==3" style="width:454px;">
              <div class="topSanlengzhu"><div class="topSanlengzhu2" ></div></div>
              <div style="width:454px;font-size:0;">
                <div class="sanlengzhu infoPicD" :style="{'background-image':leftImgUrl?`url(/static/${leftImgUrl})`:''}" style="border-right:none;">
                <span class="infoPicSpan">左</span>
                </div>
                <div class="sanlengzhu infoPicD" :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="border-right:none;">
                <span class="infoPicSpan">正</span>
                </div>
                <div class="sanlengzhu infoPicD" :style="{'background-image':rightImgUrl?`url(/static/${rightImgUrl})`:''}">
                <span class="infoPicSpan">右</span>
                </div>
              </div>
               <div style="position:absolute;left:-20px;top:50px;word-wrap:break-word;width:10px;height:170px;line-height:76px;">↑高↓</div>
              <div style="position:absolute;left:0px;bottom:45px;">←<span style="padding-left:43px;padding-right:43px">边长</span>→</div>
              <div class="bottomSanlengzhu" ><div class="bottomSanlengzhu2" ></div></div>
            </div>
            <div v-if="type==4" class="">
              <div class="cubSide"></div>
              <div style="width:500px;font-size:0;">
                <div class="cub infoPicD" :style="{'background-image':backImgUrl?`url(/static/${backImgUrl})`:''}" style="border-right:none;">
                <span class="infoPicSpan">背</span>
                </div>
                <div class="cub infoPicD" :style="{'background-image':leftImgUrl?`url(/static/${leftImgUrl})`:''}" style="border-right:none;">
                 <span class="infoPicSpan">左</span>
                </div>
                <div class="cub infoPicD" :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="border-right:none;">
                 <span class="infoPicSpan">正</span>
                </div>
                <div class="cub infoPicD" :style="{'background-image':rightImgUrl?`url(/static/${rightImgUrl})`:''}">
                 <span class="infoPicSpan">右</span>
                </div>
              </div>
              <div class="cubSide"></div>
              <div style="position:absolute;left:-20px;top:108px;word-wrap:break-word;width:10px;height:150px;line-height:50px;">↑高↓</div>
              <div style="position:absolute;left:120px;bottom:95px;">←<span style="padding-left:36px;padding-right:36px">宽</span>→</div>
              <div style="position:absolute;left:240px;bottom:-20px"><span style="margin-right:39px">←</span><span style="margin-right:38px">长</span><span>→</span></div>
            </div>
          </div>
      </div>
      <div style="margin-top:30px;">
         <el-button v-if="type==3||type==4" @click="save('left');isShow=true;">更换左⾯识别图</el-button>
         <el-button @click="save('front');isShow=true">更换正面识别图</el-button>
         <el-button v-if="type==3||type==4" @click="save('right');isShow=true">更换右⾯识别图</el-button>
         <el-button v-if="type==2||type==4" @click="save('back');isShow=true">更换背面识别图</el-button>
      </div>
      <div v-if="isShowUp">
       <showImgDialog @showDialogClose="showDialogClose" :id="formSize.id" :types="formSize.type" ></showImgDialog>
      </div>
       <div v-if="isShow">
       <upDialog @dialogClose="dialogClose" :id="formSize.id" :formSize="formSize" :direction="direction" ></upDialog>
      </div>
    </el-col>
  </el-row>
  <el-form :style="{'width':'50%','position': 'absolute','top':type==4?'540px':'500px'}" label-width="120px">
     <el-form-item label="备注：" >
          <div class="myInput">
          <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="formSize.remark"
          :rows="4"
          show-word-limit
          maxlength="500"
          style="width:80%"
          >
          </el-input>
          <el-button type="text" @click="edit()">修改</el-button>  
          </div>
        
        </el-form-item>
  </el-form>
  
  </div>
</template>
<script>
import {mapState} from 'vuex';
import {identifiedImageDelete,updateRemark,identifiedImageUpdate} from '../../http/request'
import showImgDialog from './showImgDialog'
import showImgScore from './showImgScore'
import upDialog from './upDialog'
import { Base64 } from 'js-base64'
export default {
  name:'recognitionMsg',
  inject:['replace','reload'],
  components:{
    showImgDialog,
    upDialog,
    showImgScore
  },
  data(){
    return{
      formSize:{
        name:'',
        createTime:'',
        updateTime:'',
      },
      direction:'',
      type:null,
      isShowUp:false,
      isShow:false,
      form:{},
      remark:'',
      frontImgUrl:'',
      leftImgUrl:'',
      rightImgUrl:'',
      backImgUrl:'',
    }
  },
  computed:{
  },
  watch:{
    type(){
    //  console.log(this.$route.query.frontImgFileId,'this.$route.query.frontImgFileId')
    //  console.log(this.$route.query.leftImgFileId,'this.$route.query.leftImgFileId')
    //  console.log(this.$route.query.rightImgFileId,'this.$route.query.rightImgFileId')
    //  console.log(this.$route.query.backImgFileId,'this.$route.query.backImgFileId')
     if(this.type==1){
        this.frontImgUrl =this.$route.query.frontImgFileId?Base64.decode(this.$route.query.frontImgFileId): Base64.decode(this.formSize.url1);
     }else if(this.type==2){
        this.frontImgUrl =this.$route.query.frontImgFileId?Base64.decode(this.$route.query.frontImgFileId): Base64.decode(this.formSize.url1);
        this.backImgUrl = this.$route.query.backImgFileId?Base64.decode(this.$route.query.backImgFileId): Base64.decode(this.formSize.url2);
     }else if(this.type==3){

       this.frontImgUrl =this.$route.query.frontImgFileId?Base64.decode(this.$route.query.frontImgFileId): Base64.decode(this.formSize.url1);
       this.leftImgUrl =this.$route.query.leftImgFileId?Base64.decode(this.$route.query.leftImgFileId): Base64.decode(this.formSize.url2);
       this.rightImgUrl=this.$route.query.rightImgFileId?Base64.decode(this.$route.query.rightImgFileId): Base64.decode(this.formSize.url3);
     }else if(this.type==4){
      //  console.log(this.$route.query,'this.$route.query')
       this.frontImgUrl =this.$route.query.frontImgFileId?Base64.decode(this.$route.query.frontImgFileId): Base64.decode(this.formSize.url1);
       this.leftImgUrl =this.$route.query.leftImgFileId?Base64.decode(this.$route.query.leftImgFileId): Base64.decode(this.formSize.url2);
       this.rightImgUrl=this.$route.query.rightImgFileId?Base64.decode(this.$route.query.rightImgFileId): Base64.decode(this.formSize.url3);
       this.backImgUrl = this.$route.query.backImgFileId?Base64.decode(this.$route.query.backImgFileId): Base64.decode(this.formSize.url4);
     }
    }
  },
  methods:{
    showDialogClose(){
      this.isShowUp = false;
    },
    dialogClose(){
      this.reload()
      this.isShow = false;
    },
    del(id,name){
      identifiedImageDelete({id,name}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.$router.push({path:'/recognitionInfo',query:JSON.parse(this.$route.query.msg)})
        }
      })
    },
    edit(){
      updateRemark({...this.form,remark:this.formSize.remark}).then(res=>{
         if(res.code){
          this.$message.error(res.msg);
        }else{
          this.remark=this.formSize.remark
          this.replace('remark',this.remark);
          this.reload()  
        }
      })
    },
    save(msg){
     this.direction=msg
    }
  },
  created(){
    this.formSize=JSON.parse(this.$route.query.row)
    this.type=this.formSize.type
    this.form=JSON.parse(this.$route.query.row)
    // this.formSize.url1?this.formSize.url1=`/static/${Base64.decode(this.formSize.url1)}`:null
    // this.formSize.url2?this.formSize.url2=`/static/${Base64.decode(this.formSize.url2)}`:null
    // this.formSize.url3?this.formSize.url3=`/static/${Base64.decode(this.formSize.url3)}`:null
    // this.formSize.url4?this.formSize.url4=`/static/${Base64.decode(this.formSize.url4)}`:null
    this.$route.query.remark?this.formSize.remark =this.$route.query.remark:this.formSize.remark =this.formSize.remark
  }
  
}
</script>
<style>
.imgDiv{
  width:200px;
  display:inline-block;
  margin:0px 25px 0;
}
#myImageEchart2 .sanlengzhu{
  font-size: 14px;
  width:150px;
  height:170px;
  border:#606266 solid 1px;
  text-align:center;
  line-height:170px;
  display:inline-block;
  background-size:100% 100%;
  background-repeat:no-repeat;
}
#myImageEchart2 .topSanlengzhu {
  margin:0 auto;
  position: relative;
  width: 0;
  height: 0;
  border: 76px solid transparent;
  border-bottom: 76px solid #606266;
  border-top:none;
}
#myImageEchart2 .topSanlengzhu2 {
  position: absolute;
  left:-75px;
  top:1px;
  width: 0;
  height: 0;
  border: 75px solid transparent;
  border-bottom: 75px solid #ffffff;
  border-top:none;
}
#myImageEchart2 .bottomSanlengzhu {
  margin:0 auto;
  position: relative;
  width: 0;
  height: 0;
  border: 76px solid transparent;
  border-top: 76px solid #606266;
  border-bottom:none;
}
#myImageEchart2 .bottomSanlengzhu2 {
  position: absolute;
  left:-75px;
  top:-76px;
  width: 0;
  height: 0;
  border: 75px solid transparent;
  border-top: 75px solid #ffffff;
  border-bottom:none;
}
#myImageEchart2 .cub{
  font-size: 14px;
  width:120px;
  height:120px;
  border:#606266 solid 1px;
  text-align:center;
  line-height:80px;
  display:inline-block;
  background-size:100% 100%;
  background-repeat:no-repeat;
}
#myImageEchart2 .cubSide{
  width:120px;
  height:120px;
  border:#606266 solid 1px;
  margin-left:242px
}
.myInput .el-input__count{
  line-height:14px;
  bottom: -14px;
}
.infoPicD{
  position: relative;
}
.infoPicSpan{
  position: absolute;
  font-size: 50px;
  color: #ffffff;
  top: 50%;
  left: 50%;
  transform:translate(-50%,-50%);
  z-index: 99;
}
</style>