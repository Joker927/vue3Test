import api from "@/utils/service.js";

// 登陆
export function getUserList(data) {
    return api.get("/users/list", data);
}

