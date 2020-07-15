<template>
    <div>
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;">sdk管理</span>
        <el-button  style="float:right;" type="primary" @click="$router.push('/addSdk')">新增sdk</el-button>
      </div>
      <div style="margin-top: 10px">
        <span class="myWords">名称：</span><el-input style="width: 250px;" @change="replace('page',1)" v-model="name"></el-input>
        <span class="myWords">版本号：</span><el-input style="width: 250px;" v-model="version"></el-input>
      </div>
      <div>
        <el-table :data="sdkData" style="width: 100%" border>
          <el-table-column prop="name" label="名称" >
          </el-table-column>
          <el-table-column prop="version" label="版本" width="180">
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              <span style="color: green" v-if="scope.row.status==1">上架</span>
              <span style="color: red" v-if="scope.row.status==2">下架</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="下载地址">
              <template slot-scope="scope">
                <span style="cursor: pointer" @click="downFile(scope.row,'sdkFileId','name')">{{scope.row.downloadUrl}}</span>
              </template>
          </el-table-column>
          <el-table-column  label="文档">
            <template slot-scope="scope">
              <span style="cursor: pointer" @click="downFile(scope.row,'documentFileId','documentFileName')">{{scope.row.documentFileName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="上下架">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2"  @change="changeSwitch(scope.row.status,scope.row.id,scope.row.name)">
                </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="$router.push({path:'/addSdk',query:{msg:JSON.stringify(scope.row)}})">编辑</el-button>
              <el-button size="mini" type="danger" @click="deleteSdk(scope.row.id)" >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <pagination :totalNum='totalNum' ></pagination>
      </div>
    </div>
</template>

<script>
  import {getSdk,operationSdk,deleteSdk} from "../../http/request";
  import pagination from  '../../share/pagination'
  import { Base64 } from 'js-base64';
  export default {
        name: "sdkList",
        data(){
          return{
            sdkData:[],
            totalNum:0,
            name:'',
            version:''
          }
        },
        components:{
          pagination
        },
        inject:['replace','reload'],
        methods:{
            getSdk(){
              let msg={
                pageNum:this.$route.query.page||1,
                pageSize:this.$route.query.limit||20,
                name:this.$route.query.name||'',
                version:this.$route.query.version||''
              };
              getSdk(msg).then(res=>{
                console.log(res);
                res.code&&this.$message.error(res.msg);
                !res.code&&(()=>{
                    this.sdkData=res.data.items;
                    this.totalNum=res.data.total;
                })();
              })
            },
            changeSwitch(status,id){
              let word='';
              let msg={
                id:id,
                status:status
              }
              status==1?word='确认上架吗':word='确认下架吗？'
                this.$confirm(word,'提示',{
                confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(()=>{
                  operationSdk(msg).then(res=>{
                    res.code&&this.$message.error(res.msg)&&this.getSdk();
                    !res.code&&this.$message.success(res.msg)&&this.getSdk();
                  })
                }).catch(()=>{
                  this.reload()
                })
            },
            deleteSdk(id){
              deleteSdk(id).then(res=>{
                res.code&&this.$message.error(res.msg)&&this.getSdk();
                !res.code&&this.$message.success(res.msg)&&this.getSdk();
              })
            },
          downFile(row,myProperty,fileName){
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
          }
        },
        watch:{
          $route(){
            this.getSdk();
          },
          name(){
            this.replace('name',this.name)
          },
          version(){
            this.replace('version',this.version)
          }
        },
        created() {
            this.getSdk()
        }
  }
</script>

<style scoped>

</style>
