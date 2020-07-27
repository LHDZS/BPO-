<template>
  <div class="login">
      <!-- <div class="title">个体宝商户系统</div> -->
      <div class="dialog" v-if="loginType">
        <div class="name"><img src="https://gsb-zc.oss-cn-beijing.aliyuncs.com//zc_wxapplet_1585032971702.jpg" alt="">个体宝商户系统</div>
        <!-- <div class="laber">用户名：</div> -->
        <div class="input"><el-input v-model="phone" prefix-icon="el-icon-user" placeholder="请输入公司账号/手机号"></el-input></div>
        <!-- <div class="laber">登录密码：</div> -->
        <div class="input"><el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="password" show-password></el-input></div>
        <!-- <div class="validation">
            <div class="left"><el-input v-model="graphics" placeholder="请输入图形验证码"></el-input></div>
            <div class="right" @click="captchaPost">
                <div v-html="ImageArr.captcha"></div>
            </div>
        </div> -->
        <!-- <div class="forget" @click="loginType = false">忘记密码？</div> -->
        <div :class="phone != '' && password != '' ? 'determine' : 'determineNo'" @click="homeSkip">确定</div>
      </div>
      <div class="dialog" v-else>
        <div class="name" style="cursor: pointer;" @click="loginType = true"><i class="el-icon-back"></i>&nbsp;找回密码</div>
        <div class="laber">手机号：</div>
        <div class="input"><el-input v-model="phone2" placeholder="请输入公司账号/手机号"></el-input></div>
        <div class="laber">验证码：</div>
        <div class="validation">
            <div class="left"><el-input v-model="phoneSms" placeholder="请输入手机号验证码"></el-input></div>
            <div class="obtain" @click="validationSms(phone2)">
                {{countdownHtml}}
            </div>
        </div>
        <div class="laber">新密码：</div>
        <div class="input"><el-input v-model="password2" placeholder="请输入密码"></el-input></div>
        <div :class="phone2 != '' && phoneSms != '' ? 'determine' : 'determineNo'">确定</div>
      </div>
  </div>
</template>

<script>
import api from '@/api/api.js'
import {get, post} from '@/api/index.js'

export default {
  data () {
    return {
      loginType: true,
      ImageArr:{},
      phone:'',
      phone2: '',
      phoneSms: '',
      password: '',
      password2: '',
      graphics: '',
      countdownHtml: '获取验证码',
      times: 60
    }
  },
  methods: {
      homeSkip() {
        if (this.phone == '') {
            this.$message.error('请输入用户名')
            return
        }
//         var regMoblie = /^1[345678]\d{9}$/;
//         if(!regMoblie.test(this.phone)) {
//            this.$message.error('该手机号格式错误')
//            return;
//         }
        if (this.password == '') {
            this.$message.error('请输入密码')
            return
        }
        // if (this.graphics == '') {
        //     this.$message.error('请输入验证码')
        //     return
        // }
        post( api.login, {
            loginName: this.phone,
            password: this.password,
            captchaKey: this.ImageArr.key,
            captchaCode: this.graphics
        }).then((d) => {
            console.log(d,1)
            if (d.status == 0) {
                this.$message({
                    message: '登录成功',
                    type: 'success'
                })
                sessionStorage.setItem('xggsaamerchantsid', d.data.key);
                // sessionStorage.setItem('loginPhone', this.phone);
                // this.$router.push(this.$route.query.redirect);
                // let homePath = d.data.menus[0].team[0].path
                this.$router.push({path: '/registered'})
                
            }else {
                this.$message.error(d.msg)
            }
            console.log(d)
            
            //success callback
        }, (err) => {
            console.log(err.data.msg)
            //error callback
        })
          
      },
      captchaPost() {
        //   图片验证码
        post(api.captcha,{
           width: 81,
           height: 36 
        }).then((d) => {
            console.log(d,'图片')
            if (d.status === 0) {
                this.ImageArr = d.data
            }else {
                return console.log(d.msg)
            }
            
        }, (err) => {
            //error callback
        })
      },
      validationSms(moblie) {
        if (this.times != 60) {
            return;
        }
        if (moblie == '') {
           this.$message.error('请输入手机号')
           return;
        }
        //   短信验证码
        var regMoblie = /^1[345678]\d{9}$/;
        if(!regMoblie.test(moblie)) {
           this.$message.error('该手机号格式错误')
           return;
        }  
        post( api.smsCode, {
            mobile: moblie
        }).then((d) => {
            console.log(d,3)
            if (d.status == 0) {
                this.$message({
                    message: '发送成功',
                    type: 'success'
                })
                this.countdown()
            }else {
                this.$message.error(d.msg)
            }
            //success callback
        }, (err) => {
            //error callback
        })
      },
      //60秒倒计时
      countdown() {
         var that = this
         if(that.times == 0) {
            that.countdownHtml = "获取验证码"
            that.times = 60;
            return false;
         } else {
            that.countdownHtml = "" + that.times + "s"
            that.times--
         }
         setTimeout(function() {  
            that.countdown()
         }, 1000);
      },
  },
  components: {

  },
  mounted() {
    
    this.captchaPost()
  }
}
</script>

