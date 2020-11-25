<template>
  <div>
    <el-dialog title="识别度和识别点" :visible.sync="dialogVisible" @close="close" width="700px"  :close-on-click-modal='false'>
          <div  id="myImageEchart" style="overflow:hidden">
            <div v-if="type==1">
            <div   :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="width:250px;height:250px;border:#606266 solid 1px;margin:0 auto;background-size:100% 100%;background-repeat:no-repeat;">
             </div>
             <div style="clear:both;padding-top:10px;width:200px;margin:0px auto">识别度：
              <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score1" :key="index" /> 
              <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score1"  :key="index+10"/>
              </div>
            </div>
            <div v-if="type==2" style="padding-left:30px">
              <div :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="width:200px;height:200px;border:#606266 solid 1px;float:left;margin-right:10px;text-align:center;line-height:200px;background-size:100% 100%;background-repeat:no-repeat;"></div>
              <div :style="{'background-image':backImgUrl?`url(/static/${backImgUrl})`:''}" style="width:200px;height:200px;border:#606266 solid 1px;float:left;text-align:center;line-height:200px;background-size:100% 100%;background-repeat:no-repeat;"></div>
              <div style="position:absolute;left:17px;top:57px;word-wrap:break-word;width:10px;height:150px;line-height:90px;">↑宽↓</div>
              <div style="position:absolute;left:50px;bottom:56px;">←&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→</div>
            <div style="clear:both;padding-top:20px;">
              <div class="pb10">正⾯识别度：
              <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score1" :key="index+20" /> 
              <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score1"  :key="index+30"/>
              <span style="padding-left:30px;">背⾯识别度:</span>
              <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score2" :key="index+40" /> 
              <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score2"  :key="index+50"/>
              </div>
            </div>
            </div>
            <div v-if="type==3">
              <div class="topSanlengzhu"><div class="topSanlengzhu2" ></div></div>
              <div style="width:454px;margin:0 auto;font-size:0;">
                <div class="sanlengzhu" :style="{'background-image':leftImgUrl?`url(/static/${leftImgUrl})`:''}" style="border-right:none;"></div>
                <div class="sanlengzhu" :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="border-right:none;"></div>
                <div class="sanlengzhu" :style="{'background-image':rightImgUrl?`url(/static/${rightImgUrl})`:''}"></div>
              </div>
              <div class="bottomSanlengzhu" ><div class="bottomSanlengzhu2" ></div>
              </div>
               <div style="position:absolute;left:87px;top:122px;word-wrap:break-word;width:10px;height:150px;line-height:82px;">↑高↓</div>
              <div style="position:absolute;left:124px;bottom:175px;">←&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;边长&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→</div>
              <div style="clear:both;padding-top:10px;width:220px;margin:0px auto">
                <div class="pb10">正⾯识别度：
                  <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score1" :key="index+60" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score1"  :key="index+70"/>
                </div>
                <div class="pb10">
                  <span style="">左面识别度：</span>
                  <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score2" :key="index+80" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score2"  :key="index+90"/>
                </div>
                <div class="pb10">
                  <span style="">右面识别度：</span>
                  <img  src="../../assets/starton.png" v-for="(item,index) in formSize.score3" :key="index+100" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score3"  :key="index+110"/>
                </div>
              </div>
            </div>
            <div v-if="type==4">
              <div class="cubSide"></div>
              <div style="width:500px;margin:0 auto;font-size:0;">
                <div class="cub" :style="{'background-image':backImgUrl?`url(/static/${backImgUrl})`:''}" style="border-right:none;"></div>
                <div class="cub" :style="{'background-image':leftImgUrl?`url(/static/${leftImgUrl})`:''}" style="border-right:none;"></div>
                <div class="cub" :style="{'background-image':frontImgUrl?`url(/static/${frontImgUrl})`:''}" style="border-right:none;"></div>
                <div class="cub" :style="{'background-image':rightImgUrl?`url(/static/${rightImgUrl})`:''}"></div>
              </div>
              <div class="cubSide"></div>
              <div style="position:absolute;left:70px;top:199px;word-wrap:break-word;width:10px;height:150px;line-height:50px;">↑高↓</div>
              <div style="position:absolute;left:225px;bottom:280px;">←&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;宽&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→</div>
              <div style="position:absolute;left:340px;bottom:162px">←&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;→</div>
              <div style="clear:both;padding-top:30px;width:220px;margin:0px auto">
                <div class="pb10">正⾯识别度：
                  <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score1" :key="index+120" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score1"  :key="index+130"/>
                </div>
                <div class="pb10">
                  <span style="">左面识别度：</span>
                  <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score2" :key="index+140" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score2"  :key="index+150"/>
                </div>
                <div class="pb10">
                  <span style="">右面识别度：</span>
                  <img  src="../../assets/starton.png" v-for="(item,index) in formSize.score3" :key="index+160" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score3"  :key="index+170"/>
                </div>
                <div class="pb10">
                  <span style="">背⾯识别度：</span>
                  <img  src="../../assets/starton.png" v-for="(item,index) in formSize.score4" :key="index+160" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score4"  :key="index+170"/>
                </div>
              </div>
            </div>
            
          </div>
    </el-dialog>
  </div>
