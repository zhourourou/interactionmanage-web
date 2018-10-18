<template>
    <div class="page-modules barrage-config">
        <div class="header">
        	<el-form :inline="true"  class="demo-form-inline" size="mini"  label-position="left" ref="form">
        		<el-form-item label="媒资ID">
			    	<el-input v-model.trim="form.mId" placeholder="媒资ID"></el-input>
			  	</el-form-item>
			  	<el-form-item label="评论ID">
			    	<el-input v-model.trim="form.objectId" placeholder="评论ID"></el-input>
			  	</el-form-item>
			  	<el-form-item label="用户ID">
			    	<el-input v-model.trim="form.userId" placeholder="用户ID"></el-input>
			  	</el-form-item>
			  	<el-form-item>
			  		<el-button type="success" style="width:120px" size="small" icon="el-icon-search" @click="onSubmit()" class="query">查询</el-button>
			  	</el-form-item>
			  	<el-form-item>
			  		<el-button type="success" size="small" icon="el-icon-refresh" @click="onRest()" class="query">重置</el-button>
			  	</el-form-item>
			  	<el-form-item>
			  		<!-- <el-button type="info" size="small" plain icon="el-icon-rank" @click="showDialog()">添加点赞记录</el-button> -->
			  	</el-form-item>
        	</el-form>
        </div>
        <div class="content">
        	<dynamic-table
        		:data="barrageList"
        		:total="barrageListAll"
        		:pageSize="pageSize"
                :pageNo='pageNo'
        		@pagination="countPageChange"
            	:paginationAutoHidden="false"
	            >
	            <el-table-column
	                property="mId"
	                label="媒资ID"
	                >
	            </el-table-column>
	            <el-table-column
	                property="objectId"
	                label="评论ID"
	                >
	            </el-table-column>
	            <el-table-column
	                property="userId"
	                label="用户ID"
	                >
	            </el-table-column>
	            <el-table-column
	                property="userName"
	                label="用户昵称"
	                >
	            </el-table-column>
                <el-table-column
                    property="status"
                    label="状态"
                    width="80"
                    >
                    <template slot-scope="scope">
                        <span>{{scope.row.status==1?'取消点赞':'点赞'}}</span>
                    </template>
                </el-table-column>
	            <el-table-column
	                property="createTime"
	                label="创建时间"
	                width="200">
	                <template slot-scope="scope">
	                    <span>{{dateFormate(scope.row.createTime)}}</span>
	                </template>
	            </el-table-column>
	            <!-- <el-table-column label='操作' width="150"> -->
	                <!-- <template slot-scope="scope"> -->
	                    <!-- <el-button  size="mini" @click="onChangePage(scope.row, scope.$index)">修改</el-button> -->
	                    <!-- <el-button  size="mini" type="danger" @click="onRemovePage(scope.row, scope.$index)">删除</el-button> -->
	                <!-- </template> -->
	            <!-- </el-table-column> -->
	        </dynamic-table>
        </div>

        <v-dialog ref="myDialog" :title="'添加点赞记录'" @saveBtn="onSaveblackProgram">
			<el-form  class="demo-form-inline" label-position="right" label-width="100px" size="small" :model='form1' ref="form1" :rules="rules">
			  	<el-form-item label="评论ID" style="width: 400px" prop="objectId">
			    	<el-input v-model="form1.objectId"></el-input>
			  	</el-form-item>
			  	<el-form-item label="媒资ID" prop="mId">
			    	<el-input v-model="form1.mId" style="width:300px"></el-input>
			  	</el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model="form1.type" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model="form1.userId" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称" prop="userName">
                    <el-input v-model="form1.userName" style="width: 200px"></el-input>
                </el-form-item>  
			  	<el-form-item label="点赞数" prop="times">
			    	<el-input v-model="form1.times" style="width: 200px"></el-input>
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
    		file_name: null,
    		upLoad: false,
    		form: {},
    		form1: {},
    		pageSize: 20,
    		pageNo: 1,
    		rules: {
    			// objectId: [required:true, message: '']
    		},
    		barrageList: [],
    		barrageListAll: null
    	}
    },

    beforeMount() {
    	let param = {
    		pageNo: this.pageNo,
    		pageSize: this.pageSize
    	}
    	this.getUserLikeQueryList(param)
    },

    methods: {
    	 ...mapActions(['showPageLoading', 'hidePageLoading']),

    	onSaveblackProgram() {
    	 	let params = this.form1
    	 	Api.addTimes(params).then(
    	 		res => {
    	 			console.log(res)
    	 		}
    	 	)
    	},

    	getUserLikeQueryList(params) {
    		this.showPageLoading()
    		Api.queryList(params).then(
    			 res => {
    			 	this.hidePageLoading()
                    if (res.code == '200') {
                        this.barrageList = res.body.list
                        this.barrageListAll = res.body.count
                    } else {
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

    	showDialog() {
    		this.$refs.myDialog.dialogShow();
    	},

    	onSubmit() {
            this.pageNo = 1
    		let param = this.form
    		this.getUserLikeQueryList(param)
    	},

    	onRest() {
    		this.form = {}
    	},

    	countPageChange(val) {
            this.pageNo = val
            let param = {
                pageNo: this.pageNo,
                pageSize: this.pagesize
            }
            let params =  Object.assign(param, this.form)
            this.getUserLikeQueryList(params)
        },

        dateFormate(value) {
            return value ? Utils.dateFormat(new Date(value),'yyyy-MM-dd hh:mm:ss') :'';
        },
    }
}
</script>

<style  lang="scss" scoped>
</style>
