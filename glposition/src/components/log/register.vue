<template>
    <div>
      欢迎注册
      <huInput type="name" required="true" :label="'用户名'" style="width: 500px" ref="name"></huInput>
      <huInput type="email" required="true" :label="'邮箱用于登陆'" style="width: 500px" ref="email"></huInput>
      <huInput type="phone" required="true" :label="'手机号码'" style="width: 500px" ref="phone"></huInput>
      <huInput type="code" required="true" :label="'验证码'" style="width: 500px" ref="code"></huInput>
      <el-button @click="check">注册</el-button>
      <el-button @click="$router.push('/success?type=code')">11</el-button>
    </div>
</template>

<script>
  import huInput from '../../share/huInput'
  import codeM from './codeM'
  import {register} from "../../http/request";

  export default {
        name: "register",
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
                res.code&&this.$message.warning(res.msg);
                !res.code&&this.$router.push(`/success?type=code&&eamil=${this.$refs.email.ruleForm.email}`)
              })
            })();
          }
        },
        mounted() {
          console.log(window.location)
        }
  }
</script>

<style scoped>

</style>
