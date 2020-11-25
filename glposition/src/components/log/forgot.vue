<template>
    <div class="forgot">
      <huInput :label="'邮箱地址:'" :required="true" style="width: 500px" ref="email" type="email"></huInput>
      <huInput type="code" required="true" :label="'验证码:'" style="width: 500px" ref="code" v-if="show"></huInput>
      <input  type="button"  @click="submit()"  class="h-l" value="确定" />
      <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false" width="35%" >
        <div style="padding:10px 140px">
          <img src="../../assets/dui.png" alt="" width="66px" style="display: inline-block;vertical-align:middle">
          <img src="../../assets/User.png" alt="" style="margin-left: 50px;;display: inline-block;vertical-align:middle">
        </div>
        <div style="position: absolute;left:50%;transform:translateX(-50%);min-width: 500px">
          <p style="line-height: 24px" v-if="visible">验证邮件已经发送到您的邮箱（{{this.$refs.email.ruleForm.email}}）中。</p>
          <p style="line-height: 24px">请去邮箱完成重置流程。</p>
          <div style="text-align: center">
            <el-button type="primary" @click="change" style="width: 200px">返回登录</el-button>
          </div>
        </div>

      </el-dialog>
    </div>
</template>

<script>
  import codeM from './codeM'
  import huInput from '../../share/huInput'
  import {resetPasswordEmail} from "../../http/request";

  export default {
        name: "forgot",
        components:{
          codeM,
          huInput
        },
        data(){
          return{
            email:'',
            code:'',
            show:true,
            visible:false
          }
        },
        methods:{
          submit(){
              this.$refs.code.submitForm();
              this.$refs.email.submitForm();
              if(!this.$refs.code.submitForm()){
                this.show=false;
                this.$nextTick(()=>{
                  this.show=true;
                })
              }else {
                if(this.$refs.email.submitForm()){
                  let msg={
                    email:this.$refs.email.ruleForm.email,
                    identifyCode:this.$refs.code.ruleForm.code,
                    host:window.location.origin
                  }
                  resetPasswordEmail(msg).then(res=>{
                    res.code&&this.$message.error(res.msg)
                    !res.code&&(()=>{
                      this.visible=true;
                    })();
                  })

                }
              }

          },
          change(){
            this.$emit('change',3);
          }
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
  }
</style>
<style>
 .forgot .el-dialog__body{
    height: 270px;
  }
</style>
