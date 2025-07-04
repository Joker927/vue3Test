<template>
    <view class="content">
        <view class="text-area" @click="goSign">
            <text class="title">Hello</text>
        </view>

        <view class="numKeyboard" @click="handleShowOrClose"> 数字键盘1234 </view>

        <view class="p-4 bg-blue-500 text-white rounded-lg text-center"> Tailwind 已成功集成！ </view>

        <mi-payKeyboard isShuffleBoard v-if="payKeyboardShow" @success="handleKeyboardSuccess" @close="handleShowOrClose"></mi-payKeyboard>
    </view>
</template>

<script setup>
import { onReady, onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getUserList } from '@/services/common.js'
import MiPayKeyboard from '@/components/mi-payKeyboard/mi-payKeyboard.vue'
onLoad(async () => {
    let a = await getUserList()
    console.log('🚀 ~ onLoad ~ a:', a)
})

const goSign = () => {
    uni.navigateTo({
        url: '/pages/sign/index',
    })
}

const payKeyboardShow = ref(false)
const isShuffleBoard = true
const handleKeyboardSuccess = password => {
    console.log('handleKeyboardSuccess', password)
    handleShowOrClose()
}

const handleShowOrClose = () => {
    payKeyboardShow.value = !payKeyboardShow.value
}
</script>

<style>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
}

.text-area {
    display: flex;
    justify-content: center;
}

.title {
    font-size: 36rpx;
    color: #8f8f94;
}

.numKeyboard {
    margin-top: 100rpx;
}
</style>
