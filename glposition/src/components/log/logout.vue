<template>
    <div></div>
</template>

<script>
    export default {
        name: "logout",
        methods:{
          logout(){
<<<<<<< HEAD
            this.$cookies.remove('locationMiddlegroundToken')
=======
            this.$cookies.remove('backgroundToken')
>>>>>>> 42788f962f62a120c25743f6f850a987a4c519d4
            this.$router.push('/login')
          }
        },
      created() {
          this.logout();
      }
    }
</script>

<style scoped>

</style>
