<template>
    <div class="page-modules user-config">
         <!-- 查询条件 -->
        <div>
            <el-form :inline="true" class="demo-form-inline" size="mini" :model="form" >
                 <el-form-item label="角色id:">
                    <el-input placeholder="角色id" v-model.trim="form.roleId"></el-input>
                </el-form-item>
                <el-form-item label="角色名:">
                    <el-input placeholder="角色名" v-model.trim="form.roleName"></el-input>
                </el-form-item>
            </el-form>
        </div>

         <div>
            <el-form :inline="true" class="demo-form-inline" size="mini">
                <el-button type="success" size="small" icon="el-icon-search" @click="searchRole(true)" style="width:120px">查询</el-button>
                <el-button type="success" size="small" icon="el-icon-refresh" @click="onReset" style="width:120px">重置</el-button>
                 <el-button type="success" size="small" icon="el-icon-circle-plus" @click="dialogFormVisible = true" >新增角色</el-button>
            </el-form>
        </div>

         <!-- 新增角色 -->
        <el-dialog title="新增角色信息" :visible.sync="dialogFormVisible" center @close="haha">
            <el-form :model="form1">
                <el-form-item label="角色名" >
                        <el-input v-model.trim="form1.roleName"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="canclePermission">取 消</el-button>
                <el-button type="primary" :disabled="!form1.roleName" @click="addPermission">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 修改角色 -->
         <el-dialog title="修改角色信息" :visible.sync="dialogFormVisible1" center @close="haha">
            <el-form :model="form2">
                <el-form-item label="角色id"   >
                        <el-input v-model.trim="form2.roleId"></el-input>
                </el-form-item>
                 <el-form-item label="角色名" >
                        <el-input v-model.trim="form2.roleName"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="canclePermission">取 消</el-button>
                <el-button type="primary" @click="updatePermission">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 添加权限 -->
         <el-dialog title="添加角色权限" :visible.sync="dialogFormVisible2" center @close="haha1">
            <el-form :model="form3" :inline="true">
                <el-form-item label="角色id" >
                        <el-input :disabled="ss" v-model.trim="form3.roleId"></el-input>
                </el-form-item>
                <div>
                  <el-form-item label="角色名" >
                          <el-input :disabled="ss" v-model.trim="form3.roleName"></el-input>
                  </el-form-item>
                </div>
              
                 <el-form-item label="权限id" >
                        <el-input :disabled="ss" v-model.trim="form3.permissionIds"></el-input>
                </el-form-item>
                <el-button style="margin-top:4px" @click="addSelect">选择权限</el-button>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="canclePermission">取 消</el-button>
                <el-button type="primary" @click="addupdatePermission">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 选择权限 -->
        <el-dialog
        title="权限列表"
        :visible.sync="centerDialogVisible"
        center>

        <template>
          <el-table
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="权限id"
              width="80">
              <template slot-scope="scope">{{ scope.row.permissionId }}</template>
            </el-table-column>
            <el-table-column
              prop="permissionName"
              label="权限名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="permissionUrl"
              label="权限地址"
              show-overflow-tooltip>
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

        <template>
            <el-table
            :data="tableData"
            style="width: 100%"
            stripe size="small" 
            highlight-current-row>
            <el-table-column
            prop="roleId"
             width="80"
            label="角色id">
            </el-table-column>
            <el-table-column
            prop="roleName"
            width="160"
            label="角色名">
            </el-table-column>
             <el-table-column
              prop="permissionId"
              width="160"
              label="权限">
            </el-table-column>
            <el-table-column sortable label="创建时间" prop="createTime" show-overflow-tooltip>
                <template slot-scope="scope">{{initTimes(scope.row.createTime)}}</template>
            </el-table-column>
            <!-- 1111 -->
              <el-table-column
                prop="permissionName"
                label="权限名">
              </el-table-column>
            
             <el-table-column fixed='right' label="操作" width="260">
                <template slot-scope="scope">
                   <el-button size="small" @click.native.prevent.stop="addhandleClick(scope.row)">添加权限</el-button>
                    <el-button size="small" @click.native.prevent.stop="handleClick(scope.row)">修改</el-button>
                    <el-button @click.native.prevent.stop="deleteRow(scope.$index, tableData,scope)" type="danger"
                        size="mini">删除</el-button>
                </template>
            </el-table-column>
         </el-table>
        </template>

        <template>
            <div class="block" v-if="allCount > pageSize">
                <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageNo" :page-size="pageSize"
                    layout="prev, pager, next, jumper" :total="allCount">
                </el-pagination>
            </div>
        </template>
    </div>
