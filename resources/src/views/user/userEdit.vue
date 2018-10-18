<template>
    <div class='page-edit-section'>
        <h3>新增用户信息</h3>
        <div class='divider'></div>
        <el-form class='form' :model='form' ref='form' label-position='right' :rules='rules' label-width="120px">
            
            <el-form-item label="用户中文名称" prop="chnName">
                <el-input v-model="form.chnName" style="width:300px;"></el-input>
                <span style="color:#F56C6C;">注：（中文名称）</span>
            </el-form-item>

            <el-form-item label="用户名称" prop="userName">
                <el-input v-model="form.userName" style="width:300px;"></el-input>
                <span style="color:#F56C6C;">注：（中文名称的拼音）</span>
            </el-form-item>

            <!-- <el-form-item label='用户密码' prop='password'>
                <el-input v-model.trim='form.password' style="width:300px;"></el-input>
                <span style="color:#F56C6C;">注：（8到16位数字字母组合）</span>
            </el-form-item> -->

            <el-form-item label='用户状态' prop='userStatus'>
                <el-radio-group v-model="form.userStatus">
                    <el-radio label="激活" value="1"></el-radio>
                    <el-radio label="禁用" value="2"></el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label='电话号码' prop='telephone'>
                <el-input v-model.trim='form.telephone' style="width:300px;"></el-input>
            </el-form-item>

            <el-form-item label='邮箱' prop='email'>
                <el-input v-model.trim='form.email' style="width:300px;"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="onSave">立即创建</el-button>
                <el-button @click="onCancel" v-if="!data">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import Api from '../../utils/api'
    import MessageMixins from '../../mixins/messages'

export default {
    name: 'TeamEdit',

    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },

    // mixins: [MessageMixins],

    data() {
        return {
            form: {},
            
            rules: {
                chnName: [{required: true, message: '用户名称不能为空', trigger: 'blur'},{pattern: /^[\u4e00-\u9fa5]+$/, message: '只支持中文名称',trigger: 'blur'}],
                userName: [{required: true, message: '用户名称不能为空', trigger: 'blur'},{pattern: /^[a-zA-Z]+$/, message: '只支持纯英文字符',trigger: 'blur'}],
                password: [{required: true, message: '密码不能为空', trigger: 'blur'},{pattern: /[0-9a-zA-Z]{8,16}/, message: '密码不符合规范',trigger: 'blur'}],
                userStatus: [{required: true, message: '请选择用户是否激活', trigger: 'blur'}],
                telephone: [{required: true, message: '手机号码不能为空', trigger: 'blur'},{pattern:/^1[35678]\d{9}/, message: '手机格式不正确',trigger: 'blur'}]
            }
        }
    },

    watch: {
        data(obj) {
            this.form = obj
        },
    },

    beforeMount() {
        this.$set(this.form, 'userStatus', '激活')
    },

    methods: {
        onCancel() {
            this.$router.back()
        },

        onSave() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.userStatus = this.form.userStatus == '激活' ? 1 : 2
                    const params = this.form
                    Api.newUser(params).then(
                        res => {
                            if (res.code == '200') {
                                this.$router.back()
                            } else {
                                this.$message({
                                    message: res.message,
                                    type: 'warning'
                                })
                            }
                        }
                    )
                }
            })
        }
    }
}
</script>
