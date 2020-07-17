<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;" v-if="$route.name=='cloudRecognitionList'">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">图像云识别管理</span>
      <!-- <el-button style="float:right;" type="primary" @click="$router.push({path:'/createRecognition',query:{databaseId:2}})">新建识别图库</el-button> -->
    </div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;" v-if="$route.name=='localRecognitionList'">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">图像本地识别管理</span>
      <!-- <el-button style="float:right;" type="primary" @click="$router.push({path:'/createRecognition',query:{databaseId:1}})">新建识别图库</el-button> -->
    </div>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
      <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入识别图库名称"></el-input>
    </el-row>
    <el-table ref="recognitionRef" :data="recognitionTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight">
      <el-table-column prop="name" label="识别图库" align="center"></el-table-column>
      <el-table-column prop="type" label="图库类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type==0">无限制</span>
        </template>
      </el-table-column>
      <el-table-column prop="identifiedImageCount" label="图片个数" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <el-button v-if="$route.name=='localRecognitionList'" type="warning" size="mini" @click="$router.push({path:'/recognitionInfo',query:{databaseId:1,myData:JSON.stringify(scope.row),oldQuery:JSON.stringify($route.query)}})">管理</el-button>
          <el-button v-if="$route.name=='cloudRecognitionList'" type="warning" size="mini" @click="$router.push({path:'/recognitionInfo',query:{databaseId:2,myData:JSON.stringify(scope.row),oldQuery:JSON.stringify($route.query)}})">管理</el-button>
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
import {getRecognitionList,delGlasses} from '../../http/request'
export default {
  name:'recognitionList',
  inject:['replace','reload'],
  components:{
    pagination,
  },
  data(){
    return{
      inputX:'',
      recognitionTable:[],
      showPagination:false,
      tableHeight:0,
    }
  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  },
  watch:{
    page(){
      this.replace('page',this.page);
    },
    limit(){
      this.replace('limit',this.limit);
    },
    inputX(){
      this.$store.commit('pagination/setClickPage',1);//重置第1页
      this.replace('inputX',this.inputX);
    },
    $route(){//判断路由query变化执行请求
      this.listData();
    }
  },
  methods:{
    listData(){
      this.recognitionTable=[];
      this.$store.commit('pagination/setTotal', 0);
      getRecognitionList({...this.$route.query,"identifiedType":this.$route.name=='cloudRecognitionList'?2:1}).then(res=>{
        this.recognitionTable=res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    },
  },
  created(){
    this.listData();
    let pageRecord = this.$route.query.page||1;//记录上一次页码操作
    let limitRecord = this.$route.query.limit||20;//记录上一次limit操作
    this.inputX = this.$route.query.inputX||'';
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.recognitionRef.$el.offsetTop - 110;
    })
  }
}
</script>

<style scoped>

</style>