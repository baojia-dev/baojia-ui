<template>
	<!-- 出货列表 -->
	<view>
		<view class="content" v-if="isLogin">
			<u-tabs class="tab" :list="tabs" :is-scroll="false" :current="currentType" @change="change"></u-tabs>
			<scroll-view scroll-y="true" class="scroll-Y">
				<view v-if="list.length" class="list-wrap">
					<view class="item-wrap" v-for="(item,index) in list" :key="index" @click="detail(item)">
						<view class="item-left">
							<text class="item-name">{{item.product.model}}</text>
							<view class="item-info">
								<text style="margin-right: 10rpx;">{{item.product.color}}</text>
								<text>{{ item.product.version }}</text>
							</view>
							<text class="item-date">期望取货时间：{{ item.receive_time }}</text>
						</view>
						<view class="item-right">
							<text
								:class="item.status === 0 ? 'item-stat-red' : 'item-stat-green'">{{ item.status | formatStatus }}</text>
							<view class="item-price-wrap" v-show="item.status === 1">
								<text>成交价：</text>
								<text class="item-price">¥ {{ item.price }}</text>
							</view>
						</view>
					</view>
				</view>
				<u-empty v-else></u-empty>
			</scroll-view>

			<movable-area>
				<movable-view direction="all" y="120" @click="godown">出货</movable-view>
			</movable-area>
		</view>

		<view class="to-login" v-else>
			<u-button style="width: 400rpx;" @click="toLogin" type="primary">去登录</u-button>
		</view>
	</view>

</template>

<script>
	import * as api from '@/api/product.js'
	export default {
		data() {
			return {
				isLogin: true,
				list: [],
				tabs: [{ name: '待收货' }, { name: '已收货' }],
				currentType: 0,
			}
		},
		onShow() {
			this.isLogin = uni.getStorageSync('token')
			if (this.isLogin) {
				this.getSales()
			}
		},
		mounted() {

		},
		methods: {
			// 去登录
			toLogin() {
				uni.reLaunch({ url: '/pages/login/login' })
			},
			// 立即出货
			godown() {
				uni.navigateTo({ url: '/pages/sale/sale?type=1' })
			},
			change(index) {
				this.currentType = index
				this.getSales()
			},
			// 查看详情
			detail({ id }) {
				console.log('查看详情', id)
				uni.navigateTo({ url: `/pages/saleDetail/saleDetail?id=${id}&type=1` })
			},
			getSales() {
				api.getSales(this.currentType).then(res => {
					this.list = res.data
					console.log('获取出货列表', this.list)
				})
			}
		},
		filters: {
			// 2024-10-10 => 10-10
			formatDate(value) {
				if (!value) return ''
				const date = new Date(value.replace(/\-/g, '/'))
				const year = date.getFullYear()
				const month = date.getMonth() + 1
				const day = date.getDate()
				return `${month}-${day}`
			},
			formatStatus(value) {
				const statusMap = {
					0: '待收货',
					1: '已收货'
				}
				return statusMap[value]
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f2f2f2;
	}

	movable-area {
		width: 160rpx;
		height: 400rpx;
		position: absolute;
		right: 0rpx;
		bottom: 0rpx;
	}

	movable-view {
		width: 100rpx;
		height: 100rpx;
		color: #fff;
		font-size: 28rpx;
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: $u-type-primary;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: calc(100vh - 100px);
	}

	.to-login {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.tab {
		width: 100%;
	}

	.scroll-Y {
		height: calc(100vh - 150px);
	}

	.list-wrap {
		padding: 20rpx 20rpx 50rpx 20rpx;
	}

	.item-wrap {
		height: 160rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 16rpx;
	}

	.item-left {
		height: 100%;
		padding: 25rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.item-name {
		color: #323232;
		font-size: 28rpx;
		line-height: 28rpx;
		font-weight: 600;
	}

	.item-info,
	.item-date {
		color: #999;
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.item-right {
		width: 300rpx;
		height: 100%;
		// position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		padding: 15rpx;
	}

	.item-stat-red {
		padding: 2rpx 10rpx;
		color: #FA3534;
		background-color: #fef0f0;
		font-size: 28rpx;
	}

	.item-stat-green {
		padding: 2rpx 10rpx;
		color: #0BB20C;
		background-color: #f0f8ef;
		font-size: 28rpx;
	}

	.item-price-wrap {
		font-size: 30rpx;
		line-height: 30rpx;
		color: #626262;
	}

	.item-price {
		width: 100%;
		color: $u-type-primary;
		font-size: 38rpx;
		line-height: 38rpx;
	}

	.brand-item {
		margin-right: 40rpx;
	}

	.brand-tags {
		display: flex;
		width: 100%;
		height: 100%;
		margin-bottom: 20rpx;
	}
</style>