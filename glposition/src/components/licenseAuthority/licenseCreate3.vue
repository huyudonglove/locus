<template>
  <div>
    <div v-if="$route.name=='licenseCreate3'">
       <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">License授权管理</span>
      </div>
      <div  style="margin-top:50px;width:690px;text-align: center">
        <div style="color:#555;font-size:18px;margin-bottom:50px;font-weight:600"><span style="color:#409eff;">新建密钥</span><span style="color:#409eff;margin:0px 15px;">——————————</span><span style="color:#409eff;">创建地图库</span><span style="color:#409eff;margin:0px 15px;">——————————</span><span style="color:#409eff;">新建成功</span></div>
        <img  src="@/assets/ok.png" width="120" height="120" style=""/>
          <p style="font-size:26px;line-height:48px;text-align:center;color:#67c23a">恭喜你，新建成功！</p>
        <div style="margin:15px auto;width:380px;">
          <el-button  @click="down()" >立即下载SDK</el-button>
          <el-button  @click="$router.push({path:'/licenseManage'});reload()">先随便逛逛</el-button>
        </div>
      </div>
       <el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      >
      <p style="text-align:center;font-size:16px;">是否确定下载{{formSize.name}}<span style="padding-left:10px;">{{formSize.version}}</span></p>
      <div style="width:180px;margin:0px auto;margin-top:30px;">
        <a href="javascript:void(0)" download="" style="text-decoration:none" class="downBtn" @click="dialogVisible = false" >取消</a>
        <a :href="`/static${formSize.downloadUrl}`" download="" style="text-decoration:none" class="downBtn downBtn-primary" @click="dialogVisible = false;">下载</a>
      </div>
    </el-dialog>
    </div>
  </div>
</template>
<script>
  import {sdkInfo} from "../../http/request";
  export default {
  name: 'licenseCreate3',
  inject:['replace','reload'],
  data () {
    return {
      dialogVisible:false,
      formSize: {
        radio:'1',
        name:'',
        bundleID:'',
        packageName:'',
      },
      rules: {
          name: [
            { required: true, message: '请输⼊入应⽤用名称', trigger: 'blur' },
            { min:1, max: 60, message: '长度在1到60个字符', trigger: 'blur' }
          ],
           bundleID: [
            { required: true, message: '请输⼊入BundleID', trigger: 'blur' },
            { min:1, max: 60, message: '长度在1到60个字符', trigger: 'blur' }
          ],
           packageName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min:1, max: 60, message: '请输⼊入PackageName', trigger: 'blur' }
          ],
        }
    }
  },
  created(){
    sdkInfo({}).then(res=>{
       if(res.code){
            this.$message.error(res.msg);
          }else{
            this.formSize=res.data
          } 
    })
  },
  methods:{
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
             this.$router.push({path:'/licenseManage/licenseCreate/2',query:{paramsAll:JSON.stringify(this.$router.query)}})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    down(){
      this.dialogVisible=true
    },
  },
  computed:{
    name(){
      return this.formSize.name
    },
    bundleID(){
      return this.formSize.bundleID
    },
    packageName(){
      return this.formSize.packageName
    }
  },
  watch: {
    name(){
      this.replace("name",this.formSize.name);
      },
    bundleID(){
      this.replace('bundleID',this.formSize.bundleID);
    },
    packageName(){
      this.replace('packageName',this.formSize.packageName);
    },
    
  },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pr15{
  padding-right:15px;
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
