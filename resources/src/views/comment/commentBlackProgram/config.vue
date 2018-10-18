<template>
    <div class="page-modules black_params">
        <div class="heade">
        	<el-form :inline="true"  class="demo-form-inline" size="mini" label-position="left" :model='form' ref="form">
			  	<el-form-item label="节目ID">
			    	<el-input v-model.trim="form.mmsId" placeholder="节目ID"></el-input>
			  	</el-form-item>
			  	<el-form-item label="节目名称">
			    	<el-input v-model.trim="form.contName" placeholder="节目名称"></el-input>
			  	</el-form-item>
			  	<el-form-item label="描述">
			    	<el-input v-model.trim="form.description" placeholder="描述" style="width:300px"></el-input>
			  	</el-form-item>

			  	<el-form-item label="状态">
				    <el-select v-model="form.status" placeholder="状态" style="width:165px">
				      	<el-option label="禁用" value="0"></el-option>
				      	<el-option label="启用" value="1"></el-option>
				    </el-select>
			  	</el-form-item>
			  	<el-form-item label="解禁时间">
				    <el-date-picker
				      v-model="form.gagTime"
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
                    <el-button type="info" size="small" icon="el-icon-rank" @click="showDialog">添加节目黑名单</el-button>
                </el-form-item>
			</el-form>
        </div>
        <div class='divider'></div>

        <dynamic-table
            :data='commentBlackProgramList'
            :total='commentBlackUserAll'
            :pageSize='pageSize'
            @pagination="countPageChange"
            :paginationAutoHidden="false">

            <el-table-column
                property="mmsId"
                label="节目ID"
                width="120">
            </el-table-column>

            <el-table-column
                property="contName"
                label="节目名称"
                :show-overflow-tooltip="true"
                >
            </el-table-column>

            <el-table-column
                property="status"
                sortable
                label="状态"
                width="80">
                <template slot-scope="scope">
                    <span>{{scope.row.status === '1' ? '启用' : '禁用'}}</span>
                </template>
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

            <el-table-column
                property="description"
                label="描述">
            </el-table-column>

            <el-table-column
                width="180"
                property="gagTime"
                label="解禁时间">
            </el-table-column>

            <el-table-column label='操作' width="150">
                <template slot-scope="scope">
                    <el-button  size="mini" @click="onChangePage(scope.row, scope.$index)">修改</el-button>
                    <el-button  size="mini" type="danger" @click="onRemovePage(scope.row, scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </dynamic-table>

		<v-dialog ref="myDialog" :title="'添加节目黑名单'" @saveBtn="onSaveblackProgram">
			<el-form  class="demo-form-inline" label-position="right" size="small" label-width="100px" :model='form1' ref="form1" :rules="rules">
			  	<el-form-item label="节目ID" style="width: 400px" prop="mmsId">
			    	<el-input v-model="form1.mmsId" disabled></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="showParamDialog()">查询</el-button>
			  	</el-form-item>
			  	<el-form-item label="节目名称" style="width: 400px" prop="contName">
			    	<el-input v-model="form1.contName" disabled></el-input>
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
                      :picker-options="pickerOptions"				      >
				    </el-date-picker>
			  	</el-form-item>
			  	<el-form-item label="描述" style="width: 400px" prop="description">
			    	<el-input type="textarea" v-model="form1.description"></el-input>
			  	</el-form-item>
			</el-form>
		</v-dialog>

         <!--内容配置弹窗-->
        <general-dialog ref="foreConfig" title="内容选择" :isTop="isGoTop" @save="onSaveData" class="dialog">
            <el-form :inline="true"  class="demo-form-inline" size="mini" label-position="left" :model='form2' ref="form2">
                <el-form-item label="节目名称">
                    <el-input v-model.trim="form2.contName" placeholder="节目名称"></el-input>
                </el-form-item>
                <el-form-item label="媒资ID">
                    <el-input v-model.trim="form2.mmsId" placeholder="媒资ID"></el-input>
                </el-form-item>
                <el-form-item label="推荐标签">
                    <el-input v-model.trim="form2.recommendTag" placeholder="推荐标签"></el-input>
                </el-form-item>
                <el-form-item label="开始时间">
                    <el-date-picker
                      v-model="form2.startTime"
                      type="datetime"
                      placeholder="开始时间"
                      default-time="00:00:00"
                      >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间">
                    <el-date-picker
                      v-model="form2.endTime"
                      type="datetime"
                      placeholder="结束时间"
                      default-time="00:00:00"
                      >
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" size="small" plain icon="el-icon-rank" @click="onSubmitProgram()" class="query">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="info" size="small" plain icon="el-icon-refresh" @click="onRestProgram()" class="query">重置</el-button>
                </el-form-item>
            </el-form>
            <dynamic-table
                :data="programsList"
                :total="programsListAll"
                :pageSize='pageSize'
                :pageNo='pageNo'
                @selectRow='handleSelectionChange'
                @pagination="onPagination"
                >
                <el-table-column label="选择" width="50" center>
                    <template slot-scope="scope">
                        <el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
                    </template>
                </el-table-column>

                <el-table-column prop="mmsId" label="媒资ID" width="120" center></el-table-column>

                <el-table-column prop="contId" label="内容ID" width="120" center></el-table-column>

                <el-table-column prop="prdPackId" label="产品包ID" width="100" center></el-table-column>

                <el-table-column prop="contName" label="节目名称"  center></el-table-column>

                <el-table-column prop="publishTime" label="发布时间" width="170" center></el-table-column>

            </dynamic-table>
        </general-dialog>
		
    </div>
