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
      <pagination :totalNum="total"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from "../../share/pagination";
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
      tableHeight: 250,
      total: 0,
    };
  },
  computed: {
  },
  watch: {
    $route() {
      //判断路由query变化执行请求
      if (this.$route.name == "serviceList") {
        this.listData();
      }
    }
  },
  methods: {
    listData() {
      serverList({...this.$route.query}).then(res => {
        this.tableData = res.items;
        this.total = res.total;
      });
    },
  },
  created() {
    this.listData();
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
