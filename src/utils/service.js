import { https } from './http.js';    // 引入刚刚封装好的https

class api {
    async get(url, data) {
        const res = await https({
            method: "get", // 请求方式
            url: url, // 请求url
            data: data || {},// 参数
        })
        return res
    }
    async post(url, data) {
        const res = await https({
            method: "post", // 请求方式
            url: url, // 请求url
            data: data || {},// 参数
        })
        return res
    }
}

export default new api()