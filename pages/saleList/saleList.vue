<template>
	<!-- 出货列表 -->
	<view class="content">
		<scroll-view scroll-y="true" class="scroll-Y">
			<view v-if="list.length" class="list-wrap">
				<view class="item-wrap" v-for="(item,index) in list" :key="index">
					<view class="item-left">
						<text class="item-name">{{ item.model }}</text>
						<view class="item-info">
							<text style="margin-right: 10rpx;">{{ item.color}}</text>
							<text>{{ item.version }}</text>
						</view>
						<text class="item-date">交易时间：{{ item.create_time }}</text>
					</view>
					<view class="item-right">
						<text class="item-stat">{{ item.status }}</text>
						<view class="item-price-wrap">
							<text>成交价：</text>
							<text class="item-price">¥ {{ item.prices }}</text>
						</view>
					</view>
				</view>
			</view>
			<u-empty v-else></u-empty>
		</scroll-view>

		<movable-area>
			<movable-view direction="all" y="100" @click="godown">立即出货</movable-view>
		</movable-area>
	</view>
</template>

<script>
	import * as api from '@/api/product.js'
	export default {
		data() {
			return {
				list: [],
			}
		},
		onLoad() {},
		mounted() {
			this.getSales()
		},
		methods: {
			// 立即出货
			godown() {
				uni.navigateTo({
					url: '/pages/sale/sale'
				})
			},
			getSales() {
				api.getSales().then(res => {
					this.list = res.data
				})
			}
		},
		filters: {
			// 2024-10-10 => 10-10
			formatDate(value) {
				const date = new Date(value)
				const year = date.getFullYear()
				const month = date.getMonth() + 1
				const day = date.getDate()
				return `${month}-${day}`
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
		right: 30rpx;
		bottom: 30rpx;
	}

	movable-view {
		width: 160rpx;
		height: 160rpx;
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

	.item-stat {
		padding: 2rpx 10rpx;
		color: #FA3534;
		background-color: #fef0f0;
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