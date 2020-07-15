<template>
  <div>
    <el-upload
      ref="imgUpload"
      class="upload-demo"
      :action="'/api/file/upload'"
      :data="params"
      :headers="header"
      :show-file-list="false"
      :limit="3"
      :before-upload="beforeCallback"
      :on-progress="progress"
      :on-success="successCallback">
      <el-button style="width:400px;background-color:#c9c9c9;color:#409eff;">{{imgName?imgName:'选择文件上传'}}</el-button>
    </el-upload>
<<<<<<< HEAD
    <el-dialog :title="fileName+'上传中'" :visible.sync="isUpload" width="30%" :append-to-body="true" :close-on-click-modal="false" :show-close="false">
=======
    <el-dialog title="上传中" :visible.sync="isUpload" width="30%" :append-to-body="true" :close-on-click-modal="false" :show-close="false">
>>>>>>> 42788f962f62a120c25743f6f850a987a4c519d4
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
  name:'upComponent',
  props:['imgType','length','width','height','bottom','direction'],
  data(){
    return{
      params:{
        type:'image',
        moduleCode:'locus_position_identifiedImage'
      },
      header:{
<<<<<<< HEAD
        Authorization:this.$cookies.get('locationMiddlegroundToken')
      },
      isUpload:false,
      percent:0,
      imgName:'',
      fileName:''
=======
        Authorization:this.$cookies.get('backgroundToken')
      },
      isUpload:false,
      percent:0,
      imgName:''
>>>>>>> 42788f962f62a120c25743f6f850a987a4c519d4
    }
  },
  watch:{
    isUpload(val){
      if(!val){
        this.percent=0;
      }
    }
  },
  methods:{
    judgeImgWidthHeight(judgeFile){
      return new Promise((resolve,reject)=>{
        var myReader = new FileReader();
        myReader.readAsDataURL(judgeFile)
        myReader.onload=(e)=>{
          var imgData = e.target.result;
          var myImage = new Image();
          myImage.src=imgData;
          myImage.onload = ()=>{
            console.log(myImage.width,'width',myImage.height,'height')
            let judgeRule;
            if(this.imgType==1){//单张
              judgeRule = true;//单张不需要校验图片
            }
            if(this.imgType==2){//双面
              judgeRule = ((myImage.width/myImage.height)==((this.length*1000000)/(this.width*1000000)));
            }
            if(this.imgType==3){//正三棱柱
              judgeRule = ((myImage.width/myImage.height)==((this.bottom*1000000)/(this.height*1000000)));
            }
            if(this.imgType==4){//长方体
              if(this.direction=='front'||this.direction == 'back'){
                judgeRule = ((myImage.width/myImage.height)==((this.length*1000000)/(this.height*1000000)));
              }else{
                judgeRule = ((myImage.width/myImage.height)==((this.width*1000000)/(this.height*1000000)));
              }
            }
            if(!judgeRule){
              this.$message.error('图片宽高比例与设置不符合，请重新上传');
              reject();
            }else{
              this.isUpload = true;
              resolve();
            }
          }
        }
      })
    },
    beforeCallback(file){
<<<<<<< HEAD
      this.fileName = file.name;
=======
>>>>>>> 42788f962f62a120c25743f6f850a987a4c519d4
      if(!(file.type=='image/jpg'||file.type=='image/jpeg'||file.type=='image/png')){
        this.$message.error(`上传图片格式必须为jpg或png!`);
        return false;
      }
      if (file.size / 1024 / 1024 > 2) {
        this.$message.error('上传图片大小不能超过2MB!');
        return false;
      }
      return this.judgeImgWidthHeight(file);
    },
    progress(event){
      this.percent=parseInt(event.percent);
    },
    abortFile(){
      this.$refs.imgUpload.abort();
    },
    successCallback(response){
      if(response.code){
        this.isUpload = false;
        this.$alert(response.msg, '上传失败', {confirmButtonText: '确定'})
      }else{
        checkImgIsRepeat({
          "fileId":response.data.fileId,
          "databaseId":JSON.parse(this.$route.query.myData).identifiedImageDatabaseId}).then(res=>{
          this.isUpload = false;
          if(res.code){
            this.$message.error(res.msg);
          }else{
            if(res.data){
              this.$confirm('当前识别图库⾥有类似图片会影响识别效果，是否继续添加？','温馨提示',{
                center:true,
                confirmButtonText:'是',
                cancelButtonText:'否'
                }).then(u=>{
                this.imgName = response.data.originFileName.slice(0,30)
                this.$alert('上传成功', {
                  dangerouslyUseHTMLString: true
                });
                this.$emit('getImgId',response.data.fileId,this.imgType,this.direction)
              }).catch(r=>{
                console.log('取消')
              })
<<<<<<< HEAD
            }else{
=======
            }else{            
>>>>>>> 42788f962f62a120c25743f6f850a987a4c519d4
              this.imgName = response.data.originFileName.slice(0,30)
              this.$alert('上传成功', {
                dangerouslyUseHTMLString: true
              });
              this.$emit('getImgId',response.data.fileId,this.imgType,this.direction)
            }
          }
        }).catch(err=>{
          this.isUpload = false;
<<<<<<< HEAD
        })
=======
        })      
>>>>>>> 42788f962f62a120c25743f6f850a987a4c519d4
      }
    },
    upClose(){
      // 弹窗警告
      this.$confirm('图片正在上传，离开页面将会终止上传，你确定离开吗？','警告',{
        center:true,
        confirmButtonText:'确定离开',
        cancelButtonText:'不'
        }).then(u=>{
        this.isUpload=false;
        this.abortFile();
      }).catch(r=>{
        console.log('取消')
      })
    }
  },
  created(){
    window.onbeforeunload = (e)=> {
      //窗口关闭前
      if(this.isUpload){
        return '图片正在上传，离开页面将会终止上传，你确定离开吗？';
      }
    };
  }
}
</script>
<style scoped>

<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> 42788f962f62a120c25743f6f850a987a4c519d4
