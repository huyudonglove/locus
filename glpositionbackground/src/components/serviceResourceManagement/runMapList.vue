<template>
  <div>
    <div v-if="$route.name=='runMapList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">运行地图列表
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
          prop="mapInfo.id"
          label="ID"
          width="100"
          align="center"
        ></el-table-column> -->
        <el-table-column
          prop="mapInfo.name"
          label="地图名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="mapInfo.runState"
          label="状态"
          align="center"
        >
         <template slot-scope="scope">
            <span
              v-if="scope.row.mapInfo.runState==1"
            >运行中</span>
            <span
              v-if="scope.row.mapInfo.runState==0"
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
          prop="servers"
          label="所属服务器"
          align="center"
          width=""
        >
         <template slot-scope="scope">
         {{scope.row.servers?scope.row.servers:'-'}}
        </template>
        </el-table-column>
        <!-- <el-table-column
          prop="userNumber"
          label="当前用户数量"
          width=""
          align="center"
        >
        <template slot-scope="scope">
         {{scope.row.userNumber?scope.row.userNumber:0}}
        </template>
        </el-table-column> -->
        <el-table-column
          prop="mapInfo.createBy"
          label="创建者"
          width=""
          align="center"
        ></el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="200"
          align="center"
          key=3
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.mapInfo.runState==1"
              type="danger"
              size="mini"
              @click="del(scope.row.mapInfo.mapKey)"
            >停止运行</el-button>
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
 mapState,autoStopMap
} from "../../http/request";
export default {
  name: "runMapList",
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
      if (this.$route.name == "runMapList") {
        this.listData();
      }
    }
  },
  methods: {
    listData() {
      mapState({...this.$route.query}).then(res => {
        this.tableData =res.items
        this.total = res.total;
      });
    },
    del(id) {
      autoStopMap({'mapId':id}).then(res => {
        if (res.code) {
          this.$message.error(res.msg);
        } else {
          this.reload();
        }
      });
    },
  },
  created() {
    this.listData();
  },
  updated() {
    if (this.$route.name == "runMapList") {
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
.btn
{
  display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #FFF;
    border: 1px solid #DCDFE6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: .1s;
    transition: .1s;
    font-weight: 500;
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
    font-size: 12px;
    border-radius: 3px;
    padding: 7px 15px;
}
</style>
