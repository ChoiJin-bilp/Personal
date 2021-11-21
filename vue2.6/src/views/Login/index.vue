<template>
  <div class="content">
    <div class="load">
      <div class="loadcont">
        <div class="postop">
          <img src="../../assets/logo_3.png" />
          <!-- <span class="postop_tit">电子台账系统</span> -->
        </div>
        <img class="laygroup"
             src="../../assets/lay_group.png" />
        <div style="min-width: 480px;">
          <div class="welcome">
            欢迎登录
          </div>
          <el-form :model="loginForm"
                   :rules="rules"
                   ref="loginForm"
                   class="login-form">
            <el-form-item prop="loginId">
              <el-input prefix-icon="icon iconfont cq-a-zu2083"
                        v-model="loginForm.loginId"
                        ref="username"
                        @keyup.native.enter="login"
                        placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input prefix-icon="icon iconfont cq-a-zu3304"
                        ref="password"
                        placeholder="请输入密码"
                        v-model="loginForm.password"
                        show-password
                        @keyup.native.enter="login"
                        v-on:keyup.native.enter="login"></el-input>
            </el-form-item>
            <el-form-item prop="validateCode">
              <div class="vacode">
                <el-input prefix-icon="icon iconfont cq-a-zu3304"
                          class="vacodeinput"
                          ref="validateCode"
                          v-model="loginForm.validateCode"
                          @keyup.native.enter="login"
                          placeholder="请输入验证码"></el-input>
                <div class="identify"
                     @click="refreshCode">
                  <img :src="url" />
                  <!-- <ver-code :identifyCode="identifyCode"   生成随机码
                            :contentHeight="40"
                            style="height: 50px;"></ver-code> -->
                </div>
              </div>
            </el-form-item>
            <div class="btn-con">
              <!-- <el-checkbox class="btn-checked" v-model="checked">记住密码</el-checkbox> -->
              <el-button style="height:42px; width:360px;background: #448eff;font-size: 16px;"
                         @click="login"
                         type="primary">登录</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="standBard">
      <div>全球资金 尽在掌握 </div>
      <div>Copyright © 2021 Sky All Rights Reserved. </div>
      <div>http://www.skysz.com</div>
    </div>
    <EditDialog ref="Dialog"
                title="修改密码"></EditDialog>
  </div>
</template>

