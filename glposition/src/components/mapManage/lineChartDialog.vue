<template>
  <div>
    <el-dialog title="误差折线图" :visible.sync="dialogVisible" @close="close" width="1100px">
      <div style="text-align: center;color: red;" v-if="!(oldY.length||newY.length)">{{msg}}</div>
      <div ref="myEchart" style="width: 1000px;height: 500px;transform:translateX(-50%);margin-left:50%;"></div>

      <div v-if="mapStatus==1" class="myWords" style="color: red;text-align: center;margin-bottom: 10px">地图运行中，不能更新地图!</div>
      <div style="text-align:center;">
        <el-button type="primary" :disabled="mapAble||mapStatus==1" @click="changeMainMap">是，马上更新到原版本地</el-button>
        <el-button type="primary" @click="close">否，暂不更新</el-button>
        <el-button type="primary" :disabled="deleteAble" @click="deleteVersion()">我要删除新版本地图</el-button>
      </div>
    </el-dialog>
    <el-dialog title="误差图对比" :visible.sync="dialogSmall" @close="closeSmall" width="800px">
      <div></div>
      <div class="imgDiv">
        <el-image style="width:200px;height:200px;border:1px solid #DCDFE6" :src="source">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div style="text-align:center;">误差评估图</div>
      </div>
      <div class="imgDiv" v-if="relateOld">
        <el-image style="width:200px;height:200px;border:1px solid #DCDFE6" :src="relateOld" >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div style="text-align:center;">原版本</div>
      </div>
      <div class="imgDiv" v-if="relateNew">
        <el-image style="width:200px;height:200px;border:1px solid #DCDFE6" :src="relateNew">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
        <div style="text-align:center;">新版本</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const echarts = require('echarts');
import {getMapVersion,changeMainMap,getMapLine,deleteVersion} from "../../http/request";
import {Base64} from 'js-base64'
export default {
  name:'lineChartDialog',
  props:['mapCode','mapKey','mapStatus'],
  inject:['reload'],
  data(){
    return{
      dialogVisible:true,
      dialogSmall:false,
      mapAble:false,
      mapKeyNew:'',
      deleteAble:false,
      xLine:[],
      oldY:[],
      newY:[],
      mapCodeNew:'',
      name:'',
      oldData:[],
      newData:[],
      dataIndex:'',
      source:'',
      relateOld:'',
      relateNew:'',
      oldUuid:'',
      newUuid:'',
      msg:'',
      routeId:''
    }
  },
  watch:{
  },
  methods:{
    close(){
      this.$emit("lineChartDialogClose");
    },
    closeSmall(){

    },
    init(){
      this.$nextTick(()=>{
        var myChart = echarts.init(this.$refs.myEchart);
        myChart.setOption({
          title: {

          },
          tooltip: {},
          legend:{
            data:['原地图','新地图']
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
          this.oldData.length>0&&(()=>{
            this.source=`/line/${this.oldUuid}/source_images/${oldM.source_image}`;
            this.relateOld=`/line/${this.oldUuid}/relate_images/${oldM.relate_image}`;
          })();

          //console.log(this.source,'source')
          this.newData.length>0&&(()=>{
            var newM=this.newData[this.dataIndex];
            this.relateNew=`/line/${this.newUuid}/relate_images/${newM.relate_image}`
          })()

        });
      })
    },
    getMapVersion(){
      getMapVersion(this.mapKey).then(res=>{
        console.log(res);
        res.code&&this.$message.error(res.msg);
        !res.code&&(()=>{
          this.getMapLine(this.mapKey,'old');
          res.data.length==0&&(()=>{
            this.mapAble=true;
            this.deleteAble=true;
          })();
          res.data.length!=0&&(()=>{
            this.mapAble=false;
            this.deleteAble=false;
            res.data[0].status==3&&(()=>{
              this.mapAble=false;
              this.mapKeyNew=res.data[0].mapKey;
              this.mapCodeNew=res.data[0].mapCode;
              this.routeId=res.data[0].id;
              this.getMapLine(this.mapKeyNew,'new');
            })();
            res.data[0].status!=3&&(()=>{
              this.mapAble=true;
            })();
          })();
        })();
      })
    },
    changeMainMap(){
      this.$confirm('确认更新地图, 是否继续?', '提示', {
      confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(()=>{
        let msg={
          mapKey1:this.mapKey,
          mapKey2:this.mapKeyNew
        };
        changeMainMap(msg).then(res=>{
          res.code&&this.$message.error(res.msg);
          !res.code&&this.$message.success(res.msg);
          console.log(this.$route.query,'this.$route.query');
          this.$router.push({path:'/mapManageList/mapInfoList/mapInfo',query:{id:this.routeId,oldQuery:this.$route.query.oldQuery}});
          // this.reload();
        })
      }).catch(()=>{

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
              type=='new'&&(()=>{
                this.newUuid=res.data[0].uuid
              })();
              fetch(`/static/${Base64.decode(res.data[0].lineFileId)}`).then(res=>{
                return res.json();
              }).then(my=>{
                console.log(my,456);
                //console.log(this.xLine,789)
                type=='old'&&(()=>{
                  for (var i=1;i<=my.arcoce_images;i++){
                    this.xLine.push(i)
                  }
                  this.oldData=my.data;
                  my.data.map(v=>{
                    this.oldY.push(v.deviation)
                  })
                })();
                type=='new'&&(()=>{
                  this.newData=my.data;
                  my.data.map(v=>{
                    this.newY.push(v.deviation)
                  })
                })();
                console.log(this.oldY,111111111)
                console.log(this.newY,111111111)
                this.init();
              })
          })();
          !res.data.length&&(()=>{
              !(this.oldUuid||this.newUuid)&&(()=>{
                  this.msg='没有地图测试视频'
              })();
          })();
        })();
      })
    },
    deleteVersion(){
      deleteVersion(this.mapKeyNew).then(res=>{
        res.code&&this.$message.error(res.msg);
        !res.code&&this.reload();
      })
    }
  },
  mounted(){

  },
  created() {
    console.log(this.mapCode,this.mapKey,777);
    this.getMapVersion();
  }
}
</script>

<style scoped>
.imgDiv{
  width:200px;
  display:inline-block;
  margin:0px 25px 0;
}
</style>
