<template>
  <div>
    <div v-if="$route.name=='mapInfoList'">
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
         <el-page-header @back="goTo()" content="地图库信息" style="font-size:24px;font-weight:bold;color:#614a4d;">
        </el-page-header>
      </div>
      <el-form ref="formSize" :model="formSize" label-width="130px" style="margin-top:20px;">
       <el-form-item label="地图库名称：">
        {{formSize.name}}
      </el-form-item>
      <el-form-item label="地图库类型：">
        <span v-if="formSize.type==0">无限制</span>
      </el-form-item>
       <el-form-item label="创建时间：">
        {{formSize.createTime}}
      </el-form-item>
      <el-form-item label="地图库密钥：">
        <el-input v-model="formSize.secret" :disabled="true"  style="width:60%"></el-input>
        <el-button type="text" class="ml20" @click="copyUrl2(formSize.secret)">复制密钥</el-button>
      </el-form-item>
      </el-form>
      <div>
        <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0">
          <span>
            <el-input v-model="wd" style="width:15%" suffix-icon="el-icon-search" maxlength="50"  placeholder="请输入地图名称"></el-input>
          </span>
          <span>
            <el-input v-model="q" style="width:15%" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入MapID"></el-input>
          </span>
           <span>
             状态：
            <el-select v-model="status" placeholder="请选择">
             <el-option label="全部" value></el-option>
             <el-option label="等待建图" value="1"></el-option>
             <el-option label="建图中" value="5"></el-option>
             <el-option label="正常" value="9"></el-option>
             <el-option label="未更新" value="15"></el-option>
             <el-option label="已停止" value="-5"></el-option>
             <el-option label="建图异常" value="-10"></el-option>
          </el-select>
          </span>
          <el-button style="float:right;margin-left:15px" type="primary" @click="mapLoad()">上传地图包
      </el-button>
        </el-row>
           <!-- 数据展示 -->
        <el-table :data="tableData2" ref="multipleTable2" tooltip-effect="dark" style="width: 100%" :max-height="tableHeight2"  border @sort-change="changeTableSort" :header-cell-style="headerCellStyle" :cell-style="cellStyle">
          <el-table-column
            prop="id" label="id "  align="center" width="80"
            sortable
            >
          </el-table-column>
          <el-table-column prop="name" label="地图名称" width="" align="center" sortable>
            <template slot-scope="scope">{{ scope.row.name?scope.row.name:'无'}}</template>
          </el-table-column>
          <el-table-column prop="mapKey" label="MapID" width="" align="center" sortable>
            <template slot-scope="scope">{{ scope.row.mapKey?scope.row.mapKey:'无'}}</template>
          </el-table-column>
          <el-table-column prop="size" label="地图大小" width="180" align="center" sortable>
             <template slot-scope="scope"> {{scope.row.size?(scope.row.size/(1024*1024)).toFixed(2)+'M':'-'}}</template>
          </el-table-column>
          <el-table-column prop="sceneId" label="地图类型" width="120" align="center" sortable>
             <template slot-scope="scope">
               <span  v-if="scope.row.sceneId==1">普通室内场景</span>
               <span  v-if="scope.row.sceneId==2">多植物场景</span>
             </template>
          </el-table-column>
           <el-table-column prop="status" label="状态" width="120" align="center" sortable>
              <template slot-scope="scope">
               <span  v-if="scope.row.status==1">等待建图</span>
               <span  v-if="scope.row.status==5">建图中</span>
               <span  v-if="scope.row.status==9">正常</span>
               <span  v-if="scope.row.status==15">未更新</span>
               <span  v-if="scope.row.status==-5">已停止</span>
               <span  v-if="scope.row.status==-10">建图异常</span>
            </template>
          </el-table-column>
		      <el-table-column prop="createTime" label="创建时间" width="200" align="center" sortable>
          </el-table-column>
          <el-table-column prop="updateTime" label="修改时间" width="200" align="center" sortable>
          </el-table-column>
           <el-table-column prop="runState" label="运行/停止" align="center" width="180" sortable>
          <template slot-scope="scope">
           <el-switch
                :disabled="!(scope.row.status ==9||scope.row.status ==15)"
                v-model="scope.row.runState"
                :active-value='1'
                :inactive-value='0'
                @change="upState(scope.row.runState,scope.row.id,scope.row.mapKey)"
              >
              </el-switch>
          </template>
        </el-table-column>
           <el-table-column  label="操作" width="240" align="center" >
            <template slot-scope="scope">
              <el-button type="danger" size="mini" v-if="scope.row.status==1||scope.row.status==5" @click="stopMap(scope.row.mapKey)">停止</el-button>
               <el-button
                type="success"
                size="mini"
                @click="$router.push({path:'/mapManageList/mapInfoList/mapInfo',query:{id:scope.row.id,oldQuery:JSON.stringify($route.query)}})"
              v-if="scope.row.status==-10||scope.row.status==-5||scope.row.status==9||scope.row.status==15"
              >管理</el-button>
              <el-button type="primary"
                         @click="isShowChart=true;mapCode=scope.row.mapCode;mapKey=scope.row.mapKey;mapStatus=scope.row.runState"
                         size="mini" v-if="scope.row.status==-10||scope.row.status==-5||scope.row.status==9||scope.row.status==15"
                         :disabled="scope.row.status==-10||scope.row.status==-5||scope.row.status==9">更新</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="del(scope.row.id)"
                :key="1"
              v-if="scope.row.status==-10||scope.row.status==-5||scope.row.status==9||scope.row.status==15"
               >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
         <div style="margin-top:15px"><pagination v-if="showPagination2"></pagination></div>
      </div>
       <div>
           <upMe :formSize="formSize" :mapVisible="mapVisible"></upMe>
       </div>
       <div v-if="isShowChart">
         <lineChartDialog :mapCode="mapCode" :mapKey='mapKey' :mapStatus='mapStatus'@lineChartDialogClose="lineChartDialogClose"></lineChartDialog>
       </div>
    </div>
     <router-view />
  </div>
