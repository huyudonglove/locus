<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">新增用户</span>
    </div>
    <div>
      <el-form ref="form" label-width="120px" :model="form" :rules="rules">
        <el-form-item label="用户名称：" prop="userName" required>
          <el-input type="text" v-model="form.userName" style="width:300px;" maxlength="20" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email" required>
          <el-input type="text" v-model="form.email" style="width:300px;" maxlength="30" placeholder="请输入邮箱用以登录"></el-input>
        </el-form-item>
        <el-form-item label="手机：" prop="phone" required>
          <el-input type="text" v-model="form.phone" style="width:300px;" maxlength="50" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="add">创建</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {addUser} from '../../http/request'
export default {
  name:'createUser',
  inject:['reload'],
  data(){
    return{
      loading:null,
      form:{
        userName:'',
        phone:'',
        email:''
      },
      rules:{
        userName:[
          {required: true, message: '请输入用户名称', trigger: ['change','blur']},
          {pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{2,20}$/, message: '限制只能输入20位数字和英文的组合', trigger: 'blur'}
        ],
        phone:[
          {required: true, message: '请输入手机号', trigger: ['change','blur']},
          {pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
        ],
        email:[
          {required: true, message: '请输入邮箱', trigger: ['change','blur']},
          {pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, message: '邮箱格式不正确', trigger: 'blur'}
        ],
      },
    }
  },
  methods:{
    add(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm(`是否创建用户${this.form.userName}`).then(y=>{
            this.loading=this.$loading({
              lock: true,
              text: '用户创建中...',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            addUser({host:location.href,...this.form}).then(res=>{
              this.loading.close();
              if(res.code){
                this.$message.error(res.msg)
              }else{
                this.$message.success(`用户${this.form.userName}创建成功`)
                this.$router.go(-1);
                this.reload();
              }
            }).catch(err=>{
              this.loading.close();
            })
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });   
    },
  }
}
</script>

<style scoped>

</style>