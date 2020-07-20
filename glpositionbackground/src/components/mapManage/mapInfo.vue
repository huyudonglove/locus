<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <el-page-header @back="$router.push({path:'/mapManageList/mapInfoList',query:JSON.parse($route.query.oldQuery)})" content="地图信息" style="font-size:24px;font-weight:bold;color:#614a4d;">
      </el-page-header>
    </div>
    <div class="mapDiv">
      <el-form :inline="true" label-position="right" label-width="100px" style="width: 100%">
        <el-form-item label="">
          <el-dropdown placement="bottom-start">
            <el-button size="mini" type="primary">
              下载地图数据<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="primary" size="mini" @click="download(densePointCloudFileId,'稠密')">下载稠密点云数据</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button type="primary" size="mini" @click="download(sparsePointCloudFileId,'稀疏')">下载稀疏点云数据</el-button>
              </el-dropdown-item>
              <el-dropdown-item>
                <el-button :disabled="!mapFileId" type="primary" size="mini" @click="download(mapFileId,'模型')">&nbsp;&nbsp;&nbsp;下载模型数据&nbsp;&nbsp;&nbsp;&nbsp;</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <!-- <el-form-item label="">
          <el-button type="primary" size="mini" @click="isShowChart=true"  :disabled="!(status==4)">更新地图</el-button>
        </el-form-item> -->
      </el-form>
      <el-form :inline="true" label-position="right" label-width="100px" style="width: 100%">
        <el-form-item label="地图名称：">
          <span>{{mapName}}</span>
        </el-form-item>
        <el-form-item label="地图大小：">
          <span>{{packageSize?(packageSize/(1024*1024)).toFixed(2)+'M':''}}</span>
        </el-form-item>
        <el-form-item label="MapID：">
          <span ref="gps">{{mapId}}</span> <el-button type="text" @click="copy('gps')">复制MapID</el-button>
        </el-form-item>
        <el-form-item label="状态：">
         <span  v-if="status==1">等待转换</span>
          <span  v-if="status==2">正在转换</span>
          <span  v-if="status==3">已完成（正常）</span>
          <span  v-if="status==-1">异常</span>
          <span  v-if="status==4">未更新</span>
        </el-form-item>
        <el-form-item label="GPS：">
          <span>{{gps}}</span> 
          <!-- <el-button type="text" @click="showDialog('GPS')">修改</el-button> -->
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
          <!-- <el-button type="text" @click="showDialog('备注')">修改</el-button> -->
        </el-form-item>
      </el-form>
      <el-form :inline="true" label-position="right" label-width="100px" style="width: 100%">
        <!-- <el-button size="mini" @click="visible=true" :disabled="!enableUpdateMap" type="primary">上传更新地图包</el-button> -->
        <el-form-item label="预览：">
          <div id="webglId">
            <div class="title">稀疏点云</div>
            <!-- <el-progress :show-text="false" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);" type="circle" :percentage="loadedData"></el-progress> -->
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
        <el-form label-width="100px">
          <el-form-item label="">
            <el-input v-if="title=='GPS'" v-model="newGps" style="width:200px;" placeholder="0.0.0.0" maxlength="50"></el-input>
            <el-input
              v-if="title=='备注'"
              style="width:350px;"
              type="textarea"
              :rows="4"
              maxlength="500"
              show-word-limit
              v-model="newDecription">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button :disabled="isConfirm" type="primary" @click="confirm">{{isConfirm?'修改中...':'确定'}}</el-button>
          <el-button @click="isShow = false">取 消</el-button>
        </span>
      </el-dialog>
      <!-- <el-button style="float:right;margin-left:15px" type="primary" @click="mapLoad()"  :disabled="!enableUpdateLine">更新误差评估视频</el-button> -->
      <div ref="myEchart" style="width: 1000px;height: 500px;transform:translateX(-50%);margin-left:50%;"></div>
      <upMe :mapKey="mapKey" :mapVisible="mapVisible"></upMe>
      <div v-if="isShowChart">
        <lineChartDialog @lineChartDialogClose="lineChartDialogClose" :mapKey="mapKey" :mapCode="mapCode"></lineChartDialog>
      </div>
      <div v-if="visible">
        <upM  :form-size="msg" @show="show"></upM>
      </div>
    </div>
    <el-dialog title="误差图对比" :visible.sync="dialogSmall" @close="dialogSmall=false" width="800px">
      <div></div>
      <div class="imgDiv">
        <el-image style="width:200px;height:200px;border:1px solid #DCDFE6" :src="source"> </el-image>
        <div style="text-align:center;">误差评估图</div>
      </div>
      <div class="imgDiv">
        <el-image style="width:200px;height:200px;border:1px solid #DCDFE6" :src="relateOld">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div style="text-align:center;">原版本</div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  const echarts = require('echarts');
