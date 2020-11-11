<template>
  <div>
    <div v-if="$route.name=='createRecognition'">
       <div style="height:50px;border-bottom:1px solid #DFDCDC;">
         <span style="font-size:24px;font-weight:bold;color:#614a4d;">{{$route.query.databaseId==1?'新建本地识别图库':'新建云识别图库'}}</span>
      </div>
      <div  style="margin-top:50px;width:690px;">
        <el-form ref="formSize" :model="formSize" label-width="150px" width="100%" style="font-size:16px;" :rules="rules" >
          <el-form-item label="类型：">
            <el-radio-group v-model="suitId">
              <el-radio v-for="(item,i) in suitData.slice(0,1)" :key="i" :label="item.id" @change="suitChange(i)">{{item.title}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="计费方式：">
            <span>{{suitData.length&&suitData[currentIndex].payType}}</span>
          </el-form-item>
          <el-form-item label="图库大小：">
            <span>{{suitData.length&&suitData[currentIndex].libSize}}张</span>
          </el-form-item>
          <el-form-item v-if="$route.query.databaseId==2" label="调用次数：">
            <span v-if="suitData.length">{{suitData[currentIndex].maxUseCount+'次/'+suitData[currentIndex].maxUseTime+'天（试用）'}}</span>
          </el-form-item>
          <el-form-item v-if="$route.query.databaseId==2" label="超量处理方式：">
            <span>{{suitData.length&&suitData[currentIndex].overHandle}}</span>
          </el-form-item>
          <el-form-item label="期限：">
            <span>无限期</span>
          </el-form-item>
          <el-form-item label="识别图库名称：" prop="name">
            <el-input v-model="formSize.name" maxlength="16" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="create">确定</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import {addRecognition,getSuitList} from '../../http/request';
  export default {
  name: 'createRecognition',
  inject:['replace','reload'],
  data () {
    return {
      formSize: {
        limit:0,
        name:'',
      },
      rules: {
        name: [
          {required: true, message: '请输入识别图库名称', trigger: 'change'},
          {required: true, message: '请输入识别图库名称', trigger: 'blur'},
          {pattern: /^[\_\-0-9A-Za-z]+$/, message: '识别图库名称必须是英文、数字0-9、下划线或中划线', trigger: 'blur'},
        ]
      },
      suitData:[],
      suitId:'',
      currentIndex:0
    }
  },
  created(){
    this.suitList();
  },
  methods:{
    suitChange(i){
      this.currentIndex=i;
    },
    suitList(){
      getSuitList({type:this.$route.query.databaseId==1?300:200}).then(res=>{
        this.suitData = res.data;
        this.suitId = res.data.length&&res.data[0].id;
        // .find(v=>v.title=="个人版云识别");
      })
    },
    create(){
      this.$refs.formSize.validate((valid) => {
        if(valid){
          addRecognition({"identifiedType":parseInt(this.$route.query.databaseId),"name":this.formSize.name,"type":this.suitId}).then(res=>{
            this.$router.go(-1);
          })
        }else {
          console.log('error submit!!');
          return false;
        }
      })
    }
  }
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
