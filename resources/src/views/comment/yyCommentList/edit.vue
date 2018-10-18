<template>
    <div class="page-modules">
        <el-button size="small" round @click="goback">返回</el-button>
        <el-button size="small" round @click="dialogFormVisible = true">回复评论</el-button>
        <!--这里是回复父评论的按钮-->
        <el-dialog title="回复评论" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="form" label-position="left" size="small" :rules="rules">
                <el-form-item label="父评论ID" :label-width="formLabelWidth">
                    <el-input v-model.trim="form.commentId" disabled auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="mId" :label-width="formLabelWidth">
                    <el-input v-model.trim="form.mId" disabled auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="评论内容类型" :label-width="formLabelWidth">
                    <el-input v-model.trim="form.contentType" disabled auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="短评内容" :label-width="formLabelWidth">
                    <el-input v-model.trim="form.body" disabled auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="评论用户:" :label-width="formLabelWidth" prop="userMobile">
                    <el-select placeholder="请选择评论用户" v-model.trim="form.userMobile">
                        <el-option v-for="item in options" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="desc">
                    <el-input type="textarea" :rows="4" placeholder="请输入回复内容" v-model.trim="form.desc">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: center">
                <el-button @click="dialogFormVisible = false">取消回复</el-button>
                <el-button type="primary" :disabled="!form.desc" @click="replayAnswer">确定回复</el-button>
            </div>
        </el-dialog>

        <div class="borderTop"></div>
        <!-- 这里是父评论详情 -->
        <el-form :inline="true" class="demo-form-inline" size="mini" :model="form">
            <el-form-item label="评论ID:">
                <el-input v-model.trim="form.commentId" disabled></el-input>
            </el-form-item>
            <el-form-item label="父评论ID:">
                <el-input disabled></el-input>
            </el-form-item>
            <el-form-item label="用户昵称:">
                <el-input v-model.trim="form.author" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号码:">
                <el-input v-model.trim="form.mobile" disabled></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="form.createTime" disabled type="datetime">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="更新时间">
                <el-date-picker v-model="form.updateTime" disabled type="datetime">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="内容ID:">
                <el-input v-model.trim="form.contentId" disabled></el-input>
            </el-form-item>
            <el-form-item label="内容名称:">
                <el-input v-model.trim="form.contentName" disabled></el-input>
            </el-form-item>
            <el-form-item label="评论内容类型:">
                <el-input disabled></el-input>
            </el-form-item>
            <el-form-item label="分数:">
                <el-input v-model.trim="form.score" disabled></el-input>
            </el-form-item>
            <el-form-item label="点赞次数:">
                <el-input v-model.trim="form.likeCount" disabled></el-input>
            </el-form-item>
            <el-form-item label="媒资id">
                <el-input v-model.trim="form.mId" disabled></el-input>
            </el-form-item>
            <el-form-item label="终端类型:">
                <el-select v-model.trim="form.clientType" disabled>
                    <el-option label="咪咕影院客户端" :value="2"></el-option>
                    <el-option label="咪咕影院客户端" :value="1"></el-option>
                    <el-option label="苹果系统" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否置顶:">
                <el-select v-model.trim="form.top" disabled>
                    <el-option label="置顶" :value="true"></el-option>
                    <el-option label="未置顶" :value="false"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="评论状态:">
                <el-select v-model.trim="form.status" disabled>
                    <el-option label="审核通过" :value="1"></el-option>
                    <el-option label="审核不通过" :value="2"></el-option>
                    <el-option label="用户删除" :value="3"></el-option>
                    <el-option label="父评论删除" :value="4"></el-option>
                    <el-option label="运营删除" :value="5"></el-option>
                    <el-option label="一审不通过" :value="10"></el-option>
                    <el-option label="一审通过" :value="11"></el-option>
                    <el-option label="二审不通过" :value="20"></el-option>
                    <el-option label="二审通过" :value="21"></el-option>
                    <el-option label="三审不通过" :value="30"></el-option>
                    <el-option label="三审通过" :value="31"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="ua:">
                <el-input v-model.trim="form.ua" disabled></el-input>
            </el-form-item>
            <el-form-item label="安卓，苹果用户:">
                <el-input v-model.trim="form.system" disabled></el-input>
            </el-form-item>
            <el-form-item label="客户端版本:">
                <el-input v-model.trim="form.system" disabled></el-input>
            </el-form-item>
            <el-form-item label="影院ID:">
                <el-input disabled></el-input>
            </el-form-item>
            <div>
                <el-form-item label="涉及敏感词:">
                    <el-input style="width: 650px" disabled></el-input>
                </el-form-item>
            </div>
            <div>
                <el-form-item label="短评内容:">
                    <el-input type="textarea1" style="width: 650px;margin-left: 12px;" v-model.trim="form.body"
                        disabled></el-input>
                </el-form-item>
            </div>
        </el-form>
        <div class="borderBottom"></div>
        <div class="sonsList">
            <el-tag type="info" style="margin-bottom: 5px">{{commentid}}:子评论列表</el-tag>
            <template>
                <el-table stripe size="mini" ref="singleTable" :data="tableDatas" highlight-current-row @current-change="handleCurrentChange"
                    style="width: 100%">
                    <el-table-column type="index" width="50"></el-table-column>
                    <el-table-column sortable prop="commentId" label="评论id" width="120"></el-table-column>
                    <el-table-column sortable prop="parentId" label="父评论ID" width="120"></el-table-column>
                    <el-table-column sortable prop="userId" label="评论人ID" width="120"></el-table-column>
                    <el-table-column sortable prop="mobile" label="手机号码" width="120"></el-table-column>
                    <el-table-column sortable prop="body" label="短评内容" width="120"></el-table-column>
                    <el-table-column sortable prop="contentId" label="内容id" width="120"></el-table-column>
                    <el-table-column sortable prop="mId" label="媒资id" width="120"></el-table-column>
                    <el-table-column sortable prop="status" label="评论状态" width="120">
                        <template slot-scope="scope">{{contentStatus(scope.row.status)}}</template>
                    </el-table-column>
                    <el-table-column sortable prop="likeCount" label="点赞次数" width="120"></el-table-column>
                    <el-table-column sortable prop="system" label="终端类型" width="120">
                        <template slot-scope="scope">{{contentType(scope.row.system)}}</template>
                    </el-table-column>
                    <el-table-column sortable label="创建时间" prop="createTime" width="120">
                        <template slot-scope="scope">{{initTimes(scope.row.createTime)}}</template>
                    </el-table-column>
                    <el-table-column sortable prop="updateTime" label="更新时间" width="120">
                        <template slot-scope="scope">{{initTimes(scope.row.updateTime)}}</template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="180">
                        <template slot-scope="scope">
                            <el-button @click.native.prevent.stop="handleClick(scope.row)" :disabled="scope.row.status=='30' || scope.row.status=='20' || scope.row.status=='2' || scope.row.status=='10'"  size="mini">{{scope.row.top?'取消置顶':'置顶'}}</el-button>
                            <el-button style="float:right;margin-right:10px;" @click.native.prevent.stop="deleteRow(scope.$index, tableDatas,scope)" type="danger"
                                size="mini">移除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <div class="bottom" v-show="count > pageSize">
                <template>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="pageNo" :page-size="pageSize" layout="prev, pager, next, jumper" :total="count">
                    </el-pagination>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import Api from "../../../utils/api.js"
    import MessageMixins from '../../../mixins/messages.js'
    export default {
        name: 'List',
        mixins: [MessageMixins],
        data() {
            return {
                count: 0,
                pageNo: 1,
                pageSize: 20,
                tableDatas: [],
                currentPage3: 0,
                dialogFormVisible: false,
                formLabelWidth: '120px',
                textarea: '',
                textarea1: '',
                form: {},
                options: [],
                rules: {
                    userMobile: [{ required: true, message: '手机号码不能为空' }, { pattern: /^1[35678]\d{9}/, message: '手机格式不正确' }],
                    desc: [{ required: true, message: '评论内容不能为空', trigger: 'blur' }]
                }
            }
        },
        props: {
            commentid: String,
            toplist: {
                type: Object,
                default: () => { }
            }
        },
        watch: {

            toplist: function (val) {
                this.form = val;
            },

        },
        created() {

        },
        mounted() {
            setTimeout(() => {
                this.queryChildLists(this.commentid);
                this.initOption()
            }, 200)
        },
        methods: {
            goback(){
                this.$router.back();
            },
            //获取营销白名单用户
            initOption() {
                Api.queryMarketerList().then(res => {
                    if (res.code == 200) {
                        this.options = this._initArray(res.body.list)
                    }
                })
            },
            _initArray(item) {
                let ret = []
                if (item.length > 0) {
                    for (let i = 0; i < item.length; i++) {
                        ret.push(item[i].mobile)
                    }
                }
                return ret
            },
            //查询子评论的列表
            queryChildLists(val) {
                let params = {
                    parentId: val
                }
                Api.querySonLists(params).then((res) => {
                    if (res.code == 200) {
                        this.count = res.body.count;
                        this.tableDatas = res.body.list;
                        this.pageNo = res.body.pageNo;
                        this.pageSize = res.body.pageSize;
                    }
                })
            },
            //子评论置顶
            handleClick(val) {
                let id = val.commentId;
                if (val.top == true) {
                    //取消置顶
                    Api.makeAnswerNo(`/${id}/0`).then((res) => {
                        if (res.code == 200) {
                            this.showSuccess('取消置顶成功');
                            this.queryChildLists(this.commentid);
                        }
                    })
                } else if (val.top == false) {
                    //置顶
                    Api.makeAnswerTop(`/${id}/0`).then((res) => {
                      
                        if (res.code == 200) {
                            this.showSuccess('置顶成功');
                            this.queryChildLists(this.commentid);
                        }
                    })
                }
            },
            //删除单航数据
            deleteRow(index, val, scope) {
                this.showConfirm({
                    message: `是否删除当前评论内容为 ${scope.row.body} 的评论?`
                }).then(() => {
                    Api.delChildAnswer(`/${scope.row.commentId}`).then((res) => {
                        
                        this.showSuccess('删除成功');
                        this.queryChildLists(this.commentid);
                    })
                })
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
            //根据类型判断是哪一个
            contentType(val) {
                if (val == '0') { return '苹果系统' }
                else if (val = '2') return '咪咕影院客户端'
            },
            //回复父评论就是添加子评论（回复评论）
            replayAnswer() {
                this.$refs.form.validate(valid => {
                    if (valid) {
                        this.dialogFormVisible = false
                        let params = {
                            userId: this.form.userId,
                            body: this.form.desc,
                            contentType: this.form.commentType,
                            parentId: this.form.commentId,
                            mobile: this.form.userMobile,
                            clientType: this.form.clientType,
                            mId:this.form.mId
                        }
                        Api.addSonAnswer(params).then((res) => {
                            if (res.code == 200) {
                                this.showSuccess('添加子评论成功');
                                this.form.userMobile = null,
                                    this.queryChildLists(this.commentid);
                                this.form.desc = "";
                            }
                        })

                    }
                })

            },
            handleSizeChange(val) {
               
            },
            handleCurrentChange(val) {
              
                this.pageNo = val;
                this.queryChildLists(this.commentid);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .borderTop {
        width: 100%;
        height: 1px;
        background: rgb(70, 150, 252);
        margin-top: 5px;
        margin-bottom: 5px;
    }

    .borderBottom {
        width: 100%;
        height: 1px;
        background: rgb(70, 150, 252);
        margin-bottom: 5px;
    }

    .bottom {
        margin-top: 5px;
    }
</style>