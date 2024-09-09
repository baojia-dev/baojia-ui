import request from '@/utils/request.js'

export const login = (username, password) => {
	return request({
		url: '/login',
		method: 'POST',
		data: {
			username,
			password
		}
	})
}

export const logout = () => {
	return request({
		url: '/logout',
		method: 'POST'
	})
}

export const getUserInfo = () => {
	return request({
		url: '/user',
		method: 'GET'
	})
}