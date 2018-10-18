<template>
    <div class="page-modules">
        <div class="heade">
        	<el-form :inline="true"  class="demo-form-inline" size="mini" label-position="left" :model='form' ref="form">
			  	<el-form-item label="用户ID">
			    	<el-input v-model.trim="form.userId" placeholder="用户ID"></el-input>
			  	</el-form-item>
			  	<el-form-item label="手机号码">
			    	<el-input v-model.trim="form.mobile" placeholder="手机号码"></el-input>
			  	</el-form-item>
			  	<el-form-item label="描述">
			    	<el-input v-model.trim="form.description" placeholder="描述" style="width:300px"></el-input>
			  	</el-form-item>
			  	<el-form-item label="禁言状态">
				    <el-select v-model="form.status" placeholder="禁言状态" style="width:165px">
				      	<el-option label="禁用" value="0"></el-option>
				      	<el-option label="启用" value="1"></el-option>
				    </el-select>
			  	</el-form-item>
			  	<el-form-item label="解禁时间">
				    <el-date-picker
				      v-model="form.createTime"
				      type="datetime"
                      style="width:200px"
				      placeholder="解禁时间下限"
				      default-time="00:00:00"
				      >
				    </el-date-picker>
			  	</el-form-item>
			  	<el-form-item>
			  		<el-button type="success" style="width:120px" size="small" icon="el-icon-search" @click="onSubmit()" class="query">查询</el-button>
			  	</el-form-item>
			  	<el-form-item>
			  		<el-button type="success" size="small" icon="el-icon-refresh" @click="onRest()" class="query">重置</el-button>
			  	</el-form-item>
                <el-form-item>
                    <el-button type="info" size="small" icon="el-icon-rank" @click="showDialog">添加用户黑名单</el-button>
                </el-form-item>
			</el-form>
        </div>
        <div class='divider'></div>

        <dynamic-table
            :data='commentBlackUserList'
            :total='commentBlackUserAll'
            :pageSize='pageSize'
            :pageNo='pageNo'
            @pagination="countPageChange"
            :paginationAutoHidden="false">

            <el-table-column
                property="userId"
                label="用户ID">
            </el-table-column>
            <el-table-column
                property="mobile"
                label="电话号码">
            </el-table-column>
            <el-table-column
                property="userName"
                label="用户昵称">
            </el-table-column>
            <el-table-column
                property="status"
                sortable
                label="状态">
                <template slot-scope="scope">
                    <span>{{scope.row.status === '1' ? '启用' : '禁用'}}</span>
                </template>
            </el-table-column>

              <el-table-column
                property="description"
                label="描述">
            </el-table-column>

              <el-table-column
                width="180"
                property="gagTime"
                label="解禁时间">
            </el-table-column>
            
            <el-table-column
                property="createTime"
                sortable
                label="创建时间"
                width="180">
                <template slot-scope="scope">
                    <span>{{dateFormate(scope.row.createTime)}}</span>
                </template>
            </el-table-column>

            <el-table-column label='操作' width="150">
                <template slot-scope="scope">
                    <el-button  size="mini" @click="onChangePage(scope.row, scope.$index)">修改</el-button>
                    <el-button  size="mini" type="danger" @click="onRemovePage(scope.row, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </dynamic-table>

		<v-dialog ref="myDialog" :title="this.form1.createTime?'修改用户黑名单':'添加用户黑名单'" @saveBtn="onSaveblackUser">
			<el-form  class="demo-form-inline" label-position="right" label-width="100px" size="small" :model='form1' ref="form1" :rules="rules">
			  	<el-form-item label="用户ID" style="width: 400px" prop="userId">
			    	<el-input v-model.number="form1.userId"></el-input>
			  	</el-form-item>

                <el-form-item label="用户昵称" style="width: 400px" prop="userName">
                    <el-input v-model="form1.userName"></el-input>
                </el-form-item>

			  	<el-form-item label="手机号码" style="width: 400px" prop="mobile">
			    	<el-input v-model="form1.mobile" ></el-input>
			  	</el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="form1.status">
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="解禁时间" style="width: 400px" prop="gagTime">
                    <el-date-picker
                      v-model="form1.gagTime"
                      type="datetime"
                      :picker-options="pickerOptions"                     >
                    </el-date-picker>
                </el-form-item>
			  	<el-form-item label="描述" style="width: 600px" prop="description">
			    	<el-input type="textarea" v-model="form1.description"></el-input>
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
    name: 'List',

    data () {
    	return {
            form: {},
            form1: {},
            rules: {
                userId: [{required: true, message: '用户ID不能为空',trigger:'blur'},{type:'number',message:'ID必须是数字',trigger:'blur'}],
                mobile: [{pattern:/^1[35678]\d{9}/, message: '手机格式不正确',trigger: 'blur'}],
                createTime: [{required:true,message:'时间不能为空'}],
                status: [{required: true,message:'状态不能为空',trigger: 'blur'}],
            },
    		commentBlackUserList: [],
            commentBlackUserAll: null,
            pageSize: 25,
            pageNo: 1,
             pickerOptions:{
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
    	}
    },

    mixins: [MessageMixins],

    components: {
        vDialog,
        DynamicTable
    },

    beforeMount() {
        let params = {
            pageNo: this.pageNo,
            pageSize: this.pageSize
        }
        this.getBlackUserList(params)
    },

    methods: {
    	 ...mapActions(['showPageLoading', 'hidePageLoading']),

        getBlackUserList(params) {
            this.showPageLoading()
            Api.blackUserList(params).then(
                res => {
                    if (res.code == '200') {
                        this.hidePageLoading()
                        this.commentBlackUserList = res.body.list
                        this.commentBlackUserAll = res.body.count
                    } else {
                        this.hidePageLoading()
                        this.$message({
                            message: res.message,
                            type: 'warning'
                        })
                    }
                }
            ).catch(
                res => {
                    this.hidePageLoading()
                }
            )
        },

        countPageChange(val) {
            this.pageNo = val
            let param = {
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            let params =  Object.assign(param, this.form)
            console.log(params)
            this.getBlackUserList(params)
            //？？？？？？？？？？？？？？？？
        },

        dateFormate(value) {
            return value ? Utils.dateFormat(new Date(value),'yyyy-MM-dd hh:mm:ss') :'';
        },

        onSubmit () {
            this.pageNo = 1
            if (this.form.gagTime) this.form.gagTime = Utils.dateFormat(new Date(this.form.gagTime),'yyyy-MM-dd hh:mm:ss')
            let params = this.form
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.showPageLoading()
                    this.getBlackUserList(params)
                }
            })
            
        },

        onRest() {
            this.form = {}
        },

        onCloseDialog() {
            this.form1 = {}
        },

        onSaveblackUser() {
            this.showPageLoading()
            if (this.form1.gagTime) this.form1.gagTime = Utils.dateFormat(new Date(this.form1.gagTime),'yyyy-MM-dd hh:mm:ss')
            let params = this.form1
            let params1  = {
                page: 1,
                limit: this.pagesize
            }
            this.$refs.form1.validate(valid => {
                if (valid) {
                    Api.blackUserAdd(params).then(
                        res => {
                            this.$refs.myDialog.closeDialog()
                            if (res.code == '200') {
                                this.hidePageLoading()
                                this.getBlackUserList(params1)
                            } else {
                                this.hidePageLoading()
                                this.$message({
                                    message: res.message,
                                    type: 'warning'
                                })
                            }
                            
                        }
                    ).catch(
                        res => {
                            this.hidePageLoading()
                            this.$message({
                                message: res.message,
                                type: 'warning'
                            })
                        }
                    )
                } else {
                    this.hidePageLoading()
                }
            })
        },

        onRemovePage(row, index) {
            const { userId, mobile, userName } = row
            this.showConfirm({
                message: `是否删除当前名为“${userName}”的黑名单用户吗？`
            }).then(() => {
                let params = {
                    userId: userId,
                    mobile: mobile
                }
                let params1  = {
                    page: this.pageNo,
                    limit: this.pagesize
                }
                Api.blackUserDelete(params).then(
                    res => {
                        if(res.code == '200') {
                            this.showPageLoading()
                            this.getBlackUserList(params1)
                        }
                    }
                ).catch(
                    res => {
                        this.hidePageLoading()
                    }
                )
            })
        },
        showDialog () {
            this.form1 = {}
            this.$set(this.form1, 'status', '1')
            this.$refs.myDialog.dialogShow();
        },

        onChangePage(val, index) {
            this.form1 = val
            this.$refs.myDialog.dialogShow()
        }
    }
}
</script>

<style  lang="scss" scoped>
	
</style>
