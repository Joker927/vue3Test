import api from "@/utils/service.js";

// 登陆
export function getUser(data) {
    return api.post("/accountUser/getUser", data);
}

