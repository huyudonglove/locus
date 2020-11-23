<template>
  <div>
     <div  id="myImageEchart" style="overflow:hidden;font-size:14px">
            <div v-if="type==1">
             <div style="">
               <label>识别度：</label>
              <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score1" :key="index" /> 
              <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score1"  :key="index+10"/>
              </div>
            </div>
            <div v-if="type==2">
              <div>
              <label>正⾯识别度：</label>
              <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score1" :key="index+20" /> 
              <img   src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score1"  :key="index+30"/>
              <div style="margin-top:30px">
                <label>背⾯识别度：</label>
                <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score2" :key="index+40" /> 
                <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score2"  :key="index+50"/>
              </div>
              </div>
            </div>
            <div v-if="type==3">
                <div>
                  <label>正⾯识别度：</label>
                  <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score1" :key="index+60" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score1"  :key="index+70"/>
                </div>
                <div style="margin-top:30px">
                  <label>左面识别度：</label>
                  <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score2" :key="index+80" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score2"  :key="index+90"/>
                </div>
                <div style="margin-top:30px">
                  <label>右面识别度：</label>
                  <img  src="../../assets/starton.png" v-for="(item,index) in formSize.score3" :key="index+100" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score3"  :key="index+110"/>
                </div>
              </div>
            <div v-if="type==4">
                <div>
                  <label>正⾯识别度：</label>
                  <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score1" :key="index+120" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score1"  :key="index+130"/>
                </div>
                <div style="margin-top:30px">
                  <label>左面识别度：</label>
                  <img   src="../../assets/starton.png" v-for="(item,index) in formSize.score2" :key="index+140" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score2"  :key="index+150"/>
                </div>
                <div style="margin-top:30px">
                  <label>右面识别度：</label>
                  <img  src="../../assets/starton.png" v-for="(item,index) in formSize.score3" :key="index+160" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score3"  :key="index+170"/>
                </div>
                <div style="margin-top:30px">
                  <label style="">背⾯识别度：</label>
                  <img  src="../../assets/starton.png" v-for="(item,index) in formSize.score4" :key="index+160" /> 
                  <img  src="../../assets/startonOther.png" v-for="(item,index) in 5-formSize.score4"  :key="index+170"/>
                </div>
              </div>
            </div>
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
      type:4,
      dialogVisible:true,
      frontImgUrl:'',
      leftImgUrl:'',
      rightImgUrl:'',
      backImgUrl:'',
      direction:'',
      formSize:{
        score1:0,
        score2:0,
        score3:0,
        score4:0,
      }
    }
  },
  watch:{
    type(){
    //  if(this.type==1){
    //     this.frontImgUrl = Base64.decode(this.formSize.featurePointFile1);
    //  }else if(this.type==2){
    //     this.frontImgUrl = Base64.decode(this.formSize.featurePointFile1);
    //     this.backImgUrl = Base64.decode(this.formSize.featurePointFile2);
    //  }else if(this.type==3){
    //    this.frontImgUrl = Base64.decode(this.formSize.featurePointFile1);
    //    this.leftImgUrl = Base64.decode(this.formSize.featurePointFile2);
    //    this.rightImgUrl=Base64.decode(this.formSize.featurePointFile3);
    //  }else if(this.type==4){
    //    this.frontImgUrl = Base64.decode(this.formSize.featurePointFile1);
    //    this.leftImgUrl = Base64.decode(this.formSize.featurePointFile2);
    //    this.rightImgUrl=Base64.decode(this.formSize.featurePointFile3);
    //    this.backImgUrl=Base64.decode(this.formSize.featurePointFile4);
    //  }
    }
  },
  methods:{
   
   
  },
  
  created(){
    identifiedImageDegree({id:this.id}).then(res=>{
      this.type=this.types
      this.formSize=JSON.parse(JSON.stringify(res.data))
      this.formSize.score1!==null ?this.formSize.score1=this.formSize.score1+1:0
      this.formSize.score2!==null ?this.formSize.score2=this.formSize.score2+1:0
      this.formSize.score3!==null ?this.formSize.score3=this.formSize.score3+1:0
      this.formSize.score4!==null ?this.formSize.score4=this.formSize.score4+1:0
      })
  },
}
</script>

<style scoped>
#myImageEchart label{
  width: 120px;
  display: inline-block;
  text-align: right;
  /* padding: 0 12px 0 0; */
}
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
</style>
