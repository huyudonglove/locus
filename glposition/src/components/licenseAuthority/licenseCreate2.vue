<template>
  <div>
    <div v-if="$route.name=='licenseCreate2'">
       <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:18px;font-weight:500;color:#614a4d;">License授权管理 > 新建License许可证密钥</span>
      </div>
      <div  style="margin-top:50px;width:800px" class="step">
        <div style="color:#8488D1;font-size:14px;margin-bottom:50px;margin-left:60px"><span style="color:#8488d1;"><i class="mr5 i2">1</i>新建密钥</span><span style="color:#8488d1;margin:0px 15px ">————————————</span><span><i class="mr5 ">2</i>创建地图库</span><span style="margin:0px 15px ">————————————</span><span><i class="mr5 i2">3</i>新建成功</span>
        </div>
        
        <el-form ref="formSize" :model="formSize" label-width="120px" width="100%" style="font-size:16px;" :rules="rules" >
          <el-form-item label="地图库名称：" prop="mapDatabaseName">
            <el-input v-model="formSize.mapDatabaseName" placeholder="请输入地图库名称"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align:right;">
          <el-button  @click="goTo()" class="btnW">上一步</el-button>
          <el-button type="primary" @click="submitForm('formSize')" class="btnW">完成</el-button>
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
.mr5{
  margin-right: 5px;
}
.step i{
  width:40px;height: 40px;display: inline-block;background: #8488d1;color: #fff;border-radius: 40px;font-style: normal;line-height: 40px;text-align: center;
}
.step i.i2{
  width:36px;height: 36px;display: inline-block;background: #fff;color: #8488d1;border-radius: 36px;font-style: normal;line-height: 36px;text-align: center;border: 2px solid #8488d1;
}
</style>
