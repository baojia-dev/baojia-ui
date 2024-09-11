<template>
	<!-- 首页 -->
	<view class="content">
		<u-tabs class="tab" :list="tabs" :is-scroll="false" :current="currentType" @change="change"></u-tabs>
		<scroll-view scroll-y="true" class="scroll-Y">
			<view v-if="list.length" class="list-wrap">
				<view class="brand-tags">
					<view class="brand-item" v-for="(item, index) in brands" :key="index">
						<u-tag :text="item.brand" type="primary" :mode="item.checked ? 'dark' : 'plain'" :name="index"
							@click="handleBrandClick(item.brand)"></u-tag>
					</view>
				</view>
				<view class="item-wrap" v-for="(item,index) in list" :key="index">
					<view class="item-left">
						<view class="item-brand">
							<view>{{ item.brand }}</view>
							<view :style="getDateFontStyle(getNewestPrice(item).created_at)">
								{{ (getNewestPrice(item).created_at) | formatDate }}
							</view>
						</view>
						<view class="item-name">{{item.model}}</view>
						<view style="margin-right: 10rpx;">{{item.color}}</view>
						<view>{{item.version}}</view>
					</view>
					<view class="item-right">
						<view class="input-wrap">
							<view class="input-label">出货价：</view>
							<u-input v-model="getNewestPrice(item).out_price" type="text" :border="true" border-color="#2979ff"
								height="60" :custom-style="inputStyle" placeholder='' @blur="handleOutPrice($event, item)" />
						</view>
						<view class="input-wrap">
							<view class="input-label">利润：</view>
							<u-input v-model="getNewestPrice(item).profit" type="text" :border="true" border-color="#2979ff"
								height="60" :custom-style="inputStyle" placeholder='' @blur="handleNewestPrice($event, item)" />
						</view>
						<view class="input-wrap">
							<view class="input-label">收货价：</view>
							<text class="item-price">¥ {{ getNewestPrice(item).in_price }}</text>
						</view>

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
				tabs: [{ name: '手机' }, { name: '平板' }, { name: '耳机' }],
				currentType: 0,
				currentBrand: '苹果',
				inputStyle: { fontSize: '36rpx', },
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
		onLoad() {

		},
		mounted() {
			this.getProducts()
		},
		computed: {},
		methods: {
			handleBrandClick(brand) {
				this.brands.map(item => {
					item.checked = item.brand === brand ? true : false
				})
				this.currentBrand = brand
				this.getProducts()
			},
			handleOutPrice(v, item) {
				console.log('handleOutPrice', v, item)
				const profit = this.getNewestPrice(item).profit
				const update = {
					product_id: item.id,
					out_price: parseFloat(v),
					profit: profit,
					// 收货价 = 出货价 - 利润
					// in_price: parseFloat(v) - parseFloat(profit),
					created_at: this.getTodayDate()
				}
				api.updatePrice(update).then(res => {
					console.log(res)
					this.getProducts()
				})
			},
			handleNewestPrice(v, item) {
				console.log('handleNewestPrice', v, item)
				const out_price = this.getNewestPrice(item).out_price
				const update = {
					product_id: item.id,
					out_price: parseFloat(out_price),
					profit: parseFloat(v),
					// 收货价 = 出货价 - 利润
					// in_price: parseFloat(out_price) - parseFloat(v),
					created_at: this.getTodayDate()
				}
				api.updatePrice(update).then(res => {
					console.log(res)
					this.getProducts()
				})
			},
			getNewestPrice(item) {
				if (item.prices && item.prices.length > 0) {
					return item.prices[0]
				}
				return {}
			},
			getProducts() {
				const type = this.currentType + 1
				api.getProducts(type, this.currentBrand).then(res => {
					this.list = res.data
				})
			},
			getDateFontStyle(date) {
				return {
					color: this.getTodayDate() === date ? 'green' : 'red',
					'font-size': '32rpx',
				}
			},
			getTodayDate() {
				const now = new Date()
				const year = now.getFullYear()
				const month = now.getMonth() + 1
				const day = now.getDate()
				const today = `${year}-${month}-${day}`
				return today
			},
			change(index) {
				this.currentType = index
				console.log('切换', this.currentType)
				const type = this.currentType + 1
				api.getProducts(type, '').then(res => {
					this.list = res.data
				})
			}
		},
		filters: {
			formatDate(value) {
				const date = new Date(value.replace(/\-/g, '/'))
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
		height: calc(100vh - 50px);
	}

	.tab {
		width: 100%;
	}

	.scroll-Y {
		height: calc(100vh - 100px);
	}

	.list-wrap {
		padding: 20rpx 20rpx 50rpx 20rpx;
	}

	.item-wrap {
		height: 300rpx;
		padding: 25rpx;
		margin-bottom: 20rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.item-left {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		font-size: 30rpx;
	}

	.item-name {
		color: #323232;
		font-size: 32rpx;
		line-height: 32rpx;
		font-weight: 600;
	}

	.item-info {
		display: flex;
		flex-direction: column;
		color: #999;
		font-size: 24rpx;
		line-height: 24rpx;
		border: 1px solid blue;
	}

	.item-date {
		color: #999;
		font-size: 28rpx;
		margin-right: 20rpx;
	}

	.item-price {
		color: $u-type-error;
		font-size: 38rpx;
	}

	.item-right {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.input-wrap {
		width: 320rpx;
		display: flex;
		align-items: center;
		font-size: 30rpx;
	}

	.input-label {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 120rpx;
		height: 60rpx;
	}

	.item-brand {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 140rpx;
		height: 60rpx;
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