<template>
	<view class="wrap">
		<u-form :model="model" :rules="rules" ref="uForm" :errorType="['message']">
			<u-form-item :rightIconStyle="{color: '#888', fontSize: '32rpx'}" label="联系方式" prop="contact"
				label-width="150">
				<u-input :border="false" placeholder="请输入手机号或微信号" v-model="model.contact" type="text"></u-input>
			</u-form-item>
			<u-form-item :rightIconStyle="{color: '#888', fontSize: '32rpx'}" label="序列号" prop="sn" label-width="150">
				<u-input :border="false" placeholder="请输入序列号" v-model="model.sn" type="text"></u-input>
			</u-form-item>
			<u-form-item label="取货地址" prop="address" label-width="150">
				<u-input type="text" :border="false" placeholder="请填写取货地址(地铁站点)" v-model="model.address"></u-input>
			</u-form-item>
			<u-form-item label="取货时间" prop="create_time" label-width="180">
				<u-input :border="false" type="select" :select-open="pickerShow" placeholder="请选择取货时间"
					v-model="model.create_time" @click="pickerShow = true"></u-input>
			</u-form-item>
			<u-form-item label="商品类型" prop="type" label-width="150">
				<u-radio-group v-model="radio" @change="radioGroupChange" :width="radioCheckWidth"
					:wrap="radioCheckWrap">
					<u-radio shape="circle" v-for="(item, index) in radioList" :key="index" :name="item.name">
						{{ item.name }}
					</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="品牌" prop="brand" label-width="150">
				<u-radio-group v-model="brand" @change="brandChange" :width="radioCheckWidth" :wrap="radioCheckWrap">
					<u-radio shape="circle" v-for="(item, index) in brands" :key="index" :name="item.name">
						{{ item.name }}
					</u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="产品型号" prop="product_id" label-width="150">
				<u-input :border="false" type="select" :select-open="selectShow" v-model="model.product_id"
					placeholder="请选择产品型号" @click="selectShow = true"></u-input>
			</u-form-item>
			<u-form-item label="备注" prop="remark" label-width="150">
				<u-input type="text" :border="false" placeholder="请填写备注" v-model="model.remark" />
			</u-form-item>
			<u-form-item label="订单截图" prop="order_img" label-width="180">
				<u-upload width="160" height="160" max-count="1" :action="action" :show-progress="true"
					@on-success="order_imgUploadSuccess"></u-upload>
			</u-form-item>
			<u-form-item label="包装正面照片" prop="pkg_front_img" label-width="180">
				<u-upload width="160" height="160" max-count="1" :action="action" :show-progress="true"
					@on-success="pkg_front_imgUploadSuccess"></u-upload>
			</u-form-item>
			<u-form-item label="包装背面照片" prop="pkg_back_img" label-width="180">
				<u-upload width="160" height="160" max-count="1" :action="action" :show-progress="true"
					@on-success="pkg_back_imgUploadSuccess"> </u-upload>
			</u-form-item>
		</u-form>
		<u-button @click="submit" type="primary">提交</u-button>
		<u-picker mode="time" v-model="pickerShow" :params="params" :defaultTime="defaultTime"
			@confirm="timeConfirm"></u-picker>
		<u-select mode="single-column" :list="products" v-model="selectShow" @confirm="selectConfirm"></u-select>
	</view>
</template>

