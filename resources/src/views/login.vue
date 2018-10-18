<template>
    <div class="login-wrapper">
        <div class="login-content">
            <div class="login-logo">咪咕视讯互动管理系统</div>
            <div class="login-conBox">
                <div class="login-title text-center">
                    登录
                </div>
                <div class="login-box">
                    <el-form :model="form" :rules="rules" ref="form">
                        <el-form-item class="account-input" prop='loginName'>
                            <el-input v-model.trim="form.loginName" placeholder="用户名"></el-input>
                        </el-form-item>
                        <el-form-item class="account-input" prop='password'>
                            <el-input id="password" type="password" v-model.trim="form.password" placeholder="密码"></el-input>
                            <i class='pwd-hidden passIcon cursor' v-if="isPasswordVisible" @click="togglePassword"></i>
                            <i class='pwd-visible passIcon cursor' v-else @click="togglePassword"></i>
                        </el-form-item>
                        <el-form-item prop="verification" style="position:relative;">
                            <el-input :max-length='8' v-model.trim="form.verification" placeholder="验证码"></el-input>
                            <el-button class='v-button' type='primary' size='mini' v-if="isWaiting" disabled>{{verification_button}}</el-button>
                            <el-button class='v-button' type='primary' size='mini' @click="sendVerifiation" v-else>{{verification_button}}</el-button>
                        </el-form-item>
                        <el-button type="primary" @click="submitForms('form')" class="submit">登录</el-button>
                    </el-form>
                </div>
            </div>
        </div>
        <div class="login-footer">
            Copyright © 2018 咪咕视讯科技有限公司
        </div>
    </div>
</template>

<script>
    import { mapActions } from 'vuex'
    import utils from '../utils/misc';
    import cookies from '../utils/cookies';
    import Api from '../utils/api';
    import * as C from '../constants/api';
    export default {
        name: 'Login',
        data() {
            const checkRequired = message => (rule, value, callback) => {
                if (!utils.trim(value)) {
                    return callback(new Error(`${message}不可为空`))
                } else {
                    callback()
                }
            }

            return {
                form: {
                    loginName: '',
                    password: '',
                    verification: ''
                },
                rules: {
                    loginName: [{ validator: checkRequired('用户名'), trigger: 'change' }],
                    password: [{ validator: checkRequired('密码'), trigger: 'change' }],
                    verification: [{ validator: checkRequired('验证码'), trigger: 'change' }],
                },
                isPasswordVisible: false,
                isWaiting: false,
                verification_button: '获取验证码'
            };
        },

        beforeMount() {
            this.isOverDue()
        },


        methods: {
            ...mapActions(['showPageLoading', 'hidePageLoading']),

            isOverDue() {
                let v = this.getCookieValue("secondsremained") ? this.getCookieValue("secondsremained") : 0;//获取cookie值
                if (v > 0) {
                    this.settime(); //开始倒计时
                }
            },

            togglePassword() {
                let v = document
                    .getElementById('password')
                if (this.isPasswordVisible) {
                    v.type = 'password';
                } else {
                    v.type = 'text';
                }
                this.isPasswordVisible = !this.isPasswordVisible;
            },
            refreshImageCode() {
                this.imgCodeURL = C.CODE_IMG + '?t=' + Math.random();
            },

            resetForms(formNames) {
                this.$refs[formNames].resetFields();
            },

            //发送验证码
            sendVerifiation() {
                if (!this.form.loginName) return false
                if (!this.form.password) return false
                let params = { loginName: this.form.loginName, password: this.form.password };
                Api.sendMsgCode(`/${this.form.loginName}/${this.form.password}`, '').then(res => {
                    if (res.code == '200') {
                        this.isWaiting = true;
                        this.addCookie("secondsremained", 60, 60);
                        this.settime();
                    } else {
                        this.$message({
                            message: res.message,
                            type: 'warning'
                        })
                    }

                });
                // this.isWaiting = true;
                // this.addCookie("secondsremained", 60, 60);
                // this.settime();
            },

            //登录校验
            submitForms(formNames) {
                var vm = this;
                this.$refs[formNames].validate(valid => {
                    if (valid) {
                        const params = { ...this.form };
                        this.showPageLoading()
                        Api.login(`/${params.loginName}/${params.password}/${params.verification}`, '').then(res => {
                            this.hidePageLoading()
                            const { body } = res
                            if (res.code == 200) {
                                console.log(body)
                                sessionStorage.setItem('userName',body)
                                // const {userName, newtoken} = body
                                // sessionStorage.setItem('userName', userName);
                                // cookies.setCookie('Authorization', newtoken)                           
                                vm.$router.push('/comment/yingyuan/config');
                            } else {
                                this.$message({
                                    message: res.message,
                                    type: 'warning'
                                })
                            }
                        }).catch(this.hidePageLoading)
                    }
                });
            },

            getCookieValue(name) {
                var strCookie = document.cookie;
                var arrCookie = strCookie.split("; ");
                for (var i = 0; i < arrCookie.length; i++) {
                    var arr = arrCookie[i].split("=");
                    if (arr[0] == name) {
                        return unescape(arr[1]);
                        break;
                    }
                }
            },

            addCookie(name, value, expiresHours) {
                var cookieString = name + "=" + escape(value);
                //判断是否设置过期时间,0代表关闭浏览器时失效
                if (expiresHours > 0) {
                    var date = new Date();
                    date.setTime(date.getTime() + expiresHours * 1000);
                    cookieString = cookieString + ";expires=" + date.toUTCString();
                }
                document.cookie = cookieString;
            },

            //修改cookie的值
            editCookie(name, value, expiresHours) {
                var cookieString = name + "=" + escape(value);
                if (expiresHours > 0) {
                    var date = new Date();
                    date.setTime(date.getTime() + expiresHours * 1000); //单位是毫秒
                    cookieString = cookieString + ";expires=" + date.toGMTString();
                }
                document.cookie = cookieString;
            },

            //根据名字获取cookie的值
            getCookieValue(name) {
                var strCookie = document.cookie;
                var arrCookie = strCookie.split("; ");
                for (var i = 0; i < arrCookie.length; i++) {
                    var arr = arrCookie[i].split("=");
                    if (arr[0] == name) {
                        return unescape(arr[1]);
                        break;
                    }
                }
            },

            //开始倒计时
            settime() {
                let countdown = this.getCookieValue("secondsremained");
                let tim = setInterval(() => {
                    this.isWaiting = true;
                    countdown--;
                    this.verification_button = "重新发送(" + countdown + ")";
                    if (countdown <= 0) {
                        clearInterval(tim);
                        this.verification_button = "获取验证码";
                        this.isWaiting = false;
                    }
                    this.editCookie("secondsremained", countdown, countdown + 1);
                }, 1000) //每1000毫秒执行一次
            }
        }
    };
