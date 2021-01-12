<template>
  <div >
    <div v-if="$route.name=='licenseManage'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:20px;font-weight:bold;color:#000;">License授权管理</span>
        <el-button style="float:right;margin-left:15px" type="primary" @click="$router.push({path:'/licenseManage/licenseCreate/1'})">新建License许可证密钥
      </el-button>	
      </div>
         <!-- 数据展示 -->
        <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%" :max-height="tableHeight" :header-cell-style="headerCellStyle" :cell-style="cellStyle">
          <el-table-column
            prop="id" label="id "  align="center" width="80"
            >
          </el-table-column>
          <el-table-column prop="applicationName" label="应用名称"  align="center">
          </el-table-column>
          <el-table-column prop="type" label="SDK类型" width="180" align="center">
             <template slot-scope="scope">
               <span  v-if="scope.row.type==1">终极版</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间"  align="center">
          </el-table-column>
		      <el-table-column prop="updateTime" label="修改时间"  align="center">
          </el-table-column>
           <el-table-column  label="操作" width="250" align="center">
            <template slot-scope="scope">
               <el-button
                type="success"
                size="mini"
                @click="$router.push({path:'/licenseManage/licenseInfo',query:{id:scope.row.id,applicationName:scope.row.applicationName,type:scope.row.type,msg:JSON.stringify($route.query)}})"
              >查看</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="$router.push({path:'/mapManageList',query:{id:scope.row.id,newQuery:JSON.stringify($route.query)}})"
               >地图库管理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top:15px"><pagination v-if="showPagination"></pagination></div>
      </div>
    <router-view />
  </div>
</template>

<script>
import {mapActions,mapState} from 'vuex';
import pagination from '../../share/pagination'
import {licenseList} from "../../http/request";
  export default {
  name: 'licenseManage',
  inject:['replace','reload','cellStyle','headerCellStyle'],
  data () {
    return {
      showPagination:true,
      tableData:[],
      tableHeight:200,
      total:0
    }
  },
  async created(){
     let query=this.$route.query
     let pageRecord = query.page||1;//记录上一次页码操作
     let limitRecord = query.limit||20;//记录上一次limit操作
    await this.dataTable({...this.$route.query})
     this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件 
     })
  },
  watch:{
    page(){
      this.replace("page",this.page);
      },
    limit(){
      this.replace('limit',this.limit);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='licenseManage'){
        let query=this.$route.query
        let pageRecord = query.page||1;//记录上一次页码操作
        let limitRecord = query.limit||20;//记录上一次limit操作
        this.dataTable({...this.$route.query});
        this.$nextTick(()=>{
        this.$store.commit('pagination/setClickPage',pageRecord);
        this.$store.commit('pagination/setLimitPage',limitRecord);
        this.showPagination = true;//加载分页组件 
     })
      }
    }
  },
  computed:{
       ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  },
  methods:{
    dataTable(params){
      return new Promise((resolve,reject)=>{
        licenseList(params).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.tableData=res.data.items
            this.total=res.data.total
		        this.$store.commit('pagination/setTotal',this.total);
          } 
          resolve();
        }).catch(err=>{
          reject(err);
        })
      })
    },
  },
  updated(){
    if(this.$route.name=='licenseManage'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.multipleTable.$el.offsetTop - 110;
      })
    }
  },
   components: {
    pagination
  }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
