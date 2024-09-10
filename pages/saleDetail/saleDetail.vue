<template>
	<view>
		<u-cell-group>
			<u-cell-item title="联系方式" :arrow="false">
				{{ saleInfo.contact }}
			</u-cell-item>
			<u-cell-item title="商品序列号" :arrow="false">
				{{ saleInfo.sn }}
			</u-cell-item>
			<u-cell-item title="取货地址" :arrow="false">
				{{ saleInfo.address }}
			</u-cell-item>
			<u-cell-item title="取货时间" :arrow="false">
				{{ saleInfo.receive_time }}
			</u-cell-item>
			<u-cell-item title="产品型号" :arrow="false">
				{{ saleInfo.product && saleInfo.product.model }}
			</u-cell-item>
			<u-cell-item title="产品颜色" :arrow="false">
				{{ saleInfo.product && saleInfo.product.color }}
			</u-cell-item>
			<u-cell-item title="产品版本" :arrow="false">
				{{ saleInfo.product && saleInfo.product.version }}
			</u-cell-item>
			<u-cell-item title="备注" :arrow="false">
				{{ saleInfo.remark }}
			</u-cell-item>
			<u-cell-item title="订单截图" :arrow="false" center @click="preview(ossUrl + saleInfo.order_img)">
				<u-image style="float: right;" width="200rpx" height="200rpx"
					:src="ossUrl + saleInfo.order_img"></u-image>
			</u-cell-item>
			<u-cell-item title="包装正面截图" :arrow="false" center @click="preview(ossUrl + saleInfo.pkg_front_img)">
				<u-image style="float: right;" width="200rpx" height="200rpx"
					:src="ossUrl + saleInfo.pkg_front_img"></u-image>
			</u-cell-item>
			<u-cell-item title="包装背面截图" :arrow="false" center @click="preview(ossUrl + saleInfo.pkg_back_img)">
				<u-image style="float: right;" width="200rpx" height="200rpx"
					:src="ossUrl + saleInfo.pkg_back_img"></u-image>
			</u-cell-item>
		</u-cell-group>

		<u-button v-if="pageType === 2 && saleInfo.status === 0" @click="confirmShow = true"
			type="primary">确认收货</u-button>


		<u-modal v-model="confirmShow" title="" @confirm="confirmSale" :async-close="true" show-cancel-button>
			<u-form :model="confirmForm" ref="uForm" :label-width="150" style="margin: 20rpx;">
				<u-form-item label="成交价格" required>
					<u-input v-model="confirmForm.price" type="number" />
				</u-form-item>
				<u-form-item label="结算方式">
					<u-radio-group v-model="confirmForm.payment">
						<u-radio v-for="(item, index) in paymentTypes" :key="index" :name="item.name"
							:disabled="item.disabled">
							{{ item.name }}
						</u-radio>
					</u-radio-group>
				</u-form-item>
			</u-form>
		</u-modal>
	</view>
</template>

<script>
	import * as api from '@/api/product.js'
	export default {
		data() {
			return {
				pageType: 1, // 1：出货 2:收货
				finalPrice: null, // 成交价格
				ossUrl: uni.getStorageSync('baseUrl') + '/file/',
				saleInfo: {},
				confirmShow: false,
				confirmForm: {
					price: '',
					payment: '微信'
				},
				paymentTypes: [{
						name: '微信',
					},
					{
						name: '支付宝',
						checked: false,
					},
					{
						name: '银行卡',
					}
				]
			}
		},
		onLoad(options) {
			if (options.id) {
				// 根据出货id获取出货详情
				this.getSaleInfo(options.id)
			}
			this.pageType = +options.type
			uni.setNavigationBarTitle({
				title: this.pageType === 1 ? '出货详情' : '收货详情'
			})
			console.log('收货？出货', options)
		},
		methods: {
			preview(url) {
				uni.previewImage({
					urls: [url]
				})
			},
			// 获取出货详情
			getSaleInfo(id) {
				// TODO: 获取出货详情
				api.getSale(id).then(res => {
					console.log(res)
					this.saleInfo = res.data
				})
			},
			// 确认收货
			confirmSale() {
				const paymentMap = {
					'微信': 1,
					'支付宝': 2,
					'银行卡': 3
				}
				console.log(this.confirmForm)
				if (!this.confirmForm.price) {
					uni.showToast({
						title: '请输入成交价格'
					})
					this.confirmShow = true
					return
				}
				api.confirmSale({
					price: parseFloat(this.confirmForm.price),
					payment: paymentMap[this.confirmForm.payment],
					id: this.saleInfo.id
				}).then(res => {
					console.log(res)
					uni.showToast({
						title: '收货成功'
					})
					this.confirmShow = false
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 1000)
				})
			}
		}
	}
</script>

<style>
	.btn-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-top: 1px solid #eee;
		padding: 30rpx 0 0 0;
	}
</style>