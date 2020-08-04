<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <el-page-header @back="$router.go(-1)" content="识别图信息" style="font-size:24px;font-weight:bold;color:#614a4d;">
      </el-page-header>
    </div>
    <div class="mapDiv">
      <el-form :inline="true" label-position="right" label-width="100px" style="width: 100%">
        <el-form-item label="">
          <el-dropdown placement="bottom-start">
            <el-button size="mini" type="primary" :disabled="status==-1||(status==4&&!densePointCloudFileId&&!sparsePointCloudFileId)">
              下载地图数据<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="primary" size="mini" @click="download(densePointCloudFileId,'稠密')">下载稠密点云数据</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" size="mini" @click="download(sparsePointCloudFileId,'稀疏')">下载稀疏点云数据</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-position="right" label-width="120px" style="width: 100%">
        <el-form-item label="空间多图名称：">
          <span>{{recognitionName}}</span>
        </el-form-item>
        <el-form-item label="空间多图ID：">
          <span ref="gps">{{identifiedImageId}}</span> 
          <!-- <el-button type="text" @click="copy('gps')">复制MapID</el-button> -->
        </el-form-item>
        <el-form-item label="状态：">
         <span v-if="status==1">正常</span>
          <span v-if="status==0">待生效</span>
        </el-form-item>
        <el-form-item label="类型：">
          <span>空间多图</span>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-position="right" label-width="100px" style="width: 100%">
        <el-form-item label="创建时间：">
          <span ref="apikey">{{createTime}}</span>
        </el-form-item>
        <el-form-item label="修改时间：">
          <span ref="apikey">{{updateTime}}</span>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            style="width:500px;"
            :rows="2"
            disabled
            v-model="decription">
          </el-input>
          <el-button type="text" @click="showDialog('备注')">修改</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-position="right" label-width="100px" style="width: 100%">
        <el-form-item label="宽度：" v-for="(item,i) in imgList" :key="i">
          <span style="vertical-align:top;">{{item.width}}</span>
          <div :style="{'background-image':item.imgPath?`url(/static/${item.imgPath})`:''}" style="width:100px;height:100px;display:inline-block;border:#606266 solid 1px;background-size:100% 100%;background-repeat:no-repeat;"></div>
          <el-button style="vertical-align:top;" type="primary" size="mini" @click="isShowDot=true;">查看识别度和识别点</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-position="right" label-width="100px" style="width: 100%">
        <el-button size="mini" type="primary">上传更新地图包</el-button>
        <el-form-item label="预览：">
          <div id="webglId">
            <div class="title">稀疏点云</div>
            <div class="cover" v-if="maploading">
              <div class="loading">
                <i class=" iconI el-icon-loading"></i>
                <p class="text">预览加载中...</p>
              </div>
            </div>
            <div class="reset" @click="resetPosition">重置</div>
          </div>
          <div id="webglId2">
            <div class="title">稠密点云</div>
            <div class="cover" v-if="maploading2">
              <div class="loading">
                <i class=" iconI el-icon-loading"></i>
                <p class="text">预览加载中...</p>
              </div>
            </div>
            <div class="reset" @click="resetPosition2">重置</div>
          </div>
        </el-form-item>
      </el-form>
      <el-dialog :title="title+'修改'" :visible.sync="isShow" width="550px" center>
        <div style="text-align:center;">
          <el-input
            v-if="title=='备注'"
            style="width:350px;"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit
            v-model="newDecription">
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button :disabled="isConfirm" type="primary" @click="confirm">{{isConfirm?'修改中...':'确定'}}</el-button>
          <el-button @click="isShow = false">取 消</el-button>
        </span>
      </el-dialog>
      <div v-if="isShowDot">
       <showImgDialog @showDialogClose="showDialogClose" :id="imgDialogId" :types="imgDialogType" ></showImgDialog>
      </div>
    </div>
  </div>
</template>
<script>
import 'three/examples/js/controls/TrackballControls'
import 'three/examples/js/loaders/PLYLoader'
import {getRecognitionDetails,updateRemark} from '../../http/request'
import showImgDialog from './showImgDialog'
import { Base64 } from 'js-base64';
let scene,camera,controls,scene2,camera2,controls2;