</template>

<script>

    import { mapActions, mapState } from 'vuex'
    import DynamicTable from '~/components/DynamicTable'
    import GeneralDialog from '~/components/generalDialog'
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
            form2: {},
            rules: {
               mmsId: [{required:true,message:'节目ID不能为空'}],
               contName: [{required:true,message:'节目名称不能为空'}],
               createTime: [{required:true,message:'节目名称不能为空',trigger: 'blur'}]
            },
            isGoTop: false,
            programsList: [],
            programsListAll: null,
    		commentBlackProgramList: [],
            commentBlackUserAll: null,
            pageSize: 25,
            pageNo: 1,
            radio: null,
            selectData: null,
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
        DynamicTable,
        GeneralDialog
    },

    beforeMount() {
        let params = {
            pageNo: this.pageNo,
            pageSize: this.pagesize
        }
        this.getBlackProgramList(params)
    },

    methods: {
    	 ...mapActions(['showPageLoading', 'hidePageLoading']),
        /**
         * [getBlackProgramList 获取用户黑名单列表]
         * @Author    qiyongle
         * @DateTime  2018-07-26
         * @copyright [copyright]
         * @license   [license]
         * @version   [version]
         * @return    {[type]}    [description]
         */
        getBlackProgramList(params) {
            this.showPageLoading()
            Api.blackProgramList(params).then(
                res => {
                    if (res.code == '200') {
                        this.hidePageLoading()
                        this.commentBlackProgramList = res.body.list
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
                pageSize: this.pagesize
            }
            let params =  Object.assign(param, this.form)
            this.getBlackProgramList(params)
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
                    this.getBlackProgramList(params)
                }
            })
            
        },

        onRest() {
            this.form = {}
        },

        onCloseDialog() {
            this.form1 = {}
        },

        onSaveblackProgram() {
            this.showPageLoading()
            if (this.form1.gagTime) this.form1.gagTime = Utils.dateFormat(new Date(this.form1.gagTime),'yyyy-MM-dd hh:mm:ss')
            let params = this.form1
            let params1  = {
                page: 1,
                limit: this.pagesize
            }
            this.$refs.form1.validate(valid => {
                if (valid) {
                    Api.blackProgramAdd(params).then(
                        res => {
                            this.$refs.myDialog.closeDialog()
                            if (res.code == '200') {
                                this.hidePageLoading()
                                this.getBlackProgramList(params1)
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
            const { mmsId, contName } = row
            this.showConfirm({
                message: `是否删除当前名为“${contName}”的黑名单节目？`
            }).then(() => {
                let params = {
                    mmsId: mmsId
                }
                console.log(params)
                let params1  = {
                    page: this.pageNo,
                    limit: this.pagesize
                }
                Api.blackProgramDelete(params).then(
                    res => {
                        if(res.code == '200') {
                            this.getBlackProgramList(params1)
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
        },

        showParamDialog() {
            let param = {
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            this.$refs.myDialog.closeDialog();
            this.$refs.foreConfig.onShow()
            this.getProgramList(param)
            this.form2 = {}
        },

        onSubmitProgram() {
            this.pageNo = 1
            this.programsListAll = null
            this.form2.pageSize = this.pageSize
            this.form2.pageNo = this.pageNo
            if(this.form2.startTime) this.form2.startTime = Utils.dateFormat(new Date(this.form2.startTime),'yyyy-MM-dd hh:mm:ss')
            if(this.form2.endTime) this.form2.endTime = Utils.dateFormat(new Date(this.form2.endTime),'yyyy-MM-dd hh:mm:ss')
            let params = this.form2
            this.getProgramList(params)
        },
        onRestProgram() {
            this.form2 = {}
        },

        getProgramList(params) {
            this.showPageLoading()
            Api.programList(params).then(
                res => {
                    if (res.code == '200') {
                        this.hidePageLoading()
                        this.isGoTop = false
                        if (res.body == null) {
                            this.programsList = []
                            this.programsListAll = null     
                        } else {
                            this.programsList = res.body.list
                            this.programsListAll = res.body.count
                        }
                        
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

        handleSelectionChange(val) {
            this.selectData = val;
            this.radio = this.programsList.indexOf(val);
        },

        onPagination(val) {
            let param = {
                pageNo: val,
                pageSize: this.pageSize
            }
            let params = Object.assign(param, this.form2)
            this.isGoTop = true
            this.getProgramList(params);
        },

        onSaveData() {
            this.form1 = this.selectData
            this.$refs.myDialog.dialogShow();
            this.$refs.foreConfig.onHide()
        }
    }
}
</script>

<style  lang="scss" scoped>
	.black_params{
        .el-form-item{
            white-space: nowrap
        }
        .dialog{
            .el-date-picker{
                z-index: 2020 !important;
            }
        }
    }
</style>
