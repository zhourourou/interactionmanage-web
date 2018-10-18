<template>
    <div class="page-modules">
        <div class="find-list">
            <el-form :inline="true" class="demo-form-inline" size="mini" :model="form" ref="queryList">
                <el-form-item label="评论id:">
                    <el-input placeholder="评论id" v-model.trim="form.commentId"></el-input>
                </el-form-item>
                <el-form-item label="父评论id:">
                    <el-input placeholder="父评论id" v-model.trim="form.parentId"></el-input>
                </el-form-item>
                <el-form-item label="评论人id:">
                    <el-input placeholder="评论人id" v-model.trim="form.userId"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称:">
                    <el-input placeholder="用户昵称" v-model.trim="form.userName"></el-input>
                </el-form-item>
                <el-form-item label="短评内容:">
                    <el-input placeholder="短评内容" v-model.trim="form.body"></el-input>
                </el-form-item>
                 <el-form-item label="评论来源">
                    <el-select placeholder="请选择" v-model.trim="form.clientType">
                        <el-option label="视频" value="1"></el-option>
                        <el-option label="影院" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="评论创建时间从:">
                    <el-date-picker @change="createdTime" v-model.trim="value6" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="内容id:">
                    <el-input placeholder="内容id" v-model.trim="form.contentId"></el-input>
                </el-form-item>
                <el-form-item label="媒资id:">
                    <el-input placeholder="媒资id" v-model.trim="form.mId"></el-input>
                </el-form-item>
                <el-form-item label="评论更新时间从:">
                    <el-date-picker v-model.trim="value7" @change="updateTime" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="手机号码:">
                    <el-input placeholder="手机号码" v-model.trim="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="是否置顶">
                    <el-select placeholder="请选择" v-model.trim="form.top">
                        <el-option label="置顶" value="true"></el-option>
                        <el-option label="未置顶" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="评论状态:">
                    <el-select placeholder="全部状态" v-model.trim="form.status">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-form :inline="true" class="demo-form-inline" size="mini">
                <el-button type="success" style="width:120px" size="small" icon="el-icon-search" @click="queryLists(true)">查询</el-button>
                <el-button type="success" size="small" icon="el-icon-refresh" @click="onReset">重置</el-button>
                <el-button type="primary" size="small" icon="el-icon-rank" @click="onShowDialog = true">导入</el-button>
                <el-button size="small" type="primary" @click="onShowDialogLoad=true" class="export-button">子导出</el-button>
                <el-button type="info" size="small" icon="el-icon-rank" @click="addStart">添加评论点赞</el-button>
            </el-form>
        </div>
        <!-- 增加点赞 -->
        <div v-if="busId">
            <el-dialog :title="'添加评论点赞'+busStartForm.mId" :visible.sync="dialogFormVisible" @close="close">
                <el-form :model="busStartForm" :label-position="labelPosition" size="small">
                    <el-form-item label="媒资ID" :label-width="formLabelWidth">
                        <el-input v-model="busStartForm.mId" disabled style="width:200px"></el-input>
                    </el-form-item>
                    <el-form-item label="点赞数" :label-width="formLabelWidth">
                        <el-input v-model="busStartForm.likeCount" style="width:200px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog">
                    <el-button @click="saveStart">保存</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <template>
                <el-table @current-change="selectionChanges" style="width: 100%" :data="tableDatas" stripe size="small" highlight-current-row>
                    <el-table-column sortable width="55" type="index"></el-table-column>
                    <el-table-column sortable prop="commentId" label="评论id" width="120"></el-table-column>
                    <el-table-column sortable prop="parentId" label="父评论ID" width="120"></el-table-column>
                    <el-table-column sortable prop="userId" label="评论人ID" width="120"></el-table-column>
                    <el-table-column sortable prop="mobile" label="手机号码" width="120"></el-table-column>
                    <el-table-column sortable prop="body" :show-overflow-tooltip="true" label="短评内容" width="120"></el-table-column>
                     <el-table-column sortable prop="clientType" label="来源" width="100">
                        <template slot-scope="scope"><span :class="getStyle(scope.row.clientType)">{{fromWhere(scope.row.clientType)}}</span></template>
                    </el-table-column>
                    <el-table-column sortable prop="mId" label="媒资id" width="120"></el-table-column>
                    <el-table-column sortable prop="status" label="评论状态" width="120">
                        <template slot-scope="scope"><span :class="getStyleStatus(scope.row.status)">{{contentStatus(scope.row.status)}}</span></template>
                    </el-table-column>
                    <el-table-column sortable prop="likeCount" label="点赞次数" width="120"></el-table-column>
                
                    <el-table-column sortable label="创建时间" prop="createTime" width="140">
                        <template slot-scope="scope">{{initTimes(scope.row.createTime)}}</template>
                    </el-table-column>
                    <el-table-column sortable prop="updateTime" label="更新时间" width="140">
                        <template slot-scope="scope">{{initTimes(scope.row.updateTime)}}</template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent.stop="handleClick(scope.row)" :disabled="scope.row.status=='30' || scope.row.status=='20' || scope.row.status=='2' || scope.row.status=='10'"  size="mini">{{scope.row.top?'取消置顶':'置顶'}}</el-button>
                            <el-button style="float:right;margin-right:10px;" v-show="scope.row.status!=5" @click.native.prevent.stop="deleteRow(scope.$index, tableDatas,scope)" type="danger"
                                size="mini">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <template>
                <div class="block" v-if="allCount > pageSize">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize"
                        layout="prev, pager, next, jumper" :total="allCount">
                    </el-pagination>
                </div>
            </template>
        </div>
        <el-dialog title="导入引导" :visible.sync="onShowDialog" width="50%">
            <div class="file-input">
                <el-input placeholder="请选择要导入的文件(仅支持xls和xlsx文件)" size="small" class="module" v-model="path" readonly="readonly" clearable
                    @change="onClearFile"></el-input>
                <el-upload class="upload-demo" ref="upload" :action="fileUploadAction" :limit="2" :on-change="fileCheck" :auto-upload="false"
                    :file-list="fileList" :show-file-list="false" :before-upload="beforeAvatarUpload">
                    <el-button slot="trigger" type="primary" title="只能上传xls/xlsx文件" class="browse-button">浏览</el-button>
                </el-upload>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button><a :href="url" download="导入评论模板.xlsx">模板下载</a></el-button>
                <el-button size="small" type="primary" @click="onImport" class="import-button" :disabled="!canImport">导入</el-button>
            </span>
        </el-dialog>
        <el-dialog title="导出引导" :visible.sync="onShowDialogLoad" width="55%">
            <el-form :inline="true" class="demo-form-inline" size="mini" :model="form2" ref="queryList">
                <el-form-item label="评论ID:" label-width="100px">
                    <el-input placeholder="评论ID" v-model.trim="form2.commentId"></el-input>
                </el-form-item>
                <el-form-item label="评论人id:" label-width="100px">
                    <el-input placeholder="评论人id" v-model.trim="form2.userId"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称:" label-width="100px">
                    <el-input placeholder="用户昵称" v-model.trim="form2.userName"></el-input>
                </el-form-item>
                <el-form-item label="短评内容:" label-width="100px">
                    <el-input placeholder="短评内容" v-model.trim="form2.body"></el-input>
                </el-form-item>
                </el-form-item>
                <el-form-item label="内容id:" label-width="100px">
                    <el-input placeholder="内容id" v-model.trim="form2.contentId"></el-input>
                </el-form-item>
                <el-form-item label="媒资id:" label-width="100px">
                    <el-input placeholder="媒资id" v-model.trim="form2.mId"></el-input>
                </el-form-item>
                 <el-form-item label="评论创建时间从:">
                    <el-date-picker @change="createdTime" v-model.trim="value8" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="更新开始时间">
                    <el-date-picker v-model.trim="form2.updateTimeBegin" type="datetime" placeholder="">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="更新结束时间">
                    <el-date-picker v-model.trim="form2.updateTimeEnd" type="datetime" placeholder="">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="手机号码:" label-width="100px">
                    <el-input placeholder="手机号码" v-model.trim="form2.mobile"></el-input>
                </el-form-item>
                <el-form-item label="是否置顶" label-width="100px">
                    <el-select placeholder="请选择" v-model.trim="form2.top">
                        <el-option label="置顶" value="true"></el-option>
                        <el-option label="未置顶" value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="评论状态:" label-width="100px">
                    <el-select placeholder="全部状态" v-model.trim="form2.status">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="评论来源" label-width="80px">
                    <el-select placeholder="请选择" v-model.trim="form2.clientType">
                        <el-option label="视频" value="1"></el-option>
                        <el-option label="影院" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="onDownTemplate()">导出</el-button>
            </span>

        </el-dialog>
    </div>