</script>


<style lang='scss'>
    .login-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        .login-content {
            height: 100%;
            flex: 1;
            background: url('../layouts/images/login_bg.jpg') center center;
            background-size: cover;
            .login-logo {
                position: absolute;
                top: 40px;
                left: 40px;
                font-size: 20px;
                color: #ffffff;
                text-shadow: 5px 2px 6px #666666;
            }

            .login-conBox {
                width: 330px;
                background: #fff;
                padding: 20px;
                position: absolute;
                right: 130px;
                top: 130px;
                border-radius: 5px;

                .login-title {
                    height: 50px;
                    margin-top: 20px;
                    font-size: 18px;
                    color: #888;
                }
                .login-box {
                    .account-input {
                        position: relative;
                        margin-bottom: 20px;
                        .passIcon {
                            width: 21px;
                            height: 15px;
                            display: inline-block;
                            position: absolute;
                            background: url(../layouts/images/pwd-hidden.png) center center no-repeat;
                            background-size: cover;
                            right: 13px;
                            top: 9px;
                        }
                        .pwd-visible {
                            opacity: 0.4;
                        }
                        .pwd-hidden {
                            opacity: 1;
                        }
                    }
                    .el-input__inner {
                        border: none;
                        border-radius: 0;
                        border-bottom: 1px solid #e0e0e0;
                        padding-left: 0;
                    }
                    .el-input__icon:hover+.el-input__inner,
                    .el-input__inner:hover {
                        box-shadow: 0px 0px 6px #fff;
                        border-bottom: 1px solid #e0e0e0 !important;
                    }
                    .el-input__inner::-webkit-input-placeholder {
                        color: #a0a0a0;
                    }

                    .submit {
                        width: 285px;
                        height: 34px;
                        background: #46bafe;
                        color: #fff;
                        text-align: center;
                        line-height: 34px;
                        margin-top: 20px;
                        padding: 0px;
                    }
                    .submit:hover {
                        opacity: 0.8;
                    }

                    .v-button {
                        position: absolute;
                        top: 0;
                        right: 0;
                    }
                }
            }
        }
        .login-footer {
            height: 60px;
            line-height: 60px;
            font-size: 14px;
            color: #333333;
            text-align: center;
            background-color: #ffffff;
        }
    }
</style>