<template>
  <div>
    <div v-if="$route.name=='apikeyList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">API KEY列表</span>
        <!-- <el-button style="float:right;" type="primary" @click="$router.push({path:'/service/createApikey',query:{oldQuery:JSON.stringify($route.query)}})">新增API KEY</el-button> -->
      </div>
      <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
        <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入名称"></el-input>
        <el-input v-model="createBy" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入创建者"></el-input>
      </el-row>
      <el-table ref="apikeyRef" :data="table" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight">
        <el-table-column prop="id" label="ID" width="60" align="center"></el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="apiKey" label="API KEY" align="center"></el-table-column>
        <el-table-column prop="apiSecret" label="API Secret" align="center"></el-table-column>
        <el-table-column prop="createBy" label="创建者" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" width="160" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" width="80" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="$router.push({path:'/service/apikeyInfo',query:{apiInfo:JSON.stringify(scope.row),oldQuery:JSON.stringify($route.query)}})">详情</el-button>
            <!-- <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <div>
          <pagination v-if="showPagination"></pagination>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex';
import pagination from '../../share/pagination'
import {getApikeyList,delApikey} from '../../http/request'
export default {
  name:'apikeyList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      createBy:'',
      table:[],
      showPagination:false,
      tableHeight:0,
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
      this.replace('name',this.inputX);
    },
    createBy(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('createBy',this.createBy);
    },
    $route(to){//判断路由query变化执行请求
      if(this.$route.name=='apikeyList'){
        if(JSON.stringify(to.query) == "{}"){
          this.inputX='';
          this.createBy='';
          this.$store.commit('pagination/setClickPage',1);
          this.$store.commit('pagination/setLimitPage',20);
          this.$store.commit('pagination/setTotal', 0);
        }
        this.listData();
      }
    }
  },
  methods:{
    listData(){
      getApikeyList(this.$route.query).then(res=>{
        this.table=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
    del(id){
      delApikey({id}).then(res=>{
        this.replace('pageNum',1);
        this.reload();
      })
    }
  },
  created(){
    this.listData();
    let pageRecord = this.$route.query.pageNum||1;//记录上一次页码操作
    let limitRecord = this.$route.query.pageSize||20;//记录上一次limit操作
    this.inputX = this.$route.query.name||'';
    this.createBy = this.$route.query.createBy||'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    if(this.$route.name=='apikeyList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.apikeyRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>
<style scoped>

</style>