import { baseUrl } from '@/config/env.js'

export function https(config) {
    config.url = import.meta.env.VITE_API_BASE_URL + config.url // 请求地址

    config.header = {
        'content-type': 'application/json',
    }

    const token = uni.getStorageSync('token')
    if (token) {
        config.header.authorization = 'Bearer ' + token
    }

    let promise = new Promise(function (resolve, reject) {
        uni.request(config).then(res => {
            console.log("🚀 ~ uni.request ~ res:", res)
            if (res.statusCode == 200 || res.statusCode == 201) {
                if (res.data.code != 200) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            } else {
                uni.showToast({
                    title: res.data.message || '数据获取失败',
                    icon: 'none',
                    duration: 1500,
                })
                reject(res.data)
            }
        }).catch(error => {
            reject(error)
            uni.showToast({
                title: '数据获取失败',
                icon: 'none',
                duration: 1500,
            })
        })
    })
    return promise
}
