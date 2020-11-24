<template>
  <div>
    <div v-if="$route.name=='licenseInfo'" id="license">
       <div style="height:50px;border-bottom:1px solid #DFDCDC;">
         <el-page-header @back="goTo()" content="License授权管理" style="font-size:20px;font-weight:bold;color:#000;">
        </el-page-header>
      </div>
      <el-form ref="formSize" :model="formSize" label-width="150px" style="margin-top:20px;">
       <el-form-item label="应用名称：">
        {{formSize.applicationName}}<el-button type="text" class="ml20" @click="edit(1)">修改</el-button>
      </el-form-item>
      <el-form-item label="SDK类型：">
          <span  v-if="formSize.type=='1'">终极版</span>
      </el-form-item>
      <el-form-item label="SDK License Key：">
        <div style="width:85%;word-wrap:break-word">{{formSize.licenseKey}}<el-button type="text" class="ml20" @click="copyUrl2(formSize.licenseKey)">复制License Key</el-button></div>
      </el-form-item>
      <el-form-item label="Bundle ID：">
        {{formSize.bundleId}}<el-button type="text" class="ml20" @click="edit(2)">修改</el-button>
      </el-form-item>
       <el-form-item label="Package Name ：">
        {{formSize.packageName}}<el-button type="text" class="ml20" @click="edit(3)">修改</el-button>
      </el-form-item>
      </el-form>
       <!-- 修改-->
      <el-dialog :title="title" :visible.sync="nameVisible" @closed="nameVisible=false;" width="30%" :show-close="false" :close-on-click-modal='false'>
         <el-form ref="formName" :model="formName" label-width="0px" >
          <el-form-item label="" v-if="type==1" :key="1" :rules="[{ required: true, message: '不能为空', trigger: 'change' }, { min:1, max: 60, message: '长度在1到60个字符', trigger: 'change' }]" prop="name">
            <el-input v-model="formName.name"></el-input>
          </el-form-item>
           <el-form-item label="" v-if="type==2" :key="2" :rules="[{ required: true, message: '不能为空', trigger: 'change' },{ min:1, max: 60, message: '长度在1到60个字符', trigger: 'change' }]" prop="bundleID">
            <el-input v-model="formName.bundleID">111</el-input>
            <p style="line-height:22px;">注意！修改Bundle ID将更新License Key，原License Key仍能对旧BundleID有效，但对新BundleID失效。请谨慎操作！</p>
          </el-form-item>
           <el-form-item label="" v-if="type==3" :key="3" :rules="[{ required: true, message: '不能为空', trigger: 'change' },{ min:1, max: 60, message: '长度在1到60个字符', trigger: 'change' }]" prop="packageName">
            <el-input v-model="formName.packageName"></el-input>
            <p style="line-height:22px;">注意！修改Package Name将更新License Key，原License Key仍能对旧Package Name有效，但对新Package Name失效。请谨慎操作！</p>
          </el-form-item>
          </el-form>
          
         <div style="text-align:right;">
          <el-button  @click="nameVisible=false;" class="btnW">返回</el-button>
          <el-button type="primary"  class="btnW"  @click="submitForm('formName')">确定</el-button >
        
        </div>
      </el-dialog>
      
    </div>
  </div>
</template>
<script>
import { Message,Loading } from 'element-ui';
import {licenseInfo,licenseEditName,licenseEdit} from "../../http/request";
  export default {
  name: 'licenseInfo',
  inject:['replace','reload'],
  data () {
    return {
      formSize:{
        applicationName:'',
        bundleId:'',
        packageName:'' ,
        licenseKey:'',
        type:''
      },
      title:'',
      formName:{
        name:'',
        packageName:'',
        bundleID:''
      },
      type:1,
      nameVisible:false,
    }
  },
  created(){
    let query=this.$route.query
    licenseInfo({licenseAuthId:query.id}).then(res=>{
      if(res.code){
        Message.error(res.msg);
      }else{
       let currentRow=res.data
       this.formSize = Object.assign(this.formSize, currentRow);
       this.formSize.applicationName=query.applicationName
       this.formName.name=this.$route.query.applicationName
       this.formSize.type=query.type
       this.formName.bundleID=this.formSize.bundleId
       this.formName.packageName=this.formSize.packageName
      }
    })
  },
  methods:{
    copyUrl2(data)
  {
  let url = data;
  let oInput = document.createElement('input');
  oInput.value = url;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  document.execCommand("Copy"); // 执行浏览器复制命令
  this.$message({
    message: '已成功复制到剪切板',
    type: 'success'
  });
  oInput.remove()

  },
  edit(data){
    this.nameVisible=true
    switch(data){
      case 1:
      this.type=1
      this.title='修改名称'
      this.formName.name=this.$route.query.applicationName
      break;
      case 2:
      this.type=2
      this.title='修改Bundle ID'
      this.formName.bundleID=this.formSize.bundleId
      break;
      case 3:
      this.type=3
      this.title='修改Package Name '
      this.formName.packageName=this.formSize.packageName
      break;
      default:
      break;
    }
  },
  submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          if(this.type==1){
            licenseEditName({applicationName:this.formName.name,id:this.$route.query.id}).then(res=>{
               if(res.code){
                Message.error(res.msg);
              }else{
                 let query=JSON.parse(JSON.stringify(this.$route.query))
                 query.applicationName=this.formName.name
                 this.$router.push({path:'/licenseManage/licenseInfo',query:query})
                Message({
                message: res.msg,
                center: true,
                type: 'success'
              })
              this.reload()
              }
            })
          }else{
            if(this.formSize.bundleId==this.formName.bundleID&&this.formSize.packageName==this.formName.packageName){
              this.$message.error('修改的Bundle ID或Package Name不能和以前的相同');
              return ;
            }
            licenseEdit({...this.formSize,licenseAuthId:this.$route.query.id,bundleId:this.formName.bundleID,packageName:this.formName.packageName}).then(res=>{
               if(res.code){
                Message.error(res.msg);
              }else{
                Message({
                message: res.msg,
                center: true,
                type: 'success'
              })
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
  goTo(){
    this.$router.push({path:'/licenseManage',query:JSON.parse(this.$route.query.msg)})
  },
  },
  computed:{
  },
  watch:{
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='licenseInfo'){
       let query=this.$route.query
      licenseInfo({licenseAuthId:query.id}).then(res=>{
        if(res.code){
          Message.error(res.msg);
        }else{
        let currentRow=res.data
        this.formSize = Object.assign(this.formSize, currentRow);
        this.formSize.applicationName=query.applicationName
        this.formName.name=this.$route.query.applicationName
        this.formSize.type=query.type
        this.formName.bundleID=this.formSize.bundleId
        this.formName.packageName=this.formSize.packageName
        }
      })
      }
    },

  }
  }
</script>
<style >

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ml20{margin-left: 20px;}
</style>
