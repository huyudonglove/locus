<template>
  <div id="losePage"></div>
</template>
<script>
export default {
  name:'losePage'
}
</script>
<style scoped>
#losePage{
  position:fixed;
  left:50%;
  top: 200px;
  transform: translateX(-50%);
  width:500px;
  height:500px;
  background:url("../../assets/losePage.png") no-repeat;
  background-position: 50% 0px;
}
</style>