<template>
  <div id="imgup_xu">
    <el-dialog title="识别图上传" :visible.sync="dialogVisible" @close="close" width="500px" :close-on-click-modal="false" :show-close="false">
      <div v-if="isShowOne">
        <div class="myInput">
          <el-form ref="formOne" :model="formOne" :rules="ruleOne" label-position="top">
            <el-form-item label="类型：">
              <div style="padding-left:40px;">
                <div v-for="(item,idx) in typeList" :key="idx" style="float:left;margin-right:10px;cursor:pointer;">
                  <div @click="tabType(idx)" :style="{'background-image':`url(${require('../../assets/'+(item.isCheck?'active':'noactive')+item.id+'.png')})`}" style="width:86px;height:58px;background-repeat:no-repeat;background-size:100% auto;"></div>
                  <div style="text-align:center;">{{item.name}}</div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="识别图名称：" prop="imgName">
              <el-input v-model="formOne.imgName" placeholder="请输入识别图名称" maxlength="64"></el-input>
            </el-form-item>
            <el-form-item v-if="formOne.type==2||formOne.type==4" label="长度：" prop="imgLength">
              <el-input v-model="formOne.imgLength" style="width:96%;" placeholder="请输入长度" maxlength="10"></el-input><span> 米</span>
            </el-form-item>
            <el-form-item v-if="formOne.type!==3" label="宽度：" prop="imgWidth">
              <el-input v-model="formOne.imgWidth" style="width:96%;" placeholder="请输入宽度" maxlength="10"></el-input><span> 米</span>
              <p v-if="formOne.type==1" style="margin:0;color:#C0C4CC;font-size:10px;line-height:12px;">识别图的高度将由系统根据您上传的图片自动计算</p>
            </el-form-item>
            <el-form-item v-if="formOne.type==3||formOne.type==4" label="高度：" prop="imgHeight">
              <el-input v-model="formOne.imgHeight" style="width:96%;" placeholder="请输入高度" maxlength="10"></el-input><span> 米</span>
            </el-form-item>
            <el-form-item v-if="formOne.type==3" label="底面边长：" prop="imgBottomSideLength">
              <el-input v-model="formOne.imgBottomSideLength" style="width:96%;" placeholder="请输入底面边长" maxlength="10"></el-input><span> 米</span>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                type="textarea"
                :autosize="{ minRows: 3}"
                show-word-limit
                maxlength="500"
                placeholder="请输入备注"
                v-model="formOne.remark">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-form v-if="!isShowOne" ref="formSecond" :model="formSecond" :rules="ruleSecond" label-position="top">
        <el-form-item label="类型：">
          <div style="float:left;width:100%;" id="myImageEchart">
            <div  v-if="formOne.type==1" :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="width:200px;height:200px;border:#606266 solid 1px;margin:0 auto;background-size:100% 100%;background-repeat:no-repeat;"></div>
            <div v-if="formOne.type==2" style="padding-left:75px;">
              <div :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="width:150px;height:150px;border:#606266 solid 1px;float:left;margin-right:10px;text-align:center;line-height:150px;background-size:100% 100%;background-repeat:no-repeat;"><span :style="{'opacity':frontImgUrl?0:1}">正面</span></div>
              <div :style="{'background-image':backImgUrl?`url(/static/${backImgUrl})`:''}" style="width:150px;height:150px;border:#606266 solid 1px;float:left;text-align:center;line-height:150px;background-size:100% 100%;background-repeat:no-repeat;"><span :style="{'opacity':backImgUrl?0:1}">背面</span></div>
              <div style="position:absolute;left:61px;top:-28px;word-wrap:break-word;width:10px;height:122px;line-height:70px;">↑宽↓</div>
              <div style="position:absolute;left:75px;top:140px;width:152px;display:flex;justify-content:space-between;"><span>←</span>长<span>→</span></div>
            </div>
            <div v-if="formOne.type==3">
              <div class="topSanlengzhu"><div class="topSanlengzhu2" ></div></div>
              <div style="width:304px;margin:0 auto;font-size:0;">
                <div class="sanlengzhu" :style="{'background-image':leftImgUrl?`url(/static/${leftImgUrl})`:''}" style="border-right:none;"><span :style="{'opacity':leftImgUrl?0:1}">左面</span></div>
                <div class="sanlengzhu" :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="border-right:none;"><span :style="{'opacity':frontImgUrl?0:1}">正面</span></div>
                <div class="sanlengzhu" :style="{'background-image':rightImgUrl?`url(/static/${rightImgUrl})`:''}"><span :style="{'opacity':rightImgUrl?0:1}">右面</span></div>
              </div>
              <div style="position:absolute;left:64px;top:32px;word-wrap:break-word;width:10px;height:122px;line-height:50px;">↑高↓</div>
              <div style="position:absolute;left:78px;top:160px;width:102px;display:flex;justify-content:space-between;"><span>←</span>边长<span>→</span></div>
              <div class="bottomSanlengzhu" ><div class="bottomSanlengzhu2" ></div></div>
            </div>
            <div v-if="formOne.type==4">
              <div class="cubSide"></div>
              <div style="width:325px;margin:0 auto;font-size:0;">
                <div class="cub" :style="{'background-image':backImgUrl?`url(/static/${backImgUrl})`:''}" style="border-right:none;"><span :style="{'opacity':backImgUrl?0:1}">背面</span></div>
                <div class="cub" :style="{'background-image':leftImgUrl?`url(/static/${leftImgUrl})`:''}" style="border-right:none;"><span :style="{'opacity':leftImgUrl?0:1}">左面</span></div>
                <div class="cub" :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="border-right:none;"><span :style="{'opacity':frontImgUrl?0:1}">正面</span></div>
                <div class="cub" :style="{'background-image':rightImgUrl?`url(/static/${rightImgUrl})`:''}"><span :style="{'opacity':rightImgUrl?0:1}">右面</span></div>
              </div>
              <div style="position:absolute;left:52px;top:77px;word-wrap:break-word;width:10px;height:122px;line-height:30px;">↑高↓</div>
              <div style="position:absolute;left:147px;bottom:54px;width:82px;display:flex;justify-content:space-between;"><span>←</span>宽<span>→</span></div>
              <div style="position:absolute;left:228px;bottom:-26px;width:82px;display:flex;justify-content:space-between;"><span>←</span>长<span>→</span></div>
              <div class="cubSide"></div>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="formOne.type==1?'上传识别图：':'上传正面识别图：'" prop="frontImgFileId">
          <upComponent @getImgId="getImgId" :imgType="formOne.type" :width="formOne.imgWidth" :length="formOne.imgLength" :height="formOne.imgHeight" :bottom="formOne.imgBottomSideLength" :direction="'front'"></upComponent>
        </el-form-item>
        <el-form-item v-if="formOne.type==3||formOne.type==4" label="上传左面识别图：" prop="leftImgFileId">
          <upComponent @getImgId="getImgId" :imgType="formOne.type"  :width="formOne.imgWidth" :length="formOne.imgLength" :height="formOne.imgHeight" :bottom="formOne.imgBottomSideLength" :direction="'left'"></upComponent>
        </el-form-item>
        <el-form-item  v-if="formOne.type==3||formOne.type==4" label="上传右面识别图：" prop="rightImgFileId">
          <upComponent @getImgId="getImgId" :imgType="formOne.type" :width="formOne.imgWidth" :length="formOne.imgLength" :height="formOne.imgHeight" :bottom="formOne.imgBottomSideLength" :direction="'right'"></upComponent>
        </el-form-item>
        <el-form-item v-if="formOne.type==2||formOne.type==4" label="上传背面识别图：" prop="backImgFileId">
          <upComponent @getImgId="getImgId" :imgType="formOne.type" :width="formOne.imgWidth" :length="formOne.imgLength" :height="formOne.imgHeight" :bottom="formOne.imgBottomSideLength" :direction="'back'"></upComponent>
        </el-form-item>
        <el-form-item label="">
          <div style="line-height:16px;">请上传适合⽐例的.jpg 或 .png <span style="color:#8488D1;">（最大2M）</span></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="isShowOne" @click="dialogVisible=false" class="cancelButtonXu">取消</el-button>
        <el-button v-if="isShowOne" type="primary" @click="secondStep" class="confirmButtonXu">下一步</el-button>
        <el-button v-if="!isShowOne" @click="firstStep" class="cancelButtonXu">上一步</el-button>
        <el-button v-if="!isShowOne" type="primary" @click="add" class="confirmButtonXu">完成</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {checkImgIsRepeat,addIdentifiedImage} from '../../http/request'
