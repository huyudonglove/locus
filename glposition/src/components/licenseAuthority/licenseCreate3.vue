<template>
  <div>
    <div v-if="$route.name=='licenseCreate3'">
       <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">License授权管理</span>
      </div>
      <div  style="margin-top:140px;text-align: center" class="step">
         <!-- <div style="color:#8488D1;font-size:14px;margin-bottom:50px;margin-left:60px"><span style="color:#8488d1;"><i class="mr5 i2">1</i>新建密钥</span><span style="color:#8488d1;margin:0px 15px ">————————————</span><span><i class="mr5 i2">2</i>创建地图库</span><span style="margin:0px 15px ">————————————</span><span><i class="mr5">3</i>新建成功</span>
        </div> -->
        <img  src="@/assets/ok2.png" style=""/>
          <!-- <p style="font-size:26px;line-height:48px;text-align:center;color:#67c23a">恭喜你，新建成功！</p> -->
        <div style="margin:100px auto;width:408px;">
          <el-button  @click="$router.push({path:'/licenseManage'});reload()" style="float:left;width:130px">完成</el-button>
          <el-button  @click="down()"  type="primary" style="float:right">立即下载SDK</el-button>
        </div>
      </div>
       <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false" :close-on-click-modal='false'
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
    background-color: #8488d1;
    border-color: #8488d1;
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
