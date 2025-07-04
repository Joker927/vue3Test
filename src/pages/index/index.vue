<template>
    <view class="home-container">
        <!-- 顶部状态栏占位 -->
        <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>

        <!-- 顶部导航栏 -->
        <view class="navbar">
            <view class="nav-content">
                <view class="nav-left">
                    <view class="logo">
                        <text class="logo-text">✨</text>
                    </view>
                </view>

                <view class="nav-center">
                    <view class="search-bar" @tap="handleSearch">
                        <text class="search-icon">🔍</text>
                        <text class="search-placeholder">搜索你感兴趣的内容</text>
                    </view>
                </view>

                <view class="nav-right">
                    <view class="message-icon" @tap="handleMessage">
                        <text class="icon-text">💬</text>
                        <view v-if="unreadCount > 0" class="badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</view>
                    </view>
                </view>
            </view>
        </view>

        <!-- Tab导航 -->
        <view class="tab-container">
            <scroll-view class="tab-scroll" scroll-x="true" :scroll-left="tabScrollLeft" scroll-with-animation>
                <view class="tab-list">
                    <view
                        v-for="(tab, index) in tabs"
                        :key="tab.id"
                        class="tab-item"
                        :class="{ 'tab-active': activeTab === tab.id }"
                        @tap="switchTab(tab.id, index)"
                    >
                        <text class="tab-text">{{ tab.name }}</text>
                        <view v-if="activeTab === tab.id" class="tab-indicator"></view>
                    </view>
                </view>
            </scroll-view>
        </view>

        <!-- 内容区域 -->
        <view class="content-container">
            <!-- 瀑布流容器 -->
            <view class="waterfall-container" :style="{ height: contentHeight + 'px' }">
                <!-- 左列 -->
                <view class="waterfall-column left-column">
                    <view v-for="item in leftColumnData" :key="item.id" class="card-item" @tap="handleCardTap(item)">
                        <view class="card-image" :style="{ height: item.height + 'px' }">
                            <template v-if="!item.imgError">
                                <image
                                    :id="`img-${item.id}`"
                                    :src="item.image"
                                    class="image"
                                    mode="aspectFill"
                                    :style="{ height: item.height + 'px' }"
                                    @load="handleImageLoad"
                                    @error="handleImageError(item)"
                                />
                            </template>
                            <template v-else>
                                <view class="image-placeholder" :style="{ height: item.height + 'px', width: '100%' }">
                                    <text>图片加载失败</text>
                                </view>
                            </template>
                            <view v-if="item.isVideo" class="video-badge">
                                <text class="video-icon">▶️</text>
                            </view>
                        </view>
                        <view class="card-content">
                            <text class="card-title">{{ item.title }}</text>
                            <view class="card-footer">
                                <view class="author-info">
                                    <image :src="item.author.avatar" class="author-avatar" mode="aspectFill" />
                                    <text class="author-name">{{ item.author.name }}</text>
                                </view>
                                <view class="card-actions">
                                    <view class="action-item" @tap.stop="handleLike(item)">
                                        <text class="action-icon" :class="{ liked: item.isLiked }">❤️</text>
                                        <text class="action-count">{{ formatCount(item.likeCount) }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 右列 -->
                <view class="waterfall-column right-column">
                    <view v-for="item in rightColumnData" :key="item.id" class="card-item" @tap="handleCardTap(item)">
                        <view class="card-image" :style="{ height: item.height + 'px' }">
                            <template v-if="!item.imgError">
                                <image
                                    :id="`img-${item.id}`"
                                    :src="item.image"
                                    class="image"
                                    mode="aspectFill"
                                    :style="{ height: item.height + 'px' }"
                                    @load="handleImageLoad"
                                    @error="handleImageError(item)"
                                />
                            </template>
                            <template v-else>
                                <view class="image-placeholder" :style="{ height: item.height + 'px', width: '100%' }">
                                    <text>图片加载失败</text>
                                </view>
                            </template>
                            <view v-if="item.isVideo" class="video-badge">
                                <text class="video-icon">▶️</text>
                            </view>
                        </view>
                        <view class="card-content">
                            <text class="card-title">{{ item.title }}</text>
                            <view class="card-footer">
                                <view class="author-info">
                                    <image :src="item.author.avatar" class="author-avatar" mode="aspectFill" />
                                    <text class="author-name">{{ item.author.name }}</text>
                                </view>
                                <view class="card-actions">
                                    <view class="action-item" @tap.stop="handleLike(item)">
                                        <text class="action-icon" :class="{ liked: item.isLiked }">❤️</text>
                                        <text class="action-count">{{ formatCount(item.likeCount) }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 加载更多 -->
        <view v-if="isLoading" class="loading-container">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载中...</text>
        </view>
    </view>
</template>

<script>
export default {
    name: 'HomePage',
    data() {
        return {
            statusBarHeight: 0,
            contentHeight: 0,
            activeTab: 'recommend',
            tabScrollLeft: 0,
            unreadCount: 3,
            isLoading: false,
            leftColumnData: [],
            rightColumnData: [],
            tabs: [
                { id: 'recommend', name: '推荐' },
                { id: 'food', name: '美食' },
                { id: 'travel', name: '旅行' },
                { id: 'movie', name: '电影' },
                { id: 'phone', name: '手机' },
                { id: 'game', name: '游戏' },
                { id: 'digital', name: '数码' },
                { id: 'fashion', name: '时尚' },
                { id: 'beauty', name: '美妆' },
                { id: 'fitness', name: '健身' },
            ],
            mockData: [],
        }
    },

    onLoad() {
        this.initPage()
        this.generateMockData()
        this.loadData()
    },

    onReachBottom() {
        this.loadMoreData()
    },

    onPageScroll(e) {
        this.lazyLoadImages()
    },

    mounted() {
        this.$nextTick(() => {
            this.lazyLoadImages()
        })
    },

    methods: {
        // 初始化页面
        initPage() {
            // 获取系统信息
            const systemInfo = uni.getSystemInfoSync()
            this.statusBarHeight = systemInfo.statusBarHeight
            this.contentHeight = systemInfo.windowHeight - this.statusBarHeight - 100 - 90 // 减去导航栏和tab栏高度
        },

        // 生成模拟数据
        generateMockData() {
            const categories = ['recommend', 'food', 'travel', 'movie', 'phone', 'game', 'digital']
            const titles = [
                '超级好看的日落，心情瞬间治愈了',
                '今天做的这个菜真的太香了，步骤超简单',
                '这个地方真的太美了，强烈推荐',
                '最近看的电影，剧情真的很棒',
                '新买的手机，拍照效果绝了',
                '这个游戏真的太好玩了，停不下来',
                '数码产品测评，性价比超高',
                '穿搭分享，显瘦又好看',
                '护肤心得，皮肤越来越好了',
                '健身打卡，坚持就是胜利',
            ]

            const authors = [
                { name: '小红薯', avatar: 'https://fastly.picsum.photos/id/996/100/100.jpg?hmac=scb6pkBvuMbqxgLLWNGFgJuPt1c9zdeBHvoeqO0F4cg' },
                { name: '生活达人', avatar: 'https://fastly.picsum.photos/id/798/100/100.jpg?hmac=fUsZTZiMfWZCnqg-hcR2ICUKjl7qG7-cqF-1tLL98Vk' },
                { name: '美食家', avatar: 'https://fastly.picsum.photos/id/798/100/100.jpg?hmac=fUsZTZiMfWZCnqg-hcR2ICUKjl7qG7-cqF-1tLL98Vk' },
                { name: '旅行者', avatar: 'https://fastly.picsum.photos/id/798/100/100.jpg?hmac=fUsZTZiMfWZCnqg-hcR2ICUKjl7qG7-cqF-1tLL98Vk' },
                { name: '数码控', avatar: 'https://fastly.picsum.photos/id/798/100/100.jpg?hmac=fUsZTZiMfWZCnqg-hcR2ICUKjl7qG7-cqF-1tLL98Vk' },
            ]

            this.mockData = []

            // mockData 生成部分，image 字段初始为占位图，realSrc 为真实图片
            const placeholder =
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDIwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4='
            for (let i = 0; i < 50; i++) {
                const height = Math.floor(Math.random() * 200) + 200 // 200-400px高度
                this.mockData.push({
                    id: i + 1,
                    title: titles[Math.floor(Math.random() * titles.length)],
                    realSrc: `https://picsum.photos/200/${height}?random=${i + 1}`,
                    image: placeholder,
                    author: authors[Math.floor(Math.random() * authors.length)],
                    likeCount: Math.floor(Math.random() * 10000),
                    isLiked: Math.random() > 0.7,
                    isVideo: Math.random() > 0.8,
                    category: categories[Math.floor(Math.random() * categories.length)],
                    height: height,
                })
            }
        },

        // 加载数据
        loadData() {
            this.isLoading = true

            // 模拟API请求
            setTimeout(() => {
                const filteredData = this.mockData.filter(item => this.activeTab === 'recommend' || item.category === this.activeTab)

                this.distributeData(filteredData)
                this.isLoading = false
            }, 1000)
        },

        // 加载更多数据
        loadMoreData() {
            if (this.isLoading) return

            this.isLoading = true

            // 模拟加载更多
            setTimeout(() => {
                const moreData = this.generateMoreData()
                this.distributeData([...this.leftColumnData, ...this.rightColumnData, ...moreData])
                this.isLoading = false
            }, 1000)
        },

        // 生成更多数据
        generateMoreData() {
            const moreData = []
            for (let i = 0; i < 20; i++) {
                const height = Math.floor(Math.random() * 200) + 200
                moreData.push({
                    id: this.mockData.length + i + 1,
                    title: `新内容 ${i + 1}`,
                    image: `https://picsum.photos/200/${height}?random=${this.mockData.length + i + 1}`,
                    author: { name: '新用户', avatar: 'https://picsum.photos/100/100?random=100' },
                    likeCount: Math.floor(Math.random() * 1000),
                    isLiked: false,
                    isVideo: Math.random() > 0.8,
                    category: this.activeTab,
                    height: height,
                    imgError: false, // 新增图片加载错误状态
                })
            }
            return moreData
        },

        // 分配数据到左右两列
        distributeData(data) {
            const leftColumn = []
            const rightColumn = []
            let leftHeight = 0
            let rightHeight = 0

            data.forEach(item => {
                if (leftHeight <= rightHeight) {
                    leftColumn.push(item)
                    leftHeight += item.height
                } else {
                    rightColumn.push(item)
                    rightHeight += item.height
                }
            })

            this.leftColumnData = leftColumn
            this.rightColumnData = rightColumn
        },

        // 切换Tab
        switchTab(tabId, index) {
            if (this.activeTab === tabId) return

            this.activeTab = tabId

            // 计算滚动位置
            const tabWidth = 120 // 每个tab的宽度
            const screenWidth = uni.getSystemInfoSync().windowWidth
            const scrollLeft = Math.max(0, index * tabWidth - screenWidth / 2 + tabWidth / 2)
            this.tabScrollLeft = scrollLeft

            // 重新加载数据
            this.loadData()
        },

        // 处理卡片点击
        handleCardTap(item) {
            uni.navigateTo({
                url: `/pages/detail/detail?id=${item.id}`,
            })
        },

        // 处理点赞
        handleLike(item) {
            item.isLiked = !item.isLiked
            if (item.isLiked) {
                item.likeCount++
            } else {
                item.likeCount--
            }
        },

        // 格式化数字
        formatCount(count) {
            if (count < 1000) return count.toString()
            if (count < 10000) return (count / 1000).toFixed(1) + 'k'
            return (count / 10000).toFixed(1) + 'w'
        },

        // 处理搜索
        handleSearch() {
            uni.navigateTo({
                url: '/pages/search/search',
            })
        },

        // 处理消息
        handleMessage() {
            uni.navigateTo({
                url: '/pages/message/message',
            })
        },

        // 图片加载完成
        handleImageLoad(e) {
            // 图片加载完成后的处理
        },

        // 图片加载错误
        handleImageError(item) {
            item.imgError = true
            // 图片加载错误处理
            console.log('图片加载失败', item.image)
        },

        lazyLoadImages() {
            const allItems = [...this.leftColumnData, ...this.rightColumnData]
            allItems.forEach(item => {
                if (item.image === item.realSrc) return
                // #ifdef H5
                const el = document.getElementById(`img-${item.id}`)
                if (el) {
                    const rect = el.getBoundingClientRect()
                    if (rect.top < window.innerHeight && rect.bottom > 0) {
                        this.$set(item, 'image', item.realSrc)
                    }
                }
                // #endif
            })
        },
    },
}
</script>

<style scoped>
.home-container {
    width: 100%;
    min-height: 100vh;
    background: #f8f9fa;
}

.status-bar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 导航栏 */
.navbar {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20rpx 30rpx;
}

.nav-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.nav-left {
    width: 80rpx;
}

.logo {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-text {
    font-size: 36rpx;
}

.nav-center {
    flex: 1;
    margin: 0 20rpx;
}

.search-bar {
    height: 60rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    backdrop-filter: blur(20rpx);
}

.search-icon {
    font-size: 28rpx;
    margin-right: 16rpx;
}

.search-placeholder {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
}

.nav-right {
    width: 80rpx;
    display: flex;
    justify-content: flex-end;
}

.message-icon {
    position: relative;
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-text {
    font-size: 36rpx;
}

.badge {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    background: #ff4757;
    color: white;
    font-size: 20rpx;
    padding: 2rpx 8rpx;
    border-radius: 20rpx;
    min-width: 32rpx;
    text-align: center;
}

/* Tab导航 */
.tab-container {
    background: white;
    border-bottom: 1rpx solid #e5e7eb;
}

.tab-scroll {
    white-space: nowrap;
}

.tab-list {
    display: flex;
    padding: 0 30rpx;
}

.tab-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30rpx 0;
    margin-right: 60rpx;
    min-width: 80rpx;
    transition: all 0.3s ease;
}

.tab-item:last-child {
    margin-right: 0;
}

.tab-text {
    font-size: 32rpx;
    color: #6b7280;
    font-weight: 500;
    transition: all 0.3s ease;
}

.tab-active .tab-text {
    color: #667eea;
    font-weight: 600;
}

.tab-indicator {
    position: absolute;
    bottom: 0;
    width: 40rpx;
    height: 6rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 3rpx;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        width: 0;
        opacity: 0;
    }
    to {
        width: 40rpx;
        opacity: 1;
    }
}

/* 内容区域 */
.content-container {
    padding: 20rpx;
}

.waterfall-container {
    display: flex;
    gap: 20rpx;
}

.waterfall-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

/* 卡片样式 */
.card-item {
    background: white;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
}

.card-item:active {
    transform: scale(0.98);
}

.card-image {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.image {
    width: 100%;
    height: auto;
    display: block;
}

.video-badge {
    position: absolute;
    top: 16rpx;
    right: 16rpx;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 8rpx 12rpx;
    border-radius: 16rpx;
    backdrop-filter: blur(10rpx);
}

.video-icon {
    font-size: 24rpx;
}

.card-content {
    padding: 24rpx;
}

.card-title {
    font-size: 28rpx;
    color: #1f2937;
    line-height: 1.4;
    margin-bottom: 20rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.author-info {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.author-avatar {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
}

.author-name {
    font-size: 24rpx;
    color: #6b7280;
    font-weight: 500;
}

.card-actions {
    display: flex;
    align-items: center;
    gap: 20rpx;
}

.action-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.action-icon {
    font-size: 28rpx;
    transition: all 0.3s ease;
}

.action-icon.liked {
    color: #ff4757;
    transform: scale(1.2);
}

.action-count {
    font-size: 24rpx;
    color: #6b7280;
}

/* 加载更多 */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx;
    gap: 20rpx;
}

.loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #e5e7eb;
    border-top: 4rpx solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loading-text {
    font-size: 28rpx;
    color: #6b7280;
}

.image-placeholder {
    background: #f0f0f0;
    color: #bbb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
}
</style>
