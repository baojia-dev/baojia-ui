<template>
	<view class="article-container">
		<scroll-view scroll-y="true" class="scroll-Y">
			<view v-for="(item,index) in list" :key="index" class="article-item" @click="toDetail(item.id)">
				<view class="article-item-left" v-show="item.cover">
					<image :src="item.cover" mode="aspectFill" class="article-cover"></image>
				</view>
				<view class="article-item-right">
					<view class="article-title">{{ item.title }}</view>
					<view class="article-text">{{ item.created_at | formatDatetTime}}</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import * as api from '@/api/article.js'
	export default {
		components: {},
		data() {
			return {
				list: []
			};
		},
		onLoad() {},
		onShow() {
			this.getArticles()
		},
		methods: {
			// handleAdd() {
			// 	uni.navigateTo({
			// 		url: '/pages/addArticle/addArticle'
			// 	})
			// }
			toDetail(id) {
				uni.navigateTo({
					url: `/pages/articleDetail/articleDetail?id=${id}`
				})
			},
			getArticles() {
				api.getArticles().then(res => {
					console.log(res)
					this.list = res.data
				})
			}
		},
		filters: {
			// 2024-09-12T14:04:53.661874+08:00 => 2024-09-12 14:04:53
			formatDatetTime(value) {
				if (!value) return ''
				const date = new Date(value)
				const year = date.getFullYear()
				const month = date.getMonth() + 1
				const day = date.getDate()
				const hour = date.getHours()
				const minute = date.getMinutes()
				const second = date.getSeconds()
				return `${year}-${month}-${day} ${hour}:${minute}:${second}`
			}
		}

	};
</script>

<style lang="scss">
	page {
		background-color: $u-bg-color;
	}

	.article-container {
		padding: 20rpx;
	}

	.article-item {
		display: flex;
		margin-bottom: 20rpx;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
	}
	
	.article-item-left {
		width: 120rpx;
		margin-right: 60rpx;
		padding-left: 20rpx;
	}
	
	.article-cover {
		width: 100%;
		height: 120rpx;
		border-radius: 10rpx;
	}
	
	.article-item-right {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.article-title {
		font-size: 36rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.article-text {
		font-size: 28rpx;
		color: #666;
		margin-top: 10rpx;
	}
</style>