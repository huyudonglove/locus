<template>
    <div>
      <huInput type="code" required="true" :label="'验证码'" style="width: 500px" ref="code"></huInput>
      <huInput :label="'邮箱地址'" :required="true" style="width: 500px" ref="email" type="email"></huInput>
      <el-button @click="submit">确定</el-button>
    </div>
</template>

<script>
  import codeM from './codeM'
  import huInput from '../../share/huInput'
    export default {
        name: "forgot",
        components:{
          codeM,
          huInput
        },
        data(){
          return{
            email:'',
            code:''
          }
        },
        methods:{
          submit(){
              console.log(this.$refs.code);
              console.log(this.$refs.email)
              this.$refs.code.code.toLowerCase()==this.code.toLowerCase()?(()=>{
                this.$refs.code.getCode().then(res=>{
                  res.code&&this.$message.warning(res.msg);
                  !res.code&&this.$router.push(`/success?type=pass&&eamil=${this.$refs.email.ruleForm.email}`)
                });
              })():(()=>{
                this.$message.error('验证码不正确');
                this.$refs.code.getCode();
              })()
          }
        }
    }
</script>

<style scoped>

</style>
