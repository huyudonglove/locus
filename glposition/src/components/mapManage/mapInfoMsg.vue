<template>
  <div>
    <div v-if="$route.name=='mapInfoMsg'">
      gggg
    </div>
  </div>
</template>
<script>
  export default {
  name: 'mapInfoMsg',
  inject:['replace','reload'],
  data () {
    return {
      formSize:{
        name:'哈哈啊哈哈哈哈哈哈哈哈哈哈',
        bundleID:'ee',
        packageName:'555' ,
        sdk:'66',
        SDKLicenseKey:'SgwXPU4fDyFWefRWMwFy13H0ZsIikJeiMSgwXPU4fDyFWefRWMwFy13H0ZsIikJeiMSgwXPU4fDyFWefRWMwFy13H0ZsIikJeiMSgwXPU4fDyFWefRWMwFy13H0ZsIikJeiMSgwXPU4fDyFWefRWMwFy13H0ZsIikJeiM',
      },
      title:'',
      formName:{
        name:'',
        packageName:'',
        bundleID:''
      },
      type:1,
      nameVisible:false,
    }
  },
  created(){
    
  },
  methods:{
    copyUrl2(data)
  {
  let url = data;
  let oInput = document.createElement('input');
  oInput.value = url;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  document.execCommand("Copy"); // 执行浏览器复制命令
  this.$message({
    message: '已成功复制到剪切板',
    type: 'success'
  });
  oInput.remove()

  },
  edit(data){
    this.nameVisible=true
    switch(data){
      case 1:
      this.title='修改名称'
      break;
      case 2:
      this.title='修改Bundle ID'
      break;
      case 3:
      this.title='修改Package Name '
      break;
      default:
      break;
    }
  },
  submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          this.reload()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
  goTo(){
    this.$router.push({path:'/app/licenseManage',query:JSON.parse(this.$route.query.msg)})
  },
  },
  
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ml20{margin-left: 20px;}
</style>
