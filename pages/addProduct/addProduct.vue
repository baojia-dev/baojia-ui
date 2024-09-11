<template>
	<view style="padding: 30rpx;">
		<u-form :model="form" ref="uForm" label-width="140">
			<u-form-item label="产品类型" required>
				<u-radio-group v-model="productType" @change="productTypeChange">
					<u-radio v-for="(item, index) in productTypes" :key="item.id" :name="item.name">
						{{ item.name }}
					</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="品牌" required>
				<u-input v-model="form.brand" placeholder="请输入品牌名称" />
			</u-form-item>
			<u-form-item label="系列" required>
				<u-input v-model="form.series" placeholder="请输入品牌系列" />
			</u-form-item>
			<u-form-item label="型号" required>
				<u-input v-model="form.model" placeholder="请输入品牌型号" />
			</u-form-item>
			<u-form-item label="颜色" required>
				<view class="tag-list">
					<u-tag class="tag-item" v-for="(item, index) in form.colors" :key="index" :text="item"
						shape="circle" size="mini" @close="handleColorClose" closeable />
				</view>
				<u-button type="primary" size="mini" slot="right" @click="handleShowModal('color')">添加</u-button>
			</u-form-item>
			<u-form-item label="版本" required>
				<view class="tag-list">
					<u-tag class="tag-item" v-for="(item, index) in form.versions" :key="index" :text="item"
						shape="circle" size="mini" @close="handleColorVersions" closeable />
				</view>
				<u-button type="primary" size="mini" slot="right" @click="handleShowModal('version')">添加</u-button>
			</u-form-item>
		</u-form>
		<u-button @click="submitProduct" type="primary">提交</u-button>
		<u-modal v-model="showModal" :title="modalType === 'color' ? '添加颜色' : '添加版本'" ref="model" @confirm="handleAdd"
			:async-close="true" show-cancel-button>
			<u-form :model="modalForm" ref="uForm" :label-width="150" style="margin: 20rpx;">
				<u-form-item label="颜色" required v-show="modalType === 'color'">
					<u-input v-model="modalForm.color" type="text" />
				</u-form-item>
				<u-form-item label="版本" required v-show="modalType === 'version'">
					<u-input v-model="modalForm.version" type="text" />
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
				productTypes: [],
				productType: '手机',
				form: {
					type: 1,
					brand: '',
					series: '',
					colors: [],
					versions: [],
				},
				showModal: false,
				modalType: '',
				modalForm: {
					color: '',
					version: ''
				}
			}
		},
		async mounted() {
			await this.getProductTypes()
		},
		methods: {
			productTypeChange(e) {
				this.productType = e
			},
			submitProduct() {
				if (this.form.colors.length < 1) {
					uni.showToast({
						title: '请至少添加一种颜色',
						icon: 'none'
					})
					return
				}
				if (this.form.versions.length < 1) {
					uni.showToast({
						title: '请至少添加一种版本',
						icon: 'none'
					})
					return
				}
				
				this.form.type = this.productTypes.find(item => item.name === this.productType).id
				
				api.addProduct(this.form).then(res => {
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						})
					}, 500)
				})
			},
			handleShowModal(type) {
				this.modalType = type
				this.showModal = true
			},
			handleAdd() {
				if (this.modalType === 'color') {
					this.form.colors.push(this.modalForm.color)
				}
				if (this.modalType === 'version') {
					this.form.versions.push(this.modalForm.version)
				}
				this.modalForm.color = ''
				this.modalForm.version = ''
				this.showModal = false
			},
			handleColorClose(index) {
				this.form.colors.splice(index, 1)
			},
			handleVersionClose(index) {
				this.form.versions.splice(index, 1)
			},
			async getProductTypes() {
				const res = await api.getProductTypes()
				this.productTypes = res.data.map(item => {
					return {
						name: item.name,
						checked: false,
						id: item.id
					}
				})
			},
		}
	}
</script>

<style>
.tag-list {
	display: flex;
	flex-wrap: wrap;
}
.tag-item {
	margin-right: 10rpx;
	margin-bottom: 10rpx;
	margin-top: 10rpx;
}
</style>