<template>
    <detail :toplist="topForm" :commentid="id" ></detail>
</template>

<script>
    import Detail from './edit.vue'
    import Api from '../../../utils/api.js'
    import MessageMixins from '../../../mixins/messages.js'
    export default {
        name: "detailWapper",
        mixins: [MessageMixins],
        data() {
            return {
                id: "",
                topForm: {}
            }
        },
        components: {
            Detail
        },
        created() {
            this.id = this.$route.query.id;
            this.getTopLidt();
        },
        methods: {
            //获取父评论的对象
            getTopLidt() {
                let params = {
                    commentId: this.id
                }
                Api.queryAnswerLists(params).then((res) => {
                    if (res.code == 200) {
                        this.topForm = res.body.list[0];                  
                    }
                })
            }
        }
    }

</script>

<style lang="scss" scoped>
</style>