<template>
  <div >
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <el-page-header @back="$router.push({path:'/recognitionInfo',query:JSON.parse($route.query.msg)})" content="多空间图详情" style="font-size:24px;font-weight:bold;color:#614a4d;"></el-page-header>
    </div>
    <div class="mapDiv">
      <!-- <div style="margin-top:20px"><el-button type="primary">下载地图数据</el-button></div> -->
      <el-dropdown placement="bottom-start" style="margin-top:20px">
        <el-button size="mini" type="primary" :disabled="!densePointCloudFileId||!sparsePointCloudFileId">
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
      <el-form  :model="formSize" label-width="120px">
        <el-form-item label="空间多图名称：">
          {{formSize.name}}
        </el-form-item>
        <el-form-item label="空间多图ID：">
          {{formSize.identifiedImageId}}
        </el-form-item>
         <el-form-item label="地图类型：">
          <span v-if="formSize.mapTypeId==0">普通室内场景</span>
          <span v-if="formSize.mapTypeId==1">多植物场景</span>
        </el-form-item>
        <el-form-item label="状态：" >
          <span v-if="formSize.status==1">正常</span>
          <span v-if="formSize.status==0">待生效</span>
          <span v-if="formSize.status==2">异常</span>
          <span v-if="formSize.status==3">更新</span>
          <span v-if="formSize.status==4">停止</span>
        </el-form-item>
        <el-form-item label="类型：" >
          <span v-if="formSize.type==1">单张图片</span>
          <span v-if="formSize.type==2">双面图片</span>
          <span v-if="formSize.type==3">正三棱柱</span>
          <span v-if="formSize.type==4">长方体</span>
          <span v-if="formSize.type==5">空间多图</span>
        </el-form-item>
        <el-form-item label="创建时间：">
          {{formSize.createTime}}
        </el-form-item>
        <el-form-item label="修改时间：" >
          {{formSize.updateTime}}
        </el-form-item>
      </el-form>
  <el-form style="width:50%;position: absolute;top:540px;" label-width="120px">
     <el-form-item label="备注：" >
          <div class="myInput">
          <el-input
          type="textarea"
          placeholder="请输入内容"
          v-model="formSize.remark"
          :rows="4"
          show-word-limit
          maxlength="500"
          style="width:80%"
          :disabled="true"
          >
          </el-input>
          <!-- <el-button type="text" @click="edit()">修改</el-button>   -->
          </div>
        </el-form-item>
  </el-form>
  <div style="margin-top:150px;margin-left:120px;vertical-align:middle">
    <div v-for="(item,index) in showImgData" :key="index" style="float:left;margin-right:50px;margin-bottom:20px">
      <span style="float:left;padding-top:30px;padding-right:10px">宽度：{{item.width}}</span><img :src="`/static/${item.fileId}`" style="width:80px;height:80px;float:left;margin-right:15px"/><el-button type="primary" style="float:left;margin-top:25px" @click="imgShow(item.featurePointFile,item.score)"  size="mini">查看识别度和识别点</el-button>
    </div>
  </div>
  <!-- <div style="clear:both">
    <el-button type="primary"  @click="aa();showSomeUp=true;">上传更新地图包</el-button>
  </div> -->
  <el-form :inline="true" label-position="right" label-width="100px" style="width: 100%">
    <!-- <el-button size="mini" type="primary" @click="aa();showSomeUp=true;">上传更新地图包</el-button> -->
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
  <div v-if="showSomeUp">
      <upSomeDialog @dialogClose="dialogClose" :showSomeUp="showSomeUp" :mapName="mapName"></upSomeDialog>
    </div>

  <el-dialog
  :visible.sync="imgDialogVisible"
   width="700px"
  center>
   <img :src="`/static/${featurePointFile}`" style="width:650px;"/>
   <div style="width:200px;margin:15px auto 0">
     识别度：
    <img   src="../../assets/starton.png" v-for="(item,index) in score" :key="index" /> 
    <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-score"  :key="index+10"/>
   </div>
</el-dialog>
</div>
  </div>

