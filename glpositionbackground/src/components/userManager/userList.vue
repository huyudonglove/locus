<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">用户管理</span>
      <el-button style="float:right;" type="primary" @click="$router.push({path:'/createuser'})">新增用户</el-button>
    </div>
    <el-row class="tac" style="border-bottom:1px solid #eeeeee; padding:15px 0;">
      <span class="myWords">
        <el-input v-model="inputX" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入名称" @change="replace('page',1);"></el-input>
      </span>
      <span class="myWords">
        <el-input v-model="email" style="width: 250px" suffix-icon="el-icon-search" maxlength="50" placeholder="请输入邮箱" @change="replace('page',1);"></el-input>
      </span>
    </el-row>
    <el-table ref="userRef" :data="userTable" border style="width: 100%" class="mt15 mb15" :max-height="tableHeight">
      <el-table-column prop="id" label="ID" width="100" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
      <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机" align="center"></el-table-column>
      <el-table-column prop="createBy" label="创建者" align="center"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="updateTime" label="修改时间" align="center"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200" align="center">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="del(scope.row.id)">删除</el-button>
          <el-button type="primary" size="mini" @click="$router.push({path:'/userInfo',query:{id:scope.row.id}})">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
        <pagination :totalNum="totalNum"></pagination>
    </div>
  </div>
</template>

<script>
import pagination from '../../share/page'
import {getUserList,delUser} from '../../http/request'
export default {
  name:'userList',
  inject:['replace','reload'],
  components:{
    pagination
  },
  data(){
    return{
      inputX:'',
      email:'',
      userTable:[],
      totalNum:0,
      tableHeight:0,
    }
  },
  watch:{
    inputX(){
      this.replace('userName',this.inputX);
    },
    email(){
      this.replace('email',this.email);
    },
    $route(){//判断路由query变化执行请求
      if(this.$route.name=='userList'){
        this.listData();
      }
    }
  },
  methods:{
    del(id){
      delUser({id}).then(res=>{
        this.listData();
      })
    },
    listData(){
      getUserList(this.$route.query).then(res=>{
        this.userTable=res.data.items;
        this.totalNum=res.data.total;
      })
    },
  },
  created(){
    this.listData();
    this.inputX = this.$route.query.userName||'';
    this.email = this.$route.query.email||'';
  },
  updated(){
    if(this.$route.name=='userList'){
      this.$nextTick(()=>{
        this.tableHeight = window.innerHeight - this.$refs.userRef.$el.offsetTop - 110;
      })
    }
  }
}
</script>

<style scoped>

</style>