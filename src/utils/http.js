import { baseUrl } from '@/config/env.js'

export function https(config) {
    config.url = baseUrl + config.url // 请求地址
    let promise = new Promise(function (resolve, reject) {
        uni.request(config).then(res => {
            if (res.statusCode == 200) {
                if (res.data.CODE != 2000) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            } else {
                uni.showToast({
                    title: '数据获取失败',
                    icon: 'none',
                    duration: 1500,
                })
            }
        }).catch(error => {
            reject(error)
        })
    })
    return promise
}
