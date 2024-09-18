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
		<!-- <view class="search">
			<u-search placeholder="请输入品牌/颜色/版本" @search="getProducts" :clearabled="true" :show-action="false" shape="round" v-model="keyword"></u-search>
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
						<text class="item-date">{{ getNewestPrice(item).created_at | formatDate }}</text>
						<text class="item-price">¥ {{ getNewestPrice(item).in_price }}</text>
					</view>
				</view>
			</view>
			<u-empty v-else></u-empty>
		</scroll-view> -->
		<scroll-view scroll-y="true" class="scroll-Y">
			<view v-for="(item, index) in models" :key="index">
				<u-card :title="item.name" :sub-title="getUpdateTime(item.items)">
					<view class="" slot="body">
						<u-table>
							<u-tr class="u-tr">
								<u-th class="u-th">颜色/版本</u-th>
								<u-th class="u-th" v-for="version in getVersions(item.items)" :key="version">{{version}}</u-th>
							</u-tr>

							<u-tr class="u-tr" v-for="t in getTableData(item.items)">
								<u-td class="u-td">{{t.color}}</u-td>
								<u-td class="u-td" v-for="(cell, index) in t.data" :key="index">{{cell ? cell : '-'}}</u-td>
							</u-tr>
						</u-table>
					</view>
				</u-card>
			</view>
		</scroll-view>
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
				brands: [],
				keyword: '',
				models: []
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
			async change(index) {
				this.currentType = index;
				await this.getBrands()
				await this.getProducts()
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
				const res = await api.getProducts(type, this.currentBrand, this.keyword)
				this.list = res.data
				// 按照 model 分组为对象数组 [{name: xxx, items: []}]
				this.models = [...new Set(res.data.map(item => item.model))].map(model => {
					return {
						name: model,
						items: res.data.filter(item => item.model === model)
					}
				})
			},
			getUpdateTime(item) {
				return this.getTodayDate()
			},
			getVersions(item) {
				// 去除GB
				return [...new Set(item.map(item => item.version))].map(version => {
					return version.replaceAll('GB', '')
				})
			},
			getTableData(item) {
				const colors = [...new Set(item.map(item => item.color))]
				const versions = [...new Set(item.map(item => item.version))]
				return colors.map(color => {
					return {
						color: color,
						data: versions.map(version => {
							let foundItem = item.find(d => d.color === color && d.version === version);
							return foundItem ? this.getNewestPrice(foundItem).in_price : '-';
						})
					};
				});
			},
			getTodayDate() {
				const now = new Date()
				const year = now.getFullYear()
				const month = now.getMonth() + 1
				const day = now.getDate()
				const today = `${year}-${month}-${day}`
				return today
			},
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
		height: calc(100vh - 360rpx);
	}

	.search {
		width: 100%;
		height: 100rpx;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
	}

	.search-input {
		width: 100%;
		height: 100%;
		background-color: #f2f2f2;
		border-radius: 16rpx;
		padding: 0rpx 20rpx;
	}

	.list-wrap {
		width: 100vw;
		padding: 20rpx 20rpx 50rpx 20rpx;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(700rpx, 1fr));
		gap: 10rpx;
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
		margin-top: 10rpx;
		margin-right: 20rpx;
	}

	.brand-tags {
		background-color: #fff;
		display: flex;
		width: 100%;
		padding: 10rpx 20rpx;
	}
</style>