<template>
  <div>
    <div style="padding-left:50px">
      <el-upload
        :action="'/api/file/upload'"
        :data="params"
        :headers="header"
         ref="upload"
        :limit="1"
        :before-upload="beforeCallback"
        :on-progress="progress"
        :on-success="successCallback"
         multiple
        class="upload-demo"
        :on-change="changeFile"
        :on-exceed="limitAlert"
        :on-remove="handleRemove"
        :file-list="fileArray"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text"><i style="color:red;padding:5px;">*</i>请将地图包拖拽到本区域，或<em>选择文件上传</em></div>
        <div
          class="el-upload__tip"
          slot="tip"
          style="padding-left:120px"
        >只能上传zip文件</div>
      </el-upload>
    </div>
    <div>
      <el-dialog title="空间多图正在上传中上传中" :visible.sync="isUpload" width="30%" :append-to-body="true" :close-on-click-modal="false" :show-close="false">
      <el-progress :text-inside="true" :stroke-width="26" :percentage="percent"></el-progress>
      <span>空间多图正在上传中，请不要关闭页面及浏览器</span>
      <span slot="footer" class="dialog-footer">
      </span>
    </el-dialog>
    </div>
  </div>
</template>

<script>
// import {updateMake} from "../http/request";
import {dentifiedImageInfo} from '../../http/request'
export default {
  name: "up",
  props: ['mapName','formSize','isCreate'],
  data() {
    return {
      params: {
        type: "file",
        moduleCode: "locus_position_map"
      },
      header: {
        Authorization: this.$cookies.get("locationMiddlegroundToken")
      },
      isUpload: false,
      percent: 0,
      upSuccess:false,
      type:false,
      fileName:'',
      fileArray:[],
      fileId:'',
      size:'',
      originFileName:''
    };
  },
  inject: ["reload"],
  methods: {
    beforeCallback(file) {
     this.fileName = file.name;
     return this.type
    },
    progress(event) {
      this.percent = parseInt(event.percent);
    },
    abortFile() {
      this.$refs.upload.abort();
    },
    submitUpload(){
      // console.log(952020)
      if(this.upSuccess){
         this.isUpload = true;
         this.$refs.upload.submit();
       }else{
        if(!this.fileArray.length&&!this.isCreate||!this.fileId&&this.isCreate){
          this.$message.error('必须上传地图包');
        }else {
          if(this.isCreate){
            this.$emit("changeMap", this.fileId, this.num,this.size,this.originFileName);
          }else{
            this.$emit("changeMap", this.formSize.resourceFileId, this.num,this.formSize.size,this.formSize.originFileName);
          }
        }   
       }
       
    },
    changeFile(file,list){
      if(file.raw.type=='application/x-zip-compressed'||file.raw.type=='application/zip'){
        this.fileArray=list
        this.type=true
        this.upSuccess=true
        
      }else{
        this.$message.error('只能上传zip文件！')
        this.fileArray=[];
        this.type=false
      }
      },
    successCallback(response, file) {
      if (response.code) {
        this.isUpload = false;
        this.upSuccess=false;
        this.percent=0
        this.$alert(response.msg, "上传失败", { confirmButtonText: "确定" });
      } else {
        this.isUpload = false;
        this.upSuccess=true;
        this.$emit("changeMap", response.data.fileId, this.num,response.data.size,response.data.originFileName);
      }
    },
    limitAlert(){
      this.$message.error('一次只能上传一个文件')
    },
    handleRemove(){
      this.upSuccess=false
      this.percent=0
      this.fileArray=[];
      
    },
    upClose() {
      // 弹窗警告
      this.$confirm(
        "空间多图正在上传中，离开页面将会终止上传，你确定离开吗？",
        "警告",
        {
          center: true,
          confirmButtonText: "确定离开",
          cancelButtonText: "不"
        }
      )
        .then(u => {
          this.isUpload = false;
          this.abortFile();
        })
        .catch(r => {
          console.log("取消");
        });
    }
  },
  created() {
     if(this.$route.query.row){
       dentifiedImageInfo({id:JSON.parse(this.$route.query.row).id}).then(res=>{
       if(res.code){
          this.$message.error(res.msg);
        }else{
          this.fileArray.push({name: res.data.mapName})
        }
    })
       
     }
    window.onbeforeunload = e => {
      //窗口关闭前
      if (this.isUpload) {
        return "空间多图正在上传中，离开页面将会终止上传，你确定离开吗？";
      }
    };
  },
  watch: {
    mapVisible() {
      this.mapVisibleUp = true;
    },
    
  }
};
</script>

<style scoped>
</style>