<script>
import { setCookie, removeCookie, getCookie } from '@/utils/cookie.js';
import { fetchLogin, getCode, ssoLogin } from '@/views/Login/api.js';
import { encrypt } from './index.js'
import EditDialog from "./Dialog.vue";
//import VerCode from '@/components/verCode';
import _ from 'lodash';
export default {
  components: { EditDialog },
  data () {
    let validateUsername = (rule, value, callback) => {
      if (value === '') {
        // this.$refs['username'].focus();
        callback(new Error(' '));
      } else {
        callback();
      }
    };
    let validatePassword = (rule, value, callback) => {
      if (value === '') {
        // this.$refs['password'].focus();
        callback(new Error(' '))
      } else {
        callback();
      }
    };
    let validateCheckword = (rule, value, callback) => {
      if (value === '') {
        // this.$refs['checkword'].focus();
        callback(new Error(' '));
      } else {
        callback();
      }
    };
    return {
      identifyCode: '',
      identifyCodes: '1234567890qwertyuiopasdfghjklzxcvbQWERTYUIOPASDFGHJKLZXCVBNM',
      checked: false,
      loginForm: {
        validateCode: '', //验证
        loginId: '', //登录名
        password: '', //密码
      },
      url: '',
      rules: {
        loginId: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        validateCode: [{ validator: validateCheckword, trigger: 'blur' }],
      },
    };
  },
  created () {
    this.refreshCode()
    this.$nextTick(() => {
      removeCookie('seessionId')
      localStorage.removeItem("store");
      this.$store.dispatch("updateRouters", []);
    });
    console.log(this.$route)
    if (this.$route.query.token) {
      this.ssoLogin({ token: this.$route.query.token })
    }
  },

  mounted () {
    this.$store.dispatch("routerData", []);
    this.$store.dispatch("updateRight", []);
  },
  methods: {
    async refreshCode () {
      try {
        let data = await getCode({ seed: Math.random() })
        this.url = 'data:image/png;base64,' + btoa(new Uint8Array(data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
      } catch (e) {
        console.log(e);
      }
    },
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[this.randomNum(0, this.identifyCodes.length)];
      }
    },
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    //登录
    async login () {
      this.$refs['loginForm'].validate((valid, msg) => {
        if (valid) {
          let sessionId = getCookie('sessionId') || '';
          var passWordS = encrypt(this.loginForm.password, this.loginForm.validateCode, "", "");
          fetchLogin({ ...this.loginForm, password: passWordS, JSESSIONID: sessionId }).then((res) => {
            //登录成功
            if (res.success) {
              this.$store.dispatch("updateUsers", res.infoMap);
              let tokenStr = res.infoMap.seessionId,
                UserName = this.loginForm.loginId,
                PassWord = this.loginForm.password,
                checked = this.checked;
              //缓存到cookies
              setCookie('seessionId', tokenStr, 0.5);
              setCookie('UserName', UserName, 1);
              //判断是否需要存储密码
              if (checked) {
                setCookie('PassWord', PassWord, 1);
              }
              let data = [
                {
                  name: '首页',
                  path: '/pms/home',
                  index: '1',
                },
              ];
              this.$store.dispatch('updateRouters', data);
              this.$router.push('/pms/home');
            } else {
              if (res.resultInfo == 'pwdModify') {
                this.$refs.Dialog.$emit("open", res.object.id, sessionId)
              }
              this.$refs['username'].focus();
              this.$refs['loginForm'].resetFields();
              this.$message.error(res.info || res.message);
              this.refreshCode()
            }
          });
        } else {
          // 取出错误信息第一个主动获取焦点
          let firstErr = _.entries(msg)[0];
          if (firstErr) {
            this.$refs[firstErr[0]].focus();
          }
          return false;
        }
      });
    },
    ssoLogin (params) {
      ssoLogin(params).then(res => {
        console.log('ssoLogin', res)
        if (res.success) {
          this.$store.dispatch("updateUsers", res.infoMap);
          let tokenStr = res.infoMap.seessionId
          setCookie('seessionId', tokenStr, 0.5);
          let data = [
            {
              name: '首页',
              path: '/pms/home',
              index: '1',
            },
          ];
          this.$store.dispatch('updateRouters', data);
          this.$router.push('/pms/home');
        } else {
          let sessionId = getCookie('sessionId') || '';
          if (res.resultInfo == 'pwdModify') {
            this.$refs.Dialog.$emit("open", res.object.id, sessionId)
          }
          this.$refs['username'].focus();
          this.$refs['loginForm'].resetFields();
          this.$message.error(res.info || res.message);
          this.refreshCode()
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
/deep/ .el-input--mini .el-input__inner {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  padding-left: 34px;
  width: 360px;
  border-radius: 2px;
}
.vacodeinput {
  /deep/ .el-input__inner {
    width: 136px;
  }
}

/deep/ .el-input--mini {
  width: 360px;
}
/deep/ .el-input__prefix {
  left: 12px;
  color: #448eff;
  line-height: 40px;
}
/deep/ .el-input--mini .el-input__icon {
  height: 40px;
  font-size: 17px;
}
.content {
  position: relative;
  background: url("../../assets/bg.jpg") no-repeat;
  background-size: 100% 100%;
  .load {
    width: 960px;
    height: 472px;
    background: #ffffff;
    border-radius: 12px;
    backdrop-filter: blur(8px);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    .loadcont {
      display: flex;
      position: relative;
      padding-top: 90px;
      justify-content: space-between;
      .postop {
        position: absolute;
        top: -26px;
        left: 50%;
        transform: translateX(-50%);
        width: 339px;
        height: 52px;
        opacity: 1;
        background: linear-gradient(81deg, #4098ff 0%, #4440ff 100%);
        border-radius: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 225px;
          height: 32px;
          margin-right: 6px;
        }
        .postop_tit {
          padding-left: 12px;
          height: 20px;
          line-height: 20px;
          color: rgba(255, 255, 255, 1);
          border-left: 2px solid rgba(255, 255, 255, 0.6);
        }
      }

      .laygroup {
        width: 480px;
        height: 380px;
      }
      .welcome {
        font-size: 18px;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        text-align: center;
        color: #33445e;
        margin-bottom: 28px;
        letter-spacing: 1.5px;
        padding-left: 8px;
      }
      .vacode {
        display: flex;
        height: 40px;
        /deep/.el-input--mini {
          width: 132px;
        }
        .identify {
          cursor: pointer;
          margin: -4px 10px;
        }
      }
      .login-form {
        padding: 0 40px;
        padding-left: 60px;
        margin: 0 auto;
        /deep/ .el-form-item--mini.el-form-item {
          margin-bottom: 28px !important;
        }
        .btn-con {
          width: 360px;
          display: flex;
          flex-direction: column;
          .btn-checked {
            margin-bottom: 10px;
            align-self: flex-end;
          }
        }
      }
    }
  }
}
.standBard {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 12px;
  font-family: Microsoft YaHei, Microsoft YaHei-Regular;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  line-height: 20px;
  margin-bottom: 14px;
}
@media screen and (max-width: 1366px) {
  .content {
    background: url("../../assets/bg2.jpg") no-repeat;
    background-size: 100% 100%;
  }
}
</style>
