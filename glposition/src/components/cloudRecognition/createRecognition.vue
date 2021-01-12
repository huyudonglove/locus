<template>
  <div>
    <div v-if="$route.name=='createRecognition'">
       <div style="height:50px;border-bottom:1px solid #DFDCDC;">
         <span style="font-size:20px;font-weight:bold;color:#000;">{{$route.query.databaseId==1?'新建本地识别图库':'新建云识别图库'}}</span>
      </div>
      <div  style="margin-top:50px;width:690px;">
        <el-form ref="formSize" :model="formSize" label-width="150px" width="100%" style="font-size:16px;" :rules="rules" >
          <el-form-item label="计费方式：">
            <el-radio v-model="formSize.limit" :label="0">无限制</el-radio>
          </el-form-item>
          <el-form-item label="识别图库名称：" prop="name">
            <el-input v-model="formSize.name" maxlength="16" style="width:360px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="$router.go(-1)" class="btnW">取消</el-button>
            <el-button type="primary" @click="create" class="btnW">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
  import {addRecognition} from '../../http/request'
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
      loading:null
    }
  },
  created(){
    
  },
  methods:{
    create(){
      this.$refs.formSize.validate((valid) => {
        if(valid){
          this.$confirm(`<div style='font-size:20px;font-weight:bold;margin-bottom:20px;word-break:break-all;'>确认创建识别图库${this.formSize.name}吗</div>`,
            {'dangerouslyUseHTMLString':true,
            'closeOnClickModal':false,
            'showClose':false,
            'confirmButtonClass':'confirmButtonXu',
            'cancelButtonClass':'cancelButtonXu'}).then(y=>{
              this.loading = this.$loading({
                lock: true,
                showClose:false,
                closeOnClickModal:false,
                text: `创建识别图库${this.formSize.name}中...`,
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.3)',
                customClass: 'loading_xu',
              });
              addRecognition({"identifiedType":parseInt(this.$route.query.databaseId),"name":this.formSize.name,"type":this.formSize.limit}).then(res=>{
                if(res.code){
                  this.$message.error(res.msg);
                  this.loading.close();
                }else{
                  this.loading.close();
                  this.$message({
                    message: `图库“${this.formSize.name}”新建成功`,
                    center: true,
                    type: 'success'
                  })
                  this.$router.push({path:'/recognitionInfo',query:{databaseId:this.$route.query.databaseId,myData:JSON.stringify(res.data),oldQuery:JSON.stringify({})}})
                }
              }).catch(()=>{
                this.loading.close();
              })
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
