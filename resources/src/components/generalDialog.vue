<template>
    <div class="general-dialog" v-show="dialogShow">
        <div class="wrapper">
            <div class="head">
                <span class="title">{{title}}</span>
                <el-tooltip class="close" content="关闭" placement="top">
                    <i class='fa fa-close fa-2x' @click="onHide"></i>
                </el-tooltip>
            </div>
            <div class='divider'></div>
            <div class="table" ref="table">
                <slot></slot>
            </div>
            <div class="btn-sections text-center">
                <el-button type='primary' @click='onSave'>确定</el-button>
                <el-button @click='onHide'>关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data(){
            return {
                dialogShow:false
            }
        },

        props:{
            title:{
                type:String,
                default:'相关配置'
            },
            searchShow:{
                type:Boolean,
                default:true
            },
            isTop: {
                type:Boolean,
                default: false
            }
        },

        watch: {
            isTop(newVal, oldVal) {
                if (newVal) {
                    this.$refs.table.scrollTop = 0
                }
            }
        },

        methods:{
            onShow(){
                this.dialogShow = true;
            },
            onHide(){
                this.dialogShow = false;
                this.searchTerm = ''
            },
            onSave(){
                this.$emit('save')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .general-dialog{
        background: rgba(0,0,0,0.6);
        position: absolute;
        top:0;
        left:0;
        bottom:0;
        right:0;
        z-index: 1005;
        .wrapper{
            width: 90%;
            margin:30px auto;
            background: #fff;
            padding-bottom:40px;
            .head{
                height:40px;
                display: flex;
                align-items: center;
                padding:20px 20px 0 20px;
                .title{
                    font-size:18px;
                    flex:1;
                }
            }
            .table{
                width: 90%;
                height:350px;
                margin:20px auto;
                overflow: scroll;
            }
        }
    }
</style>
