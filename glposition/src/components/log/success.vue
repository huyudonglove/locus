<template>
    <div>
      <div v-if="type=='pass'">
        重置密码邮件已经发送到您的邮箱{{email}}中。
      </div>
      <div v-if="type=='code'">
        验证邮件已经发送到您的邮箱{{email}}中。
      </div>
      <el-button @click="$router.push({path:'/login'})">返回登录</el-button>
    </div>
</template>

<script>
    export default {
        name: "success",
        data(){
          return{
            type:'',
            email:''
          }
        },
        created() {
          console.log(this.$route);
          this.type=this.$route.query.type;
          this.email=this.$route.query.email;
        }
    }
</script>

<style scoped>

</style>
