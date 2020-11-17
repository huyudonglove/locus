<template>
  <div >
    <div v-if="$route.name=='mapManageList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;" v-if="!$route.query.id">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">地图库管理</span>
         <el-button style="float:right;" type="primary" @click="$router.push({path:'/replaceList'})" class="btnIcon"><img  src="../../assets/zhuanhuan.png"/><span class="btnIconSpan">转换列表</span></el-button>
      </div>
       <div style="height:50px;border-bottom:1px solid #DFDCDC;position:relative" v-if="$route.query.id">
         <el-page-header @back="goTo()" content="地图库管理" style="font-size:24px;font-weight:bold;color:#614a4d;">
        </el-page-header>
         <el-button style="position:absolute;right:0px;top:0px" type="primary" @click="$router.push({path:'/replaceList'})" class="btnIcon"><img  src="../../assets/zhuanhuan.png"/><span class="btnIconSpan">转换列表</span></el-button>
      </div>
         <!-- 数据展示 -->
        <el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" style="width: 100%" :max-height="tableHeight"  border :header-cell-style="headerCellStyle" :cell-style="cellStyle">
          <el-table-column
            prop="id" label="id "  align="center" width="80"
            >
          </el-table-column>
          <el-table-column prop="name" label="地图库名称 "  align="center">
          </el-table-column>
          <el-table-column prop="type" label="地图库类型" width="150" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.type==0">无限制</span>
            </template>
          </el-table-column>
          <el-table-column prop="mapCount" label="地图个数" width="150" align="center">
            <template slot-scope="scope">
              {{scope.row.mapCount?scope.row.mapCount:0}}
            </template>
          </el-table-column>
           <el-table-column prop="status" label="状态" width="150" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status==1">使用中</span>
            </template>
          </el-table-column>
		      <el-table-column prop="createTime" label="创建时间" width="200" align="center">
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="200" align="center">
          </el-table-column>
           <el-table-column  label="操作" width="240" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="$router.push({path:'/mapManageList/mapInfoList',query:{ids:scope.row.id,msg:JSON.stringify($route.query),params:JSON.stringify(scope.row)}})"
               >管理</el-button>
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
import {mapList} from "../../http/request";
  export default {
  name: 'mapManageList',
  inject:['replace','reload','cellStyle','headerCellStyle'],
  data () {
    return {
      showPagination:false,
      tableData:[],
      tableHeight:200,
      total:0
    }
  },
   created(){
     let query=this.$route.query
     let pageRecord = query.page||1;//记录上一次页码操作
     let limitRecord = query.limit||20;//记录上一次limit操作
     if(query.id){
        this.dataTable({...this.$route.query,licnese:this.$route.query.id})
     }else{
        this.dataTable({...this.$route.query})
     }
     this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件 
     })
  },
  watch:{
    page(){
      
      if(this.$route.name=='mapManageList'){
      this.replace("page",this.page);
      }
      },
    limit(){
      if(this.$route.name=='mapManageList'){
      this.replace('limit',this.limit);
      }
    },
    $route(){//判断路由query变化执行请求
      let query=this.$route.query
      let pageRecord = parseInt(query.page)||1;//记录上一次页码操作
      let limitRecord =  parseInt(query.limit)||20;//记录上一次limit操作
      if(this.$route.name=='mapManageList'){
         if(this.$route.query.id){
          this.dataTable({...this.$route.query,licnese:this.$route.query.id}).then(res=>{
          this.$store.commit('pagination/setClickPage',pageRecord);
          this.$store.commit('pagination/setLimitPage',limitRecord);
          this.showPagination = true;//加载分页组件 
          })
        }else{
          this.dataTable({...this.$route.query}).then(res=>{ 
          this.$store.commit('pagination/setClickPage',pageRecord);
          this.$store.commit('pagination/setLimitPage',limitRecord);
          this.showPagination = true;//加载分页组件 
     })
        }
      
      }
      
    }
  },
  computed:{
       ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  },
  methods:{
    dataTable(params){
      return new Promise((resolve,reject)=>{
        mapList(params).then(res=>{
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
    goTo(){
      this.$router.push({path:'/licenseManage',query:JSON.parse(this.$route.query.newQuery)})
    }
  },
  updated(){
    if(this.$route.name=='mapManageList'){
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
<style >
.btnIcon{
      padding: 8px 20px;
}
.btnIconSpan{
  line-height: 18px;
}
.btnIcon img{
  vertical-align:middle;margin-right:5px
}
/* .btnIcon-zhuanhuan{
  background: url('../../assets/zhuanhuan.png') center center no-repeat;
} */
.el-page-header__content{font-size:24px}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
