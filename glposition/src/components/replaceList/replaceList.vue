<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">转换列表</span>
    </div>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
      <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入地图名称"></el-input>
      <span class="myWords">
        状态
        <el-select v-model="status" style="width:150px;">
          <el-option label="全部" value=""></el-option>
          <el-option label="等待转换" value="1"></el-option>
          <el-option label="正在转换" value="2"></el-option>
          <el-option label="已完成（正常）" value="3"></el-option>
          <el-option label="异常" value="-1"></el-option>
          <el-option label="误差评估中" value="5"></el-option>
        </el-select>
      </span>
    </el-row>
    <el-table ref="ReplaceRef" :data="table" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight">
      <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
      <el-table-column prop="mapLocation" label="地图位置" align="center"></el-table-column>
      <el-table-column prop="mapPackageSize" label="地图包大小(M)" align="center">
        <template slot-scope="scope">
          {{scope.row.mapPackageSize?(scope.row.mapPackageSize/(1024*1024)).toFixed(2):'0'}}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1">等待转换</span>
          <span v-if="scope.row.status==2&&scope.row.type===0">{{'正在转换'+scope.row.progress+'%'}}</span>
          <span v-if="scope.row.status==3">{{'已完成（正常） '}}<span style="color:#DCDFE6;">{{scope.row.finishTime}}</span></span>
          <span v-if="scope.row.status==-1">异常</span>
          <span  v-if="scope.row.status==2&&scope.row.type==1">误差评估中</span>
          <span  v-if="scope.row.status==2&&scope.row.type==2">{{'正在转换'+scope.row.progress+'%'}}</span>
          <span v-if="scope.row.status==6">等待空间多图构筑</span>
          <span v-if="scope.row.status==7">空间多图构筑中</span>
          <span v-if="scope.row.status==8">空间多图构筑完成</span>
          <span v-if="scope.row.status==9">空间多图构筑异常</span>
          <span v-if="scope.row.status==10">等待空间多图更新</span>
          <span v-if="scope.row.status==11">空间多图更新中</span>
          <span v-if="scope.row.status==12">空间多图更新完成</span>
          <span v-if="scope.row.status==13">空间多图更新异常</span>
        </template>
      </el-table-column>
      <el-table-column prop="uploadTime" label="上传时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status===1||scope.row.status===2||scope.row.status===5" type="danger" size="mini" @click="stop(scope.row.id)">停止</el-button>
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
import {getReplaceList,stopReplace} from '../../http/request'
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
      mySetInterval:null
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
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='replaceList'){
        this.listData();
      }
    }
  },
  methods:{
    stop(id){
      stopReplace({id}).then(res=>{
        this.reload();
      })
    },
    listData(){
      getReplaceList(this.$route.query).then(res=>{
        this.table=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    }
  },
  created(){
    this.listData();
    this.mySetInterval = setInterval(this.listData,30000);
    let pageRecord = this.$route.query.pageNum||1;//记录上一次页码操作
    let limitRecord = this.$route.query.pageSize||20;//记录上一次limit操作
    this.inputX = this.$route.query.mapLocation||'';
    this.status = this.$route.query.status||'';
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