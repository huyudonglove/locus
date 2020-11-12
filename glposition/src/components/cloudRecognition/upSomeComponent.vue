<template>
  <div>
    <el-upload
      ref="imgUpload"
      class="upload-demo"
      :action="'/api/file/upload'"
      :data="params"
      :headers="header"
      :show-file-list="false"
      :limit="5"
      :before-upload="beforeCallback"
      :on-progress="progress"
      :on-success="successCallback"
      :disabled="!width"
      >
    <el-button :style="{'width':'240px','background-color':'#fff','color':'#409eff'}"  v-if="width">{{imgName?imgName:'选择上传文件'}}</el-button>
    <el-button  v-if="!width" :disabled="!width" :style="{'width':'240px'}">{{imgName?imgName:'选择上传文件'}}</el-button>
    </el-upload>
    <el-dialog :title="fileName+'上传中'" :visible.sync="isUpload" width="30%" :append-to-body="true" :close-on-click-modal="false" :show-close="false">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="percent"></el-progress>
      <span>图片正在上传中，请不要关闭页面及浏览器</span>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {checkImgIsRepeat} from '../../http/request'
export default {
  name:'upSomeComponent',
  props:['num','width','isCreate','isCreateWidth'],
  data(){
    return{
      params:{
        type:'image',
        moduleCode:'locus_position_identifiedImage'
      },
      header:{
        Authorization:localStorage.getItem('locationMiddlegroundToken')
      },
      isUpload:false,
      imageUrl:'',
      imgName:'',
      percent:0,
      fileName:'',
      height:0,
      timeout:null
    }
  },
  watch:{
    isUpload(val){
      if(!val){
        clearTimeout(this.timeout);
        this.percent=0;
      }
    }
  },
  methods:{

    beforeCallback(file){
      this.fileName = file.name;
      if(!(file.type=='image/jpg'||file.type=='image/jpeg'||file.type=='image/png')){
        this.$message.error(`上传图片格式必须为jpg或png!`);
        return false;
      }
      if (file.size / 1024 / 1024 > 2) {
        this.$message.error('上传图片大小不能超过2MB!');
        return false;
      }
        var myReader = new FileReader();
        myReader.readAsDataURL(file)
        myReader.onload=(e)=>{
          var imgData = e.target.result;
          var myImage = new Image();
          myImage.src=imgData;

          myImage.onload = ()=>{
           this.isUpload = true;
          //  console.log(myImage.width,'width',myImage.height,'height')
           this.height = ((myImage.height/myImage.width)*this.width).toFixed(6);
          }
        }

    },
    progress(event){
      this.percent=parseInt(event.percent);
      // console.log('progress',this.percent)
    },
    abortFile(){
      this.$refs.imgUpload.abort();
    },
    successCallback(response,file){
      if(response.code){
        this.isUpload = false;
        this.percent=0
        this.$alert(response.msg, '上传失败', {confirmButtonText: '确定'})
      }else{
        // console.log(response,'response')
        this.imgName = response.data.originFileName.slice(0,20)
        this.$emit('changeImg',response.data.fileId,this.num,response.data.originFileName,this.height)
        this.timeout=setTimeout(()=>{
        this.percent=0
        this.isUpload = false;
       }, 100);
        // console.log('successCallback')
      }
    },
    upClose(){
      // 弹窗警告
      this.$confirm('图片正在上传，离开页面将会终止上传，你确定离开吗？','警告',{
        center:true,
        confirmButtonText:'确定离开',
        cancelButtonText:'不'
        }).then(u=>{
        clearTimeout(this.timeout);
        this.isUpload=false;
        this.percent=0
        this.abortFile();
      }).catch(r=>{
        console.log('取消')
      })
    },
  },
  created(){
    window.onbeforeunload = (e)=> {
      //窗口关闭前
      if(this.isUpload){
        return '图片正在上传，离开页面将会终止上传，你确定离开吗？';
      }
    };
  },
  destroyed() {
     clearTimeout(this.timeout);
  },
}
</script>
<style scoped>

</style>