</template>
<script>
import {mapState} from 'vuex';
import {identifiedImageDelete,updateRemark,identifiedImageUpdate,dentifiedImageInfo} from '../../http/request'
import upSomeDialog from './upSomeDialog'
import showImgDialog from './showImgDialog'
import upDialog from './upDialog'
import { Base64 } from 'js-base64'
import 'three/examples/js/controls/TrackballControls'
import 'three/examples/js/loaders/PLYLoader'
let scene,camera,controls,scene2,camera2,controls2,worker,worker2;
export default {
  name:'recognitionSomeMsg',
  inject:['replace','reload'],
  components:{
    showImgDialog,
    upDialog,
    upSomeDialog
  },
  data(){
    return{
      formSize:{
        name:'',
        createTime:'',
        updateTime:'',
      },
      featurePointFile:'',
      score:0,
      isShow:false,
      form:{},
      remark:'',
      showSomeUp:false,
      imgDialogVisible:false,
      showImgData:[
      ],
      mapName:'',
      sparsePointCloudFileId:'',
      sparseMapPath:'',
      densePointCloudFileId:'',
      denseMapPath:'',
      maploading:true,
      maploading2:true,
      renderer:'',
      clock:'',
      delta:'',
      renderer2:'',
      clock2:'',
      delta2:'',
    }
  },
  computed:{
  },
  watch:{
    
  },
  methods:{
    download(id,name){
      let url=`/static/${Base64.decode(id)}`;
      let path = Base64.decode(id);
      let arr = path.split('/');
      let aTag = document.createElement('a')
      let packageName =name+this.mapId+'.'+arr[arr.length-1].split('.')[1]
      aTag.download = packageName;
      aTag.href = url;
      aTag.click();
    },
    showDialogClose(){
      this.isShowUp = false;
    },
    dialogClose(){
      this.reload()
      this.isShow = false;
    },
    edit(){
      updateRemark({...this.form,remark:this.formSize.remark}).then(res=>{
         if(res.code){
          this.$message.error(res.msg);
        }else{
          this.remark=this.formSize.remark
          this.replace('remark',this.remark);
          this.reload()  
        }
      })
    },
    imgShow(img,score){
      this.imgDialogVisible=true
      this.featurePointFile=Base64.decode(img)
      this.score=score+1
    },
    aa(){
       this.mapName=this.formSize.mapName
    },
    getInfo(){
      return new Promise((resolve,reject)=>{
        dentifiedImageInfo({id:JSON.parse(this.$route.query.row).id}).then(res=>{
          resolve();
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.showImgData=res.data.fileList
            this.showImgData.forEach(v=>v.fileId=Base64.decode(v.fileId))
            this.sparsePointCloudFileId = res.data.sparsePlyId;//稀疏
            this.densePointCloudFileId = res.data.densePlyId;//稠密
            this.sparseMapPath = Base64.decode(res.data.sparsePlyId);
            this.denseMapPath = Base64.decode(res.data.densePlyId);
          }
        }).catch(err=>{
          reject();
        })
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
      this.delta2 = this.clock.getDelta();
      controls.update(this.delta);
      controls2.update(this.delta2);
    },
  },
  created(){
    this.formSize=JSON.parse(this.$route.query.row)
    this.type=this.formSize.type
    this.form=JSON.parse(this.$route.query.row)
    this.$route.query.remark?this.formSize.remark =this.$route.query.remark:this.formSize.remark =this.formSize.remark
  },
  async mounted(){
    try{
      await this.getInfo();
    }catch(err){
      console.log(err)
    }
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
.imgDiv{
  width:200px;
  display:inline-block;
  margin:0px 25px 0;
}
#myImageEchart2 .sanlengzhu{
  font-size: 14px;
  width:150px;
  height:170px;
  border:#606266 solid 1px;
  text-align:center;
  line-height:170px;
  display:inline-block;
  background-size:100% 100%;
  background-repeat:no-repeat;
}
#myImageEchart2 .topSanlengzhu {
  margin:0 auto;
  position: relative;
  width: 0;
  height: 0;
  border: 76px solid transparent;
  border-bottom: 76px solid #606266;
  border-top:none;
}
#myImageEchart2 .topSanlengzhu2 {
  position: absolute;
  left:-75px;
  top:1px;
  width: 0;
  height: 0;
  border: 75px solid transparent;
  border-bottom: 75px solid #ffffff;
  border-top:none;
}
#myImageEchart2 .bottomSanlengzhu {
  margin:0 auto;
  position: relative;
  width: 0;
  height: 0;
  border: 76px solid transparent;
  border-top: 76px solid #606266;
  border-bottom:none;
}
#myImageEchart2 .bottomSanlengzhu2 {
  position: absolute;
  left:-75px;
  top:-76px;
  width: 0;
  height: 0;
  border: 75px solid transparent;
  border-top: 75px solid #ffffff;
  border-bottom:none;
}
#myImageEchart2 .cub{
  font-size: 14px;
  width:120px;
  height:120px;
  border:#606266 solid 1px;
  text-align:center;
  line-height:80px;
  display:inline-block;
  background-size:100% 100%;
  background-repeat:no-repeat;
}
#myImageEchart2 .cubSide{
  width:120px;
  height:120px;
  border:#606266 solid 1px;
  margin-left:242px
}
.myInput .el-input__count{
  line-height:14px;
  bottom: -14px;
}
</style>