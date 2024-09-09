const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:8080/api' : 'https://bj.xbmlz.cc/api'
uni.setStorageSync('baseUrl', baseUrl)
let request = (http) => {
	const {
		url,
		data,
		method
	} = http
	const token = uni.getStorageSync('loginSysUser') ? JSON.parse(uni.getStorageSync('loginSysUser')).token : ''
	return new Promise((resolve, reject) => {
		uni.request({
			url: baseUrl + url,
			method,
			data,
			header: {
				"Content-Type": "application/json",
			},
			withCredentials: true,
			success: (res) => { //请求成功
				if (res.data.code === 0) { //这里后台返回一个自定义状态码，可根据实际开发情况调整
					resolve(res.data)
				} else {
					if (res.data.code == 401) {
						uni.removeStorageSync('loginSysUser')
						uni.navigateTo({
							url: '/pages/login/login'
						})
					}
					uni.showToast({
						title: res.data.message || '请求数据失败',
						icon: 'none',
						duration: 2000
					})
					resolve(res.data)
				}
			},
			fail: (err) => { //请求失败
				uni.showToast({
					title: '请求数据失败！',
					icon: 'none'
				})
				reject(err)
			}
		})
	})
}
export default request
