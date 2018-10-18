<template>
    <div class="page-modules">
        <div class="heade">
        	<el-form :inline="true"  class="demo-form-inline" size="mini" label-position="left" :model='form' ref="form">
			  	<el-form-item label="敏感词">
			    	<el-input v-model.trim="form.sensitiveWord" placeholder="敏感词" style="width:150px"></el-input>
			  	</el-form-item>
			  	<el-form-item label="敏感词等级">
			    	<el-select v-model="form.wordLevel" style="width:150px">
				      	<el-option label="一级敏感词" value="1"></el-option>
				      	<el-option label="二级敏感词" value="2"></el-option>
				    </el-select>
			  	</el-form-item>
			  	<el-form-item label="分类">
				    <el-select v-model="form.category"  style="width:150px">
				      	<el-option label="广告垃圾" value="1"></el-option>
				      	<el-option label="黄赌毒" value="2"></el-option>
                        <el-option label="政治" value="3"></el-option>
                        <el-option label="辱骂攻击" value="4"></el-option>
                        <el-option label="其他" value="5"></el-option>
				    </el-select>
			  	</el-form-item>
			  	<el-form-item>
			  		<el-button type="success" style="width:120px"size="small" icon="el-icon-search" @click="onSubmit" class="query">查询</el-button>
			  	</el-form-item>
			  	<el-form-item>
			  		<el-button type="success" size="small" icon="el-icon-refresh" @click="onRest" class="query">重置</el-button>
			  	</el-form-item>
                <el-form-item>
                    <el-button type="info" size="small" icon="el-icon-rank" @click="showDialog">添加敏感词</el-button>
                </el-form-item>
			</el-form>
        </div>
        <div class='divider'></div>

        <dynamic-table
            :data='sensitiveWordList'
            :total='sensitiveWordAll'
            :pageSize='pagesize'
            :pageNo='pageNo' 
            @pagination="countPageChange"
            :paginationAutoHidden="false">

            <el-table-column
                property="id"
                label="敏感词ID"
                width="120">
            </el-table-column>

		    <el-table-column
		        property="sensitiveWord"
		        label="敏感词"
                :show-overflow-tooltip="true"
		        >
		    </el-table-column>

            <el-table-column
                property="wordLevel"
                label="敏感词等级"
                width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.wordLevel === 1 ? '一级敏感词' : '二级敏感词'}}</span>
                </template>
            </el-table-column>

            <el-table-column
                property="status"
                sortable
                label="状态"
                width="100">
                <template slot-scope="scope">
                    <span>{{scope.row.status === '1' ? '启用' : '禁用'}}</span>
                </template>
            </el-table-column>
            
            <el-table-column
                property="createTime"
                sortable
                label="创建时间"
                width="200">
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

		<v-dialog ref="myDialog" :title="'添加敏感评论词'" @saveBtn="onSaveSensitiveWord">
			<el-form  class="demo-form-inline" label-position="left" size="small" label-width="100px" :model='form1' ref="form1" :rules="rules">
			  	<el-form-item label="敏感词等级" prop="wordLevel">
			    	<el-select v-model="form1.wordLevel" placeholder="等级">
				      	<el-option label="一级敏感词" value="1"></el-option>
				      	<el-option label="二级级敏感词" value="2"></el-option>
				    </el-select>
			  	</el-form-item>
			  	<el-form-item label="敏感词" prop="sensitiveWord" style="width: 400px">
			    	<el-input v-model="form1.sensitiveWord" placeholder="敏感词内容"></el-input>
			  	</el-form-item>
			  	<el-form-item label="分类" prop="category">
				    <el-select v-model="form1.category" placeholder="类别">
				      	<el-option 
    				      	v-for="(item, index) in options"
    				      	:label="item.name"
    				      	:value="item.value"
    				      	:key="index"></el-option>
				    </el-select>
			  	</el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="form1.status" placeholder="状态">
                        <el-option label="禁用" value="0"></el-option>
                        <el-option label="启用" value="1"></el-option>
                    </el-select>
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
    import Misc from '~/utils/misc'
    import Api from '~/utils/api'
    import Utils from '~/plugins/utils'


