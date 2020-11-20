<template>
    <div>
      <el-dialog  :visible.sync="mapVisibleUp" width="30%" title="上传地图包" :close-on-click-modal="false" @close="visB()" :show-close="false">
        <div>
          <p><i style="color:red;padding:5px;">*</i>地图名称：</p>
          <el-input v-model="name" placeholder="请输入名称"  maxlength="20"></el-input>
        </div>
        <div>
          <p>地图类型:</p>
          <p>
            <el-radio v-model="sceneId" :label="1">普通室内场景</el-radio>
            <el-radio v-model="sceneId" :label="2">多植物场景</el-radio>
          </p>
        </div>
        <div>
          <p>备注：</p>
          <el-input v-model="description" type="textarea" maxlength="500" show-word-limit></el-input>
        </div>
        <div style="text-align: center">
          <p >
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
              <div class="el-upload__text"><i style="color:red;padding:5px;">*</i>请将地图包拖拽到本区域，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传zip文件</div>
            </el-upload>
            <el-upload
              class="upload-demo"
              :drag="true"
              :data="dataMsg"
              :action="`/api/file/upload`"
              :multiple="auto"
              :limit="1"
              :headers="header"
              :file-list="fileArr"
              :on-success="upSuccessAnther"
              :on-remove="removeAnther"
              :on-exceed="limitAlert"
              :on-change="changeFile2"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">可选择将误差评估视频拖拽到本区域，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传zip文件</div>
            </el-upload>
          </p>
        </div>
        <div style="text-align: right">
          <el-button @click="mapVisibleUp=false" class="btnW">返回</el-button>
          <el-button @click="submitUpload"  type="primary" class="btnW">上传</el-button>
        </div>
      </el-dialog>
      <div>
        <el-dialog title="上传中" :visible.sync="upLoad" width="30%" :close-on-click-modal="false" :show-close="false">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="percent"></el-progress>
          <span>模型正在上传中，请不要关闭页面及浏览器</span>
          <span slot="footer" class="dialog-footer">
          </span>
        </el-dialog>
        <el-dialog title="上传成功" :visible.sync="upEnd" width="30%" @close="upEnd = false;reload();" :close-on-click-modal="false" :show-close="false" style="text-align: center">
          <img src="../assets/ok.png" alt="" width="100" height="100">
          <p>
            <span>上传成功，开始进行转换，你可以在<router-link :to="'/replaceList?type=0'">转换列表</router-link>或者地图库列表看到你的地图</span>
          </p>
          <p>
            <span slot="footer" class="dialog-footer">
             <el-button type="primary" @click="upEnd = false;reload();">确 定</el-button>
          </span>
          </p>
        </el-dialog>
        <el-dialog title="警告" :visible.sync="upBreak" width="30%" @close="upBreak = false;" :close-on-click-modal="false" :show-close="false">
          <span>地图包正在上传，离开页面将会终止上传，你确定离开吗？</span>
          <!-- <span slot="footer" class="dialog-footer">
             
          </span> -->
          <div style="text-align:right">
            <el-button type="primary" @click="upBreak = false;reload();abortFile();" class="btnW">确 定</el-button>
            <el-button @click="upBreak=false;" class="btnW">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import {upMap} from "../http/request";
  import upLoad from "../share/upLoad";
  export default {
        name: "up",
        props:['formSize','mapVisible'],
        data(){
          return{
            name:'',
            description:'',
            file:'',
            mapDatabaseId:'',
            mapDatabaseName:'',
            auto:false,
            percent:0,
            upLoad:false,
            upEnd:false,
            upBreak:false,
            msg:{
              mainMapId:'',
              testFileId:'',

            },
            header:{
              Authorization:localStorage.getItem('locationMiddlegroundToken')
            },
            fileArray:[],
            fileArr:[],//偏差数组列表
            mapVisibleUp:false,
            mapDatabaseKey:'',
            upMsg:{
              type:'file',
              moduleCode:'map.zip'
            },
            dataMsg:{
              type:'file',
              moduleCode:'location'
            },
            sceneId:1
          }
        },
        inject:['reload'],
        methods:{
          limitAlert(){
            this.$message.error('一次只能上传一个文件')
          },
          submitUpload(){
            console.log(this.fileArray.length)
            this.fileArray.length?(()=>{
              this.msg.mapDatabaseId=this.formSize.id;
              this.msg.mapDatabaseName=this.formSize.name;
              this.msg.name=this.name;
              this.msg.description=this.description;
              this.msg.mapDatabaseKey=this.formSize.secret;
              this.msg.testFileId=this.msg.testFileId;
              this.msg.sceneId=this.sceneId;
              this.name?(()=>{
                this.upLoad=true;
                this.$refs.upload.submit();
                this.mapVisibleUp=false
              })():this.$message.error('地图名称不能为空')
            })():this.$message.error('请选择上传地图包文件');
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
              this.msg.fileId=response.data.fileId;
              this.msg.size=response.data.size;
               upMap(JSON.parse(JSON.stringify(this.msg))).then(v=>{
                console.log(v,77777)
                this.upLoad=false;
                  v.code&&this.$message.error(v.msg);
                  !v.code&&(()=>{
                    // this.$alert(response.msg, '提示', {
                    //   confirmButtonText: '确定',
                    //   callback: action => {
                    //     this.reload();
                    //   }
                    // });
                    this.upLoad=false;
                    this.upEnd=true;
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
          changeFile2(file,list){
            file.raw.type=='application/x-zip-compressed'||file.raw.type=='application/zip'?this.fileArr=list:(()=>{
              this.$message.error('只能上传zip文件！')
              this.fileArr=[];
            })();
          },
          remove(file,list){
            console.log(file,list)
            this.fileArray=list;
          },
          removeAnther(file,list){
            this.fileArr=[]
          },
          upSuccessAnther(res, file){
            if (res.code) {
              this.$message.error(res.msg)
              return
            }
            this.msg.testFileId=res.data.fileId
          },
        },
      mounted() {
            console.log(this.formSize,77777)
      },
      watch:{
        mapVisible(){
          this.mapVisibleUp=true;
        },
        upLoad(){
          this.upLoad==false&&(()=>{
            this.percent=0;
          })()
        }
      },
    created(){
      window.onbeforeunload = ()=> {
        //窗口关闭前
        if(this.upLoad){
          return '文件正在上传，离开页面将会终止上传，你确定离开吗？';
        }
      };
    }
  }
</script>

<style scoped>

</style>
