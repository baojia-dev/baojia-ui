<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			const pages = getCurrentPages(); // 获取当前页面栈
		},
		onShow: function() {
			console.log('App Show')

		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";

	* {
		box-sizing: border-box;
	}
</style>