export default {
    name: 'List',
    data () {
    	return {
            form: {},
            form1: {},
            rules: {
                wordLevel: [{required: true, message: '敏感词等级不能为空'}],
                sensitiveWord: [{required: true, message: '敏感词内容不能为空',trigger: 'blur'}],
                category: [{required: true,message:'敏感词类别不能为空',trigger: 'blur'}],
                status: [{required: true,message:'敏感词状态不能为空',trigger: 'blur'}]
            },
    		options: [
    			{
    				name: '广告垃圾',
    				value: 1
    			},
    			{
    				name: '黄赌毒',
    				value: 2
    			},
    			{
    				name: '政治',
    				value: 3
    			},
    			{
    				name: '辱骂攻击',
    				value: 4
    			},
    			{
    				name: '其他',
    				value: 5
    			},
    		],
    		sensitiveWordList: [],
            sensitiveWordAll: null,
            pagesize: 25,
            pageNo: 1
    	}
    },
    
    beforeMount() {
        let params = {
                page: this.pageNo,
                limit: this.pagesize
            }
        this.getSensitiveList(params)
    },

    mixins: [MessageMixins],

    components: {
    	vDialog,
        DynamicTable
    },
    methods: {

         ...mapActions(['showPageLoading', 'hidePageLoading']),
        /**
         * [getSensitiveList 获取敏感词列表]
         * @Author    qiyongle
         * @DateTime  2018-07-26
         * @copyright [copyright]
         * @license   [license]
         * @version   [version]
         * @return    {[type]}    [description]
         */
        getSensitiveList(params) {
            this.showPageLoading()
            Api.sensitiveWordList(params).then(
                res => {
                    if (res.code == '200') {
                        this.hidePageLoading()
                        this.sensitiveWordList = res.body.list
                        this.sensitiveWordAll = res.body.count
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
                page: this.pageNo,
                limit: this.pagesize
            }
            let params =  Object.assign(param, this.form)
            this.getSensitiveList(params)
        },

        dateFormate(value) {
            return value ? Utils.dateFormat(new Date(value),'yyyy-MM-dd hh:mm:ss') :'';
        },

    	onSubmit () {
            this.pageNo = 1
            if(this.form.sensitiveWord) this.form.sensitiveWord = Misc.trim(this.form.sensitiveWord)
            let params = this.form
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.showPageLoading()
                    this.getSensitiveList(params)
                }
            })
    		
    	},

        onRest() {
            this.form = {}
        },

        onCloseDialog() {
            this.form1 = {}
        },

        onSaveSensitiveWord() {
            this.showPageLoading()
            this.form1.wordLevel = this.form1.wordLevel == '一级敏感词' ? 1 : 0
            this.form1.status = this.form1.status == '启用' ? 1 : 2
            let params = this.form1
            let params1  = {
                page: 1,
                limit: this.pagesize
            }
            this.$refs.form1.validate(valid => {
                if (valid) {
                    Api.sensitiveWordAdd(params).then(
                        res => {
                            this.$refs.myDialog.closeDialog()
                            if (res.code == '200') {
                                this.hidePageLoading()
                                this.getSensitiveList(params1)
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
            const { id , sensitiveWord } = row
            this.showConfirm({
                message: `是否删除当前名为“${sensitiveWord}”的敏感词？`
            }).then(() => {
                let params = {
                    id: id
                }
                let params1  = {
                    page: this.pageNo,
                    limit: this.pagesize
                }
                Api.sensitiveWordDelete(params).then(
                    res => {
                        if(res.code == '200') {
                            this.showPageLoading()
                            this.getSensitiveList(params1)
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
            this.$set(this.form1,'status','启用')
        	this.$refs.myDialog.dialogShow();
        },

        onChangePage(val, index) {
            this.form1 = val
            this.form1.wordLevel = this.form1.wordLevel == 1 ? '一级敏感词' : '二级级敏感词'
            this.$set(this.form1, 'wordLevel', this.form1.wordLevel)
            // this.$set(this.form1, 'sensitiveWord', '')
            this.$refs.myDialog.dialogShow()

        }
    }
}
</script>

<style  lang="scss" scoped>
	/*.query{
		vertical-align: top;
	}*/
</style>
