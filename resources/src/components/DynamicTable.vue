<template>
    <div class='table-wrapper' ref='table'>
        <el-table 
            :data="data"
            highlight-current-row
            v-bind='$attrs'
            v-on='$listeners'
            @current-change="handleCurrentChange"
            stripestyle="width: 100%"
            empty-text="暂无记录"
        ref='table'>
            <slot></slot>
        </el-table>
        <div class='pagination-box' v-if='isPaginationVisible'>
            <el-pagination
                    @size-change="handleSizeChange"
                    ref="pagination"
                    @current-change="onPagination"
                    :current-page="pageNo"
                    :page-size="pageSize"
                    :layout="layout"
                    :total="total"   >
            </el-pagination>
        </div>
    </div>
</template>


<script>
    import utils from '../utils/misc'
    import Sortable from 'sortablejs'
	export default {
        name: 'DynamicTable',
        inheritAttrs: false,
		props: {
			data: {
				required: true,
				type: Array
			},

			pageNo: {
				type: Number,
				default: 1
			},

			pageSize: {
				type: Number,
				default: 10
			},
			total: {
				type: Number,
				default: 0
            },
            paginationAutoHidden: {
                type: Boolean,
                default: true
            },
            draggable: {
                type: Boolean,
                boolean: false
            }
		},

		methods: {
			onPagination(pageNo){
				this.$emit("pagination", pageNo);
            },

            handleSizeChange(size){
            	this.$emit('sizeChange', size)
            },
            
            handleCurrentChange(val){
                this.$emit('selectRow',val)
            }
        },

        computed: {
            isPaginationVisible() {
                if( !this.paginationAutoHidden) {
                    return true
                }
                return this.total > this.pageSize
            },

            layout() {
                return 'total, prev, pager, next, jumper'
            }
        },

        mounted() {
            if(this.draggable) {
                const table = this.$refs.table.querySelector('.el-table__body-wrapper tbody')
                const vm = this
                Sortable.create(table, {
                    onEnd({ newIndex, oldIndex }) {
                        newIndex !== oldIndex && vm.$emit('drag', {newIndex, oldIndex})
                    }
                })
            }
        }
	}

</script>

<style lang='scss'>
.pagination-box{
    margin-top: 10px;
    text-align: right;
}

</style>