</template>
<script>
    import Api from '../../../utils/api.js'
    import MessageMixins from '../../../mixins/messages.js'
    import * as C from '../../../constants/api.js'
    import { mapActions, mapState } from 'vuex'
    export default {
        name: 'childAnswer',
        mixins: [MessageMixins],
        data() {
            return {
                url: require('~/layouts/images/sheet.xlsx'),
                path: '',
                tableData: [],
                everyPageData: [],
                canImport: false,
                dlgVisible: true,
                fileList: [],
                failedCounter: 0,
                form: {},
                form2: {},
                tableDatas: [],
                allCount: 0,
                pageSize: 20,
                currentPage: 1,
                busStartForm: {},
                dialogFormVisible: false,
                busId: '',
                labelPosition: 'left',
                formLabelWidth: "120px",
                value6: [],
                value8:[],
                value7: '',

                options: [{
                    value: '1',
                    label: '审核通过'
                }, {
                    value: '2',
                    label: '审核不通过'
                }, {
                    value: '3',
                    label: '用户删除'
                }, {
                    value: '4',
                    label: '父评论删除'
                }, {
                    value: '5',
                    label: '运营删除'
                }, {
                    value: '10',
                    label: '一审不通过'
                }, {
                    value: '11',
                    label: '一审通过'
                }, {
                    value: '20',
                    label: '二审不通过'
                }, {
                    value: '21',
                    label: '二审通过'
                }, {
                    value: '30',
                    label: '三审不通过'
                }, {
                    value: '31',
                    label: '三审通过'
                }],
                onShowDialog: false,
                onShowDialogLoad: false
            }
        },
        created() {
            this.inittime("","init")
            this.queryLists();
        },
        computed: {

            fileUploadAction() {
                return C.IMPORT_EXCEL
            },

            downloadTemplet() {
                return C.EXPORT_EXCEL
            }
        },

        methods: {
            ...mapActions(['showPageLoading', 'hidePageLoading']),
          inittime(val,value1) {
                let starTime = new Date(new Date().setDate(new Date().getDate() - 90));
                let endTime = new Date();    

                 let starTime1 = new Date(new Date().setDate(new Date().getDate() - 7));
                let endTime1 = new Date();
              
                 if(val=="value6"||value1=="init"){

                    this.value6.push(starTime)
                    this.value6.push(endTime)
        
                    this.form = {
                        createTimeBegin: this.initTimes(starTime.getTime()),
                        createTimeEnd: this.initTimes(endTime.getTime())
                    }
                }
                if(val=="value8"||value1=="init"){
                    this.value8.push(starTime1)
                    this.value8.push(endTime1)
                    this.form2 = {
                        createTimeBegin: this.initTimes(starTime1.getTime()),
                        createTimeEnd: this.initTimes(endTime1.getTime())
                    }
                }         

            },
            /*-----------------导入导出------------------*/
            onClearFile() {
                this.$refs.upload.clearFiles()
                this.canImport = false
            },
            //检测数据的excel类型
            fileCheck(file, fileList) {
                this.failedCounter = 0
                this.tableData = []
                this.everyPageData = []
                const extension1 = file.name.split('.')[1] === 'xls'
                const extension2 = file.name.split('.')[1] === 'xlsx'
                this.canImport = fileList.length > 0
                this.path = file.name
                if (!extension1 && !extension2) {
                    this.showWarning('上传文件只能是 xls、xlsx 格式!，请更换上传文件')
                    this.$refs.upload.clearFiles()
                    this.canImport = false
                    this.path = ''
                    return;
                }
                if (fileList.length > 1) {
                    this.$refs.upload.clearFiles()
                    this.path = ''
                    this.canImport = false
                    this.showWarning('最多只能上传文件一个文件,请重新上传')
                    return;
                }
            },
            // 上传前对文件的类型的判断
            beforeAvatarUpload(file) {
                this.realUpload(file)
                return false
            },
            //导入功能提交
            onImport() {
                this.$refs.upload.submit()
                this.onShowDialog = false
            },
            onDownTemplate() {
                let arr = [];
                for (let item in this.form2) {
                    arr.push(item + '=' + this.form2[item])
                }
                window.open(this.downloadTemplet + '?' + arr.join('&'))
                setTimeout(() => {
                    this.value8=[];
                    this.form2 = {}
                    this.inittime("value8");
                    this.onShowDialogLoad = false
                }, 500)
            },
            //上传数据接口
            realUpload(file) {
                var formData = new FormData()
                formData.append('upload', file)
                Api.importExcel('', '', '', '', '', formData).then(res => {
                    if (res.code === 200) {
                        this.showSuccess("导入完成")
                        this.queryLists();
                    }
                    this.canImport = false
                    this.path = ''
                    this.$refs.upload.clearFiles()
                    // this.hidePageLoading()
                }).catch(() => {
                    // this.hidePageLoading()
                })
            },


            /*-----------------------------------*/
            //获取评论创建时间的开始时间跟结束时间的时间戳
            createdTime() {
                if (this.value6) {
                    let formatTime = {
                        createTimeBegin: this.initTimes(this.value6[0].getTime()),
                        createTimeEnd: this.initTimes(this.value6[1].getTime())
                    }
                    this.form = Object.assign({}, formatTime);
                } else {
                    this.value6 = "";
                }
                   if (this.value8) {
                    let formatTime1 = {
                        createTimeBegin: this.initTimes(this.value8[0].getTime()),
                        createTimeEnd: this.initTimes(this.value8[1].getTime())
                    }
                    this.form2 = Object.assign({}, formatTime1);
                } else {
                    this.value8 = "";
                }
            },
            //   获取评论更新时间段的开始时间跟结束时间的时间戳
            updateTime() {
                if (this.value7) {
                    let formatTimes = {
                        updateTimeBegin: this.initTimes(this.value7[0].getTime()),
                        updateTimeEnd: this.initTimes(this.value7[1].getTime())
                    }
                    this.form = Object.assign({}, formatTimes);
                } else {
                    this.value7 = "";
                }
            },
            close() {

            },
            saveStart() {
                let tt = {
                    objectId: this.busId,
                    type: 0,
                    times: this.busStartForm.likeCount,
                    mId: this.busStartForm.mId
                }
                Api.addStartNum(tt).then((res) => {
                    if (res.code == 200) {
                        this.showSuccess('修改成功');
                        this.busStartForm = {};
                        this.busId = "";
                        this.busForm = {};
                        this.queryLists();
                        this.dialogFormVisible = false;
                    }
                }).catch(
                    res => {
                        this.hidePageLoading()
                    }
                )
            },
            //根据类型判断是哪一个
            contentType(val) {
                if (val == '0') { return '咪咕' }
                else if (val = '2') return '咪咕影院客户端'
            },
            //时间戳转化为时间
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
                        m = '0' + m;
                    }
                    if (d < 10) {
                        d = '0' + d;
                    }
                    if (H < 10) {
                        H = '0' + H;
                    }
                    if (i < 10) {
                        i = '0' + i;
                    }
                    if (s < 10) {
                        s = '0' + s;
                    }
                    var t = Y + '-' + m + '-' + d + ' ' + H + ':' + i + ':' + s;
                    return t;
                }
                return '';
            },
              fromWhere(val){
                if(val=="1") return "视频"
                else if(val=="2") return "影院"
            },
            //评论状态
            contentStatus(val) {
                if (val == '1') return '审核通过'
                else if (val == '21') return '二审通过'
                else if (val == '30') return '三审不通过'
                else if (val == '20') return '二审不通过'
                else if (val == '2') return '审核不通过'
                else if (val == '3') return '用户删除'
                else if (val == '4') return '父评论删除'
                else if (val == '5') return '运营删除'
                else if (val == '10') return '一审不通过'
                else if (val == '11') return '一审通过'
                else if (val == '5') return '运营删除'
                else if (val == '31') return '三审通过'
            },
             getStyle(val){
                if(val=="2") return "yingyuan"
            },
            getStyleStatus(val) {
                if (val == '1' || val == '21' || val == '11' || val == '31') {
                    return 'success'
                } else if (val == '2' || val == '10' || val == '20' || val == '30') {
                    return 'danger'
                } else {
                    return 'delete'
                }
            },
            //初始化/根据条件查询子评论的列表
            queryLists(val) {
                if (val == true) {
                    this.currentPage = 1;
                }
                this.showPageLoading()
                let init = {
                    pageNo: this.currentPage,
                    pageSize: this.pageSize
                }
                let params = Object.assign({}, this.form, init)
                Api.queryChildList(params).then((res) => {
                    if (res.code == 200) {
                        this.hidePageLoading()
                        this.tableDatas = res.body.list;
                        this.allCount = res.body.count;
                        this.pageSize = res.body.pageSize;
                        this.currentPage = res.body.pageNo;
                    }
                })
            },
            //重置按钮
            onReset() {
                this.value6 = [];
                this.value7 = "";
                this.form = {};
                this.inittime("value6")
                this.queryLists();
            },
            addStart() {
                if (!this.busId) {
                    this.showWarning('请选择添加的对象');
                } else {
                    this.dialogFormVisible = true;
                }
            },
            selectionChanges(val) {
                if (val) {
                    this.busId = val.commentId;
                    this.busForm = val;
                    let tt = {
                        mId: val.mId,
                        likeCount: val.likeCount
                    }
                    this.busStartForm = Object.assign({}, tt)
                }
            },
            //置顶
            handleClick(val) {
                let id = val.commentId;
                if (val.top == true) {
                    //取消置顶
                    Api.makeAnswerNo(`/${id}/0`).then((res) => {
                        if (res.code == 200) {
                            this.showSuccess('取消置顶成功')
                            this.queryLists();
                        }
                    }).catch(
                        res => {
                            this.hidePageLoading()
                        }
                    )
                } else if (val.top == false) {
                    //置顶
                    Api.makeAnswerTop(`/${id}/0`).then((res) => {
                        if (res.code == 200) {
                            this.showSuccess("置顶成功");
                            this.queryLists();
                        }
                    }).catch(
                        res => {
                            this.hidePageLoading()
                        }
                    )
                }
            },
            //删除子评论
            deleteRow(index, val, scope) {
                this.showConfirm({
                    message: `是否删除当前评论内容为 ${scope.row.body} 的评论?`
                }).then(() => {
                    Api.delChildAnswer(`/${scope.row.commentId}`).then((res) => {
                        if (res.code == 200) {
                            this.showSuccess('删除成功');
                            this.queryLists();
                        } else {
                            this.showSuccess('删除失败');
                        }

                    }).catch(
                        res => {
                            this.hidePageLoading()
                        }
                    )
                })
            },
            //
            handleSizeChange() {
                // 页面发生改变的时候

            },
            handleCurrentChange(val) {
                // 页面发生改变的时候
                this.currentPage = val;
                this.queryLists();
            }

        }

    }
</script>

<style lang="scss" scoped>
    .find-list {
        width: 100%;
    }

    .dialog {
        text-align: center;
    }

    .file-input {
        margin-bottom: 8px;
        margin-top: 8px;
    }

    .block {
        text-align: right;
    }

    .module {
        width: 70%;
    }

    .upload-demo {
        display: inline-block;
    }

    .search {
        width: 240px;

    }
     .yingyuan{
        color:rgb(76, 188, 130);
    }
</style>