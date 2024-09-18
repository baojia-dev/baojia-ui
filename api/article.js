import request from '@/utils/request.js'

export const saveArticle = (data) => {
	return request({
		url: `/article`,
		method: 'POST',
		data,
	})
}

export const getArticles = () => {
	return request({
		url: `/articles`,
		method: 'GET',
	})
}

export const getArticle = (id) => {
	return request({
		url: `/article/${id}`,
		method: 'GET',
	})
}

export const updateArticle = (data) => {
	return request({
		url: `/article`,
		method: 'PUT',
		data,
	})
}

export const deleteArticle = (id) => {
	return request({
		url: `/article/${id}`,
		method: 'DELETE',
	})
}