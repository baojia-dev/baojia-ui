<template>
	<!-- 首页 -->
	<view class="content">
		<u-tabs class="tab" :list="productTypes" :is-scroll="false" :current="currentType" @change="change"></u-tabs>
		<view class="brand-tags">
			<view class="brand-item" v-for="(item, index) in brands" :key="index">
				<u-tag :text="item.brand" type="primary" :mode="item.checked ? 'dark' : 'plain'" shape="circle"
					:name="index" @click="handleBrandClick(item.brand)"></u-tag>
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-Y">
			<view class="list-wrap">
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
							<u-input v-model="getNewestPrice(item).out_price" type="text" :border="true"
								border-color="#2979ff" height="60" :custom-style="inputStyle" placeholder=''
								@blur="handleOutPrice($event, item, index)" />
						</view>
						<view class="input-wrap">
							<view class="input-label">利润：</view>
							<u-input v-model="getNewestPrice(item).profit" type="text" :border="true"
								border-color="#2979ff" height="60" :custom-style="inputStyle" placeholder=''
								@blur="handleNewestPrice($event, item, index)" />
						</view>
						<view class="input-wrap">
							<view class="input-label">收货价：</view>
							<text class="item-price">¥ {{ getNewestPrice(item).in_price }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<u-empty v-if="!list"></u-empty>
	</view>
</template>

<script>
	import * as api from '@/api/product.js'
	export default {
		data() {
			return {
				productTypes: [],
				currentType: 0,
				currentBrand: '苹果',
				inputStyle: {
					fontSize: '36rpx',
				},
				list: [],
				brands: []
			}
		},
		onLoad() {

		},
		async mounted() {
			await this.getProductTypes()
			await this.getBrands()
			await this.getProducts()
		},
		computed: {

		},
		methods: {
			handleBrandClick(brand) {
				this.brands.map((item) => {
					item.checked = item.brand === brand ? true : false
				})
				this.currentBrand = brand;
				this.getProducts()
			},
			handleOutPrice(v, item, index) {
				console.log('handleOutPrice', v, item)
				const profit = this.getNewestPrice(item).profit || 0
				const in_price = parseFloat(v) - parseFloat(profit)
				console.log(in_price)
				const update = {
					product_id: item.id,
					out_price: parseFloat(v),
					profit: profit,
					// 收货价 = 出货价 - 利润
					in_price: in_price,
					created_at: this.getTodayDate()
				}
				let priceObj = this.getNewestPrice(item)
				priceObj.in_price = in_price
				this.$set(this.list, index, {
					...item,
					prices: [priceObj]
				})
				api.updatePrice(update).then(res => {
					console.log(res)
					// this.getProducts()
				})
			},
			handleNewestPrice(v, item, index) {
				console.log('handleNewestPrice', v, item)
				const out_price = this.getNewestPrice(item).out_price || 0
				const in_price = parseFloat(out_price) - parseFloat(v)
				const update = {
					product_id: item.id,
					out_price: parseFloat(out_price),
					profit: parseFloat(v),
					// 收货价 = 出货价 - 利润
					in_price,
					created_at: this.getTodayDate()
				}
				let priceObj = this.getNewestPrice(item)
				priceObj.in_price = in_price
				this.$set(this.list, index, {
					...item,
					prices: [priceObj]
				})
				api.updatePrice(update).then(res => {
					console.log(res)
					// this.getProducts()
				})
			},
			getNewestPrice(item) {
				if (item.prices && item.prices.length > 0) {
					return item.prices[0]
				}
				return {}
			},
			async getProductTypes() {
				const res = await api.getProductTypes()
				this.productTypes = res.data
			},
			async getBrands() {
				const res = await api.getBrands(this.currentType + 1)
				this.brands = res.data.map(item => {
					return {
						brand: item,
						checked: false
					}
				})
				if (this.brands.length > 0) {
					this.brands[0].checked = true
					this.currentBrand = this.brands[0].brand
				}
			},
			async getProducts() {
				const type = this.currentType + 1
				const res = await api.getProducts(type, this.currentBrand)
				this.list = res.data
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
			async change(index) {
				this.currentType = index;
				console.log("切换", this.currentType)
				await this.getBrands()
				await this.getProducts()
			}
		},
		filters: {
			formatDate(value) {
				if (!value) return ''
				const date = new Date(value.replace(/\-/g, "/"))
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
		width: 100vw;
		padding: 20rpx 20rpx 50rpx 20rpx;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(700rpx, 1fr));
		gap: 20rpx;
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