<script>
	import * as api from '@/api/product.js'
	export default {
		data() {
			let that = this;
			return {
				action: process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api/upload' :
					'https://bj.xbmlz.cc/api/upload',
				model: {
					contact: '', // 联系方式
					sn: '', // 序列号
					remark: '', // 备注
					type: '手机', // 商品类型
					product_id: '', // 产品型号
					create_time: '', // 期望交易时间
					order_img: '', // 订单截图
					pkg_front_img: '', // 包装正面照片
					pkg_back_img: '', // 包装背面照片
				},
				// 产品型号列表
				products: [],
				typeMap: {
					'手机': 1,
					'平板': 2,
				},
				// 表单校验规则
				rules: {
					name: [{
							required: true,
							message: '请输入姓名',
							trigger: 'blur',
						},
						{
							min: 3,
							max: 5,
							message: '姓名长度在3到5个字符',
							trigger: ['change', 'blur'],
						},
						{
							// 此为同步验证，可以直接返回true或者false，如果是异步验证，稍微不同，见下方说明
							validator: (rule, value, callback) => {
								// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
								return this.$u.test.chinese(value);
							},
							message: '姓名必须为中文',
							// 触发器可以同时用blur和change，二者之间用英文逗号隔开
							trigger: ['change', 'blur'],
						},
					],
					// remark: [
					// 	{
					// 		required: true,
					// 		message: '请填写简介'
					// 	},
					// 	{
					// 		min: 5,
					// 		message: '简介不能少于5个字',
					// 		trigger: 'change' ,
					// 	},
					// 	// 正则校验示例，此处用正则校验是否中文，此处仅为示例，因为uView有this.$u.test.chinese可以判断是否中文
					// 	{
					// 		pattern: /^[\u4e00-\u9fa5]+$/gi,
					// 		message: '简介只能为中文',
					// 		trigger: 'change',
					// 	},
					// ],
					type: [{
						required: true,
						message: '请选择商品类型',
						trigger: 'change',
					}],
					product_id: [{
						required: true,
						message: '请选择产品型号',
						trigger: 'change',
					}],
					// contact: [{
					// 		required: true,
					// 		message: '请输入手机号',
					// 		trigger: ['change', 'blur'],
					// 	},
					// 	{
					// 		validator: (rule, value, callback) => {
					// 			// 调用uView自带的js验证规则，详见：https://www.uviewui.com/js/test.html
					// 			return this.$u.test.mobile(value);
					// 		},
					// 		message: '手机号码不正确',
					// 		// 触发器可以同时用blur和change，二者之间用英文逗号隔开
					// 		trigger: ['change', 'blur'],
					// 	}
					// ],
				},
				radioList: [{
						name: '手机',
						checked: true,
						disabled: false
					},
					{
						name: '平板',
						checked: false,
						disabled: false
					},
					{
						name: '耳机',
						checked: false,
						disabled: false
					},
				],
				radio: '手机', // 单选值
				brands: [{
					name: '苹果',
					checked: true,
					disabled: false
				}, {
					name: '华为',
					checked: false,
					disabled: false
				}],
				brand: '苹果',
				selectShow: false,
				pickerShow: false, // 时间选择器是否显示
				defaultTime: '2024-12-11 20:15:35', // 时间选择器中的当前时间
				radioCheckWidth: 'auto',
				radioCheckWrap: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					timestamp: true
				},
				currentModel: 0
			};
		},
		onLoad() {

		},
		mounted() {
			this.getProducts()
		},
		computed: {

		},
		onReady() {
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 提交出货信息
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						// if(!this.model.agreement) return this.$u.toast('请勾选协议');
						console.log('验证通过');
						console.log(this.model)
						api.createSale({
							...this.model,
							type: this.typeMap[this.radio],
							product_id: this.currentModel
						}).then(res => {
							if (res.code === 0) {
								this.$u.toast('提交成功');
								// this.model = {}
							} else {
								this.$u.toast(res.msg)
							}
						})
					} else {
						console.log('验证失败');
					}
				});
			},
			order_imgUploadSuccess(data, index, lists, name) {
				console.log(data)
				if (data.code === 0) {
					this.model.order_img = data.data
				} else {
					this.$u.toast(data.msg)
				}
			},

			pkg_front_imgUploadSuccess(data, index, lists, name) {
				console.log(data)
				if (data.code === 0) {
					this.model.pkg_front_img = data.data
				} else {
					this.$u.toast(data.msg)
				}
			},
			pkg_back_imgUploadSuccess(data, index, lists, name) {
				console.log(data)
				if (data.code === 0) {
					this.model.pkg_back_img = data.data
				} else {
					this.$u.toast(data.msg)
				}
			},
			// 选择品牌
			brandChange(e) {
				this.brand = e;
				this.getProducts()
			},
			// radio选择发生变化
			radioGroupChange(e) {
				this.model.type = e;
				this.getProducts()
			},
			// 选择产品名称回调
			selectConfirm(e) {
				this.currentModel = e[0].value
				this.model.product_id = '';
				e.map((val, index) => {
					this.model.product_id += this.model.product_id == '' ? val.label : '-' + val.label;
				})
			},
			// 选择时间
			timeConfirm(e) {
				console.log("时间", e)
				const {
					year,
					month,
					day,
					hour
				} = e
				this.model.create_time = `${year}-${month}-${day} ${hour}`
			},
			getProducts() {
				const type = this.typeMap[this.radio]
				api.getProducts(type, this.brand).then(res => {
					this.products = res.data.map(item => {
						return {
							label: item.model,
							value: item.id
						}
					})
				})
			}
		}
	};
</script>

<style scoped lang="scss">
	.wrap {
		padding: 30rpx;
	}
</style>