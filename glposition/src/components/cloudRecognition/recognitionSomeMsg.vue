<template>
  <div >
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <el-page-header @back="$router.push({path:'/recognitionInfo',query:JSON.parse($route.query.msg)})" content="识别图详情" style="font-size:24px;font-weight:bold;color:#614a4d;"></el-page-header>
    </div>
      <div style="margin-top:20px"><el-button type="primary">下载地图数据</el-button></div>
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
        </el-form-item>
        <el-form-item label="类型：" >
          <span v-if="formSize.type==1">单张图片</span>
          <span v-if="formSize.type==2">双面图片</span>
          <span v-if="formSize.type==3">正三棱柱</span>
          <span v-if="formSize.type==4">长方体</span>
          <span v-if="formSize.type==5">空间多图</span>
        </el-form-item>
        <el-form-item label="创建时间：">
          {{formSize.createTime}}
        </el-form-item>
        <el-form-item label="修改时间：" >
          {{formSize.updateTime}}
        </el-form-item>
      </el-form>
  <el-form style="width:50%;position: absolute;top:490px;" label-width="120px">
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
  <div style="margin-top:150px;margin-left:120px;vertical-align:middle">
    <div v-for="(item,index) in showImgData" :key="index" style="float:left;margin-right:50px;margin-bottom:20px">
      <span style="float:left;padding-top:30px;padding-right:10px">宽度：{{item.width}}</span><img :src="`/static/${item.fileId}`" style="width:80px;height:80px;float:left;margin-right:15px"/><el-button type="primary" style="float:left;margin-top:25px" @click="imgShow(item.featurePointFile,item.score)">查看识别度和识别点</el-button>
    </div>
  </div>
  <div style="clear:both">
    <el-button type="primary"  @click="aa();showSomeUp=true;">上传更新地图包</el-button>
  </div>
  <div v-if="showSomeUp">
      <upSomeDialog @dialogClose="dialogClose" :showSomeUp="showSomeUp" :mapName="mapName"></upSomeDialog>
    </div>

  <el-dialog
  :visible.sync="imgDialogVisible"
  width="30%"
  center>
   <img :src="`/static/${featurePointFile}`" style="width:100%;height:300px;"/>
   <div>
    <img   src="../../assets/starton.png" v-for="(item,index) in score" :key="index" /> 
    <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-score"  :key="index+10"/>
   </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="imgDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="imgDialogVisible = false">确 定</el-button>
   
  </span>
</el-dialog>
  </div>

</template>
<script>
import {mapState} from 'vuex';
import {identifiedImageDelete,updateRemark,identifiedImageUpdate,dentifiedImageInfo} from '../../http/request'
import upSomeDialog from './upSomeDialog'
import showImgDialog from './showImgDialog'
import upDialog from './upDialog'
import { Base64 } from 'js-base64'
export default {
  name:'recognitionSomeMsg',
  inject:['replace','reload'],
  components:{
    showImgDialog,
    upDialog,
    upSomeDialog
  },
  data(){
    return{
      formSize:{
        name:'',
        createTime:'',
        updateTime:'',
      },
      featurePointFile:'',
      score:0,
      isShowUp:false,
      isShow:false,
      form:{},
      remark:'',
      showSomeUp:false,
      imgDialogVisible:false,
      showImgData:[
      ],
      mapName:''
      
    }
  },
  computed:{
  },
  watch:{
    
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
    },
    imgShow(img,score){
      this.imgDialogVisible=true
      this.featurePointFile=Base64.decode(img)
      this.score=score+1
    },
    aa(){
       this.mapName=this.formSize.mapName
    }
  },
  created(){
    this.formSize=JSON.parse(this.$route.query.row)
    this.type=this.formSize.type
    this.form=JSON.parse(this.$route.query.row)
    if(this.$route.query.row){
    dentifiedImageInfo({id:JSON.parse(this.$route.query.row).id}).then(res=>{
      if(res.code){
        this.$message.error(res.msg);
      }else{
        this.showImgData=res.data.fileList
        this.showImgData.forEach(v=>v.fileId=Base64.decode(v.fileId))
       
      }
    })
    }
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
</style>