export default {
  name:'recognitionDetails',
  components:{
    showImgDialog
  },
  data(){
    return{
      loading:null,
      maploading:true,
      loadedData:0,
      maploading2:true,
      isConfirm:false,
      recognitionName:'',
      identifiedImageId:'',
      status:'',
      createTime:'',
      updateTime:'',
      decription:'',
      sparsePointCloudFileId:'',
      sparseMapPath:'',
      densePointCloudFileId:'',
      denseMapPath:'',
      isShow:false,
      newDecription:'',
      title:'',
      renderer:'',
      clock:'',
      delta:'',
      renderer2:'',
      clock2:'',
      delta2:'',
      isShowDot:false,
      imgList:[],
      imgDialogId:'',
      imgDialogType:''
    }
  },
  watch:{
  },
  methods:{
    download(id,name){
      let url=`/static/${Base64.decode(id)}`;
      let path = Base64.decode(id);
      let arr = path.split('/');
      let aTag = document.createElement('a')
      let packageName =name+this.identifiedImageId+'.'+arr[arr.length-1].split('.')[1]
      aTag.download = packageName;
      aTag.href = url;
      aTag.click();
    },
    getInfo(){
      return new Promise((resolve,reject)=>{
        this.loading=this.$loading({
          lock: true,
          text: `数据加载中...`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        getRecognitionDetails({id:this.$route.query.id}).then(res=>{
          this.loading.close();
          resolve();
          if(res.code){
            this.$message.error(res.msg);
          }else{
            console.log(res,'res');
            this.recognitionName = res.data.name;
            this.identifiedImageId = res.data.identifiedImageId;
            this.status = res.data.status;
            this.createTime = res.data.createTime;
            this.updateTime = res.data.updateTime;
            this.decription = res.data.remark;
            this.imgList = res.data.fileList&&res.data.fileList.length?res.data.fileList.map(v=>{
              v.imgPath = Base64.decode(v.fileId);
              return v;
            }):[];
            this.sparsePointCloudFileId = res.data.sparsePointCloudFileId;//稀疏
            this.densePointCloudFileId = res.data.densePointCloudFileId;//稠密
            this.sparseMapPath = Base64.decode(this.sparsePointCloudFileId);
            this.denseMapPath = Base64.decode(this.densePointCloudFileId);
          }
        }).catch(u=>{
          this.loading.close();
        })
      })
    },
    copy(ref){
      window.getSelection().removeAllRanges();
      var r = document.createRange();
      r.selectNode(this.$refs[ref]);
      window.getSelection().addRange(r);
      document.execCommand("Copy");
      window.getSelection().removeAllRanges();
      this.$message({
        message: '复制成功',
        duration: 500,
        type: 'success'
      })
    },
    showDialog(title){
      this.title = title;
      if(title=='尺度'){
      }else{
        this.newDecription = this.decription;
      }
      this.isShow = true;
    },
    confirm(){
      // this.isConfirm=true;
      updateRemark({"id":this.$route.query.id,"remark":this.newDecription}).then(res=>{
        // this.isConfirm = false;
        // if(res.code){
        //   this.$message.error(res.msg);
        // }else{
        //   this.$message.success(res.msg);
          this.decription = this.newDecription;
          this.isShow = false;
        // }
      // }).catch(err=>{
        // this.isConfirm = false;
      })
    },
    resetPosition(){
      controls.reset();
    },
    resetPosition2(){
      controls2.reset();
    },
    initRender(){
       //创建渲染器
      this.renderer=new THREE.WebGLRenderer();
      this.renderer.setSize(800,600);
      this.renderer.setClearColor(0x000000, 1.0);
      this.renderer2=new THREE.WebGLRenderer();
      this.renderer2.setSize(800,600);
      this.renderer2.setClearColor(0x000000, 1.0);
      document.getElementById('webglId').appendChild(this.renderer.domElement);
      document.getElementById('webglId2').appendChild(this.renderer2.domElement);
    },
    initScene(){
      //创造场景
      scene=new THREE.Scene();
      scene2=new THREE.Scene();
    },
    initLight(){
      //添加灯光
      var light=new THREE.PointLight(0x000000);
      light.position.set(300,400,200);//光源的位置
      scene.add(light);//将光源加入到场景中
      scene.add(new THREE.AmbientLight(0x333333));
      //添加灯光
      var light2=new THREE.PointLight(0x000000);
      light2.position.set(300,400,200);//光源的位置
      scene2.add(light2);//将光源加入到场景中
      scene2.add(new THREE.AmbientLight(0x333333));
    },
    initCamera(){
      //添加相机
      camera=new THREE.PerspectiveCamera(40,800/600,1,1000);
      camera.position.set(0, 0, 128);
      camera.lookAt(scene.position);
      //添加相机
      camera2=new THREE.PerspectiveCamera(40,800/600,1,1000);
      camera2.position.set(0, 0, 128);
      camera2.lookAt(scene2.position);
    },
    initMesh(){
      //外部模型加载 没有材质的
      var self=this;
      var loader = new THREE.PLYLoader();
        loader.load(`/static/${this.sparseMapPath}`, function (geometry) {

          //更新顶点的法向量
          geometry.computeVertexNormals();
          // geometry.computeFaceNormals();
          geometry.computeBoundingBox();
          geometry.center();
          //创建纹理，并将模型添加到场景道中
          var material = new THREE.PointsMaterial( {size: 0.05,transparent: true,vertexColors:THREE.VertexColors,alphaTest: 0.5} );
          var mesh = new THREE.Points( geometry, material );

					mesh.castShadow = true;
          mesh.receiveShadow = true;
          self.maploading=false;
          scene.add( mesh );
        },function ( xhr ) {
          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          self.loadedData = Math.floor(xhr.loaded/xhr.total*100)
        },function ( error ) {
          console.log( 'An error happened' );
      });
      var axes = new THREE.AxesHelper(100);
      scene.add(axes);

      var loader2 = new THREE.PLYLoader();
        loader2.load(`/static/${this.denseMapPath}`, function (geometry) {

          //更新顶点的法向量
          geometry.computeVertexNormals();
          // geometry.computeFaceNormals();
          geometry.computeBoundingBox();
          geometry.center();
          //创建纹理，并将模型添加到场景道中
          var material = new THREE.PointsMaterial( {size: 0.05,transparent: true,vertexColors:THREE.VertexColors,alphaTest: 0.5} );
          var mesh = new THREE.Points( geometry, material );

					mesh.castShadow = true;
          mesh.receiveShadow = true;
          self.maploading2=false;
          scene2.add( mesh );
        },function ( xhr ) {
          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },function ( error ) {
          console.log( 'An error happened' );
      });
      var axes2 = new THREE.AxesHelper(100);
      scene2.add(axes2);
    },
    initControls(){
      controls = new THREE.TrackballControls(camera, this.renderer.domElement);
      controls.rotateSpeed = 2.5;
      controls.zoomSpeed = 1.2;
      controls.panSpeed = 0.8;
      controls.noZoom = false;
      controls.noPan = false;
      controls.staticMoving = true;
      controls.dynamicDampingFactor = 0.3;
      this.clock = new THREE.Clock();
      controls2 = new THREE.TrackballControls(camera2, this.renderer2.domElement);
      controls2.rotateSpeed = 2.5;
      controls2.zoomSpeed = 1.2;
      controls2.panSpeed = 0.8;
      controls2.noZoom = false;
      controls2.noPan = false;
      controls2.staticMoving = true;
      controls2.dynamicDampingFactor = 0.3;
      this.clock2 = new THREE.Clock();
    },
    //渲染
    render(){
      this.renderer.render(scene,camera);
      this.renderer2.render(scene2,camera2);
    },
    //动画执行
    animate() {
      requestAnimationFrame(this.animate);
      this.render();
      this.delta = this.clock.getDelta();
      this.delta2 = this.clock2.getDelta();
      controls.update(this.delta);
      controls2.update(this.delta2);
    },
  },
  created(){
    // console.log(JSON.parse(this.$route.query.oldQuery))
  },
  async mounted(){
    await this.getInfo();
    this.initScene();
    this.initCamera();
    this.initMesh();
    this.initLight();
    this.initRender();
    this.initControls();
    this.animate();
  }
}
</script>
<style>
.mapDiv .decription{
  width: 500px;
  text-overflow: ellipsis;
  line-height: 26px;
}
.mapDiv .el-textarea .el-textarea__inner{
  resize: none;
}
.mapDiv #webglId{
  display: inline-block;
  width: 800px;
  height: 600px;
  position: relative;
}
.mapDiv #webglId2{
  display: inline-block;
  width: 800px;
  height: 600px;
  position: relative;
}
.mapDiv .title{
  position: absolute;
  z-index: 50;
  left: 5px;
  top: 3px;
  color: #409EFF;
  font-size: 18px;
  font-weight: bold;
}
.mapDiv .reset{
  position: absolute;
  z-index: 50;
  right: 15px;
  top: 3px;
  color: #409EFF;
  font-size: 18px;
  font-weight: bold;
}
.mapDiv .cover {
  position: absolute;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.8);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity .3s;
}
.mapDiv .loading {
  top: 50%;
  margin-top: -21px;
  width: 100%;
  text-align: center;
  position: absolute;
}
.mapDiv .iconI {
  color: #409eff;
  font-size: 20px;
  animation: rotating 2s linear infinite;
}

.mapDiv .loading .text {
  color: #409eff;
  margin: 3px 0;
  font-size: 14px;
  line-height: 20px;
}
</style>
