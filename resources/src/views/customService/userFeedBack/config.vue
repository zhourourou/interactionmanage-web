<template>
    <div class="page-modules user-feedback-config">
        <div class="header">
        	<el-form :inline="true"  class="demo-form-inline" :model="form" size="mini"  label-position="left" ref="form">
        		<el-form-item label="分类">
                    <el-select v-model="form.type"  style="width:150px">
                        <el-option
                            v-for="item in typeArr"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户ID" prop="userId">
                    <el-input v-model.trim="form.userId" placeholder="用户ID"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model.trim="form.mobile" placeholder="手机号"></el-input>
                </el-form-item>
			  	<el-form-item>
			  		<el-button type="success" style="width:120px" size="small" icon="el-icon-search" @click="onSubmit(true)" class="query">查询</el-button>
			  	</el-form-item>
			  	<el-form-item>
			  		<el-button type="success" size="small" icon="el-icon-refresh" @click="onRest()" class="query">重置</el-button>
			  	</el-form-item>
        	</el-form>
        </div>
        <div class="content">
        	<dynamic-table
        		:data="feedBackList"
        		:total="feedBackListAll"
        		:pageSize="pageSize"
                :pageNo='pageNo'
        		@pagination="countPageChange"
            	:paginationAutoHidden="false"
	            >
	           
              <el-table-column
	                property="phoneInfo"
	                label="客户端信息"
                    :show-overflow-tooltip="true"
	                width="180">
	            </el-table-column>
	            <el-table-column
	                property="contents"
	                label="反馈内容"
                  width="120"
                    :show-overflow-tooltip="true"
	                >
	            </el-table-column>
               <el-table-column
	                property="channelId"
	                label="渠道id"
                    :show-overflow-tooltip="true"
	                width="120">
	            </el-table-column>
	            <el-table-column
	                property="userId"
	                label="用户ID"
	                width="120">
	            </el-table-column>
	            <el-table-column
	                property="mobile"
	                label="手机号码"
	                width="120">
	            </el-table-column>
	            <el-table-column
	                property="createTime"
	                label="创建时间"
	                width="200">
	                <template slot-scope="scope">
	                    <span>{{dateFormate(scope.row.createTime)}}</span>
	                </template>
	            </el-table-column>
                <el-table-column
                    property="updateTime"
                    label="更新时间"
                    width="200">
                    <template slot-scope="scope">
	                    <span>{{dateFormate(scope.row.updateTime)}}</span>
	                </template>
                </el-table-column>
	            <el-table-column label='操作' width="150"  fixed='right'>
	                <template slot-scope="scope">
	                    <el-button  size="mini" @click="onChangePage(scope.row, scope.$index)">查看</el-button>
	                </template>
	            </el-table-column>
	        </dynamic-table>
        </div>

        <v-dialog ref="myDialog" :save="false" :title="'信息详情'"  @saveBtn="onSaveBtn()">
            <el-form  class="demo-form-inline" label-position="right" label-width="100px" :model='form1' ref="form1">
                <el-form-item label="客户端信息" style="width: 450px" prop="id">
                    <el-input v-model="form1.phoneInfo" disabled></el-input>
                </el-form-item>

                 <el-form-item label="渠道ID" style="width: 450px" prop="channelId">
                    <el-input v-model="form1.channelId" disabled></el-input>
                </el-form-item>

                <el-form-item label="用户账号" style="width: 450px" prop="userId">
                    <el-input v-model="form1.userId" disabled></el-input>
                </el-form-item>

                <el-form-item label="手机号码" style="width: 450px" prop="mobile">
                    <el-input v-model="form1.mobile" disabled></el-input>
                </el-form-item>
                <el-form-item label="描述" style="width: 600px" prop="contents">
                    <el-input type="textarea" v-model="form1.contents" disabled></el-input>
                </el-form-item>
            </el-form>
        </v-dialog>
    </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import DynamicTable from "~/components/DynamicTable";
import MessageMixins from "~/mixins/messages";
import vDialog from "~/components/dialog";
import Api from "~/utils/api";
import Utils from "~/plugins/utils";

export default {
  name: "feedBackConfig",

  components: {
    DynamicTable,
    vDialog
  },

  mixins: [MessageMixins],

  data() {
    return {
      upLoad: false,
      form: {},
      form1: {},
      pageSize: 20,
      pageNo: 1,
      feedBackList: [],
      feedBackListAll: null,
      typeArr: [
        {
          name: "内容相关",
          value: 1
        },
        {
          name: "功能异常",
          value: 2
        },
        {
          name: "会员权益",
          value: 3
        },
        {
          name: "活动相关",
          value: 4
        },
        {
          name: "产品建议",
          value: 5
        },
        {
          name: "其他",
          value: 6
        }
      ]
    };
  },

  beforeMount() {
   
    this.getUserLikeQueryList();
  },

  methods: {
    ...mapActions(["showPageLoading", "hidePageLoading"]),

    getUserLikeQueryList(val) {
         if (val == true) {
            this.pageNo = 1;
        }
         let tt = {
            pageSize: this.pageSize,
            pageNo: this.pageNo,
            type: 1
            };
        let params = Object.assign({},tt,this.form)
        
      this.showPageLoading();
      Api.feedBackList(params)
        .then(res => {
          this.hidePageLoading();
          if (res.code == "200") {
            if(res.body.list.length==0){
             this.$message({message: '暂无查询结果',type: 'warning'})
            }
            this.feedBackList = res.body.list;
            this.feedBackListAll = res.body.count;  
          } else {
            this.$message({
              message: res.message,
              type: "warning"
            });
          }
        })
        .catch(res => {
          this.hidePageLoading();
        });
    },

    onSubmit(val) {
      if(!this.form.userId&&!this.form.mobile) return
      this.getUserLikeQueryList(val);

      // this.pageNo = 1
      // let arr = Object.keys(this.form)
      // if (arr.length != 0) this.getUserLikeQueryList(this.form)
      // else this.$message({message: '请输入查询条件',type: 'warning'})
    },

    onRest() {
      this.form = {};
      this.getUserLikeQueryList();
    },

    countPageChange(val) {
      this.pageNo = val;   
      this.getUserLikeQueryList();
    },

    dateFormate(value) {
      return value
        ? Utils.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss")
        : "";
    },

    onChangePage(val, index) {
      this.form1 = val;
      this.$refs.myDialog.dialogShow();
    },

    onSaveBtn() {
      this.form1 = {};
      this.$refs.myDialog.closeDialog();
    }
  }
};
</script>

<style  lang="scss" scoped>
</style>
