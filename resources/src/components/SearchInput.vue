<template>
    <div class='search-input' :class="{'inline-block':inline}">
        <el-input clearable v-model.trim='keyword'
            prefix-icon="el-icon-search"
            @keypress.enter.native='doSearch(keyword)' :placeholder='placeholder' />
    </div>
</template>

<script>
    export default {
        name: 'SearchInput',
        props: {
            value: String,
            inline: {
                type: Boolean,
                default: false
            },

            placeholder: String,
            search: Function
        },

        beforeMount() {
            this.keyword = this.value
        },

        data() {
            return {
                keyword: ''
            }
        },

        watch: {
            value(newVal) {
                this.keyword = newVal
            },

            keyword(newVal) {
                this.$emit('input', newVal)
            }
        },

        methods: {
            doSearch(value) {
                this.$emit('search', value)
            }
        }
    }
</script>

<style lang='scss'>
    .search-input {
        width: 260px;
        .el-input__inner {
            height: 30px;
        }
        .el-input__icon {
            line-height: 30px;
        }
    }
</style>
