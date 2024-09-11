<template>
	<!-- 首页 -->
	<view class="content">
		<u-tabs class="tab" :list="productTypes" :is-scroll="false" :current="currentType" @change="change"></u-tabs>
		<view class="brand-tags">
			<view class="brand-item" v-for="(item, index) in brands" :key="index">
				<u-tag :text="item.brand" type="primary" shape="circle" :mode="item.checked ? 'dark' : 'plain'" :name="index"
					@click="handleBrandClick(item.brand)"></u-tag>
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-Y">
			<view v-if="list.length" class="list-wrap">
				<view class="item-wrap" v-for="(item,index) in list" :key="index">
					<view class="item-top">
						<text class="item-name">{{item.model}}</text>
					</view>
					<view class="item-bottom">
						<view>
							<u-tag style="margin-right: 10rpx; margin-bottom: 10rpx;" v-for="(item, index) in groupByColor(item.items)"
								:key="index" :text="item" />
						</view>

						<view style="margin-top: 20rpx; margin-bottom:20rpx;">
							<u-tag style="margin-right: 10rpx; margin-bottom: 10rpx;" type="success"
								v-for="(item, index) in groupByVersion(item.items)" :key="index" :text="item" />
						</view>
					</view>
				</view>
			</view>
			<u-empty v-else></u-empty>
		</scroll-view>

		<movable-area>
			<movable-view direction="all" y="120" x="20" @click="handleAdd()">
				<u-icon name="plus" size="40"></u-icon>
			</movable-view>
		</movable-area>
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
				list: [],
				brands: []
			}
		},
		onLoad() {},
		async mounted() {
			await this.getProductTypes()
			await this.getBrands()
			await this.getProducts()
		},
		methods: {
			handleBrandClick(brand) {
				this.brands.map((item) => {
					item.checked = item.brand === brand ? true : false
				})
				this.currentBrand = brand;
				this.getProducts()
			},
			handleAdd() {
				uni.navigateTo({
					url: '/pages/addProduct/addProduct'
				})
			},
			async change(index) {
				this.currentType = index;
				console.log("切换", this.currentType)
				await this.getBrands()
				await this.getProducts()
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
				// 按照 res.data[i].model 分组[{"model": "xxx", items: []}]
				const grouped = res.data.reduce((acc, item) => {
					const model = item.model
					if (!acc[model]) {
						acc[model] = {
							model: model,
							items: []
						}
					}
					acc[model].items.push(item)
					return acc
				}, {})
				this.list = Object.values(grouped)
			},
			groupByColor(item) {
				console.log(item)
				return [...new Set(item.map(item2 => item2.color))]
			},
			groupByVersion(item) {
				return [...new Set(item.map(item2 => item2.version))]
			}
		},
		filters: {
			// 2024-10-10 => 10-10
			formatDate(value) {
				if (!value) return ''
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
		height: auto;
		margin-bottom: 20rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: center;
		border-radius: 16rpx;
	}

	.item-top {
		width: 100%;
		padding: 20rpx;
	}

	.item-bottom {
		width: 100%;
		padding: 0rpx 20rpx;
	}

	.item-name {
		color: #323232;
		font-size: 28rpx;
		line-height: 28rpx;
		font-weight: 600;
	}

	.item-color-wrap {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		height: 100%;
		margin-top: 20rpx;
		padding: 0 20rpx;
	}

	.brand-item {
		margin-right: 20rpx;
	}

	.brand-tags {
		display: flex;
		width: 100%;
		margin-top: 20rpx;
		padding: 0 20rpx;
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
</style>