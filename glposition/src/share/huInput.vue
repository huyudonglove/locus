<template>
    <div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item :label="label" prop="email" v-if="type=='email'">
          <el-input v-model="ruleForm.email" placeholder="请输入你的邮箱" clearable style="ime-mode:disabled" maxlength='30'></el-input>
        </el-form-item>
        <el-form-item :label="label" prop="name" v-if="type=='name'">
          <el-input v-model="ruleForm.name" placeholder="请输入你的用户名" clearable onkeyup="value=value.replace(/[^\w\.\/]/ig,'')" maxlength='20'></el-input>
        </el-form-item>
        <el-form-item :label="label" prop="phone" v-if="type=='phone'">
          <el-input v-model="ruleForm.phone" placeholder="请输入你的手机号码" clearable onkeyup="this.value=this.value.replace(/\D/g,'')" maxlength='11'></el-input>
        </el-form-item>
        <el-form-item :label="label" prop="code" v-if="type=='code'">
          <el-input v-model="ruleForm.code" placeholder="请输入验证码" clearable style="width: 200px"></el-input>
          <codeM ref="code" type="online" style="display: inline-block;position: absolute;padding-left: 10px"></codeM>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import codeM from '../components/log/codeM'
  export default {
        name: "huInput",
        props:['label','required','type'],
        data(){
          var checkCode=(rule, value, callback)=>{
            if (!value) {
              return callback(new Error('验证码不能为空'));
            }else {
              if(value.toLowerCase()==this.$refs.code.code.toLowerCase()){
                callback();
              }else {
                callback(new Error('验证码不正确'));
                this.$refs.code.getCode();
              }
            }
          }
          return{
            ruleForm:{
              email:'',
              name:'',
              phone:'',
              code:''
            },
            rules:{
              email:[
                { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
              ],
              name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
              ],
              phone:[
                { required:true,message: '请输入手机号码',trigger: 'blur'}
              ],
              code:[
                { required:true,validator: checkCode,trigger: 'blur'}
              ]
            }
          }
        },
        components:{
          codeM
        },
        methods:{
          submitForm() {
            var all;
            this.$refs[`ruleForm`].validate((valid) => {
              if (valid) {
                all=valid;
              } else {
                console.log('error submit!!');
                all= valid;
              }
            });
            return all;
          },
        },
      created() {
        this.rules.email[0].required=this.required;
        this.rules.name[0].required=this.required;
        this.rules.phone[0].required=this.required;
      }
    }
</script>

<style scoped>

</style>