import 'three/examples/js/controls/TrackballControls'
import 'three/examples/js/loaders/PLYLoader'
import {getMapInfo,editMapInfo} from '../../http/request'
import { Base64 } from 'js-base64';
import upMe from '../../share/upLoad'
import lineChartDialog from './lineChartDialog'
import upM from '../upM'
import {getMapVersion,getMapLine,checkMapEnableUpdate,getMapUpdate} from "../../http/request";
let scene,camera,controls,scene2,camera2,controls2;

export default {
  name:'mapInfo',
  data(){
    return{
      loading:null,
      maploading:true,
      loadedData:0,
      maploading2:true,
      isConfirm:false,
      mapName:'',
      packageSize:'',
      mapId:'',
      status:'',
      gps:'',
      createTime:'',
      updateTime:'',
      decription:'',
      sparsePointCloudFileId:'',
      sparseMapPath:'',
      densePointCloudFileId:'',
      denseMapPath:'',
      mapFileId:'',
      isShow:false,
      newGps:'',
      newDecription:'',
      title:'',
      renderer:'',
      clock:'',
      delta:'',
      renderer2:'',
      clock2:'',
      delta2:'',
      mapVisible:false,
      mapKey:'',
      isShowChart:false,
      visible:false,
      msg:{},
      mapCode:'',
      xLine:[],
      oldData:'',
      oldY:[],
      oldUuid:'',
      dataIndex:'',
      source:'',
      relateOld:'',
      dialogSmall:false,
      enableUpdateMap:false,
      enableUpdateLine:false
    }
  },
  methods:{
    show(){
      this.visible=false;
    },
    lineChartDialogClose(){
      this.isShowChart =false;
    },
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
    getInfo(){
      return new Promise((resolve,reject)=>{
        this.loading=this.$loading({
          lock: true,
          text: `数据加载中...`,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        getMapUpdate({"mapId":this.$route.query.id}).then(result=>{
          if(result.code){
            this.loading.close();
            this.$message.error(result.msg);
          }else{
            console.log(result,'result')
            getMapInfo({id:this.$route.query.id}).then(res=>{
              this.loading.close();
              resolve();
              if(res.code){
                this.$message.error(res.msg);
              }else{
                console.log(res,'res');
                this.msg=res.data;
                this.mapName = res.data.name;
                this.packageSize = res.data.size;
                this.mapId = res.data.mapKey;
                this.status = res.data.status;
                this.gps = res.data.gps;
                this.createTime = res.data.createTime;
                this.updateTime = res.data.updateTime;
                this.decription = res.data.description;
                this.sparsePointCloudFileId = result.resource?result.resource.sparsePlyId_new?result.resource.sparsePlyId_new:res.data.sparsePointCloudFileId:res.data.sparsePointCloudFileId;//稀疏
                this.densePointCloudFileId = result.resource?result.resource.densePlyId_new?result.resource.densePlyId_new:res.data.densePointCloudFileId:res.data.densePointCloudFileId;//稠密
                this.mapFileId = result.resource?result.resource.modelId_new?result.resource.modelId_new:'':'';//模型
                this.sparseMapPath = Base64.decode(this.sparsePointCloudFileId);
                this.denseMapPath = Base64.decode(this.densePointCloudFileId);
                this.mapKey=res.data.mapKey
                this.mapCode=res.data.mapCode;
                console.log(this.sparseMapPath,this.denseMapPath,'路径');
              }
            }).catch(u=>{
              this.loading.close();
            })
          }
        }).catch(()=>{
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
      if(title=='GPS'){
        this.newGps = this.gps;
      }else{
        this.newDecription = this.decription;
      }
      this.isShow = true;
    },
    confirm(){
      if(this.title=='GPS'){
        this.isConfirm=true;
        editMapInfo({"id":this.$route.query.id,"gps":this.newGps}).then(res=>{
          this.isConfirm = false;
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.$message.success(res.msg);
            this.gps = this.newGps;
            this.isShow = false;
          }
        }).catch(err=>{
          this.isConfirm = false;
        })
      }else{
        this.isConfirm=true;
        editMapInfo({"id":this.$route.query.id,"description":this.newDecription}).then(res=>{
          this.isConfirm = false;
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.$message.success(res.msg);
            this.decription = this.newDecription;
            this.isShow = false;
          }
        }).catch(err=>{
          this.isConfirm = false;
        })
      }
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
    mapLoad(){
    this.mapVisible=!this.mapVisible
  },
    init(){
      this.$nextTick(()=>{
        var myChart = echarts.init(this.$refs.myEchart);
        myChart.setOption({
          title: {

          },
          tooltip: {},
          legend:{
            data:['原价格','活动价格']
          },
          xAxis: {
            data: this.xLine
          },
          yAxis: {},
          series: [{
            name: '原地图',
            type: 'line',
            data: this.oldY
          },
            {
              name: '新地图',
              type: 'line',
              data: this.newY
            }]
        });
        myChart.on('click', 'series', (param)=>{
          this.dialogSmall =true;
          console.log(param)
          //this.name=param.name;
          this.dataIndex=param.dataIndex;
          var oldM=this.oldData[this.dataIndex];
          this.source=`/line/${this.oldUuid}/source_images/${oldM.source_image}`;
          this.relateOld=`/line/${this.oldUuid}/relate_images/${oldM.relate_image}`;
          console.log(this.source,'source')
          // this.newData.length>0&&(()=>{
          //   var newM=this.newData[this.dataIndex];
          //   this.relateNew=`/line/${this.newUuid}/relate_images/${newM.relate_image}`
          // })()

        });
      })
    },
    getMapVersion(){
      getMapVersion(this.mapCode).then(res=>{
        console.log(res);
        res.code&&this.$message.error(res.msg);
        !res.code&&(()=>{
          res.data.length==1&&(()=>{
            // this.mapAble=true;
            // this.deleteAble=true;
            this.getMapLine(this.mapKey,'old')
          })();
          res.data.length!=1&&(()=>{
            this.getMapLine(this.mapKey,'old')
            // res.data[0].status==3&&(()=>{
            //   this.mapAble=false;
            //   this.mapKeyNew=res.data[0].mapKey;
            //   this.mapCodeNew=res.data[0].mapCode;
            //   this.getMapLine(this.mapKeyNew,'new');
            // })();
            // res.data[0].status!=3&&(()=>{
            //   this.mapAble=true;
            // })();
          })();
        })();
      })
    },
    getMapLine(mapKey,type){
      getMapLine(mapKey).then(res=>{
        console.log(res,789);
        res.code&&this.$message.error(res.msg);
        !res.code&&(()=>{
          res.data.length&&(()=>{
            //console.log(res.data[0].lineFileId,7777777777)
            type=='old'&&(()=>{
              this.oldUuid=res.data[0].uuid;
              console.log(this.oldUuid,'ols')
            })();
            // type=='new'&&(()=>{
            //   this.newUuid=res.data[0].uuid
            // })();
            fetch(`/static/${Base64.decode(res.data[0].lineFileId)}`).then(res=>{
              return res.json();
            }).then(my=>{
              console.log(my,456);
              for (var i=1;i<=my.arcoce_images;i++){
                this.xLine.push(i)
              }
              //console.log(this.xLine,789)
              type=='old'&&(()=>{
                this.oldData=my.data;
                my.data.map(v=>{
                  this.oldY.push(v.deviation)
                })
              })();
              // type=='new'&&(()=>{
              //   this.newData=my.data;
              //   my.data.map(v=>{
              //     this.newY.push(v.deviation)
              //   })
              // })();
              console.log(this.oldY,111111111)
              console.log(this.newY,111111111)
              this.init();
            })
          })();
        })();
      })
    },
    checkMapEnableUpdate(){
      checkMapEnableUpdate(this.mapKey).then(res=>{
        //console.log(res,77777777)
        this.enableUpdateLine=res.data.enableUpdateLine;
        this.enableUpdateMap=res.data.enableUpdateMap;
      })
    }
  },
  created(){
    console.log(JSON.parse(this.$route.query.oldQuery))
  },
  async mounted(){
    await this.getInfo();
    this.getMapVersion();
    this.initScene();
    this.initCamera();
    this.initMesh();
    this.initLight();
    this.initRender();
    this.initControls();
    this.animate();
    this.checkMapEnableUpdate();

  },
  components: {
    upMe,
    lineChartDialog,
    upM
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
</style>