</template>

<script>
import {Base64} from 'js-base64'
import {identifiedImageDegree} from '../../http/request'
export default {
  name:'upImgDialog',
  props:['id','types'],
  inject:['reload'],
  components:{
  },
  data(){
    return{
      type:null,
      dialogVisible:true,
      frontImgUrl:'',
      leftImgUrl:'',
      rightImgUrl:'',
      backImgUrl:'',
      direction:'',
      formSize:{}
    }
  },
  watch:{
    type(){
     if(this.type==1){
        this.frontImgUrl = Base64.decode(this.formSize.featurePointFile1);
     }else if(this.type==2){
        this.frontImgUrl = Base64.decode(this.formSize.featurePointFile1);
        this.backImgUrl = Base64.decode(this.formSize.featurePointFile2);
     }else if(this.type==3){
       this.frontImgUrl = Base64.decode(this.formSize.featurePointFile1);
       this.leftImgUrl = Base64.decode(this.formSize.featurePointFile2);
       this.rightImgUrl=Base64.decode(this.formSize.featurePointFile3);
     }else if(this.type==4){
       this.frontImgUrl = Base64.decode(this.formSize.featurePointFile1);
       this.leftImgUrl = Base64.decode(this.formSize.featurePointFile2);
       this.rightImgUrl=Base64.decode(this.formSize.featurePointFile3);
       this.backImgUrl=Base64.decode(this.formSize.featurePointFile4);
     }
    }
  },
  methods:{
    close(){
      this.$emit("showDialogClose");
    },
   
  },
  
  created(){
    console.log()
    identifiedImageDegree({id:this.id}).then(res=>{
      this.type=this.types
      this.formSize=JSON.parse(JSON.stringify(res.data))
      this.formSize.score1!==null ?this.formSize.score1=this.formSize.score1+1:null
      this.formSize.score2!==null ?this.formSize.score2=this.formSize.score2+1:null
      this.formSize.score3!==null ?this.formSize.score3=this.formSize.score3+1:null
      this.formSize.score4!==null ?this.formSize.score4=this.formSize.score4+1:null
      })
  },
}
</script>

<style scoped>
.imgDiv{
  width:200px;
  display:inline-block;
  margin:0px 25px 0;
}
#myImageEchart .sanlengzhu{
  font-size: 14px;
  width:150px;
  height:170px;
  border:#606266 solid 1px;
  text-align:center;
  line-height:170px;
  display:inline-block;
  background-size:100% 100%;
  background-repeat:no-repeat;
}
#myImageEchart .topSanlengzhu {
  margin:0 auto;
  position: relative;
  width: 0;
  height: 0;
  border: 76px solid transparent;
  border-bottom: 76px solid #606266;
  border-top:none;
}
#myImageEchart .topSanlengzhu2 {
  position: absolute;
  left:-75px;
  top:1px;
  width: 0;
  height: 0;
  border: 75px solid transparent;
  border-bottom: 75px solid #ffffff;
  border-top:none;
}
#myImageEchart .bottomSanlengzhu {
  margin:0 auto;
  position: relative;
  width: 0;
  height: 0;
  border: 76px solid transparent;
  border-top: 76px solid #606266;
  border-bottom:none;
}
#myImageEchart .bottomSanlengzhu2 {
  position: absolute;
  left:-75px;
  top:-76px;
  width: 0;
  height: 0;
  border: 75px solid transparent;
  border-top: 75px solid #ffffff;
  border-bottom:none;
}
#myImageEchart .cub{
  font-size: 14px;
  width:120px;
  height:120px;
  border:#606266 solid 1px;
  text-align:center;
  line-height:80px;
  display:inline-block;
  background-size:100% 100%;
  background-repeat:no-repeat;
}
#myImageEchart .cubSide{
  width:120px;
  height:120px;
  border:#606266 solid 1px;
  margin-left:322px
}
.pb10{
  padding-top: 10px;
}
</style>
