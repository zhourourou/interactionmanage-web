<template>
    <div class="page-modules">
        <el-form :inline="true" class="demo-form-inline" size="mini" label-position="left" :model='form1' ref="form">
        
            <el-form-item label="id/手机号" prop="filter">
                <el-input v-model.trim="form1.filter" placeholder="id/手机号"></el-input>
            </el-form-item>

            <el-form-item label="用户状态" prop="status">
                <el-select v-model="form1.status">
                    <el-option label="已激活" value="1"></el-option>
                    <el-option label="禁用" value="0"></el-option>
                </el-select>
            </el-form-item>
            <div>
                <el-form-item>
                    <el-button type="success" style="width:120px" :disabled="!this.form1.filter&&!this.form1.status" size="small" icon="el-icon-search" @click="queryMarketerList(true)" class="query">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" :disabled="!this.form1.filter&&!this.form1.status" size="small" icon="el-icon-refresh" @click="onRest()" class="query">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" size="small" icon="el-icon-rank" @click="onAddUser()">新增用户</el-button>
                </el-form-item>
            </div>

            <dynamic-table :paginationAutoHidden="false" :data="userList" :pageSize="pageSize" :total="listAll" :pageNo="pageNo" @pagination="onPagination">
                <el-table-column label="用户id" prop="userId" width="120"></el-table-column>
                <el-table-column label="手机号" prop="mobile" width="160"></el-table-column>
                <el-table-column label="状态" prop="status">
                    <template slot-scope="scope">
                        {{ scope.row.status == "0" ? '禁用' : '已激活' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed=right width="180px">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="onUserChange(scope.row)">修改</el-button>
                        <el-button type="danger" @click="delUserChange(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </dynamic-table>

            <el-dialog center class="upload" title="修改评论用户" :visible.sync="dialogVisible" width="70%" :before-close="handleClose">
                <el-form class="form" :model="form" ref="form" label-position="right" :rules="rules">

                    <el-form-item label="用户id" prop="userId">
                        <el-input v-model="form.userId" disabled style="width:300px;"></el-input>
                    </el-form-item>

                    <el-form-item label="手机号" prop="mobile">
                        <el-input v-model.trim="form.mobile" style="width:300px;"></el-input>
                    </el-form-item>
                    <div>
                        <el-form-item label="状态" prop="status" >
                            <el-radio-group v-model.trim="form.status">
                                <el-radio :label="1">激活</el-radio>
                                <el-radio :label="0">禁用</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>

                    <div style="text-align: center">
                        <el-form-item>
                            <el-button type="primary" @click="onSave()">保存</el-button>
                            <el-button @click="handleClose">取消</el-button>
                        </el-form-item>
                    </div>

                </el-form>
            </el-dialog>
        </el-form>
    </div>
</template>
<script>
    import Api from '~/utils/api'
    import DynamicTable from '~/components/DynamicTable'
    import MessageMixins from '../../mixins/messages.js'
    import { mapState, mapActions } from 'vuex'
    export default {
        data() {
            return {
                userList: [],
                pageSize: 20,
                listAll: 0,
                pageNo: 1,
                form1: {},
                dialogVisible: false,
                form: {},
                rules: {
                    userId: [{ required: true, message: '用户名称不能为空' }],
                    status: [{ required: true, message: '请选择用户是否激活' }],
                    mobile: [{ required: true, message: '手机号码不能为空' }, { pattern: /^1[35678]\d{9}/, message: '手机格式不正确' }]
                }
            }
        },
        mixins: [MessageMixins],
        components: {
            DynamicTable
        },
        created() {
            this.queryMarketerList()
        },
        methods: {
            ...mapActions(['showPageLoading', 'hidePageLoading']),

            delUserChange(item) {
                this.showConfirm({
                    message: `你确定要删除ID为${item.userId}的用户吗`
                }).then(() => {
                    this.showPageLoading()
                    Api.deleteMarketer(`/${item.userId}`, {}).then(res => {
                        this.hidePageLoading()
                        if (res.code == 200) {
                            this.showSuccess('删除成功')
                            this.queryMarketerList()
                        }
                    })
                })
            },
            onRest() {
                this.form1 = {}
                this.queryMarketerList()

            },
            onPagination(val) {
                this.pageNo = val;
                this.queryMarketerList();
            },
            onAddUser() {
                this.$router.push('/whiteUser/info/edit');
            },
            onSave() {
                this.showPageLoading()
                Api.updateMarketer(this.form).then(res => {
                    this.hidePageLoading()
                    if (res.code == 200) {
                        this.showSuccess("更新成功")
                        this.queryMarketerList()
                    }
                    this.dialogVisible = false;
                })
            },
            handleClose() {
                this.dialogVisible = false;
            },
            queryMarketerList(val) {
                if(val==true){
                    this.pageNo=1
                }
                let init = {
                    pageNo: this.pageNo,
                    pageSize: this.pageSize
                }
                let params = Object.assign({}, this.form1,init)
                this.showPageLoading()
                Api.queryMarketerList(params).then(res => {
                    this.hidePageLoading()
                    if (res.code == 200) {
                        this.listAll = res.body.count;
                        this.pageNo = res.body.pageNo;
                        // this.pageSize = res.body.pageSize
                        this.userList = res.body.list;
                    }
                })
            },
            onUserChange(item) {
                this.dialogVisible = true
                this.form = {
                    userId: item.userId,
                    mobile: item.mobile,
                    status: item.status
                }
            }
        }
    }
</script>
<style>
</style>