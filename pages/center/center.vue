<template>
	<!-- 个人中心 -->
	<view>
		<u-navbar :is-back="true" title="个人中心" :border-bottom="true"></u-navbar>
		<view class="u-flex user-box u-m-t-20 u-p-l-30 u-p-r-20 u-p-b-30">
			<view class="u-m-r-10">
				<u-avatar :src="userInfo.avatarUrl || pic" size="140" mode="circle"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{userInfo.nickName || '昵称'}}</view>
				<view class="u-font-14 u-tips-color">账号: {{ userInfo.username }}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<u-icon name="arrow-right" color="#969799" size="28"></u-icon>
			</view>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item v-if="userInfo.is_admin" icon="tags" title="产品维护" @click="toProduct"></u-cell-item>
				<u-cell-item v-if="userInfo.is_admin" icon="order" title="价格维护" @click="toPrice"></u-cell-item>
				<u-cell-item v-if="userInfo.is_admin" icon="bell" title="收货列表" @click="toSale"></u-cell-item>
				<!-- <u-cell-item icon="kefu-ermai" title="联系我们"></u-cell-item> -->
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="zhuanfa" title="退出登录" @click="handleLogout"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import * as api from '@/api/auth.js'
	export default {
		data() {
			return {
				pic: 'https://img01.yzcdn.cn/vant/cat.jpeg',
				show: true,
				userInfo: {}
			}
		},
		onLoad() {
			api.getUserInfo().then(res => {
				this.userInfo = res.data
				uni.setStorageSync('userInfo', JSON.stringify(res.data))
			})
		},
		methods: {
			handleLogout() {
				uni.showModal({
					title: '提示',
					content: '确定要退出登录吗？',
					success: (res) => {
						if (res.confirm) {
							uni.clearStorageSync()
							uni.reLaunch({
								url: '/pages/login/login'
							})
						}
					}
				})
			},
			toPrice() {
				uni.navigateTo({
					url: '/pages/price/price',
				})
			},
			toSale() {
				uni.navigateTo({
					url: '/pages/takeGoods/takeGoods',
				})
			},
			toProduct() {
				uni.navigateTo({
					url: '/pages/product/product',
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f2f2f2;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: #ededed;
		}
	}

	.user-box {
		background-color: #fff;
	}
</style>