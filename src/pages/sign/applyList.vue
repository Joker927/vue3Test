<template>
    <view>
        <view>{{ title }}</view>
        <view>applyList</view>

        <button @click="add">add btn</button>

        <Apply-item></Apply-item>
    </view>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, getCurrentInstance } from 'vue'
import { onReady, onLoad } from '@dcloudio/uni-app'
import ApplyItem from './applyItem.vue'

const props = defineProps({
    title: {
        type: String,
        default: 'title',
    },
})

const getList = () => {
    console.log(state.applyList)
}

const state = {
    applyList: [1, 2, 3],
}
onLoad(options => {})

onReady(() => {})

// 通过defineExpose将数据指定抛出 父组件才可以获取需要的数据
defineExpose({
    state,
    getList,
})

//子传父
const model = defineModel()
const emit = defineEmits(['add', 'updata:listDetail', 'input'])
const add = () => {
    emit('add', 'emitAdd')
    model.value++
}
</script>
