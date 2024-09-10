<template>
	<view class="wrap">
		<view class="title">皮皮回收</view>
		<view class="title">{{isLogin ? '登录' : '注册'}}</view>
		<!-- 注册 -->
		<u-form v-show="!isLogin" :model="registerForm" ref="registerFormRef" class="login-form">
			<u-form-item class="field-label" label="用户名" prop="username" left-icon="man-add" label-width="160">
				<u-input v-model="registerForm.username" placeholder="用户名" />
			</u-form-item>
			<u-form-item class="field-label" label="密码" prop="password" left-icon="lock" label-width="160"
				@click-right-icon="switchPassType=!switchPassType">
				<u-input v-model="registerForm.password" placeholder="密码" :type="switchPassType ? 'password' : 'text'" />
			</u-form-item>
			<u-form-item class="field-label" label="确认密码" prop="againPassword" left-icon="lock" label-width="160"
				@click-right-icon="switchPassType=!switchPassType">
				<u-input v-model="registerForm.againPassword" placeholder="确认密码" :type="switchPassType ? 'password' : 'text'" />
			</u-form-item>
			<u-button shape="circle" class="u-m-t-20 u-m-b-20" type="primary" @click="handleRegister"
				:loading="registerLoading">注册</u-button>
			<view class="tips" @click="isLogin = !isLogin">已有账号？去登录</view>
		</u-form>
		<!-- 登录 -->
		<u-form v-show="isLogin" :model="loginForm" ref="loginFormRef" class="login-form">
			<u-form-item class="field-label" label="用户名" prop="username" left-icon="man-add" label-width="160">
				<u-input v-model="loginForm.username" placeholder="用户名" />
			</u-form-item>
			<u-form-item class="field-label" label="密码" prop="password" left-icon="lock" label-width="160"
				@click-right-icon="switchPassType=!switchPassType">
				<u-input v-model="loginForm.password" placeholder="密码" :type="switchPassType ? 'password' : 'text'" />
			</u-form-item>

			<u-button class="login-btn" type="primary" text="登录" shape="circle" @click="handlelogin" :loading="loginLoading">
				登录
			</u-button>
			<view class="tips" @click="isLogin = !isLogin">没有账号？去注册</view>
		</u-form>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import * as api from '@/api/auth'
	export default {
		data() {
			return {
				switchPassType: true, // 密码是否可见
				registerForm: {
					username: '',
					password: '',
					againPassword: ''
				},
				loginForm: {
					username: '',
					password: '',
				},
				registerLoading: false,
				loginLoading: false,
				isLogin: true, // 是否展示登录
				rules: {
					username: [{
						required: true,
						min: 3,
						message: '用户名不能少于3字',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					password: [{
						required: true,
						// pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{3,}$/,
						min: 3,
						message: '密码不能少于3位',
						trigger: ['change', 'blur'],
					}],
					againPassword: [{
						required: true,
						validator: (rule, value, callback) => {
							if (value !== this.registerForm.password) {
								return false
							} else {
								return true
							}
						},
						message: '两次密码输入不一致',
						trigger: ['change', 'blur'],
					}]
				}
			}
		},
		computed: {},
		onReady() {
			const isLogin = uni.getStorageSync('token')
			if (isLogin) {
				uni.switchTab({ url: '/pages/index/index' })
			}
			this.$refs.registerFormRef.setRules(this.rules)
			this.$refs.loginFormRef.setRules(this.rules)
		},
		onLoad() {

		},
		methods: {
			showToast(title, type) {
				this.$refs.uToast.show({
					title,
					type,
				})
			},
			// 注册
			handleRegister() {
				console.log('zhuce---')
				this.$refs.registerFormRef.validate(valid => {
					console.log('zhuce---22', valid)
					if (valid) {
						this.isLogin = true
						this.registerLoading = true
						setTimeout(() => {
							this.registerLoading = false
							this.showToast('注册成功', 'success')
						}, 1000)
					} else {
						console.log('验证失败')
					}
				})

			},

			// 登录
			handlelogin() {
				this.$refs.loginFormRef.validate(async valid => {
					if (valid) {
						this.loginLoading = true
						try {
							const res = await api.login(this.loginForm.username, this.loginForm.password)
							uni.setStorageSync('token', res.data)
							this.showToast('登录成功', 'success')
							setTimeout(() => {
								uni.switchTab({ url: '/pages/index/index' })
							}, 1000)
						} catch (err) {
							console.log(111, err)
							this.showToast('登录失败' + err, 'error')
						} finally {
							this.loginLoading = false
						}
					} else {
						console.log('验证失败')
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		width: 100vw;
		height: 100vh;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #f7f8fa;
	}

	.title {
		width: 100%;
		font-size: 24px;
		font-weight: bold;
		text-align: center;
		color: $u-type-primary;
		margin-bottom: 30px;
	}

	.login-form {
		width: 100%;
		height: 400px;
		padding: 20px;
		border-radius: 10px;
		background-color: #fff;
		box-shadow: 0rpx 4rpx 24rpx 0rpx rgba(0, 0, 0, 0.1);
	}

	.field-label {
		margin-bottom: 16px;
	}

	.login-btn {
		margin-bottom: 16px;
		margin-top: 30px;
	}

	.tips {
		width: 100%;
		height: 30px;
		line-height: 30px;
		text-align: center;
		font-size: 16px;
		color: $u-type-primary;
		cursor: pointer;
	}
</style>