<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <el-page-header @back="$router.push({path:'/service/apikeyList',query:JSON.parse($route.query.oldQuery)})" content="API KEY详情" style="font-size:24px;font-weight:bold;color:#614a4d;">
      </el-page-header>
    </div>
    <div>
      <el-form label-position="right" label-width="150px" style="width: 70%">
        <el-form-item label="名称：">
          <span>{{name}}</span>
        </el-form-item>
        <el-form-item label="云服务：">
          <span>{{service}}</span>
        </el-form-item>
        <el-form-item label="描述：">
          <!-- <div class="decription">{{decription}}</div> -->
          <el-input
            type="textarea"
            :rows="4"
            disabled
            v-model="decription">
          </el-input>
        </el-form-item>
        <el-form-item label="API KEY：">
          <span ref="apikey">{{apiKey}}</span> <el-button type="text" @click="copy('apikey')">复制</el-button>
        </el-form-item>
        <el-form-item label="API Secret：">
          <span ref="apisecret">{{apiSecret}}</span> <el-button type="text" @click="copy('apisecret')">复制</el-button>
        </el-form-item>
      </el-form> 
    </div>
  </div>
</template>
<script>
import {getServerTypeList} from '../../http/request'
export default {
  name:'apikeyInfo',
  data(){
    return{
      name:'',
      service:'',
      decription:'',
      apiKey:'',
      apiSecret:'',
      apiKeyTypeList:[]
    }
  },
  methods:{
    copy(ref){
      window.getSelection().removeAllRanges();
      var r = document.createRange(); 
      r.selectNode(this.$refs[ref]); 
      window.getSelection().addRange(r); 
      document.execCommand("Copy");
      window.getSelection().removeAllRanges();
      this.$message({
        message: '复制成功',
        duration: 500,
        type: 'success'
      })
    },
    serverTypeList(){
      return new Promise((resolve,reject)=>{
        getServerTypeList({"type":1}).then(res=>{
          this.apiKeyTypeList = res.data;
          resolve();
        }).catch(err=>{
          reject();
        })
      })
    }
  },
  async created(){
    await this.serverTypeList();
    if(this.$route.query.apiInfo){
      let apiInfo = JSON.parse(this.$route.query.apiInfo);
      this.name = apiInfo.name;
      this.service = apiInfo.apiKeyType?
      apiInfo.apiKeyType.split(',').map(item=>this.apiKeyTypeList.find(v=>v.value==item).name).join(',')
      :null;
      this.decription = apiInfo.decription;
      this.apiKey = apiInfo.apiKey;
      this.apiSecret = apiInfo.apiSecret;
    }
  }
}
</script>
<style scoped>
</style>