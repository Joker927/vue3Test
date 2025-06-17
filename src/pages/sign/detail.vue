<template>
    <view>
        <view>{{ title }}</view>
        <view>detail</view>
        <slot></slot>

        <slot name="contain"></slot>
        <slot name="footer"></slot>
    </view>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, getCurrentInstance, defineProps } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: 'title',
    },
})

onMounted(() => {
    console.log('onMounted')
})
</script>
