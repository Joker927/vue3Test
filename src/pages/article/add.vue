<template>
    <view class="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
        <!-- 顶部导航栏 -->
        <view class="flex items-center justify-between px-4 py-3 pt-12">
            <view class="flex items-center">
                <view class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3" @tap="goBack">
                    <text class="text-white text-lg">←</text>
                </view>
                <text class="text-white text-lg font-medium">发布文章</text>
            </view>
            <view class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <text class="text-white text-sm">?</text>
            </view>
        </view>

        <!-- 主要内容区域 -->
        <scroll-view class="flex-1 px-4 pb-24" scroll-y="true" style="height: calc(100vh - 210rpx)">
            <!-- 图片上传区域 -->
            <view class="mb-6">
                <view class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-blue-500/20">
                    <view class="flex items-center mb-4">
                        <view class="w-1 h-5 bg-blue-500 rounded-full mr-3"></view>
                        <text class="text-gray-800 font-medium">添加图片</text>
                    </view>

                    <view class="grid grid-cols-3 gap-3 mb-4" v-if="images.length > 0">
                        <view
                            v-for="(image, index) in images"
                            :key="index"
                            class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 transition-transform duration-200 active:scale-95"
                        >
                            <image :src="image" class="w-full h-full object-cover" mode="aspectFill" />
                            <view
                                class="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"
                                @tap="removeImage(index)"
                            >
                                <text class="text-white text-xs">×</text>
                            </view>
                        </view>
                    </view>

                    <view
                        class="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center transition-all duration-200 active:scale-98"
                        @tap="chooseImage"
                        v-if="images.length < 9"
                    >
                        <view class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <text class="text-blue-500 text-2xl">+</text>
                        </view>
                        <text class="text-gray-600 text-sm">点击添加图片</text>
                        <text class="text-gray-400 text-xs mt-1">最多可添加9张图片</text>
                    </view>
                </view>
            </view>

            <!-- 标题输入区域 -->
            <view class="mb-6">
                <view class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-blue-500/20">
                    <view class="flex items-center mb-4">
                        <view class="w-1 h-5 bg-blue-500 rounded-full mr-3"></view>
                        <text class="text-gray-800 font-medium">文章标题</text>
                    </view>

                    <textarea
                        v-model="title"
                        placeholder="请输入文章标题..."
                        class="w-full h-16 text-lg text-gray-800 resize-none border-none outline-none placeholder:text-gray-400"
                        :maxlength="50"
                        auto-height
                    />
                    <view class="flex justify-end mt-2">
                        <text class="text-gray-400 text-xs">{{ title.length }}/50</text>
                    </view>
                </view>
            </view>

            <!-- 正文输入区域 -->
            <view class="mb-6">
                <view class="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-blue-500/20">
                    <view class="flex items-center mb-4">
                        <view class="w-1 h-5 bg-blue-500 rounded-full mr-3"></view>
                        <text class="text-gray-800 font-medium">正文内容</text>
                    </view>

                    <textarea
                        v-model="content"
                        placeholder="分享你的想法..."
                        class="w-full h-48 text-gray-800 resize-none border-none outline-none placeholder:text-gray-400 leading-relaxed"
                        :maxlength="2000"
                        auto-height
                    />
                    <view class="flex justify-end mt-2">
                        <text class="text-gray-400 text-xs">{{ content.length }}/2000</text>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 底部发布按钮 -->
        <view class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4">
            <view class="flex space-x-3">
                <button
                    class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-medium shadow-lg shadow-blue-500/30 transition-all duration-200 active:scale-98"
                    @tap="publishArticle"
                    :disabled="!canPublish"
                    :class="{ 'opacity-50': !canPublish }"
                >
                    发布文章
                </button>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            images: [],
            title: '',
            content: '',
            allowComment: true,
            onlyFans: false,
        }
    },

    computed: {
        canPublish() {
            return this.title.trim().length > 0 && this.content.trim().length > 0
        },
    },

    methods: {
        goBack() {
            uni.navigateBack()
        },

        chooseImage() {
            uni.chooseImage({
                count: 9 - this.images.length,
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success: res => {
                    this.images = this.images.concat(res.tempFilePaths)
                },
            })
        },

        removeImage(index) {
            this.images.splice(index, 1)
        },

        onCommentChange(e) {
            this.allowComment = e.detail.value
        },

        onFansChange(e) {
            this.onlyFans = e.detail.value
        },

        saveDraft() {
            uni.showToast({
                title: '已保存草稿',
                icon: 'success',
            })
        },

        publishArticle() {
            if (!this.canPublish) {
                uni.showToast({
                    title: '请填写标题和内容',
                    icon: 'none',
                })
                return
            }

            uni.showLoading({
                title: '发布中...',
            })

            // 模拟发布过程
            setTimeout(() => {
                uni.hideLoading()
                uni.showToast({
                    title: '发布成功！',
                    icon: 'success',
                })

                // 发布成功后返回上一页
                setTimeout(() => {
                    uni.navigateBack()
                }, 1500)
            }, 2000)
        },
    },
}
</script>

<style scoped>
.active\:scale-95:active {
    transform: scale(0.95);
}

.active\:scale-98:active {
    transform: scale(0.98);
}

.space-y-4 > * + * {
    margin-top: 1rem;
}

.space-x-3 > * + * {
    margin-left: 0.75rem;
}

.grid {
    display: grid;
}

.grid-cols-3 {
    grid-template-columns: repeat(3, 1fr);
}

.gap-3 {
    gap: 0.75rem;
}

.aspect-square {
    aspect-ratio: 1 / 1;
}

.backdrop-blur-sm {
    backdrop-filter: blur(4px);
}

.bg-gradient-to-br {
    background: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.from-blue-400 {
    --tw-gradient-from: #60a5fa;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(96, 165, 250, 0));
}

.via-blue-500 {
    --tw-gradient-stops: var(--tw-gradient-from), #3b82f6, var(--tw-gradient-to, rgba(59, 130, 246, 0));
}

.to-blue-600 {
    --tw-gradient-to: #2563eb;
}

.bg-gradient-to-r {
    background: linear-gradient(to right, var(--tw-gradient-stops));
}

.from-blue-500 {
    --tw-gradient-from: #3b82f6;
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(59, 130, 246, 0));
}

.to-blue-600 {
    --tw-gradient-to: #2563eb;
}

.shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.shadow-blue-500\/20 {
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.2), 0 4px 6px -2px rgba(59, 130, 246, 0.1);
}

.shadow-blue-500\/30 {
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.2);
}
</style>
