<template>
    <view> </view>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, getCurrentInstance, defineProps } from 'vue'

onMounted(() => {
    console.log('uni', uni)
})
</script>
