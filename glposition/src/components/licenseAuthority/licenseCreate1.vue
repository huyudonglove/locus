<template>
  <div>
    <div v-if="$route.name=='licenseCreate1'">
       <div style="height:50px;border-bottom:1px solid #DFDCDC;">
         <span style="font-size:24px;font-weight:bold;color:#614a4d;">新建License许可证密钥</span>
      </div>
      <div  style="margin-top:50px;width:690px;">
        <div style="color:#555;font-size:18px;margin-bottom:50px;font-weight:600"><span style="color:#409eff;">新建密钥</span><span style="color:#409eff;margin:0px 15px;">——————————</span><span>创建地图库</span><span style="margin:0px 15px;">——————————</span><span>新建成功</span></div>
        <el-form ref="formSize" :model="formSize" label-width="150px" width="100%" style="font-size:16px;" :rules="rules" >
          <el-form-item label="SDK类型：">
            <el-radio v-model="formSize.radio" label="1">终极版</el-radio>
          </el-form-item>
          <el-form-item label="创建应用：">
             <el-form-item label="应用名称：" style="margin-bottom:20px;" prop="name">
              <el-input v-model="formSize.name" placeholder="请输入应⽤名称"></el-input>
            </el-form-item>
             <el-form-item label="支持平台：" style="margin-bottom:20px;" >
              <img src="../../assets/iOSlogo.png" width="20" height="20" class="icon"/><span class="pr15 text">ios</span><img src="../../assets/AndroidLogo.png" width="20" height="20" class="icon"/><span class="pr15 text" >Android</span><img src="../../assets/windowsLogo.png" width="17" height="17" class="icon"/><span class="pr15 text">Windows</span><img src="../../assets/finder.png" width="17" height="17" class="icon"/><span class="pr15 text">macOS</span>
            </el-form-item>
             <el-form-item label="Bundle ID：" style="margin-bottom:20px;" prop="bundleID">
              <el-input v-model="formSize.bundleID" placeholder="请输⼊Bundle ID" ></el-input>
            </el-form-item>
             <el-form-item label="Package Name：" style="margin-bottom:20px;" prop="packageName">
              <el-input v-model="formSize.packageName" placeholder="请输⼊Package Name"></el-input>
            </el-form-item>
          </el-form-item>
        </el-form>
        <div style="margin:15px auto;width:180px;">
          <el-button type="primary" @click="goTo()">返回</el-button>
          <el-button type="primary" @click="submitForm('formSize')">下一步</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
  name: 'licenseCreate1',
  inject:['replace','reload'],
  data () {
    return {
      formSize: {
        radio:'1',
        name:'',
        bundleID:'',
        packageName:''
      },
      rules: {
          name: [
            { required: true, message: '请输⼊应用名称', trigger: 'blur' },
            { min:1, max: 60, message: '长度在1到60个字符', trigger: 'blur' }
          ],
           bundleID: [
            { required: true, message: '请输⼊Bundle ID', trigger: 'blur' },
            { min:1, max: 60, message: '长度在1到60个字符', trigger: 'blur' }
          ],
           packageName: [
            { required: true, message: '请输⼊Package Name', trigger: 'blur' },
            { min:1, max: 60, message: '长度在1到60个字符', trigger: 'blur' }
          ],
        }
    }
  },
  created(){
    let query=this.$route.query
    this.formSize.name=query.name
    this.formSize.bundleID=query.bundleID
    this.formSize.packageName=query.packageName
  },
  methods:{
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
             this.$router.push({path:'/licenseManage/licenseCreate/2',query:{msg:JSON.stringify(this.$route.query)}})
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    goTo(){
      this.$router.push({path:'/licenseManage'})
    }
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
    $route(){
      if(this.$route.name=='licenseCreate1'){
      
      }
    }
  },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pr15{
  padding-right:25px;
}
.icon{
  display: inline-block;vertical-align: middle;padding-right: 3px;
}
</style>
