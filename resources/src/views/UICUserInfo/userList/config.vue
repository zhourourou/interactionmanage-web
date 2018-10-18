<template>
    <div class="page-modules userList-config">
        <div class="header">
            <el-form :inline="true" class="demo-form-inline" size="mini" label-position="left" ref="form">
                <el-form-item label="用户ID">
                    <el-input v-model.trim="form.userId" placeholder="用户ID"></el-input>
                </el-form-item>            
                <el-form-item>
                    <el-button type="success" :disabled="!form.userId" style="width:120px" size="small" icon="el-icon-search" @click="onSubmit()"
                        class="query">查询</el-button>
                </el-form-item>
            </el-form>
        </div>

        <v-dialog ref="myDialog"  :isok="'重置'" :title="'用户信息详情'" @saveBtn="onSaveBtn()">
            <el-form class="demo-form-inline" label-position="right" size="small" label-width="100px" :model='form1' ref="form1" :rules="rules"
                :disabled="isShowDisabled">
                <el-form-item label="用户昵称" style="width: 300px" prop="userName">
                    <el-input v-model="form1.sname" disabled></el-input>
                </el-form-item>
                <el-form-item style="width: 150px" prop="image" class="img">
                    <img :src="form1.picture || 'http://183.192.162.16:2443/static-web/images/fst_avator.png'" alt="图片预览" class="avatar">
                    <el-button size="mini">用户头像</el-button>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio v-model="form1.sex" :label="1" disabled>男</el-radio>
                    <el-radio v-model="form1.sex" :label="0" disabled>女</el-radio>
                </el-form-item>
                <el-form-item label="注册时间" prop="registTime">
                    <el-input style="width: 200px" v-model="form1.registTime" disabled></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form1.mobile" style="width: 200px" disabled></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="address">
                    <el-input v-model="form1.area" style="width: 300px" disabled></el-input>
                </el-form-item>
            </el-form>
        </v-dialog>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex'
    import DynamicTable from '~/components/DynamicTable'
    import MessageMixins from '~/mixins/messages'
    import vDialog from '~/components/dialog'
    import Api from '~/utils/api'
    import Utils from '~/plugins/utils'

    export default {
        name: 'BarrageConfig',

        components: {
            DynamicTable,
            vDialog
        },

        mixins: [MessageMixins],

        data() {
            return {
                form: {},
                form1: {},
                pageSize: 20,
                pageNo: 1,
                rules: {
                    // objectId: [required:true, message: '']
                },
                isShowDisabled: true,
                userList: [],
                userListAll: null
            }
        },

        methods: {
            ...mapActions(['showPageLoading', 'hidePageLoading']),

            formatTime(val) {
                let times = '';
                if (val) {
                    let time = val.substring(0, 8);
                    let year = time.substring(0, 4);
                    let mouse = time.substring(4, 6);
                    let day = time.substring(6, 8);
                    times = `${year}年${mouse}月${day}日`
                }
                return times;
            },

            showDialog() {
                this.$refs.myDialog.dialogShow()
            },

            onSaveBtn() {
                this.onRest();
                this.$refs.myDialog.closeDialog()
            },

            onSubmit() {
                let param = this.form.userId
                // this.getUserList(param)
                this.showPageLoading()
                Api.getAppUserInfo(`/${param}`).then((res) => {
                    this.hidePageLoading()
                    if (res.code == 200) {
                        if (res.body == null) {
                            this.showSuccess('该用户不存在');
                            return;
                        }
                        this.form1 = res.body;
                        if (res.body.registTime) {
                            this.form1.registTime = this.formatTime(res.body.registTime);
                        }
                        this.$refs.myDialog.dialogShow()
                    } else {
                        this.showSuccess('查询用户信息失败');
                    }
                });

            },

            onRest() {
                // this.form = {}
                this.showPageLoading()
                let params = this.form.userId;
                Api.changeUserInfo(`/${params}`).then((res) => {
                    this.hidePageLoading()
                    if (res.code == 200) {
                        this.showSuccess('重置用户头像和昵称成功');
                    } else if(res.code = 423) {
                        this.showSuccess('该用户不存在');
                    }
                })
            },

            countPageChange(val) {
                this.pageNo = val
                let param = {
                    pageNo: this.pageNo,
                    pageSize: this.pagesize
                }
                let params = Object.assign(param, this.form)
                // this.getAppUserList(params)
            },

            dateFormate(value) {
                return value ? Utils.dateFormat(new Date(value), 'yyyy-MM-dd hh:mm:ss') : '';
            },
        }
    }
</script>

<style lang="scss" scoped>
    .userList-config {
        .img {
            position: absolute;
            left: 400px;
            top: 80px;
            img {
                border-radius: 10px;
            }
        }
        .avatar {
            width: 100px;
            height: 100px;
        }
    }
</style>