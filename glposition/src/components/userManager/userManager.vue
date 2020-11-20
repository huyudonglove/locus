<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:20px;font-weight:bold;color:#000;">账号管理</span>
    </div>
    <div>
      <el-form label-position="right" label-width="150px" style="width: 70%">
        <el-form-item label="用户名">
          <span>{{userName}}</span>
        </el-form-item>
        <el-form-item label="邮箱">
          <span>{{email}}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{phone}}</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="isShow=true;">修改密码</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="修改密码" :visible.sync="isShow" @close="closeDialog" :close-on-click-modal="false" :show-close="false" width="550px">
        <el-form ref="form" label-width="120px" :model="form" :rules="rules">
          <el-form-item label="旧密码" prop="oldPassword" required>
            <input  type="text"  class="is-hidden" />
            <el-input type="password" v-model="form.oldPassword" style="width:200px;" autocomplete="new-password" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password" required>
            <input  type="text"  class="is-hidden" />
            <el-input type="password" v-model="form.password" style="width:200px;" autocomplete="new-password" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword" required>
            <input  type="text"  class="is-hidden" />
            <el-input type="password" v-model="form.confirmPassword" style="width:200px;" autocomplete="new-password" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="">
            <span style="color:red">注：密码必须为6-16位字母+数字的组合</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="isShow = false" class="cancelButtonXu">取 消</el-button>
          <el-button :disabled="isConfirm" type="primary" @click="confirm" class="confirmButtonXu">{{isConfirm?'修改中...':'修改密码'}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {userInfo,editPassword} from '../../http/request'
export default {
  name:'userManager',
  inject:['reload'],
  data(){
    return{
      userName:'',
      email:'',
      phone:'',
      isShow:false,
      form:{
        oldPassword:'',
        password:'',
        confirmPassword:''
      },
      rules:{
        oldPassword:[{required: true, message: '请输入旧密码', trigger: 'blur'}],
        password:[
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[A-Za-z0-9]{6,16}$/, message: '密码必须为6-16位字母+数字的组合', trigger: 'blur'}
        ],
        confirmPassword:[{validator: this.validatePass, trigger: 'blur'}],
      },
      isConfirm:false,
    }
  },
  methods:{
    validatePass(rule, value, callback){
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    },
    closeDialog(){
      this.$refs.form.resetFields();
    },
    confirm(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.isConfirm=true;
          editPassword({...this.form}).then(res=>{
            this.isConfirm = false;
            if(res.code){
              this.$message.error(res.msg);
            }else{
              this.$message.success(res.msg);
              this.isShow = false;
              this.reload();
            }
          }).catch(err=>{
            this.isConfirm = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      }); 
    }
  },
  created(){
    userInfo().then(res=>{
      this.userName = res.data.userName;
      this.email = res.data.email;
      this.phone = res.data.phone;
    })
  }
}
</script>
<style scoped>
.is-hidden {
    position: absolute;
    left: -10000px;
    top: -10000px;
}
</style>