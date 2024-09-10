<template>
	<!-- 首页 -->
	<view class="content">
		<u-tabs class="tab" :list="tabs" :is-scroll="false" :current="currentType" @change="change"></u-tabs>
		<view class="brand-tags">
			<view class="brand-item" v-for="(item, index) in brands" :key="index">
				<u-tag :text="item.brand" type="primary" :mode="item.checked ? 'dark' : 'plain'" :name="index"
					@click="handleBrandClick(item.brand)"></u-tag>
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-Y">
			<view v-if="list.length" class="list-wrap">
				<view class="item-wrap" v-for="(item,index) in list" :key="index">
					<view class="item-left">
						<text class="item-name">{{item.model}}</text>
						<view class="item-info">
							<text style="margin-right: 10rpx;">{{item.color}}</text>
							<text>{{ item.version }}</text>
						</view>
					</view>
					<view class="item-right">
						<text class="item-date">{{ (item.prices && item.prices[0].created_at) | formatDate }}</text>
						<text class="item-price">¥ {{ item.prices && item.prices[0].in_price }}</text>
					</view>
				</view>
			</view>
			<u-empty v-else></u-empty>
		</scroll-view>
	</view>
</template>

<script>
	import * as api from '@/api/product.js'
	export default {
		data() {
			return {
				tabs: [{
					name: '手机'
				}, {
					name: '平板'
				}, {
					name: '耳机'
				}],
				currentType: 0,
				currentBrand: '苹果',
				list: [],
				brands: [{
						brand: '苹果',
						checked: true
					},
					{
						brand: '华为',
						checked: false
					},
				]
			}
		},
		onLoad() {},
		mounted() {
			this.getProducts()
		},
		methods: {
			handleBrandClick(brand) {
				this.brands.map((item) => {
					item.checked = item.brand === brand ? true : false
				})
				this.currentBrand = brand;
				this.getProducts()
			},
			change(index) {
				this.currentType = index;
				console.log("切换", this.currentType)
				this.getProducts()
			},
			getProducts() {
				const type = this.currentType + 1
				api.getProducts(type, this.currentBrand).then(res => {
					this.list = res.data
				})
			},
		},
		filters: {
			// 2024-10-10 => 10-10
			formatDate(value) {
				const date = new Date(value.replace(/\-/g, "/"))
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
		height: 120rpx;
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

	.item-info {
		color: #999;
		font-size: 24rpx;
		line-height: 24rpx;
	}

	.item-right {
		height: 100%;
		// position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0rpx 15rpx;
	}

	.item-date {
		padding: 2rpx 10rpx;
		color: #FA3534;
		background-color: #fef0f0;
		font-size: 28rpx;
		margin-right: 40rpx;
	}

	.item-price {
		width: 150rpx;
		color: $u-type-primary;
		font-size: 38rpx;
	}

	.brand-item {
		margin-right: 20rpx;
	}

	.brand-tags {
		display: flex;
		width: 100%;
		height: 100%;
		margin-top: 20rpx;
		padding: 0 20rpx;
	}
</style>