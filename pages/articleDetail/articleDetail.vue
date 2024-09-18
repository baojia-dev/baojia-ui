<template>
	<view class="u-article">
		
		<view class="u-header">
			<view class="u-title">{{article.title}}</view>
			<view class="u-info">
				<view class="u-author">{{article.author}}</view>
				<view class="u-right">
					<view class="u-time">{{article.created_at | formatDatetTime}}</view>
					<view class="u-text" v-show="user.is_admin" @click="handleEdit">编辑</view>
					<view class="u-text" v-show="user.is_admin" @click="handleDelete">删除</view>
				</view>
			</view>
		</view>
		<view class="u-content">
			<u-parse :html="article.html"></u-parse>
		</view>
	</view>
</template>

<script>
	import * as api from '@/api/article.js'
	import * as authApi from '@/api/auth.js'
	export default {
		data() {
			return {
				id: 0,
				article: {},
				user: {}
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getArticleDetail()
		},
		onShow() {
			this.getUser()
		},
		methods: {
			getArticleDetail() {
				api.getArticle(this.id).then(res => {
					console.log(res)
					this.article = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			getUser() {
				authApi.getUserInfo().then(res => {
					this.user = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			handleEdit() {
				uni.navigateTo({
					url: `/pages/addArticle/addArticle?id=${this.id}`
				})
			},
			handleDelete() {
				uni.showModal({
					title: '提示',
					content: '确定删除该文章吗？',
					success: (res) => {
						if (res.confirm) {
							api.deleteArticle(this.id).then(res => {
								uni.showToast({
									title: '删除成功',
									icon: 'success'
								})
								setTimeout(() => {
									uni.navigateBack()
								}, 1000)
							}).catch(err => {
								console.log(err)
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
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

	.u-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 24rpx;
		color: #999;
		margin-bottom: 20rpx;
	}

	.u-content {
		font-size: 32rpx;
		line-height: 1.5;
	}

	.u-right {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.u-text {
		cursor: pointer;
	}
</style>