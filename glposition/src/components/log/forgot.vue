<template>
    <div>
      <huInput :label="'邮箱地址'" :required="true" style="width: 500px" ref="email" type="email"></huInput>
      <huInput type="code" required="true" :label="'验证码'" style="width: 500px" ref="code" v-if="show"></huInput>
      <input  type="button"  @click="submit()"  class="h-l" value="确定" />
      <el-dialog :visible.sync="visible" :show-close="false" :close-on-click-modal="false" width="30%">
        <div style="padding:10px 140px">
          <img src="../../assets/dui.png" alt="" width="66px" style="display: inline-block;vertical-align:middle">
          <img src="../../assets/User.png" alt="" style="margin-left: 50px;;display: inline-block;vertical-align:middle">
        </div>
        <!--        <div style="padding-left: 20px">-->
        <!--          重置密码邮件已经发送到您的邮箱（{{this.$refs.email.ruleForm.email}}）中。-->
        <!--          请去邮箱完成注册流程。-->
        <!--        </div>-->
        <div style="text-align: center">
          <el-button type="primary" @click="change" style="width: 200px">返回登录</el-button>
        </div>
      </el-dialog>
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
                  this.visible=true;
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
