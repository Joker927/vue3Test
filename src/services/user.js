import api from "@/utils/service.js";

// 注册用户
export function createUser(data) {
    return api.post("/users/add", data);
}

// 登录
export function userLogin(data) {
    return api.post("/users/login", data);
}