</template>
<script>
import { Message,Loading } from 'element-ui';
import {mapActions,mapState} from 'vuex';
import {mapInfoList,mapInfoDel,autoStartMap,autoStopMap,stopMap} from "../../http/request";
import pagination from '../../share/pagination'
import lineChartDialog from './lineChartDialog'
import upMe from '../up'
  export default {
  name: 'mapInfoList',
  inject:['replace','reload','cellStyle','headerCellStyle'],
  data () {
    return {
      isShowChart:false,
      formSize:{
        name:'',
      },
      loading:true,
      wd:'',
      q:'',
      status:'',
      title:'上传地图包',
      type:1,
      mapVisible:false,
      tableData2:[],
      tableHeight2:200,
      showPagination2:false,
      total2:0,
      mapCode:'',
      mapKey:'',
      mapStatus:'',
      sortType:'',
      sortField:''

    }
  },
   created(){
    if(this.$route.name=='mapInfoList'){
      let query=this.$route.query
      this.formSize=JSON.parse(query.params)
      this.wd=query.wd
      this.q=query.q
      this.status=query.status||''
      let pageRecord = query.page||1;//记录上一次页码操作
      let limitRecord =query.limit||20;//记录上一次limit操作
       this.dataTable({page:query.page,limit:query.limit,q:query.q,wd:query.wd,status:query.status,mapDatabaseId:query.ids,sortType:this.sortType,sortField:this.sortField}).then(res=>{
        this.tableData2=res.data.items
        this.$store.commit('pagination/setTotal',res.data.total);
        this.$store.commit('pagination/setClickPage',pageRecord);
        this.$store.commit('pagination/setLimitPage',limitRecord);
        this.showPagination2 = true;//加载分页组件
      })
        
    }
  },
  methods:{
    lineChartDialogClose(){
      this.isShowChart =false;
    },
    copyUrl2(data)
  {
  let url = data;
  let oInput = document.createElement('input');
  oInput.value = url;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象;
  document.execCommand("Copy"); // 执行浏览器复制命令
  this.$message({
    message: '已成功复制到剪切板',
    type: 'success'
  });
  oInput.remove()
  },
  edit(data){
    this.mapVisible=true
    switch(data){
      case 1:
      this.title='修改名称'
      break;
      case 2:
      this.title='修改Bundle ID'
      break;
      case 3:
      this.title='修改Package Name '
      break;
      default:
      break;
    }
  },
  submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          this.reload()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
  goTo(){
    this.$router.push({path:'/mapManageList',query:JSON.parse(this.$route.query.msg)})
  },
  mapLoad(){
    this.mapVisible=!this.mapVisible
  },
  dataTable(params){
      return new Promise((resolve,reject)=>{
        mapInfoList(params).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
          }else{
            resolve(res);
          }
         
        }).catch(err=>{
          reject(err);
        })
      })
    },
    del(id){
      mapInfoDel({'id':JSON.stringify(id)}).then(res=>{
         if(res.code){
            this.$message.error(res.msg);
          }else{
              this.reload()
          }
      })
    },
    upState(state, id,mapKey) {
      let notice,resetStatus;
      if(state==1){
        notice = '确认运行吗？';
        resetStatus = 0;
        this.$confirm(notice).then(u=>{
        this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
        });
        autoStartMap({'mapId':mapKey}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
            this.tableData2.forEach(v=>{if(v.id==id){v.runState=resetStatus;}});
            this.loading.close();
          }else{
            this.loading.close();
            this.$message.success(res.msg);
          }
        }).catch(err=>{
          this.tableData2.forEach(v=>{if(v.id==id){v.runState=resetStatus;}});
          this.loading.close();
        })
      }).catch(error=>{
        this.tableData2.forEach(v=>{if(v.id==id){v.runState=resetStatus;}});
      })
      }else{
        notice = '确认停用吗？';
        resetStatus = 1;
        this.$confirm(notice).then(u=>{
        this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
        });
        autoStopMap({'mapId':mapKey}).then(res=>{
          if(res.code){
            this.$message.error(res.msg);
            this.tableData2.forEach(v=>{if(v.id==id){v.runState=resetStatus;}});
            this.loading.close();
          }else{
            this.loading.close();
            this.$message.success(res.msg);
          }
        }).catch(err=>{
          this.tableData2.forEach(v=>{if(v.id==id){v.runState=resetStatus;}});
          this.loading.close();
        })
      }).catch(error=>{
        this.tableData2.forEach(v=>{if(v.id==id){v.runState=resetStatus;}});
      })
      }
    },
    stopMap(id){
      stopMap(id).then(v=>{
        v.code&&this.$message.error(v.msg)&&this.reload();
        !v.code&&this.reload();
      })
    },
     changeTableSort(col){
      this.sortField = col.prop.replace(/[A-Z]/g,(a,b)=>{
          return '_'+a.toLowerCase();
        });
      this.sortType = col.order=='ascending'?'asc':'desc';
    },

  },
  computed:{
    ...mapState('pagination',{page:'clickPage',limit:'limitPage'}),
  },
  watch:{
    page(){
    if(this.$route.name=='mapInfoList'){
      this.replace("page",this.page);
    }

    },
    limit(){
      if(this.$route.name=='mapInfoList'){
      this.replace('limit',this.limit);
    }
    },
    wd(){
      this.$store.commit('pagination/setClickPage',1);
      this.replace('wd',this.wd);

    },
    q(){
        this.$store.commit('pagination/setClickPage',1);
        this.replace('q',this.q);
    },
    status(){
      this.$store.commit('pagination/setClickPage',1);
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

     if(this.$route.name=='mapInfoList'){
       let query=this.$route.query
       this.dataTable({page:query.page,limit:query.limit,q:query.q,wd:query.wd,status:query.status,mapDatabaseId:query.ids,sortType:this.sortType,sortField:this.sortField}).then(res=>{
        this.$nextTick(()=>{
        this.tableData2=res.data.items
        this.$store.commit('pagination/setTotal',res.data.total);
        this.showPagination2 = true;//加载分页组件
        })
       });
       
       this.$nextTick(()=>{
        this.tableHeight2 = window.innerHeight - this.$refs.multipleTable2.$el.offsetTop - 110;
      })
    }
  }
  },
   updated(){
    if(this.$route.name=='mapInfoList'){
      this.$nextTick(()=>{
        this.tableHeight2 = window.innerHeight - this.$refs.multipleTable2.$el.offsetTop - 130;
      })
    }
  },
  components: {
  pagination,
  upMe,
  lineChartDialog
}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.ml20{margin-left: 20px;}
.tac span {
  padding-left: 5px;
  padding-right: 10px;
}
</style>
