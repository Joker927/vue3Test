<template>
    <view>
        <view>
            <text class="title">{{ title }}</text>
        </view>

        <view ref="nameView">
            {{ state.name }}
        </view>
        <ApplyList :title="'456'" @add="add" ref="applyListRef" v-model="listDetail" />
        <Detail :title="'123'">
            <view>is Detail</view>

            <template #contain>
                <view> is detail contain </view>
            </template>

            <template #footer>
                <view> is detail footer </view>
            </template>
        </Detail>

        <button @click="goBack">返回</button>
    </view>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted, getCurrentInstance, provide, watch } from 'vue'
import { onReady, onLoad } from '@dcloudio/uni-app'
import { getUser } from '@/services/common.js'
//引入组件
import Detail from './detail.vue'
import ApplyList from './applyList.vue'
//获取vue实例
const { proxy } = getCurrentInstance()

const title = ref('Hellddo1')

const nameView = ref(null)
const applyListRef = ref(null)
const state = reactive({
    name: 'aaa',
})

const changeTitle = title => {}

onLoad(async options => {
    nextTick(function () {
        console.log('🚀 ~ file: index.vue:48 ~ nameView.value.$el.clientWidth:', nameView.value.$el.clientWidth)
        console.log('🚀 ~ file: index.vue:49 ~ proxy.$refs.nameView.$el.clientWidth:', proxy.$refs.nameView.$el.clientWidth)

        //通过refs获取子组件数据
        console.log(applyListRef.value.state)
        applyListRef.value.getList()
    })

    console.log(import.meta.env.VITE_TEST)
})

onReady(() => {})

const listDetail = ref(0)
//addBtn监听回调
const add = value => {
    console.log('🚀 ~ file: index.vue:58 ~ add ~ value:', value)
}

watch(listDetail, (newV, oldV) => {
    console.log('🚀 ~ watch ~ newV:', newV)
})

provide('signIndex', 123456)

const goBack = () => {
    proxy.$goBack()
}
</script>

<style lang="scss" scoped>
.contain {
    background: red;
}
</style>
