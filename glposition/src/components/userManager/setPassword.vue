<template>
  <div class="h-div">
    <div class="h-login">
      <div class="h-head" v-if="$route.name=='setPassword'">设置密码</div>
      <div class="h-head" v-if="$route.name=='resetPassword'">重置密码</div>
      <el-form
        :model="pswForm"
        status-icon
        :rules="rules"
        ref="pswForm"
        label-width="94px"
        autocomplete="off"
        style="padding:15px 40px 0px 40px;margin-bottom:60px;"
        class="demo"
      >
        <el-form-item label="账号：" prop="userName">
          <span>{{$route.query.userName}}</span>
        </el-form-item>
        <el-form-item label="输入密码：" prop="password" required>
          <input type="password" class="is-hidden" />
          <el-input
            type="password"
            v-model="pswForm.password"
            maxlength="16"
            autocomplete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="confirmPassword" required>
          <input type="password" class="is-hidden" />
          <el-input
            type="password"
            v-model="pswForm.confirmPassword"
            maxlength="16"
            autocomplete="off"
          ></el-input>
        </el-form-item> 
      </el-form>
      <div class="btnDiv">
          <input
            type="button"
            class="currentBtn"
            @click="submitForm('pswForm')"
            value="确定"
            style="margin-right:30px"
          />
        </div>
    </div>
  </div>
</template>

<script>
import {setPassword} from '../../http/request';
  import CryptoJS from 'crypto-js';
export default {
  name: "setPassword",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
        // !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,30}$/.test(value)
      } else if (!/[0-9a-zA-Z]{1,16}/.test(value)) {
        callback(new Error("只能输入数字和字母,最多16位"));
      } else {
        if (this.pswForm.confirmPassword !== "") {
          this.$refs.pswForm.validateField("confirmPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pswForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      pswForm: {
        password: "",
        confirmPassword: "",
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        confirmPassword: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  mounted() {
    setPassword({code:this.$route.query.code}).then(res=>{
      if(res.code&&res.msg=='链接已过期'){
        this.$router.push('/losePage');
      }
    })
    this.pswForm.password = "";
    this.pswForm.confirmPassword = "";
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let keyStr='DF1052378682867B34A81D9E59F484C4';
          var key=CryptoJS.enc.Utf8.parse(keyStr);
          var psw=CryptoJS.enc.Utf8.parse(this.pswForm.password);
          var encrypted = CryptoJS.AES.encrypt(psw, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
          var password,confirmPassword;
          password=confirmPassword=encrypted.toString();
          console.log(password,confirmPassword,1515);
          setPassword({password,confirmPassword,code:this.$route.query.code}).then(res=>{
            if(res.code){
              this.$message.error(res.msg);
            }else{
              this.$message.success(res.msg);
              //this.$cookies.set('locationMiddlegroundToken',res.data.token);
              localStorage.setItem('locationMiddlegroundToken',res.data.token)
              this.$router.push('/');
            }
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
};
</script>

<style scoped>
.h-div {
  background: url("../../assets/bg.png") no-repeat center center;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
  position: absolute;
}
.h-login {
  position: relative;
  width: 440px;
  padding-bottom: 60px;
  background: rgba(250, 250, 250);
  left: 50%;
  margin-left:340px;
  top: 20%;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.h-head {
  text-align: center;
  border-bottom: 2px dashed #8488D1;
  width: 360px;
  height: 90px;
  margin: 0 auto;
  line-height: 90px;
  font-size: 26px;
  font-weight: bold;
}
.btnDiv input[type="button"] {
  width: 360px;
  height: 40px;
  background: rgba(223, 220, 220, 1);
  box-shadow: 0px 4px 10px 0px rgba(223, 220, 220, 0.3);
  border-radius: 5px;
  font-size: 18px;
  border: 0px none;
  cursor: pointer;
}
.h-login .el-input {
  width: 266px;
}
.btnDiv input.currentBtn {
  background: #8488D1;
  border: 2px solid #8488D1;
  box-shadow: 0px 4px 10px 0px #8488D1;
  color: #fff;
}
.code {
  width: 68px;
  text-align: center;
  /* color:#fff; */
  height: 36px;
  line-height: 36px;
  /* background:rgba(245,124,4,1); */
  /* border-radius:10px; */
  position: absolute;
  right: 40px;
  font-size: 14px;
  top: 4px;
  cursor: pointer;
  /* border: 1px solid #ff644e */
}
.posR {
  position: relative;
}
.btnDiv {
  clear: both;
  padding-left: 40px;
}
::-webkit-input-placeholder {
  color: #dfdcdc;
} /* 使用webkit内核的浏览器 */
:-moz-placeholder {
  color: #dfdcdc;
} /* Firefox版本4-18 */
::-moz-placeholder {
  color: #dfdcdc;
} /* Firefox版本19+ */
:-ms-input-placeholder {
  color: #dfdcdc;
} /* IE浏览器 */
/* .el-form-item__label{
		text-align: right;
    font-size: 16px !important;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box
	} */
.is-hidden {
  position: absolute;
  left: -10000px;
  top: -10000px;
}
</style>