import upComponent from './upComponent'
import {Base64} from 'js-base64'
export default {
  name:'upImgDialog',
  props:['mapId'],
  inject:['reload'],
  components:{
    upComponent
  },
  data(){
    return{
      dialogVisible:true,
      typeList:[{id:1,name:'单张图片',isCheck:true},{id:2,name:'双面图片组',isCheck:false},{id:3,name:'正三棱柱',isCheck:false},{id:4,name:'长方体',isCheck:false}],
      formOne:{
        type:1,
        imgName:'',
        imgLength:'',
        imgWidth:'',
        imgHeight:'',
        imgBottomSideLength:'',
        remark:''
      },
      ruleOne:{
        imgName:[{required: true, message: '请输入识别图名称', trigger: 'change'},{required: true, message: '请输入识别图名称', trigger: 'blur'},{pattern: /^[\_\-0-9A-Za-z]+$/, message: '识别图名称必须是英文、数字0-9、下划线或中划线', trigger: 'blur'}],
        imgLength:[{required: true, message: '请输入长度', trigger: 'change'},{required: true, message: '请输入长度', trigger: 'blur'},{validator: this.myValidator, trigger: 'blur'}],
        imgWidth:[{required: true, message: '请输入宽度', trigger: 'change'},{required: true, message: '请输入宽度', trigger: 'blur'},{validator: this.myValidator, trigger: 'blur'}],
        imgHeight:[{required: true, message: '请输入高度', trigger: 'change'},{required: true, message: '请输入高度', trigger: 'blur'},{validator: this.myValidator, trigger: 'blur'}],
        imgBottomSideLength:[{required: true, message: '请输入底面边长', trigger: 'change'},{required: true, message: '请输入底面边长', trigger: 'blur'},{validator: this.myValidator, trigger: 'blur'}],
      },
      isShowOne:true,
      formSecond:{
        frontImgFileId:undefined,
        leftImgFileId:undefined,
        rightImgFileId:undefined,
        backImgFileId:undefined,
      },
      ruleSecond:{
        frontImgFileId:[{required: true, validator: this.frontValidator, trigger: ['change','blur']}],
        leftImgFileId:[{required: true, message: '请上传左面识别图', trigger: ['change','blur']}],
        rightImgFileId:[{required: true, message: '请上传右面识别图', trigger: ['change','blur']}],
        backImgFileId:[{required: true, message: '请上传背面识别图', trigger: ['change','blur']}],
      },
      frontImgUrl:'',
      leftImgUrl:'',
      rightImgUrl:'',
      backImgUrl:'',
      countHeight:'',//计算高度
    }
  },
  watch:{
    'formOne.imgLength'(newValue, oldValue) {
      this.formOne.imgLength = this.judge(newValue);
    },
    'formOne.imgWidth'(newValue, oldValue) {
      this.formOne.imgWidth = this.judge(newValue);
    },
    'formOne.imgHeight'(newValue, oldValue) {
      this.formOne.imgHeight = this.judge(newValue);
    },
    'formOne.imgBottomSideLength'(newValue, oldValue) {
      this.formOne.imgBottomSideLength = this.judge(newValue);
    },
  },
  methods:{
    tabType(idx){
      this.typeList.forEach(v=>{v.isCheck=false});
      this.typeList[idx].isCheck=true;
      this.$refs.formOne.resetFields();
      this.formOne.imgName='';
      this.formOne.imgLength='';
      this.formOne.imgWidth='';
      this.formOne.imgHeight='';
      this.formOne.imgBottomSideLength='';
      this.formOne.remark='';
      this.formOne.type = this.typeList[idx].id;
    },
    close(){
      this.$emit("upImgDialogClose");
    },
    getImgId(fileId,type,direction,countHeight){
      if(type==1){
        this.countHeight = countHeight;
      }else{
        this.countHeight='';
      }
      if(direction=='front'){
        this.$refs.formSecond.clearValidate('frontImgFileId');//清除表单验证消息
      }
      if(direction=='left'){
        this.$refs.formSecond.clearValidate('leftImgFileId');//清除表单验证消息
      }
      if(direction=='right'){
        this.$refs.formSecond.clearValidate('rightImgFileId');//清除表单验证消息
      }
      if(direction=='back'){
        this.$refs.formSecond.clearValidate('backImgFileId');//清除表单验证消息
      }
      this.formSecond[direction+'ImgFileId'] = fileId;
      this[direction+'ImgUrl'] = Base64.decode(fileId);
    },
    firstStep(){
      this.isShowOne=true;
      this.formSecond.frontImgFileId=undefined;
      this.formSecond.leftImgFileId=undefined;
      this.formSecond.rightImgFileId=undefined;
      this.formSecond.backImgFileId=undefined;
      this.frontImgUrl='';
      this.leftImgUrl='';
      this.rightImgUrl='';
      this.backImgUrl='';
    },
    secondStep(){
      this.$refs.formOne.validate((valid) => {
        if (valid) {
          this.isShowOne=false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    frontValidator(rule, value, callback){
      if (this.formOne.type==1&&!value) {
        callback(new Error('请上传识别图'));
      }else if(!value){
        callback(new Error('请上传正面识别图'));
      }else{
        callback();
      }
    },
    myValidator(rule, value, callback){
      if (Number(value)==0) {
        callback(new Error('不能为0'));
      }else{
        callback();
      }
    },
    judge(value){//保留6位小数
      var p1 = /[^\d\.]/g;	// 过滤非数字及小数点 /g :所有范围中过滤
      var p2 = /(\.\d{6})\d*$/g;
      var p4 = /(\.)(\d*)\1/g;
      var newValue = value;
      newValue = newValue.replace(p1, "").replace(p2, "$1").replace(p4,"$1$2");
      newValue=newValue.replace(/[^0-9.]/g, '');
      if(newValue.length===1){
        newValue = newValue.replace('.','');
      }
      if(newValue.length===2&&newValue!='0.'){
        newValue = newValue.replace(/\b0/g,'');
      }
      var p5 = /\.+/g;	//多个点的话只取1个点，屏蔽1....234的情况
      newValue = newValue.replace(p5, ".")   
      var p6 = /(\.+)(\d+)(\.+)/g; //屏蔽1....234.的情况
      newValue = newValue.replace(p6, "$1$2")// 屏蔽最后一位的.
      return newValue;
    },
    add(){
      this.$refs.formSecond.validate((valid) => {
        if (valid) {         
          addIdentifiedImage({
            "name":this.formOne.imgName,
            "type":this.formOne.type,
            "remark":this.formOne.remark,
            "identifiedImageDatabaseId":JSON.parse(this.$route.query.myData).identifiedImageDatabaseId,
            "identifiedImageLength":this.formOne.imgLength?Number(this.formOne.imgLength):undefined,
            "identifiedImageWidth":this.formOne.imgWidth?Number(this.formOne.imgWidth):undefined,
            "identifiedImageHeight":this.formOne.imgHeight?Number(this.formOne.imgHeight):this.countHeight?Number(this.countHeight):undefined,
            "identifiedImageBottomSideLength":this.formOne.imgBottomSideLength?Number(this.formOne.imgBottomSideLength):undefined,
            "url1":this.formSecond.frontImgFileId,
            "url2":this.formOne.type==2?this.formSecond.backImgFileId:this.formSecond.leftImgFileId,
            "url3":this.formSecond.rightImgFileId,
            "url4":this.formOne.type==2?undefined:this.formSecond.backImgFileId,
          }).then(res=>{
            this.reload();
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>

<style>
.myInput .el-input__count{
  line-height:14px;
  bottom: -14px;
}
.imgDiv{
  width:200px;
  display:inline-block;
  margin:0px 25px 0;
}
#myImageEchart .sanlengzhu{
  font-size: 14px;
  width:100px;
  height:120px;
  border:#606266 solid 1px;
  text-align:center;
  line-height:120px;
  display:inline-block;
  background-size:100% 100%;
  background-repeat:no-repeat;
}
#myImageEchart .topSanlengzhu {
  margin:0 auto;
  position: relative;
  width: 0;
  height: 0;
  border: 50px solid transparent;
  border-bottom: 50px solid #606266;
  border-top:none;
}
#myImageEchart .topSanlengzhu2 {
  position: absolute;
  left:-48px;
  top:1px;
  width: 0;
  height: 0;
  border: 48px solid transparent;
  border-bottom: 48px solid #ffffff;
  border-top:none;
}
#myImageEchart .bottomSanlengzhu {
  margin:0 auto;
  position: relative;
  width: 0;
  height: 0;
  border: 50px solid transparent;
  border-top: 50px solid #606266;
  border-bottom:none;
}
#myImageEchart .bottomSanlengzhu2 {
  position: absolute;
  left:-48px;
  top:-49px;
  width: 0;
  height: 0;
  border: 48px solid transparent;
  border-top: 48px solid #ffffff;
  border-bottom:none;
}
#myImageEchart .cub{
  font-size: 14px;
  width:80px;
  height:80px;
  border:#606266 solid 1px;
  text-align:center;
  line-height:80px;
  display:inline-block;
  background-size:100% 100%;
  background-repeat:no-repeat;
}
#myImageEchart .cubSide{
  width:80px;
  height:80px;
  border:#606266 solid 1px;
  margin-left:229px;
}
#imgup_xu .el-form--label-top .el-form-item__label{
  padding: 0;
}
</style>
