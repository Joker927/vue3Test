<template>
    <view> applyItem{{ signIndex }} </view>
    <button @click="add">add counter</button>
    <view> Current Count: {{ counter.count }} </view>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, getCurrentInstance, inject } from 'vue'
import { useCounterStore } from '@/stores/counter'

const counter = useCounterStore()
console.log('🚀 ~ file: applyItem.vue:12 ~ counter:', counter)

const add = () => {
    // counter.$patch({ count: counter.count + 1 })
    // counter.increment()
    counter.count++
}

const signIndex = inject('signIndex')
console.log('🚀 ~ file: applyItem.vue:9 ~ signIndex:', signIndex)
</script>

<style lang="scss" scoped></style>
