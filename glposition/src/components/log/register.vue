<template>
    <div class="forgot">
      <huInput type="name" required="true" :label="'用户名:'" style="width: 500px" ref="name"></huInput>
      <huInput type="email" required="true" :label="'邮箱用于登录:'" style="width: 500px" ref="email"></huInput>
      <huInput type="phone" required="true" :label="'手机号码:'" style="width: 500px" ref="phone"></huInput>
      <huInput type="code" required="true" :label="'验证码:'" style="width: 500px" ref="code"></huInput>
      <input  type="button"  @click="check()"  class="h-l" value="立即注册" />
      <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false" width="35%">
        <div style="padding:10px 140px">
          <img src="../../assets/dui.png" alt="" width="66px" style="display: inline-block;vertical-align:middle">
          <img src="../../assets/User.png" alt="" style="margin-left: 50px;;display: inline-block;vertical-align:middle">
        </div>
        <div style="position: absolute;left:50%;transform:translateX(-50%);min-width: 300px" v-if="visible">
          <p style="line-height: 24px" >验证邮件已经发送到您的邮箱（{{this.$refs.email.ruleForm.email}}）中。</p>
          <p style="line-height: 24px" >请去邮箱完成注册流程。</p>
          <div style="text-align: center">
            <el-button type="primary" @click="change" style="width: 200px">返回登录</el-button>
          </div>
         </div>
      </el-dialog>
    </div>
</template>

<script>
  import huInput from '../../share/huInput'
  import codeM from './codeM'
  import {register} from "../../http/request";

  export default {
        name: "register",
        data(){
          return{
            visible:false
          }
        },
        components:{
          huInput,
          codeM
        },
        methods:{
          check(){
            console.log(this.$refs.name.submitForm());
            console.log(this.$refs.email.submitForm());
            console.log(this.$refs.phone.submitForm());
            this.$refs.phone.submitForm()&&this.$refs.email.submitForm()&&this.$refs.name.submitForm()&&this.$refs.code.submitForm()&&(()=>{
              let msg={
                userName:this.$refs.name.ruleForm.name,
                email:this.$refs.email.ruleForm.email,
                phone:this.$refs.phone.ruleForm.phone,
                identifyCode:this.$refs.code.ruleForm.code,
                host:window.location.origin
              }
              console.log(msg)
              register(msg).then(res=>{
                console.log(res,7777);
                res.code&&this.$message.error(res.msg);
                !res.code&&(()=>{
                  this.visible=true;
                })();
              })
            })();
          },
          change(){
            this.$emit('change');
          }
        },
        mounted() {

        }
  }
</script>

<style scoped>
  input[type="button"]{
    width: 480px;
    height:50px;
    line-height: 50px;
    background: #8488D1;
    color: white;
    border-radius:10px;
    font-size: 18px;
    border:0px none;
    cursor: pointer;
    margin-left: 20px;
    margin-top: 20px;
  }
  .forgot .el-dialog__body{
    height: 270px;
  }
</style>
