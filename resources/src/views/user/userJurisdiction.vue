<template>
    <div class="page-modules user-config">
        <!-- 查询条件 -->
        <div>
            <el-form :inline="true" class="demo-form-inline" size="mini" :model="form" >
                 <el-form-item label="权限ID:">
                    <el-input placeholder="权限ID" v-model.trim="form.permissionId"></el-input>
                </el-form-item>
                <el-form-item label="权限名:">
                    <el-input placeholder="权限名" v-model.trim="form.permissionName"></el-input>
                </el-form-item>
                <el-form-item label="权限地址:">
                    <el-input placeholder="权限地址" v-model.trim="form.permissionUrl"></el-input>
                </el-form-item>
                 <el-form-item label="状态">
                    <el-select placeholder="请选择" v-model.trim="form.status">
                        <el-option label="有效" value="1"></el-option>
                        <el-option label="无效" value="0"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <!-- <div class="mid"></div> -->
        
         <div>
            <el-form :inline="true" class="demo-form-inline" size="mini">
                <el-button type="success" size="small" icon="el-icon-search" @click="queryLists()" style="width:120px">查询</el-button>
                <el-button type="success" size="small" icon="el-icon-refresh" @click="onReset" style="width:120px">重置</el-button>
                 <el-button type="success" size="small" icon="el-icon-circle-plus" @click="dialogFormVisible = true" >新增权限</el-button>
            </el-form>
        </div>
        <!-- 新增权限 -->
        <el-dialog title="新增权限信息" :visible.sync="dialogFormVisible" center @close="haha">
            <el-form :model="form1">
                <el-form-item label="权限名" >
                     <el-input v-model.trim="form1.permissionName"></el-input>
                </el-form-item>
                <el-form-item label="权限地址" >
                     <el-input v-model.trim="form1.permissionUrl" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="canclePermission">取 消</el-button>
                <el-button type="primary" :disabled="!form1.permissionName||!form1.permissionUrl" @click="addPermission">确 定</el-button>
            </div>
            </el-dialog>
            <!-- 修改权限 -->
            <el-dialog title="修改权限信息" :visible.sync="dialogFormVisible1" center @close="haha">
            <el-form :model="form2">
                <el-form-item label="权限id" >
                     <el-input v-model.trim="form2.permissionId"></el-input>
                </el-form-item>
                <el-form-item label="权限名" >
                     <el-input v-model.trim="form2.permissionName"></el-input>
                </el-form-item>
                <el-form-item label="权限地址" >
                     <el-input v-model.trim="form2.permissionUrl" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="canclePermission">取 消</el-button>
                <el-button type="primary"  @click="updatePermission">确 定</el-button>
            </div>
            </el-dialog>

        <template>
            <el-table
            :data="tableData"
            style="width: 100%"
            stripe 
            size="small" 
            highlight-current-row>
            <el-table-column
            prop="permissionId"
             width="80"
            label="权限id">
            </el-table-column>
            <el-table-column
            prop="permissionName"
            label="权限名"
            width="180">
            </el-table-column>
            <el-table-column
            prop="permissionUrl"
             width="180"
            label="权限地址">
            </el-table-column>
             <el-table-column
                prop="status"
                label="状态">
                <template slot-scope="scope">{{scope.row.status==1?"有效":"无效"}}</template>
            </el-table-column>
             <el-table-column sortable label="创建时间" prop="createTime">
                <template slot-scope="scope">{{initTimes(scope.row.createTime)}}</template>
            </el-table-column>
             <el-table-column fixed='right' label="操作" width="180">
                <template slot-scope="scope">
                    <el-button size="small" @click.native.prevent.stop="handleClick(scope.row)">修改</el-button>
                    <el-button :disabled="scope.row.status==0" @click.native.prevent.stop="deleteRow(scope.$index, tableData,scope)" type="danger"
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
  name: "userJurisdiction",
  mixins: [MessageMixins],
  data() {
    return {
      tableData: [],
      pageNo: 1,
      pageSize: 20,
      allCount: 0,
      form: {},
      form1: {},
      form2: {},
      dialogFormVisible: false,
      dialogFormVisible1: false
    };
  },
  created() {
    //查询权限列表信息---->接口ok
    this.searchPermission();
  },
  mounted() {},
  methods: {
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
    haha() {
      this.form1 = {};
      this.form2 = {};
    },
    onReset() {
      this.form = {};
      this.searchPermission();
    },
    queryLists() {
      this.searchPermission(true);
    },
    canclePermission() {
      this.dialogFormVisible = false;
      this.dialogFormVisible1 = false;
      this.form1 = {};
    },

    handleClick(val) {
      this.dialogFormVisible1 = true;
      console.log(val);
      this.form2 = Object.assign({}, val);
    },

    //更新权限信息
    updatePermission() {
      this.showPageLoading();
      Api.updatePermission(this.form2).then(res => {
        this.hidePageLoading();
        console.log(res);
        if (res.code == 200) {
          this.dialogFormVisible1 = false;
          this.showSuccess("更新成功");
          this.searchPermission();
        }else{
          this.dialogFormVisible1 = false;
          this.showWarning(res.message);  
        }
      });
    },

    //添加权限名确定按钮
    addPermission() {
      this.showPageLoading();
      Api.addPermission(this.form1).then(res => {
        console.log(res);
        this.hidePageLoading();
        if (res.code == 200) {
          this.dialogFormVisible = false;
          this.showSuccess("添加成功");
          this.searchPermission();
        } else {
          this.dialogFormVisible = false;
          this.showWarning(res.message);
        }
      });
    },
    ...mapActions(["showPageLoading", "hidePageLoading"]),
    //查询权限列表信息
    searchPermission(val) {
      if (val == true) {
        this.pageNo = 1;
      }
      let initParams = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      let params = Object.assign({}, initParams, this.form);
      this.showPageLoading();
      Api.searchPermission(params).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.hidePageLoading();
          this.allCount = res.body.count;
          this.tableData = res.body.list;
        }
      });
    },

    //删除单航数据
    deleteRow(index, val, scope) {
      console.log(index, val, scope);
      this.showConfirm({
        message: `是否删除当前权限名为 ${scope.row.permissionName} 的权限？`
      }).then(() => {
        let params = {
          id: scope.row.permissionId
        }
        
        Api.deletePermission(params).then(res => {
          console.log(res);
          if (res.code == 200) {
            this.showSuccess("删除成功");
            this.searchPermission();
          } else {
            this.showWarning(res.message);
          }
        });
      });
    },
    handleCurrentChange(val) {
      //当前页发生变化的时候会触发这个函数 val是当前的页数
      this.pageNo = val;
      this.searchPermission();
    }
  }
};
</script>

<style lang="scss" scoped >
.mid {
  width: 100%;
  height: 2px;
  margin: 10px 0;
  background: rgb(171, 187, 206);
}
.block{
  text-align: right;
}
</style>