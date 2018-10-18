<template>
    <div class="page-modules user-config">
        <el-form :inline="true"  class="demo-form-inline" size="mini" label-position="left" :model='form1' ref="form">
                <el-form-item label="用户中文名称" prop="chnName" label-width="100px">
	                <el-input v-model.trim="form1.chnName" placeholder="用户中文名称"></el-input>
	            </el-form-item>

	            <el-form-item label="用户名称" prop="userName">
	                <el-input v-model.trim="form1.userName" placeholder="用户名称"></el-input>
	            </el-form-item>

	            <el-form-item label='用户状态' prop='userStatus' >
	                <el-select v-model="form1.userStatus" >
				      	<el-option label="激活" value="1"></el-option>
				      	<el-option label="禁用" value="2"></el-option>
				    </el-select>
	            </el-form-item>

	            <el-form-item label='电话号码' prop='telephone'>
	                <el-input v-model.trim='form1.telephone' placeholder="电话号码"></el-input>
	            </el-form-item>

			  	<el-form-item>
			  		<el-button type="success" style="width:120px" size="small"  icon="el-icon-search" @click="onSubmit()" class="query">查询</el-button>
			  	</el-form-item>
			  	<el-form-item>
			  		<el-button type="success" size="small" icon="el-icon-refresh" @click="onRest()" class="query">重置</el-button>
			  	</el-form-item>
			  	<el-form-item>
			  		<el-button type="info" size="small" icon="el-icon-rank" @click="onAddUser()">新增用户</el-button>
			  	</el-form-item>
			</el-form>

            <dynamic-table 
            	:data="userList"
                :total="userListAll"
                :pageSize="pageSize"
                :pageNo="pageNo"
                @pagination="onPagination"
                >
                <el-table-column label='用户中文名称' prop='chnName' width="180"></el-table-column>
                <el-table-column label='用户名' prop='userName' width="180"></el-table-column>
                <el-table-column label='状态' prop='userStatus' width="120">
                    <template slot-scope="scope">
                        {{ scope.row.userStatus == '2' ? '禁用' : '已激活' }}
                    </template>
                </el-table-column>
                <el-table-column label='电话号码' prop='telephone' width="150"></el-table-column>
				<el-table-column label='角色' prop='roleName' width="150"></el-table-column>
                <el-table-column label='邮箱地址' prop='email'width="160"></el-table-column>
                <el-table-column label="操作" width="220" fixed=right>
                    <template slot-scope="scope">
						 <el-button  type="success"  @click.native.prevent.stop="addhandleClick(scope.row)">添加角色</el-button>
                        <el-button  type="primary" @click='onUserChange(scope.row)'>修改</el-button>
                    </template>
                </el-table-column>
            </dynamic-table>
		  <!-- 添加角色 -->
         <el-dialog title="添加角色" :visible.sync="dialogFormVisible2" center @close="haha1">
            <el-form :model="form3" :inline="true" >
				<div>
                  <el-form-item label="用户id">
                          <el-input :disabled="ss" v-model.trim="form3.userId" style="width:260px"></el-input>
                  </el-form-item>
                </div>
                <el-form-item label="用户名" >
                        <el-input :disabled="ss" v-model.trim="form3.userName"></el-input>
                </el-form-item>
                <div>
                  <el-form-item label="电话号" >
                          <el-input :disabled="ss" v-model.trim="form3.telephone"></el-input>
                  </el-form-item>
                </div>		
                 <el-form-item label="角色id" >
                        <el-input :disabled="ss" v-model.trim="form3.roleId"></el-input>
                </el-form-item>
                <el-button style="margin-top:4px" @click="addSelect">选择角色</el-button>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="canclePermission">取 消</el-button>
                <el-button type="primary" @click="addupdatePermission">确 定</el-button>
            </div>
        </el-dialog>
		 <!-- 选择角色 -->
        <el-dialog
        title="角色列表"
        :visible.sync="centerDialogVisible"
        center>
        <template>
          <el-table
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
			 highlight-current-row
            @current-change="handleSelectionChange">
            <el-table-column
				type="index"
				width="50">
            </el-table-column>
            <el-table-column
              label="角色id"
              width="80">
              <template slot-scope="scope">{{ scope.row.roleId }}</template>
            </el-table-column>
            <el-table-column
              prop="roleName"
              label="角色名"
             >
            </el-table-column>
          </el-table>
        </template>
         <template>
            <div class="block" v-if="allCount1 > pageSize1">
                <el-pagination @current-change="handleCurrentChange1" :current-page.sync="pageNo1" :page-size="pageSize1"
                    layout="prev, pager, next, jumper" :total="allCount1">
                </el-pagination>
            </div>
        </template>

        <span slot="footer" class="dialog-footer">
          <el-button @click="cancleSQ">取 消</el-button>
          <el-button type="primary" @click="okSQ" >确 定</el-button>
        </span>
      </el-dialog>

		<!-- // -->

        <el-dialog
			center
			class="upload"
			title="修改用户信息"
			:visible.sync="dialogVisible"
			width="70%"
			:before-close="handleClose">
			<el-form class='form' :model='form' ref='form' label-position='right' :rules='rules' label-width="120px">
	            <el-form-item label="用户中文名称" prop="chnName">
	                <el-input v-model="form.chnName" style="width:300px;"></el-input>
	                  <span style="color:#F56C6C;">注：（中文名称）</span>
	            </el-form-item>

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
	                <el-button type="primary" @click="onSave()">保存</el-button>
	                <el-button @click="handleClose">取消</el-button>
	            </el-form-item>
	        </el-form>
		</el-dialog>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DynamicTable from "~/components/DynamicTable";
import Api from "~/utils/api";
import MessageMixins from "~/mixins/messages.js";

