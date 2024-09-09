import request from '@/utils/request.js'

/**
 * 测试接口
 * @param Id
 * @author lyn
 * @date 2021/10/20
 */
export const list = () => {
    return request({
        url: `/listFeeitem/100`,
        method: 'GET'
    })
}
