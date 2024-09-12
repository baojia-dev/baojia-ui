<template>
	<view class="u-article">
		<view class="u-title">
			<view>{{article.title}}</view>
		</view>
		<view class="u-content">
			<u-parse :html="article.html"></u-parse>
		</view>
	</view>
</template>

<script>
	import * as api from '@/api/article.js'
	export default {
		data() {
			return {
				id: 0,
				article: {}
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getArticleDetail()
		},
		methods: {
			getArticleDetail() {
				api.getArticle(this.id).then(res => {
					console.log(res)
					this.article = res.data
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style>
	.u-article {
		padding: 20rpx;
	}

	.u-title {
		font-size: 40rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
</style>