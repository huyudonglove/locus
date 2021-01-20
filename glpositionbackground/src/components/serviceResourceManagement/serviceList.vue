<template>
  <div>
    <div v-if="$route.name=='serviceList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">服务器列表
        </span>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%"
        class="mt15 mb15 el-table"
        :max-height="tableHeight"
        v-cloak
      >
        <!-- <el-table-column
          prop="id"
          label="ID"
          width="100"
          align="center"
        ></el-table-column> -->
        <el-table-column
          prop="serverModel.uuid"
          label="服务器名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serverModel.state"
          label="状态"
          align="center"
        >
         <template slot-scope="scope">
            <span
              v-if="scope.row.serverModel.state==1"
            >运行中</span>
            <span
              v-if="scope.row.serverModel.state==0"
            >未运行</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="runTime"
          label="占用时间"
          align="center"
        >
        <template slot-scope="scope">
         {{scope.row.runTime?scope.row.runTime:0}}
        </template>
        </el-table-column>
        <el-table-column
          prop="monitor.cpuRatio"
          label="CPU"
          align="center"
          width=""
        >
         <template slot-scope="scope">
         {{scope.row.monitor.cpuRatio?scope.row.monitor.cpuRatio:0}}
        </template>
        </el-table-column>
        <el-table-column
          prop="monitor.memoryRatio"
          label="内存"
          width=""
          align="center"
        >
         <template slot-scope="scope">
         {{scope.row.monitor.memoryRatio?scope.row.monitor.memoryRatio:0}}
        </template>
        </el-table-column>
        <el-table-column
          prop="monitor.gpuRatio"
          label="GPU"
          width=""
          align="center"
        >
         <template slot-scope="scope">
         {{scope.row.monitor.gpuRatio?scope.row.monitor.gpuRatio:0}}
        </template>
        </el-table-column>
      </el-table>
     <pagination v-if="showPagination"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from "../../share/pagination";
import {mapActions,mapState} from 'vuex';
import {
  serverList
} from "../../http/request";
export default {
  name: "serviceList",
  inject: ["replace", "reload"],
  data() {
    return {
      tableData: [
      ],
      loading:null,
      tableHeight: 250,
      total: 0,
      showPagination:false
    };
  },
  computed: {
     ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  },
  watch: {
    $route() {
      //判断路由query变化执行请求
      if (this.$route.name == "serviceList") {
       let query=this.$route.query
        let pageRecord = query.page||1;//记录上一次页码操作
        let limitRecord = query.limit||20;//记录上一次limit操作
        this.listData({...this.$route.query});
        this.$nextTick(()=>{
        this.$store.commit('pagination/setClickPage',pageRecord);
        this.$store.commit('pagination/setLimitPage',limitRecord);
        this.showPagination = true;//加载分页组件 
      }
        )
      }
    },
    page(){
      if(this.$route.name=='serviceList'){
      this.replace("page",this.page);
      }
      },
    limit(){
      if(this.$route.name=='serviceList'){

      this.replace('limit',this.limit);
      }
    },
    
  },
  methods: {
    listData() {
      this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      serverList({...this.$route.query}).then(res => {
        this.tableData = res.items;
        this.total = res.total;
        this.$store.commit('pagination/setTotal',this.total);
        this.showPagination = true;//加载分页组件 
        this.loading.close();
        }).catch(err=>{
          this.loading.close();
        })
    },
  },
   created() {
     let query=this.$route.query
     let pageRecord = query.page||1;//记录上一次页码操作
     let limitRecord = query.limit||20;//记录上一次limit操作
     this.listData();
     this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
     })
    
  },
  updated() {
    if (this.$route.name == "serviceList") {
      this.$nextTick(() => {
        this.tableHeight =
          window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
      });
    }
  },
  components: {
    pagination
  }
};
</script>

<style scoped>
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
