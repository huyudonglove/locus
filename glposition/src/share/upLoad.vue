<template>
    <div>
      <el-dialog  :visible.sync="mapVisibleUp" width="30%" title="上传误差评估视频" @close="visB()">
        <div style="text-align: center">
          <el-upload
              ref="upload"
              class="upload-demo"
              :drag="true"
              :before-upload="beforeUploadFile"
              action="/api/file/upload"
              :auto-upload="auto"
              :limit="1"
              :on-exceed="limitAlert"
              :data="upMsg"
              :on-progress="progress"
              :on-error="upError"
              :on-success="upSuccess"
              :on-remove="remove"
              name="file"
              :headers="header"
              :on-change="changeFile"
              :file-list="fileArray"
              :multiple="auto">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text"><i style="color:red;padding:5px;">*</i>可选择将误差评估视频拖拽到本区域，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传zip文件</div>
            </el-upload>
        </div>
        <div style="text-align: center">
          <el-button @click="submitUpload"  type="primary">上传</el-button>
        </div>
      </el-dialog>
      <div>
        <el-dialog title="上传中" :visible.sync="upLoad" width="30%"  :close-on-click-modal="false" :show-close="false">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="percent"></el-progress>
          <span>正在上传中，请不要关闭页面及浏览器</span>
          <span slot="footer" class="dialog-footer">
          </span>
        </el-dialog>
        <el-dialog title="警告" :visible.sync="upBreak" width="30%" @close="upBreak = false;">
          <span>文件正在上传，离开页面将会终止上传，你确定离开吗？</span>
          <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="upBreak = false;reload();abortFile();">确 定</el-button>
             <el-button @click="upBreak=false;">取消</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import {updateMake} from "../http/request";

  export default {
        name: "up",
        props:['mapKey','mapVisible'],
        data(){
          return{
            name:'',
            file:'',
            mapDatabaseId:'',
            mapDatabaseName:'',
            auto:false,
            percent:0,
            upLoad:false,
            upEnd:false,
            upBreak:false,
            msg:{},
            header:{
              Authorization:this.$cookies.get('locationMiddlegroundToken')
            },
            fileArray:[],
            mapVisibleUp:false,
            mapDatabaseKey:'',
            upMsg:{
              type:'file',
              moduleCode:'map.zip'
            }
          }
        },
        inject:['reload'],
        methods:{
          limitAlert(){
            this.$message.error('一次只能上传一个文件')
          },
          submitUpload(){
            this.fileArray.length?(()=>{
              this.msg.mapKey=this.mapKey;
              this.upLoad=true;
              this.$refs.upload.submit();
              this.mapVisibleUp=false
            })():this.$message.error('请选择上传文件');
          },
          visB(){
            this.mapVisibleUp=false
          },
          progress(event, file, fileList){
            this.percent=parseInt(event.percent)
          },
          upError(){
            this.$message.error('上传失败，请稍后再试！')
          },
          upSuccess(response){
            console.log(response);

            !response.code?(()=>{
              this.msg.testFileId=response.data.fileId;
               updateMake(JSON.parse(JSON.stringify(this.msg))).then(v=>{
                console.log(v,77777)
                this.upLoad=false;
                  v.code&&this.$message.error(v.msg);
                  !v.code&&(()=>{
                     this.$message({
                      message: v.msg,
                      center: true,
                      type: 'success'
                    })
                    // this.$alert(response.msg, '提示', {
                    //   confirmButtonText: '确定',
                    //   callback: action => {
                    //     this.reload();
                    //   }
                    // });

                    this.upLoad=false;
                    this.reload()
                  })();
              })
            })():(()=>{
               this.$alert(response.msg, '上传失败', {
                      confirmButtonText: '确定',
                      callback: action => {
                        this.reload();
                      }
                    });
            })();
          },
          beforeUploadFile(file){
              console.log(file,999);
            !file&&(()=>{
              return false
            })();
          },
          handleClose(){
            this.upBreak=true;
          },
          abortFile(){
            this.$refs.upload.abort();
          },
          changeFile(file,list){
            console.log(file,list)
            file.raw.type=='application/x-zip-compressed'||file.raw.type=='application/zip'?this.fileArray=list:(()=>{
              this.$message.error('只能上传zip文件！')
              this.fileArray=[];
            })();

          },
          remove(file,list){
            console.log(file,list)
            this.fileArray=list;
          }
        },
      mounted() {
            //console.log(this.formSize,77777)
      },
      watch:{
        mapVisible(){
          this.mapVisibleUp=true;
        }
      }
    }
</script>

<style scoped>

</style>
