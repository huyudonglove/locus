<template>
  <div>
    <div v-if="$route.name=='licenseCreate2'">
       <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:18px;font-weight:500;color:#614a4d;">SDK授权管理 > 新建License许可证密钥</span>
      </div>
      <div  style="margin-top:50px;width:690px">
        <div style="color:#555;font-size:18px;margin-bottom:50px;font-weight:600"><span style="color:#409eff;">新建密钥</span><span style="color:#409eff;margin:0px 15px;">——————————</span><span style="color:#409eff;">创建地图库</span><span style="color:#409eff;margin:0px 15px;">——————————</span><span>新建成功</span></div>
        
        <el-form ref="formSize" :model="formSize" label-width="120px" width="100%" style="font-size:16px;" :rules="rules" >
          <el-form-item label="地图库名称：" prop="mapDatabaseName">
            <el-input v-model="formSize.mapDatabaseName" placeholder="请地图库名称"></el-input>
          </el-form-item>
        </el-form>
        <div style="margin:15px auto;width:200px;">
          <el-button  @click="goTo()">上一步</el-button>
          <el-button type="primary" @click="submitForm('formSize')">完成</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {licenseSave} from "../../http/request";
  export default {
  name: 'licenseCreate2',
  inject:['replace','reload'],
  data () {
    return {
      formSize: {
        mapDatabaseName:'',
        type:1
      },
      rules: {
          mapDatabaseName: [
            { required: true, message: '请地图库名称', trigger: 'blur' },
            { min:1, max: 60, message: '长度在1到60个字符', trigger: 'blur' }
          ],
        }
    }
  },
  created(){
      let query=JSON.parse(this.$route.query.msg)
      this.formSize.applicationName=query.name
      this.formSize.bundleId=query.bundleID
      this.formSize.mapDatabaseName=this.$route.query.mapDatabaseName
      this.formSize.packageName=query.packageName
    },
  methods:{
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
             licenseSave(this.formSize).then(res=>{
                if(res.code){
              this.$message.error(res.msg);
            }else{
            this.$router.push({path:'/licenseManage/licenseCreate/3',query:{msg:JSON.stringify(this.$router.query)}})
            } 
             })
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    //返回
    goTo(){
      this.$router.push({path:'/licenseManage/licenseCreate/1',query:JSON.parse(this.$route.query.msg)})
    },
  },
  computed:{
    mapName(){
      return this.formSize.mapName
    },
  },
  watch: {
    mapName(){
      this.replace("mapName",this.formSize.mapName);
      },
    $route(){
      if(this.$route.name=='licenseCreate2'){
     
      }
    }
  },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pr15{
  padding-right:15px;
}
</style>