</template>

<script>
import Api from "~/utils/api";
import { mapActions, mapState } from "vuex";
import MessageMixins from "~/mixins/messages.js";
export default {
  name: "userCharacter",
  mixins: [MessageMixins],
  data() {
    return {
      tableData: [],
      ss:true,
      pageNo: 1,
      pageSize: 20,
       pageNo1: 1,
      pageSize1: 20,
      allCount: 0,
       allCount1: 0,
      form: {},
      form1: {},
      form2: {},
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogFormVisible2:false,
      form3:{},
      centerDialogVisible:false,
      tableData3:[],
      strreq:''
    };
  },
  created() {
    //新增角色信息----->接口ok
    // this.addRole();
    //删除角色信息--->接口ok
    // this.deleteRole()
    //查询角色列表信息---->接口ok
    this.searchRole();
    //更新角色信息------>接口异常   put请求---->接口ok
    // this.updateRole()
    //绑定用户角色关系信息----->接口异常   put请求------>接口ok
    // this.bindUserRole()
    //查询用户角色关系列表---->接口ok
    // this.queryUserRole()
    //绑定角色权限关系信息------>接口异常   put请求------>接口ok
    // this.bindRolePermission()
    //查询角色权限关系列表--->接口ok
    // this.queryRolePermission()
    this.searchPermission()

  },
  mounted() {},
  methods: {
    cancleSQ(){
        this.centerDialogVisible = false
      //  this.$refs.multipleTable.clearSelection();
    },
    okSQ(){
      this.centerDialogVisible = false
      // this.$refs.multipleTable.clearSelection();
      // if(this.form2.permissionIds){
      //   this.form2.permissionIds= this.form2.permissionIds+','+ String(this.strreq);
      // }else{
      //   console.log('qq'+this.strreq)
      //   this.form2.permissionIds = this.strreq;
      // }
      this.form3.permissionIds = this.strreq;
    },
    //查询权限列表信息
    searchPermission() {
      let initParams = {
        pageNo: this.pageNo1,
        pageSize: this.pageSize1
      };
      let params = Object.assign({}, initParams);
      Api.searchPermission(params).then(res => {
        if (res.code == 200) {
          this.allCount1 = res.body.count;
          this.tableData3 = res.body.list;
        }
      });
    },
    handleSelectionChange(val){
      console.log(val)
      let str ='';
      if(val){
        for(let i=0;i<val.length;i++){
          // console.log(val[i].permissionId)
          str = str+val[i].permissionId+','
        }
        str = str.substring(0,str.length-1)
       
         this.strreq = str
      }else{
        this.strreq = ''
      }
    },
    addSelect(){
      this.centerDialogVisible=true;
      // this.$nextTick(()=>{
      //   //假如已经有41，42
      // let arr = [41,42,38]
      // for(let i=0;i<arr.length;i++){
      //   for(let q=0;q<this.tableData3.length;q++){
      //     if(arr[i]==this.tableData3[q].permissionId){
      //        this.$refs.multipleTable.toggleRowSelection(this.tableData3[q],true);
      //     }
      //   }
      // }     
      // })
    },
    //实践戳转化为时间
    initTimes(val) {
      if (val) {
        let date = new Date(val);
        let Y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let H = date.getHours();
        let i = date.getMinutes();
        let s = date.getSeconds();
        if (m < 10) {
          m = "0" + m;
        }
        if (d < 10) {
          d = "0" + d;
        }
        if (H < 10) {
          H = "0" + H;
        }
        if (i < 10) {
          i = "0" + i;
        }
        if (s < 10) {
          s = "0" + s;
        }
        var t = Y + "-" + m + "-" + d + " " + H + ":" + i + ":" + s;
        return t;
      }

      return "";
    },
     addupdatePermission() { 
      if(!this.form3.permissionIds){
        this.showWarning("请选择要绑定的权限");
        return
      }
         let params = {
            roleId: this.form3.roleId,
            permissionIds: this.form3.permissionIds
          };
      this.strreq='';
      Api.bindRolePermission(params).then(res => {
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

    updatePermission() {
      Api.updateRole(this.form2).then(res => {
              if (res.code == 200) {
                this.dialogFormVisible1 = false;
                this.showSuccess("更新成功");
                this.searchRole();
              } else {
                this.dialogFormVisible1 = false;
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
    addPermission() {
      Api.addRole(this.form1).then(res => {
        if (res.code == 200) {
          this.dialogFormVisible = false;
          this.showSuccess("添加成功");
          this.searchRole();
        } else {
          this.dialogFormVisible = false;
          this.showWarning(res.message);
        }
      });
    },
    haha() {
      this.form1 = {};
      this.form2 = {};
      this.form3={};
    },
    haha1(){
      this.form3={};
      if(this.$refs.multipleTable){
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleClick(val) {
      this.form2 = Object.assign({}, this.form2, val);
      this.dialogFormVisible1 = true;
    },
    addhandleClick(val) {
      // this.centerDialogVisible=true;
      this.form3 = Object.assign({}, this.form3, val);
      this.dialogFormVisible2 = true;
    },

    //删除角色
    deleteRow(index, val, scope) {
     
      this.showConfirm({
        message: `是否删除当前角色名为 ${scope.row.roleName} 的权限？`
      }).then(() => {
        let params = {
          id: scope.row.roleId
        };
        Api.deleteRole(params).then(res => {
          if (res.code == 200) {
            this.showSuccess("删除成功");
            this.searchRole();
          } else {
            this.showWarning(res.message);
          }
        });
      });
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.searchRole();
    },
    handleCurrentChange1(val) {
      this.pageNo1 = val;
      this.searchPermission();
    },
    onReset() {
      this.form = {};
      this.searchRole();
    },
    //查询角色信息列表
    searchRole(val) {
      if (val == true) {
        this.pageNo = 1;
      }
      let initParams = {
        page: this.pageNo,
        size: this.pageSize
      };
      let params = Object.assign({}, initParams, this.form);
      //   this.showPageLoading();
      Api.searchRole(params).then(res => {
 
        if (res.code == 200) {
          //   this.hidePageLoading();
          this.allCount = res.body.count;
          this.tableData = res.body.list;
        }
      });
    },
     //查询角色权限关系列表
    queryRolePermission() {
      let params = {};
      Api.queryRolePermission(params).then(res => {
        console.log('查询角色权限关系列表')
        console.log(res);
      });
    },

    //---------------------以下的调试接口-------------------

    //绑定角色权限关系信息
    bindRolePermission() {
      let params = {
        roleId: "5b87459d1f35ac67e06c0048",
        permissionIds: "5b874fef1f35ac67e06c004a"
      };
      Api.bindRolePermission(params).then(res => {
        console.log(res);
      });
    },

    //更新角色信息
    updateRole() {
      let params = { roleId: "5b866a781f35ac67e06c0047", roleName: "zycqqq" };
      Api.updateRole(params).then(res => {
        console.log(res);
      });
    },
    //新增角色信息
    addRole() {
      let initParams = {
        page: this.pageNo,
        size: this.pageSize
      };
      let params = Object.assign({}, initParams);

      Api.addRole(params).then(res => {
        console.log(res);
        if (res.code == 200) {
          console.log("成功");
        } else if (res.code == 400) {
          console.log("用户名已存在");
        } else {
          console.log(res.message);
        }
      });
    },
    //删除角色信息
    deleteRole() {
      let params = {
        id: "5b866a781f35ac67e06c0047"
      };
      Api.deleteRole(params).then(res => {
        console.log(res);
        if (res.code == 1027) {
          console.log("删除角色信息失败");
        } else if (res.code == 200) {
          console.log("删除角色信息成功");
        }
      });
    },
    //绑定用户角色关系信息
    bindUserRole() {
      let params = {
        userId: "689128085",
        roleIds: "5b866a781f35ac67e06c0047"
      };
      Api.bindUserRole(params).then(res => {
        console.log(res);
      });
    },
    //查询用户角色关系列表
    queryUserRole() {
      let params = {
        userId: "5b87459d1f35ac67e06c0048"
      };
      Api.queryUserRole(params).then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.block{
  text-align: right;
}
</style>