export default {
  name: "UserConfig",
    mixins: [MessageMixins],
  components: {
    DynamicTable
  },

  data() {
    return {
      userList: [],
      userListAll: null,
      form1: {},
      dialogVisible: false,
      form: {},
      form3: {},
      tableData3: [],
      ss: true,
      pageNo1: 1,
      pageSize1: 20,
	  allCount1: 0,
	  strreq:'',
      dialogFormVisible2: false,
      centerDialogVisible: false,
      rules: {
        chnName: [
          { required: true, message: "用户名称不能为空" },
          { pattern: /^[\u4e00-\u9fa5]+$/, message: "只支持中文名称" }
        ],
        userName: [
          { required: true, message: "用户名称不能为空" },
          { pattern: /^[a-zA-Z]+$/, message: "只支持纯英文字符" }
        ],
        password: [
          { required: true, message: "密码不能为空" },
          { pattern: /[0-9a-zA-Z]{8,16}/, message: "密码不符合规范" }
        ],
        userStatus: [{ required: true, message: "请选择用户是否激活" }],
        telephone: [
          { required: true, message: "手机号码不能为空" },
          { pattern: /^1[35678]\d{9}/, message: "手机格式不正确" }
        ]
      },
      total: null,
      pageNo: 1,
      pageSize: 20
    };
  },
  created() {
    this.searchRole();
  },

  methods: {
	///--------------------------------
	 handleCurrentChange1(val) {
      this.pageNo1 = val;
      this.searchRole();
    },
	cancleSQ(){
        this.centerDialogVisible = false
      //  this.$refs.multipleTable.clearSelection();
	},
	 okSQ(){
	  this.centerDialogVisible = false
      this.form3.roleId = this.strreq;
    },
	  addupdatePermission() { 
      if(!this.form3.roleId){
        this.showWarning("请选择要绑定的角色");
        return
      }
         let params = {
            userId: this.form3.userId,
            roleIds: this.form3.roleId
          };
	  this.strreq='';
	   Api.bindUserRole(params).then(res => {
		 if(res.code==200){
           this.dialogFormVisible2 = false;
           this.showSuccess("绑定成功");
           this.searchRole();
        }else{
           this.dialogFormVisible2 = false;
          this.showWarning(res.message);
        }
      });
    },

	 canclePermission() {
      this.dialogFormVisible = false;
      this.dialogFormVisible1 = false;
       this.dialogFormVisible2 = false;
      this.form1 = {};
      this.form2 = {};
       this.form3 = {};
      this.strreq='';
	  //
	  if(this.$refs.multipleTable){
		this.$refs.multipleTable.clearSelection();
	  }
	},
	 //查询角色信息列表
    searchRole() {  
      let initParams = {
        pageNo: this.pageNo1,
        pageSize: this.pageSize1
      };
      let params = Object.assign({}, initParams);
      Api.searchRole(params).then(res => {
        if (res.code == 200) {
          this.allCount1 = res.body.count;
          this.tableData3 = res.body.list;
        }
      });
    },
    haha1() {
		 this.form3={};
		 if(this.$refs.multipleTable){
 			this.$refs.multipleTable.clearSelection();
		 }
	},
    addhandleClick(val) {
      // this.centerDialogVisible=true;
      this.form3 = Object.assign({}, this.form3, val);
      this.dialogFormVisible2 = true;
    },
    addSelect() {
      this.centerDialogVisible = true;
    //   this.$nextTick(() => {
    //     //假如已经有41，42
    //     let arr = [41, 42, 38];
    //     for (let i = 0; i < arr.length; i++) {
    //       for (let q = 0; q < this.tableData3.length; q++) {
    //         if (arr[i] == this.tableData3[q].permissionId) {
    //           this.$refs.multipleTable.toggleRowSelection(
    //             this.tableData3[q],
    //             true
    //           );
    //         }
    //       }
    //     }
    //   });
    },
    handleSelectionChange(val) {
	  if(val&&val.roleId){
		    this.strreq = val.roleId;
	  }else{
		 this.strreq = ""; 
	  }
    },
    ///--------------------------------

    ...mapActions(["showPageLoading", "hidePageLoading"]),

    onAddUser() {
      this.$router.push("/user/info/config/edit");
    },

    getUserList(param) {
      this.showPageLoading();
      Api.user(param)
        .then(res => {
          this.hidePageLoading();
          this.userList = res.body.list;
          this.userListAll = res.body.count;
        })
        .catch(res => {
          this.hidePageLoading();
        });
    },

    onUserChange(value) {
      this.dialogVisible = true;
      this.form = {
        userId: value.userId,
        chnName: value.chnName,
        userStatus: value.userStatus,
        telephone: value.telephone,
        email: value.email,
        page: this.pageNo
      };
      this.form.userStatus = this.form.userStatus == "1" ? "激活" : "禁用";
    },

    handleClose() {
      this.dialogVisible = false;
    },

    onSave() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.userStatus = this.form.userStatus == "激活" ? 1 : 2;
          const params = this.form;
          Api.changeUser(params)
            .then(res => {
              if (res.code == "200") {
                this.handleClose();
                this.getUserList();
              }
            })
            .catch(res => {
              this.hidePageLoading();
            });
        }
      });
    },

    onRest() {
      this.form1 = {};
    },

    onSubmit() {
      let params = this.form1;
      this.getUserList(params);
    },

    onPagination(val) {
      this.pageNo = val;
      let param = {
        pageNo: this.pageNo,
        limit: this.pagesize
      };
      let params = Object.assign(param, this.form);
      this.getUserList(params);
    }
  },

  beforeMount() {
    this.getUserList();
  }
};
</script>

<style lang="scss" scoped>
.user-config {
  h2 {
    line-height: 30px;
    margin-bottom: 20px;
  }
}
</style>
