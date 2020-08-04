<template>
  <div>
    <el-dialog title="上传空间多图" :visible.sync="dialogVisible" @close="close" width="800px" center>
      <el-form :model="formSize" :rules="rules" ref="formSize" label-width="120px" class="demo-ruleForm">
         <el-form-item label="空间名称：" prop="name">
           <el-input v-model="formSize.name" placeholder="请输入空间名称"  maxlength="30" show-word-limit :disabled="!isCreate"></el-input>
        </el-form-item> 
        <el-row v-for="(item,index) in formSize.fileList" :key="index">
        <el-col :span="8">
        <el-form-item label="宽度：" :prop="'fileList.'+index+'.width'" :rules="rules.width">
          <el-input v-model="item.width" placeholder="请输入宽度"  :disabled="!isCreate&&item.width !==''&& !isCreateWidth" onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,6})?).*$/g, '$1')"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label="上传识别图：" >
         <upSomeComponent @changeImg="changeImg" :num="item.identifiedIndex" :ref="`upSome${item.identifiedIndex}`"></upSomeComponent>
        </el-form-item>
         </el-col>
         <el-col :span="4"> <img v-if="item.fileId" :src="`/static/${item.imageUrl}`" style="width:55px;height:55px;" v-focus><span  v-if="item.fileId" style="" class="spanA" @click="del(item.identifiedIndex)">x</span></el-col>
        </el-row>
        <el-row style="padding-left:60px;margin-bottom:25px;color:#888;font-size:13px;"> 
          <span >识别图的高度将由系统根据您的上传的图片自动计算，请上传.JPG或者.PNG(最大2M)</span>
        </el-row>
        <el-form-item label="地图包上传：" prop="resourceFileId" ref="map22">
         <upLoad @changeMap="changeMap" :mapName="mapName"></upLoad>
        </el-form-item>
        <el-form-item label="地图类型：">
         <el-radio-group v-model="formSize.mapTypeId">
          <el-radio :label="0">普通室内场景</el-radio>
          <el-radio :label="1">多植物场景</el-radio>
        </el-radio-group>
        </el-form-item>

        <el-form-item label="备注：" >
         <el-input
          type="textarea"
          placeholder="请输入备注"
          v-model="formSize.remark"
          maxlength="500"
          show-word-limit
        >
        </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button  type="primary" @click="add('formSize')" v-if="isCreate">创建多图空间</el-button>
        <el-button  type="primary" @click="edit('formSize')" v-if="!isCreate">编辑多图空间</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {identifiedImageUpdate,addIdentifiedImage,dentifiedImageInfo } from '../../http/request'
