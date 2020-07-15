<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">新建API KEY</span>
    </div>
    <div>
      <el-form ref="form" :model="form" :rules="rules" label-position="right" label-width="150px" style="width: 70%">
        <el-form-item label="名称" prop="name" required>
          <el-input type="text" v-model="form.name" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="云服务" prop="apiKeyType">
          <el-checkbox-group v-model="form.apiKeyType">
            <el-checkbox v-for="(item,idx) in serverTypeList" :key="idx" :label="item.value">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.decription"
            maxlength="500"
            show-word-limit>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="create">确定</el-button>
          <el-button @click="$router.push({path:'/service/apikeyList',query:JSON.parse($route.query.oldQuery)});">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {createApikey,getServerTypeList} from '../../http/request'
export default {
  name:'createApikey',
  inject:['reload'],
  data(){
    return{
      loading:null,
      form:{
        name:'',
        decription:'',
        apiKeyType:[]
      },
      rules:{
        name:[{required: true, message: '请输入名称', trigger: 'blur'}],
        apiKeyType:[{required: true, message: '请选择云服务', trigger: 'blur'}]
      },
      serverTypeList:[],
    }
  },
  methods:{
    create(){
      this.$refs.form.validate((valid) => {
        console.log(valid,'valid')
        if (valid) {
          createApikey({"name":this.form.name,"decription":this.form.decription,"apiKeyType":this.form.apiKeyType.join(',')}).then(res=>{
            this.$router.push({path:'/service/apikeyList',query:JSON.parse(this.$route.query.oldQuery)})
            this.reload();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      }); 
    },
    dropDown(){
      getServerTypeList({"type":1}).then(res=>{
        this.serverTypeList = res.data;
      })
    }
  },
  created(){
    this.dropDown();
  }
}
</script>
<style scoped>
</style>