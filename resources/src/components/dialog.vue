<template>
	<div class="my-dialog">
		<el-dialog
		  	:title="title"
		  	:visible.sync="dialogVisible"
		  	width="70%"
		  	center
		  	>
			<slot></slot>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button v-if="save" type="primary" @click="onSave()">{{isok}}</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'my-dialog',
		props: {
			save:{
				type:Boolean,
				default:true
			},
			title: {
				type: String,
				default:'主题'
			},
			isok:{
				type:String,
				default:'保 存'
			}
		},
		data () {
			return {
				dialogVisible: false,

			}
		},
		methods: {
			dialogShow () {
				this.dialogVisible = true;
			},
			closeDialog () {
				this.dialogVisible = false;
			},
			onSave() {
				this.$emit('saveBtn')
				// this.dialogVisible = false
			}
		}

	}
</script>

<style lang="scss" scoped>

</style>