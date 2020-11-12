<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">SDK下载</span>
    </div>
    <el-table ref="sdkRef" border :data="sdkTable" tooltip-effect="dark" :max-height="tableHeight" :header-cell-style="headerCellStyle" :cell-style="cellStyle">
      <el-table-column label="名称" prop="name" align="center"></el-table-column>
      <el-table-column label="版本" prop="version" align="center"></el-table-column>
      <el-table-column label="下载地址" prop="unityVersion" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="download(scope.row,'sdkFileId','name')">点击下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="开发文档" prop="loadingLine" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="download(scope.row,'documentFileId','documentFileName')">下载文档</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
        <pagination v-if="showPagination"></pagination>
    </div>
  </div>
</template>
<script>
import {getSdkList} from '../../http/request'
import {Base64} from 'js-base64'
import {mapState} from 'vuex';
import pagination from '../../share/pagination'
export default {
  name:'sdkList',
  inject:['replace','cellStyle','headerCellStyle'],
  components:{
    pagination,
  },
  data(){
    return{
      sdkTable:[],
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
    $route(){//判断路由query变化执行请求
      this.listData();
    }
  },
  methods:{
    download(row,myProperty,fileName){
      let decodeUrl=`/static/${Base64.decode(row[myProperty])}`;
      let aTag = document.createElement('a');
      let pathArr = decodeUrl.split('/');
      let nameArr = pathArr[pathArr.length-1].split('.');
      aTag.style.display = "none";
      if(myProperty=='sdkFileId'){
        aTag.href = `/api/location/middleground/sdk/download?type=1&sdkId=${row.id}`;
      }else{
        aTag.download = row[fileName]+'.'+nameArr[nameArr.length-1];
        aTag.href = decodeUrl;
      }
      document.body.appendChild(aTag);
      aTag.click();
      URL.revokeObjectURL(aTag.href);    // 释放URL 对象
      document.body.removeChild(aTag);
    },
    listData(){
      getSdkList(this.$route.query).then(res=>{
        this.sdkTable = res.data.items;
        this.$store.commit('pagination/setTotal', res.data.total);
      })
    }
  },
  created(){
    this.listData();
    let pageRecord = this.$route.query.page||1;//记录上一次页码操作
    let limitRecord = this.$route.query.limit||20;//记录上一次limit操作
    this.$nextTick(()=>{
      this.$store.commit('pagination/setClickPage',pageRecord);
      this.$store.commit('pagination/setLimitPage',limitRecord);
      this.showPagination = true;//加载分页组件
    })
  },
  updated(){
    this.$nextTick(()=>{
      this.tableHeight = window.innerHeight - this.$refs.sdkRef.$el.offsetTop - 110;
    })
  }
}
</script>
<style scoped>

</style>