import upSomeComponent from './upSomeComponent'
import upLoad from './upLoad'
import {Base64} from 'js-base64'
export default {
  name:'upSomeDialog',
  inject:['reload','replace'],
  props:['showSomeUp','mapName'],
  components:{
    upSomeComponent,
    upLoad
  },
  data(){
    return{
      dialogVisible:false,
      formSize:{
        name:'',
        remark:'',
        resourceFileId:'' ,
        fileList:[{ width:'',fileId:'',identifiedIndex:0,imageUrl:'',imgName:''},{ width:'',fileId:'',identifiedIndex:1,imageUrl:'',imgName:''},{ width:'',fileId:'',identifiedIndex:2,imageUrl:'',imgName:''},{ width:'',fileId:'',identifiedIndex:3,imageUrl:'',imgName:''},{ width:'',fileId:'',identifiedIndex:4,imageUrl:'',imgName:''}],
        identifiedImageDatabaseId:'',mapTypeId:0,size:0,mpaName:''
      },
     
      isCreate:true,
      isCreateWidth:true,
      rules: {
        name: [
          {required: true, message: '请输入空间名称', trigger: ['change','blur']},{pattern: /^[\_\-0-9A-Za-z]+$/, message: '识别图名称必须是英文、数字0-9、下划线或中划线', trigger: ['blur','change']}
        ],
        width:[{validator: this.myValidator, trigger: ['blur','change']}],
        resourceFileId:[
          {
            required: true, message: '请上传地图包'
          }
        ]
      }
    }
  },
  created(){
    this.dialogVisible = this.showSomeUp;
    if(this.$route.query.row){
      this.formSize.identifiedImageDatabaseId=JSON.parse(this.$route.query.row).identifiedImageDatabaseId
      dentifiedImageInfo({id:JSON.parse(this.$route.query.row).id}).then(res=>{
       if(res.code){
          this.$message.error(res.msg);
        }else{
         this.isCreate=false
         this.isCreateWidth=false
         this.formSize=Object.assign(this.formSize,res.data)
         let arr=this.formSize.fileList.map(v=>v.identifiedIndex)
         let  count = [0,1,2,3,4]
         let  d = count.filter(function(v){ return arr.indexOf(v) == -1})
         d.forEach((v)=>{
           this.formSize.fileList.splice(v,0,{ width:'',fileId:'',identifiedIndex:v,imageUrl:'',imgName:''})
         })
         this.formSize.fileList.forEach((v,index)=>{
           v.imageUrl=Base64.decode(v.fileId)
           this.$refs['upSome'+v.identifiedIndex][0].imgName=v.fileId.slice(0,20)
           return v
         })
        }
    })
    }else{
      this.formSize.identifiedImageDatabaseId=JSON.parse(this.$route.query.myData).identifiedImageDatabaseId
    }
  },
  watch:{ 
  
  },
  computed:{
   
  },
  methods:{
    close(){
      this.$emit("dialogClose");
    },
    changeImg(fileId,num,imgName){
     this.formSize.fileList[num].imageUrl= Base64.decode(fileId);
     this.formSize.fileList[num].fileId=fileId
     this.formSize.fileList[num].imgName=imgName
    },
    changeMap(fileId,num,size,name){
     this.formSize.resourceFileId=fileId
     this.formSize.size=size
     this.formSize.mpaName=name
     this.$refs.map22.clearValidate()
    },
    myValidator(rule, value, callback){
      
      // value=this.judge(value)
      callback();
    },
    add(){
      this.$refs.formSize.validate((valid) => {
        if (valid) {         
        if(!this.isHasImg()){
           this.$message.error('空间多图必须上传1-5张图片');
           return
         }else{
           
           let fileList=this.formSize.fileList.filter(v=>v.width&&v.fileId)
           addIdentifiedImage({name:this.formSize.name,type:5,resourceFileId:this.formSize.resourceFileId,fileList:fileList,remark:this.formSize.remark,identifiedImageDatabaseId:this.formSize.identifiedImageDatabaseId,size:this.formSize.size,mapTypeId:this.formSize.mapTypeId}).then(res=>{
                if(res.code){
                  this.$message.error(res.msg);
                }else{
                  this.reload()  
                }
           })
         }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    edit(){
      this.$refs.formSize.validate((valid) => {
        if (valid) {         
        if(!this.isHasImg()){
           this.$message.error('空间多图必须上传1-5张图片');
           return
         }else{
           let fileList=this.formSize.fileList.filter(v=>v.width&&v.fileId)
           identifiedImageUpdate({id:JSON.parse(this.$route.query.row).id,name:this.formSize.name,type:5,resourceFileId:this.formSize.resourceFileId,fileList:fileList,remark:this.formSize.remark,identifiedImageDatabaseId:this.formSize.identifiedImageDatabaseId,size:this.formSize.size,mapTypeId:this.formSize.mapTypeId}).then(res=>{
                if(res.code){
                  this.$message.error(res.msg);
                }else{
                  this.reload()  
                }
           })
         }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    //判断是否至少有一个图片
    isHasImg(){
     return this.formSize.fileList.filter(v=>v.fileId).length
    },
    del(n){
      console.log(n,'n')
      this.formSize.fileList[n].fileId=''
      this.formSize.fileList[n].imageUrl=''
      this.formSize.fileList[n].width=''
      this.$refs['upSome'+n][0].imgName=''
      this.isCreateWidth=true
    }
  },
  
}
</script>

<style scoped>
.spanA{
  position:absolute;top:8px;right:30px;font-size:30px;cursor:pointer
}
</style>
