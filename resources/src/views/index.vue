<template>
    <div class="page-section">
        <div class="page-header">
            <header>
                <div class="logo">
                </div>
                <div class="avatar">
                    <el-dropdown @command="handleCommand" trigger="click">
                        <span class="el-dropdown-link cursor">
                            {{currentUser}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <span>{{password.userName}}</span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="updatePassword">密码修改</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="logout" @click="logout">
                    <i class='icon-logout'></i> 退出
                </div>
            </header>
        </div>

        <div class="page-content-wrapper">
            <div class='sidebar'>
                <el-menu :default-active="currentActiveIndex" :unique-opened='true' :router="true">
                    <el-submenu index='0'>
                        <span slot='title'>
                            <i class='fa fa-comment-o'></i> 评论管理
                        </span>

                        <el-menu-item index='/comment/yingyuan/config'>
                            <i class='fa'></i> 父评论列表
                        </el-menu-item>
                        <el-menu-item index='/comment/son_comment/config'>
                            <i class='fa'></i> 子评论列表
                        </el-menu-item>

                        <el-menu-item index='/comment/black_user/config'>
                            <i class='fa'></i> 评论用户黑名单
                        </el-menu-item>

                        <el-menu-item index='/comment/black_program/config'>
                            <i class='fa'></i> 评论节目黑名单
                        </el-menu-item>

                        <el-menu-item index='/comment/word/config'>
                            <i class='fa'></i> 评论敏感词
                        </el-menu-item>

                    </el-submenu>

                    <el-submenu index='2'>
                        <span slot='title'>
                            <i class="fa fa-thumbs-o-up"></i> 点赞管理
                        </span>

                        <el-menu-item index='/barrage/barragelist/config'>
                            <i class='fa'></i> 点赞列表
                        </el-menu-item>

                    </el-submenu>

                    <el-submenu index='4'>
                        <span slot='title'>
                            <i class="fa fa-address-card-o"></i> APP用户管理
                        </span>

                        <el-menu-item index='/uicuserInfo/userList/config'>
                            <i class='fa'></i> APP用户信息
                        </el-menu-item>

                    </el-submenu>

                    <el-submenu index='5'>
                        <span slot='title'>
                            <i class="fa fa-address-book-o"></i> 客服管理
                        </span>

                        <el-menu-item index='/customService/userFeedBack/config'>
                            <i class='fa'></i> 用户反馈
                        </el-menu-item>

                    </el-submenu>

                    <el-submenu index='6'>
                        <span slot='title'>
                            <i class="fa fa-user-o"></i> 用户管理
                        </span>

                        <el-menu-item index='/user/info/config'>
                            <i class='fa'></i> 用户信息列表
                        </el-menu-item>
                        
                        <el-menu-item index='/whiteUser/info/config'>
                            <i class="fa"></i> 评论用户
                        </el-menu-item>

                         <el-menu-item index='/user/character/config'>
                            <i class="fa"></i> 用户角色管理
                        </el-menu-item>

                         <el-menu-item index='/user/jurisdiction/config'>
                            <i class="fa"></i> 用户权限管理
                        </el-menu-item>

                    </el-submenu>
                </el-menu>
            </div>
            <div class='page-content'>
                <router-view></router-view>
            </div>
        </div>
        <modal title="密码修改" v-model="dialogVisible" width="35%" :before-close="resetForm" @close="resetForm" @save="submitForm">
            <el-form label-width="100px" :rules="rules" :model="password" ref="form">
                <el-form-item label="用户名称" prop="userName">
                    <el-input placeholder="请输入用户名称" disabled v-model.trim="password.userName" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="原密码" prop="oldPassword">
                    <el-input placeholder="请输入旧密码" type="password" v-model.trim="password.oldPassword" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                    <el-input placeholder="请输入新密码" type="password" v-model.trim="password.newPassword" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item label="确认新密码" prop="confirm">
                    <el-input placeholder="请确认原密码" type="password" v-model.trim="password.confirm" style="width:200px"></el-input>
                </el-form-item>
                <el-form-item prop="verification" style="position:relative;" label='输入验证码'>
                    <el-input :max-length='8' v-model.trim="password.verification" placeholder="验证码" style="width:200px"></el-input>
                    <el-button class='v-button' type='primary' size='mini' v-if="isWaiting" disabled>{{verification_button}}</el-button>
                    <el-button class='v-button' type='primary' size='mini' :disabled="!password.oldPassword || !password.newPassword || !password.confirm" @click="sendVerifiation" v-else>{{verification_button}}</el-button>
                </el-form-item>
            </el-form>
        </modal>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Api from "../utils/api";
import * as C from "../constants/api";
import cookies from "../utils/cookies";
import MessageMinxs from "../mixins/messages";
import Modal from "../components/Modal";
export default {
  name: "AppManagerIndex",
  mixins: [MessageMinxs],
  components: {
    Modal
  },

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.password.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      password: {
        oldPassword: "",
        newPassword: "",
        confirm: "",
        verification: "",
        userName: ""
      },
      isWaiting: false,
      verification_button: "获取验证码",
      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 8, message: "密码至少为8位数字或者字母", trigger: "blur" }
        ],
        confirm: [{ required: true, validator: validatePass, trigger: "blur" }],
        verification: [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ]
      },
      items: ["评论管理", "咪咕视频评论列表"]
    };
  },

  beforeMount() {
    this.password.userName = sessionStorage.getItem("userName");

    // userName && this.changeCurrentUser(userName);
    this.isOverDue();
  },

  computed: {
    ...mapState({
      currentUser: ({ root }) => root.currentUser
    }),

    currentActiveIndex() {
      const path = this.$route.path;
      const prefixVal = path.split("/")[1];
      const prefix = `/${prefixVal}`;
      if (~path.indexOf(prefix)) {
        const reg = new RegExp("/" + prefixVal + "/\\w+", "ig");
        return path.match(reg)[0] + "/" + path.split("/")[3];
      }
      return path;
    }
  },

  methods: {
    ...mapActions(["showPageLoading", "hidePageLoading"]),

    logout() {
      cookies.removeCookie("Authorization");
      window.location.hash = "#/login";
      window.location.reload();
    },

    handleCommand(command) {
      if (command == "updatePassword") this.dialogVisible = true;
    },

    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          console.log(this.password);
          this.showPageLoading();
          Api.updatePassword(
            `/${this.password.oldPassword}/${this.password.newPassword}/${
              this.password.userName
            }/${this.password.verification}`
          )
            .then(res => {
              if (res.code == "200") {
                this.logout();
              } else {
                this.hidePageLoading();
                this.$message({
                  message: res.message,
                  type: "warning"
                });
              }
            })
            .catch(this.hidePageLoading);
        }
      });
    },

    isOverDue() {
      let v = this.getCookieValue("secondsremained")
        ? this.getCookieValue("secondsremained")
        : 0; //获取cookie值
      if (v > 0) {
        this.settime(); //开始倒计时
      }
    },

    //发送验证码
    sendVerifiation() {
      console.log();
      if (!this.password.userName) return false;
      Api.sendVerification(`/${this.password.userName}`, "").then(res => {
        if (res.code == "200") {
          this.isWaiting = true;
          this.addCookie("secondsremained", 60, 60);
          this.settime();
        } else {
          this.$message({
            message: res.message,
            type: "warning"
          });
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
      }, 1000); //每1000毫秒执行一次
    },

    resetForm() {
      this.$refs.form.resetFields();
      this.dialogVisible = false;
    }
  }
};
</script>