<style lang="less" scoped>
.login {
    width: 100%;
    height: 100%;
    background: url('https://gsb-zc.oss-cn-beijing.aliyuncs.com//zc_wxapplet_1585031928263.jpg') no-repeat;
    background-size: 100% 100%;
    padding-top: 83px;
    box-sizing: border-box;
    position: relative;
    .title {
        width:459px;
        height:50px;
        font-size: 36px;
        font-family:PingFangSC;
        font-weight:600;
        color:rgba(255,255,255,1);
        line-height:50px;
        letter-spacing:5px;
        margin-left: 99px;
    }
    .dialog {
        width:486px;
        height:450px;
        top: 26.85%;
        right: 9.92%;
        position: absolute;
        // background-color: #fff;
        padding: 19px 29px;
        box-sizing: border-box;
        .name {
            width:85%;
            margin: 0 auto;
            // height:20px;
            // width:322px;
            text-align: center;
            display: flex;
            height:72px;
            font-size:46px;
            font-family:PingFangSC-Semibold,PingFang SC;
            font-weight:600;
            color:rgba(58,58,58,1);
            line-height:72px;
            img {
                margin-right: 13px;
            }
        }
        .laber {
            width: 100%;
            height:20px;
            font-size:14px;
            font-family:PingFangSC;
            font-weight:500;
            color:rgba(51,51,51,1);
            line-height:20px;
            text-align: left;
            margin-top: 25px;
        }
        .input {
            width:100%;
            height:60px;
            background: rgb(232, 240, 254);
            border-radius:30px;
            border:1px solid rgba(224,224,224,1);
            overflow: hidden;
            margin-top: 50px;
            line-height: 60px;
        }
        .validation {
            width: 100%;
            height:52px;
            margin-top: 11px;
            .left {
                float: left;
                width:257px;
                height:52px;
                line-height: 52px;
                background:rgba(245,245,245,1);
                border-radius:6px;
                border:1px solid rgba(224,224,224,1);
            }
            .right {
                float: right;
                width:97px;
                height:52px;
                padding: 8px;
                box-sizing: border-box;
                background:rgba(245,245,245,1);
                div {
                    width: 100%;
                    height: 100%;
                    background-color: #fff;
                    cursor: pointer;
                }
            }
            .obtain {
                float: right;
                width:97px;
                height:52px;
                line-height: 52px;
                text-align: center;
                background:rgba(245,245,245,1);
                border-radius:6px;
                border:1px solid rgba(224,224,224,1);
                font-size:13px;
                font-family:PingFangSC;
                font-weight:400;
                color:rgba(153,153,153,1);
                cursor: pointer;
            }
        }
        .forget {
            width: 100%;
            font-size:13px;
            font-family:PingFangSC;
            font-weight:400;
            color:rgba(77,194,248,1);
            line-height:18px;
            text-align: right;
            padding: 11px 13px;
            box-sizing: border-box;
            cursor: pointer;
        }
        .determine {
            width:100%;
            height:60px;
            background:rgba(0,122,254,1);
            border-radius:30px;
            line-height: 60px;
            text-align: center;
            font-size:22px;
            font-family:PingFangSC;
            font-weight:400;
            color:rgba(255,255,255,1);
            margin-top: 50px;
            cursor: pointer;
        }
        .determineNo {
            width:100%;
            height:60px;
            background:rgba(226,226,226,1);
            border-radius:30px;
            line-height: 60px;
            text-align: center;
            font-size:22px;
            font-family:PingFangSC;
            font-weight:400;
            color:rgba(51,51,51,1);
            margin-top: 50px;
            cursor: pointer;
        }
    }
}
</style>

<style>
.login .el-input > .el-input__inner {
    /* background-color: rgba(245,245,245,1) !important; */
    height: 60px !important;
    line-height: 60px !important;
    border: none !important;
}
</style>
