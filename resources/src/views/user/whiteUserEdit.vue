<template>
    <div class="page-modules">
        <el-form :model="form" ref="form" label-position="right" :rules="rules" label-width="120px">

            <el-form-item label="用户id" prop="userId">
                <el-input v-model="form.userId" style="width:300px;"></el-input>
            </el-form-item>

            <el-form-item label="电话号码" prop="mobile">
                <el-input v-model.trim="form.mobile" style="width:300px;"></el-input>
            </el-form-item>

            <!-- <el-form-item label="用户状态" prop="status">
                <el-radio-group v-model="form.status">
                    <el-radio label="1">激活</el-radio>
                    <el-radio label="2">禁用</el-radio>
                </el-radio-group>
            </el-form-item> -->

            <el-form-item>
                <el-button type="primary" @click="onSave">立即创建</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import Api from '~/utils/api'
    import MessageMixins from '../../mixins/messages.js'
    import { mapState, mapActions } from 'vuex'
    export default {
        data() {
            return {
                form: {},
                rules: {
                    userId: [{ required: true, message: '用户ID不能为空', trigger: 'blur' }],
                    // status: [{ required: true, message: '请选择用户是否激活', trigger: 'blur' }],
                    mobile: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }, { pattern: /^1[35678]\d{9}/, message: '手机格式不正确', trigger: 'blur' }]
                }
            }
        },
        mixins: [MessageMixins],
        methods: {
            ...mapActions(['showPageLoading', 'hidePageLoading']),
            onSave() {    
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.showPageLoading()
                        Api.addMarketer(this.form).then(res => {
                            this.hidePageLoading()
                            if (res.code == 200) {
                                this.showSuccess('创建成功')
                                this.$router.push('/whiteUser/info/config')
                            }
                        })
                    }
                })
            },
            onCancel() {
                this.$router.back()
            }
        }

    }
</script>
<style>
</style>