<style lang='scss'>
@import "../layouts/css/index.scss";

$activeColor: #409eff;
$activeFolderColor: #409eff;

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  min-width: 100%;

  header {
    height: $header-height;
    background-color: $header-background;
    display: block;
    position: relative;
    padding-left: 8px;

    .logo {
      width: 160px;
      height: 100%;
      background: transparent url("../layouts/images/logo.png") 0 7px no-repeat;
      background-size: contain;
    }

    .avatar {
      position: absolute;
      top: 0;
      right: 120px;
      padding-left: 35px;
      background: transparent url("../layouts/images/avatar.png") left center
        no-repeat;

      span {
        text-align: center;
        color: #fff;
        line-height: $header-height;
        font-size: 16px;
      }
    }

    .logout {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 16px;
      color: #fff;
      height: $header-height;
      padding-right: 24px;
      cursor: pointer;

      i {
        line-height: $header-height;
      }
    }
  }
}

.page-content-wrapper {
  width: 100%;
  position: absolute;
  top: $header-height;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;

  .sidebar {
    width: 170px;
    height: 100%;
    border-right: 1px solid #e7e7e7;
    background-color: #fff;
    float: left;

    .fa {
      margin-right: 4px;
      font-size: 14px;
    }

    .el-menu {
      background-color: #fff;
      border-right: none;
    }

    .el-submenu__title {
      height: 50px;
      line-height: 50px;
    }

    .el-submenu .el-menu-item {
      font-size: 12px;
      padding-left: 35px !important;
      height: 35px;
      line-height: 35px;
    }

    .el-menu-item {
      &:hover,
      &:focus {
        background-color: transparent;
        color: $activeColor;
      }

      &.is-active {
        color: $activeColor;
      }
    }

    .el-submenu {
      &.is-active {
        .el-submenu__title {
          color: $activeFolderColor;

          i {
            color: inherit;
          }
        }
      }
    }
  }

  .page-content {
    padding: 15px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
