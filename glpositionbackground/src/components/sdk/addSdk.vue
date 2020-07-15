<template>
    <div>
      <div style="height:50px;border-bottom:1px solid #DFDCDC;">
        <span style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="!msg.id">新增sdk</span>
        <span style="font-size:24px;font-weight:bold;color:#614a4d;" v-if="msg.id">编辑sdk</span>
      </div>
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width: 30%;margin-top: 10px">
          <el-form-item label="名称" prop="name">
            <el-input v-model="ruleForm.name" :disabled="!!msg.id"></el-input>
          </el-form-item>
          <el-form-item label="版本号" prop="version">
            <el-input v-model="ruleForm.version" :disabled="!!msg.id">></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="ruleForm.status" placeholder="请选择" :disabled="!msg.id" v-if="!msg.id">
              <el-option label="下架" :value="2">
              </el-option>
            </el-select>
            <el-select v-model="ruleForm.status" placeholder="请选择" v-if="msg.id" @change="changeSwitch(ruleForm.status,msg.id)">
              <el-option label="下架" :value="2">
              </el-option>
              <el-option label="上架" :value="1">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下载地址" prop="sdkFileId">
            <uploadFile button-name="文件" moduleCode="locusSdk" type="sdk" @getSdkId="getSdkId" :parentName="downloadUrl"></uploadFile>
          </el-form-item>
          <el-form-item label="文档" prop="documentFileId">
            <uploadFile button-name="文件" moduleCode="locusPdf" type="pdf" @getSdkId="getSdkId" :parentName="ruleForm.documentFileName"></uploadFile>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" v-if="!msg.id">确定</el-button>
            <el-button type="primary" @click="updateSdk('ruleForm')" v-if="msg.id">确定</el-button>
            <el-button @click="$router.go(-1)">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
  import uploadFile from '../../share/uploadFile'
  import {addSdk,operationSdk,sdkInfo,updateSdk} from "../../http/request";

  export default {
        name: "addSdk",
        components:{uploadFile},
        data(){
          return{
            ruleForm: {
              id:'',
              name: '',
              version:'',
              status:2,
              sdkFileId:'',
              documentFileId:'',
              documentFileName:''
            },
            rules: {
              name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
              ],
              version: [
                { required: true, message: '请输入版本号', trigger: 'blur' },
                { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
              ],
              status: [
                { required: true, message: '请选择状态', trigger: 'blur' },
              ]
              ,
              sdkFileId: [
                { required: true, message: '下载地址不能为空', trigger: 'blur' }
              ],
              documentFileId: [
              ]
            },
            downloadUrl:'',
            msg:{}
          };
        },
        methods:{
          getSdkId(id,name,size,time,type){
              console.log(id,name,size,time,type,77777)
            type=='sdk'&&(()=>{
              this.ruleForm.sdkFileId=id;
            })();
            type=='pdf'&&(()=>{
              this.ruleForm.documentFileId=id;
              this.ruleForm.documentFileName=name.split('.').slice(0,-1).join('.');
            })();
          },
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                  addSdk(this.ruleForm).then(res=>{
                    res.code&&this.$message.error(res.msg);
                    !res.code&&(()=>{
                      this.$message.success(res.msg);
                      this.$router.go(-1);
                    })();
                  })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
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
                res.code&&this.$message.error(res.msg)&&this.sdkInfo();
                !res.code&&this.$message.success(res.msg)&&this.sdkInfo();
              })
            }).catch(()=>{
              this.reload()
            })
          },
          sdkInfo(){
            sdkInfo(this.msg.id).then(res=>{
              res.code&&this.$message.error(res.msg);
              !res.code&&(()=>{
                this.ruleForm.id=res.data.id;
                this.ruleForm.name=res.data.name;
                this.ruleForm.version=res.data.version;
                this.ruleForm.documentFileId=res.data.documentFileId;
                this.ruleForm.documentFileName=res.data.documentFileName;
                this.downloadUrl=res.data.downloadUrl;
                this.ruleForm.status=res.data.status;
                this.ruleForm.sdkFileId=res.data.sdkFileId;
              })();
            })
          },
          updateSdk(formName){
            this.$refs[formName].validate((valid) => {
              if (valid) {
                updateSdk(this.ruleForm).then(res=>{
                  res.code&&this.$message.error(res.msg);
                  !res.code&&(()=>{
                    this.$message.success(res.msg);
                    this.$router.go(-1);
                  })();
                })
              } else {
                console.log('error submit!!');
                return false;
              }
            });
          }
        },
        created() {
          this.$route.query.msg&&(()=>{
            console.log(1111111)
            let msg=JSON.parse(this.$route.query.msg);
            console.log(msg)
            this.msg=msg;
            this.sdkInfo();
          })();
        }
  }
</script>

<style scoped>

</style>
