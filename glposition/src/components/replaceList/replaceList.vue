<template>
  <div>
    <!-- <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">转换列表</span>
    </div> -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="地图转换" name="地图转换"></el-tab-pane>
      <el-tab-pane label="误差评估" name="误差评估"></el-tab-pane>
      <el-tab-pane label="激光扫描" name="激光扫描"></el-tab-pane>
      <!-- <el-tab-pane label="空间多图" name="空间多图"></el-tab-pane> -->
    </el-tabs>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
      <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入地图名称"></el-input>
      <span class="myWords">
        状态
        <el-select v-model="status" clearable style="width:200px;">
          <el-option v-for="(item,i) in statusList" :key="i" :label="item.msg" :value="item.code"></el-option>
        </el-select>
      </span>
    </el-row>
    <el-table ref="ReplaceRef" :data="table" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight" @sort-change="changeTableSort">
      <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
      <el-table-column prop="mapLocation" label="地图位置" align="center" sortable></el-table-column>
      <el-table-column prop="mapPackageSize" label="地图包大小(M)" align="center" sortable>
        <template slot-scope="scope">
          {{scope.row.mapPackageSize?(scope.row.mapPackageSize/(1024*1024)).toFixed(2):'0'}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center" sortable>
        <template slot-scope="scope">
          <span v-if="scope.row.status==1&&scope.row.type==0">等待建图</span>
          <span v-if="scope.row.status==5&&scope.row.type==0">{{'建图中'+scope.row.progress+'%'}}</span>
          <span v-if="scope.row.status==9&&scope.row.type==0">{{'已完成建图（'+scope.row.finishTime+'）'}}</span>
          <span v-if="scope.row.status==-10&&scope.row.type==0">建图异常</span>
          <span v-if="scope.row.status==2&&scope.row.type==0">等待重建</span>
          <span v-if="scope.row.status==6&&scope.row.type==0">{{'重建中'+scope.row.progress+'%'}}</span>
          <span v-if="scope.row.status==10&&scope.row.type==0">{{'重建完成（'+scope.row.finishTime+'）'}}</span>
          <span v-if="scope.row.status==-9&&scope.row.type==0">重建异常</span>
          <span v-if="scope.row.status==1&&scope.row.type==1">等待评估</span>
          <span v-if="scope.row.status==5&&scope.row.type==1">{{'评估中'+scope.row.progress+'%'}}</span>
          <span v-if="scope.row.status==10&&scope.row.type==1">{{'评估完成（'+scope.row.finishTime+'）'}}</span>
          <span v-if="scope.row.status==-10&&scope.row.type==1">评估异常</span>
          <span v-if="scope.row.status==1&&scope.row.type==2">等待重构点云</span>
          <span v-if="scope.row.status==5&&scope.row.type==2">{{'重构点云中'+scope.row.progress+'%'}}</span>
          <span v-if="scope.row.status==10&&scope.row.type==2">{{'重构点云完成（'+scope.row.finishTime+'）'}}</span>
          <span v-if="scope.row.status==-10&&scope.row.type==2">重构点云异常</span>
          <span v-if="scope.row.status==1&&scope.row.type==3">等待空间多图构筑</span>
          <span v-if="scope.row.status==5&&scope.row.type==3">{{'空间多图构筑中'+scope.row.progress+'%'}}</span>
          <span v-if="scope.row.status==9&&scope.row.type==3">{{'空间多图构筑完成（'+scope.row.finishTime+'）'}}</span>
          <span v-if="scope.row.status==-10&&scope.row.type==3">空间多图构筑异常</span>
          <span v-if="scope.row.status==2&&scope.row.type==3">等待空间多图更新</span>
          <span v-if="scope.row.status==6&&scope.row.type==3">{{'空间多图更新中'+scope.row.progress+'%'}}</span>
          <span v-if="scope.row.status==10&&scope.row.type==3">{{'空间多图更新完成（'+scope.row.finishTime+'）'}}</span>
          <span v-if="scope.row.status==-9&&scope.row.type==3">空间多图更新异常</span>
          <span v-if="scope.row.status==-5">已停止</span> 
        </template>
      </el-table-column>
      <el-table-column prop="uploadTime" label="上传时间" align="center" sortable></el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===6||scope.row.status===5||scope.row.status===1||scope.row.status===2" type="danger" size="mini" @click="stop(scope.row.id)">停止</el-button>
          <span v-else>--</span>
        </template>
      </el-table-column>
    </el-table>
    <div>
        <pagination v-if="showPagination"></pagination>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex';
import pagination from '../../share/pagination'
import {getReplaceList,stopReplace,getStatusList} from '../../http/request'
export default {
  name:'replaceList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      table:[],
      showPagination:false,
      tableHeight:0,
      status:'',
      statusList:[],
      mySetInterval:null,
      activeName:'地图转换',
      sortType:'desc',
      sortField:'upload_time'
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  },
  watch:{
    page(){
      this.replace('pageNum',this.page);
    },
    limit(){
      this.replace('pageSize',this.limit);
    },
    inputX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('mapLocation',this.inputX);
    },
    status(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('status',this.status);
    },
    sortField(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('sortField',this.sortField);
    },
    sortType(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('sortType',this.sortType);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='replaceList'){
        this.listData();
      }
    }
  },
  methods:{
    handleClick(tab, event) {
      switch(tab.name){
        case '地图转换':
          this.getStatus(0);
          this.replace('type',0);
          break;
        case '误差评估':
          this.getStatus(1);
          this.replace('type',1);
          break;
        case '激光扫描':
          this.getStatus(2);
          this.replace('type',2);
          break;
        case '空间多图':
          this.getStatus(3);
          this.replace('type',3);
          break;
        default:
          break;
      }
      this.inputX = '';
      this.status = '';
      this.sortField = 'upload_time';
      this.sortType = 'desc';
      this.$refs.ReplaceRef.clearSort();
      this.$store.commit('pagination/setClickPage',1);
      this.$store.commit('pagination/setLimitPage',20);
    },
    stop(id){
      stopReplace({id}).then(res=>{
        this.reload();
      })
    },
    getStatus(type){
      getStatusList({type}).then(res=>{
        this.statusList=res.data;
        var arr = res.data.map(v=>v.msg);
        var newArr = Array.from(new Set(arr));
        if(arr.length>newArr.length){
          this.statusList.splice(arr.indexOf('已停止'),1);
        }
        
      })
    },
    changeTableSort(col){
      this.sortField = col.prop.replace(/[A-Z]/g,(a,b)=>{
          return '_'+a.toLowerCase();
        });
      this.sortType = col.order=='ascending'?'asc':'desc';
    },
    listData(){
      let params = this.$route.query.type?this.$route.query:{type:0,...this.$route.query}
      params= this.$route.query.sortType&&this.$route.query.sortField?params:{sortType:'desc',sortField:'upload_time',...params}
      getReplaceList(params).then(res=>{
        this.table=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    }
  },
  created(){
    this.activeName=this.$route.query.type?
    this.$route.query.type==1?'误差评估':
    this.$route.query.type==2?'激光扫描':
    this.$route.query.type==3?'空间多图':'地图转换':'地图转换';
    this.getStatus(Number(this.$route.query.type)?Number(this.$route.query.type):0);
    this.listData();
    this.mySetInterval = setInterval(this.listData,30000);
    let pageRecord = this.$route.query.pageNum||1;//记录上一次页码操作
    let limitRecord = this.$route.query.pageSize||20;//记录上一次limit操作
    this.inputX = this.$route.query.mapLocation||'';
    this.status = Number(this.$route.query.status)||'';
    this.sortField = this.$route.query.sortField||'upload_time';
    this.sortType = this.$route.query.sortType||'desc';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  destroyed(){
    clearInterval(this.mySetInterval);
  },
  updated(){
    if(this.$route.name=='replaceList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.ReplaceRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>
<style scoped>

</style>