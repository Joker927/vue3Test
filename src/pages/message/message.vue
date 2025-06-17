<template>
    <view></view>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, getCurrentInstance, inject } from 'vue'

onMounted(() => {
    // startSSE()
    startWSS()
})

let eventSource = ref(null)
const startSSE = () => {
    // 创建 EventSource 实例，连接到服务器的 SSE 端点
    eventSource.value = new EventSource('http://localhost:3000/api/msg/events')

    // 当接收到消息时，更新消息列表
    eventSource.value.onmessage = event => {
        // 假设服务器发送的是 JSON 格式的数据
        const message = JSON.parse(event.data)
        console.log('🚀 ~ startSSE ~ message:', message)
    }

    // 监听错误事件
    eventSource.value.onerror = err => {
        console.error('SSE 错误', err)
        // 可以在此处处理错误，可能是连接丢失等问题
    }

    setTimeout(() => {
        eventSource.value.close()
    }, 20000)
}

let ws = ref(null)
const startWSS = () => {
    ws = uni.connectSocket({
        // url: 'ws://localhost:3000/api/msg/ws',
        url: 'ws://localhost:3000/ws/chat',
        success: res => {
            console.log('正在建立连接')
            console.log('🚀 ~ startWSS ~ res:', res)
            return ws
        },
        fail: err => {
            this.reconnect()
        },
    })

    ws.onopen = () => {
        console.log('WebSocket 已连接')
    }

    ws.onmessage = event => {
        // 假设服务器发送的是 JSON 格式的数据
        const message = JSON.parse(event.data)
        console.log('🚀 ~ startWSS ~ message:', message)
    }
}
</script>

<style></style>
