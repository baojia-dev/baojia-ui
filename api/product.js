import request from '@/utils/request.js'

export const getProducts = (type, brand) => {
	return request({
		url: `/products?type=${type}&brand=${brand}`,
		method: 'GET',
	})
}

export const updatePrice = (data) => {
	return request({
		url: `/price`,
		method: 'POST',
		data,
	})
}

export const createSale = (data) => {
	return request({
		url: `/sale`,
		method: 'POST',
		data,
	})
}

export const getSales = (status) => {
	return request({
		url: `/sales?status=${status}`,
		method: 'GET',
	})
}

export const getSale = (id) => {
	return request({
		url: `/sale/${id}`,
		method: 'GET',
	})
}

export const confirmSale = (data) => {
	return request({
		url: `/sale/confirm`,
		method: 'PUT',
		data,
	})
}