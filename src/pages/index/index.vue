<template>
    <view class="content">
        <view class="text-area" @click="goSign">
            <text class="title">Hello</text>
        </view>

        <view class="numKeyboard" @click="handleShowOrClose"> 数字键盘 </view>

        <mi-payKeyboard isShuffleBoard v-if="payKeyboardShow" @success="handleKeyboardSuccess" @close="handleShowOrClose"></mi-payKeyboard>
    </view>
</template>

<script setup>
import { onReady, onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
onLoad(() => {})

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
