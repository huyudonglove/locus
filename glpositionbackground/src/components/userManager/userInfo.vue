<template>
  <div>
    <div style="height:50px;border-bottom:1px solid #DFDCDC;margin-bottom:10px;">
      <span style="font-size:24px;font-weight:bold;color:#614a4d;">用户详情</span>
    </div>
    <div>
      <el-form :inline="true" label-width="120px" :model="form">
        <el-form-item label="ID：" prop="id" required>
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="状态：" prop="isActive" required>
          <span v-if="form.isActive==1">已激活</span>
          <span v-if="form.isActive==2">未激活</span>
        </el-form-item>
      </el-form>
      <el-form ref="form" label-width="120px" :model="form">
        <el-form-item label="ID：" prop="id" required>
          <span>{{form.id}}</span>
        </el-form-item>
        <el-form-item label="用户名：" prop="userName" required>
          <span>{{form.userName}}</span>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email" required>
          <span>{{form.email}}</span>
        </el-form-item>
        <el-form-item label="手机：" prop="phone" required>
          <span>{{form.phone}}</span> <el-button type="text" size="mini" @click="showDialog('手机号码')">修改</el-button>
        </el-form-item>
        <el-form-item label="创建者：" prop="createBy" required>
          <span>{{form.createBy}}</span>
        </el-form-item>
        <el-form-item label="创建时间：" prop="createTime" required>
          <span>{{form.createTime}}</span>
        </el-form-item>
        <el-form-item label="修改时间：" prop="updateTime" required>
          <span>{{form.updateTime}}</span>
        </el-form-item>
        <el-form-item label="License数量：" prop="licenseCount" required>
          <span>{{form.licenseCount}}</span>
           <el-button type="text" size="mini" @click="$router.push({path:'/licenseManager',query:{saasCode:userCode}})">查看</el-button>
        </el-form-item>
        <el-form-item label="API KEY数量：" prop="apiKeyCount" required>
          <span>{{form.apiKeyCount}}</span> <el-button type="text" size="mini" @click="$router.push({path:'/service/apikeyList',query:{userCode}})">查看</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="$router.go(-1)">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :title="'修改'+title" :visible.sync="isShow" width="550px" center>
      <div style="text-align:center;position:relative;">
        <el-input v-if="title=='手机号码'" v-model="newPhone" style="width:200px;" maxlength="50"></el-input>
        <div v-if="isShowTips" style="color:#F56C6C;font-size:12px;line-height:1;padding-top:4px;position:absolute;top:100%;left:150px;">{{tips}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="isConfirm" type="primary" @click="confirm">{{isConfirm?'修改中...':'确定'}}</el-button>
        <el-button @click="isShow = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {editUser,getUserInfo} from '../../http/request'
export default {
  name:'userInfo',
  inject:['reload'],
  data(){
    return{
      loading:'',//loading框
      form:{
        id:'',
        userName:'',
        email:'',
        phone:'',
        createBy:'',
        createTime:'',
        updateTime:'',
        licenseCount:'',
        apiKeyCount:'',
        isActive:''
      },
      userCode:'',
      isShow:false,
      title:'',
      newPhone:'',
      isConfirm:false,
      tips:'',
      isShowTips:false
    }
  },
  watch:{
    newPhone(val){
        var reg =/^1[34578]\d{9}$/;
        if(val===''){
          this.isShowTips=true;
          this.tips='请输入手机号码';
        }else if(val!==''){
          this.isShowTips=false;
        }else if(reg.test(val)){
          this.isShowTips=false;
        }
    }
  },
  methods:{
    userInfo(){
      this.loading=this.$loading({
        lock: true,
        text: '数据获取中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      getUserInfo({"id":parseInt(this.$route.query.id)}).then(res=>{
        if(res.code){
          this.$message.error(res.msg);
        }else{
          this.form.id = res.data.id;
          this.form.userName = res.data.userName;
          this.form.createBy = res.data.createBy;
          this.form.updateTime = res.data.updateTime;
          this.form.createTime = res.data.createTime;
          this.form.phone = res.data.phone;
          this.form.email = res.data.email;
          this.form.licenseCount = res.data.licenseCount;
          this.form.apiKeyCount = res.data.apiKeyCount;
          this.form.isActive = res.data.isActive;
          this.userCode=res.data.userCode;
        }
        this.loading.close();
      }).catch(err=>{
        this.loading.close();
      })
    },
    showDialog(title){
      this.title = title;
      if(title=='手机号码'){
        this.newPhone = this.form.phone;
      }
      this.isShow = true;
    },
    confirm(){
      if(this.title=='手机号码'){
        var reg =/^1[34578]\d{9}$/;
        if(this.newPhone===''){
          this.isShowTips=true;
          this.tips='请输入手机号码';
          return;
        }else if(!reg.test(this.newPhone)){
          this.isShowTips=true;
          this.tips='请输入正确的手机号码';
          return;
        }
        this.isShowTips=false;
        this.isConfirm=true;
        editUser({"id":this.$route.query.id,"phone":this.newPhone}).then(res=>{
          this.isConfirm = false;
          if(res.code){
            this.$message.error(res.msg);
          }else{
            this.$message.success({message:'手机号码修改成功',center:true});
            this.isShow = false;
            this.reload();
          }
        }).catch(err=>{
          this.isConfirm = false;
        })
      }
    }
  },
  created(){
    this.userInfo();
  }
}
</script>

<style scoped>

</style>