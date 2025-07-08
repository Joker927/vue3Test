<template>
    <view class="container">
        <!-- 顶部图片轮播 -->
        <swiper
            class="banner-swiper"
            :indicator-dots="true"
            :autoplay="true"
            :interval="3000"
            :duration="500"
            indicator-color="rgba(255, 255, 255, 0.3)"
            indicator-active-color="rgba(255, 255, 255, 0.8)"
        >
            <swiper-item v-for="(image, index) in article.images" :key="index">
                <image class="banner-image" :src="image" mode="aspectFill" @click="previewImage(index)"></image>
            </swiper-item>
        </swiper>

        <!-- 主内容区域 -->
        <scroll-view class="content-scroll" scroll-y="true" :style="{ height: scrollHeight + 'px' }">
            <!-- 文章标题和内容 -->
            <view class="article-section">
                <text class="article-title">{{ article.title }}</text>
                <text class="article-content">{{ article.content }}</text>

                <!-- 作者信息 -->
                <view class="author-info">
                    <image class="author-avatar" :src="article.author.avatar" mode="aspectFill"></image>
                    <view class="author-details">
                        <text class="author-name">{{ article.author.name }}</text>
                        <text class="publish-time">{{ article.publishTime }}</text>
                    </view>
                </view>
            </view>

            <!-- 发表评论区域 -->
            <view class="comment-publish-section">
                <text class="section-title">发表评论</text>
                <view class="comment-input-container">
                    <textarea
                        class="comment-textarea"
                        v-model="newComment"
                        placeholder="写下你的想法..."
                        :maxlength="200"
                        :show-count="true"
                        :auto-height="true"
                        @input="onCommentInput"
                    ></textarea>
                    <view class="comment-actions">
                        <view class="comment-tools">
                            <view class="tool-item" @click="insertEmoji">
                                <text class="tool-icon">😀</text>
                                <text class="tool-text">表情</text>
                            </view>
                            <view class="tool-item" @click="selectImages">
                                <text class="tool-icon">📷</text>
                                <text class="tool-text">图片</text>
                            </view>
                        </view>
                        <view class="publish-btn" :class="{ active: canPublish }" @click="publishComment">
                            <text class="publish-text">发表</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 评论列表 -->
            <view class="comment-list-section">
                <text class="section-title">评论 ({{ comments.length }})</text>

                <view class="comment-list">
                    <view class="comment-item" v-for="(comment, index) in comments" :key="comment.id">
                        <image class="comment-avatar" :src="comment.avatar" mode="aspectFill"></image>
                        <view class="comment-content">
                            <view class="comment-header">
                                <text class="comment-name">{{ comment.name }}</text>
                                <text class="comment-time">{{ comment.time }}</text>
                            </view>
                            <text class="comment-text">{{ comment.content }}</text>

                            <!-- 评论图片 -->
                            <view class="comment-images" v-if="comment.images && comment.images.length > 0">
                                <image
                                    class="comment-image"
                                    v-for="(img, imgIndex) in comment.images"
                                    :key="imgIndex"
                                    :src="img"
                                    mode="aspectFill"
                                    @click="previewCommentImage(comment.images, imgIndex)"
                                ></image>
                            </view>

                            <view class="comment-actions">
                                <view class="comment-action" @click="likeComment(comment)">
                                    <text class="action-icon" :class="{ liked: comment.isLiked }">♥</text>
                                    <text class="action-count">{{ comment.likeCount }}</text>
                                </view>
                                <view class="comment-action" @click="replyComment(comment)">
                                    <text class="action-text">回复</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 加载更多 -->
                <view class="load-more" @click="loadMoreComments" v-if="hasMoreComments">
                    <text class="load-more-text">查看更多评论</text>
                </view>
            </view>
        </scroll-view>

        <!-- 底部操作栏 -->
        <view class="bottom-actions">
            <view class="action-left">
                <input
                    class="quick-comment"
                    v-model="quickComment"
                    placeholder="说点什么..."
                    @focus="focusQuickComment"
                    @confirm="sendQuickComment"
                />
            </view>
            <view class="action-right">
                <view class="action-item" @click="toggleLike">
                    <text class="action-icon" :class="{ liked: isLiked }">♥</text>
                    <text class="action-count">{{ formatCount(article.likeCount) }}</text>
                </view>
                <view class="action-item" @click="toggleCollect">
                    <text class="action-icon" :class="{ collected: isCollected }">⭐</text>
                    <text class="action-text">收藏</text>
                </view>
                <view class="action-item" @click="shareArticle">
                    <text class="action-icon">↗</text>
                    <text class="action-text">分享</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            scrollHeight: 0,
            newComment: '',
            quickComment: '',
            isLiked: false,
            isCollected: false,
            hasMoreComments: true,

            article: {
                id: 1,
                title: '春日限定｜樱花季的浪漫穿搭分享',
                content:
                    '春天来了，樱花盛开的季节总是让人心情愉悦。今天想和大家分享几套适合樱花季的浪漫穿搭，既有少女感又不失优雅。这些搭配不仅适合赏花，也很适合日常约会和朋友聚会。希望能给大家一些灵感，让这个春天更加美好！',
                images: [
                    'https://via.placeholder.com/750x500/ffb3d9/ffffff?text=樱花穿搭1',
                    'https://via.placeholder.com/750x500/ffc0d9/ffffff?text=樱花穿搭2',
                    'https://via.placeholder.com/750x500/ffd0e9/ffffff?text=樱花穿搭3',
                    'https://via.placeholder.com/750x500/ffe0f9/ffffff?text=樱花穿搭4',
                ],
                author: {
                    name: '樱花少女',
                    avatar: 'https://via.placeholder.com/100x100/ffb3d9/ffffff?text=作者',
                },
                publishTime: '2小时前',
                likeCount: 2580,
                collectCount: 456,
            },

            comments: [
                {
                    id: 1,
                    name: '时尚达人小雨',
                    avatar: 'https://via.placeholder.com/80x80/667eea/ffffff?text=用户1',
                    content: '哇，这套搭配太美了！粉色系真的很适合春天，温柔又有活力。特别是第二套，那个蝴蝶结的细节太可爱了～',
                    time: '1小时前',
                    likeCount: 23,
                    isLiked: false,
                    images: [],
                },
                {
                    id: 2,
                    name: '穿搭新手',
                    avatar: 'https://via.placeholder.com/80x80/764ba2/ffffff?text=用户2',
                    content: '请问这个包包是什么牌子的？颜色和衣服搭配得很好看！',
                    time: '45分钟前',
                    likeCount: 12,
                    isLiked: false,
                    images: [],
                },
                {
                    id: 3,
                    name: '摄影师Anna',
                    avatar: 'https://via.placeholder.com/80x80/50c878/ffffff?text=用户3',
                    content: '拍摄角度和构图都很棒！背景的樱花树也很应景，整体氛围感很强。',
                    time: '30分钟前',
                    likeCount: 18,
                    isLiked: false,
                    images: [
                        'https://via.placeholder.com/200x150/ffb3d9/ffffff?text=评论图1',
                        'https://via.placeholder.com/200x150/ffc0d9/ffffff?text=评论图2',
                    ],
                },
                {
                    id: 4,
                    name: '学生party',
                    avatar: 'https://via.placeholder.com/80x80/ff6b6b/ffffff?text=用户4',
                    content: '学生党表示很心动！这样的搭配日常上课也能穿，不会太过于正式。',
                    time: '15分钟前',
                    likeCount: 8,
                    isLiked: false,
                    images: [],
                },
            ],
        }
    },

    computed: {
        canPublish() {
            return this.newComment.trim().length > 0
        },
    },

    onLoad(options) {
        this.getSystemInfo()
        this.loadArticleDetail(options.id)
    },

    methods: {
        getSystemInfo() {
            const systemInfo = uni.getSystemInfoSync()
            // 计算滚动区域高度：总高度 - 轮播图高度 - 底部操作栏高度
            this.scrollHeight = systemInfo.windowHeight - 300 - 70
        },

        loadArticleDetail(id) {
            // 加载文章详情
            console.log('Loading article:', id)
        },

        previewImage(index) {
            uni.previewImage({
                urls: this.article.images,
                current: index,
            })
        },

        previewCommentImage(images, index) {
            uni.previewImage({
                urls: images,
                current: index,
            })
        },

        onCommentInput(e) {
            this.newComment = e.detail.value
        },

        insertEmoji() {
            // 插入表情功能
            this.newComment += '😊'
        },

        selectImages() {
            uni.chooseImage({
                count: 3,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: res => {
                    // 处理选择的图片
                    console.log('Selected images:', res.tempFilePaths)
                },
            })
        },

        publishComment() {
            if (!this.canPublish) return

            const comment = {
                id: Date.now(),
                name: '我',
                avatar: 'https://via.placeholder.com/80x80/667eea/ffffff?text=我',
                content: this.newComment,
                time: '刚刚',
                likeCount: 0,
                isLiked: false,
                images: [],
            }

            this.comments.unshift(comment)
            this.newComment = ''

            uni.showToast({
                title: '发表成功',
                icon: 'success',
            })
        },

        likeComment(comment) {
            comment.isLiked = !comment.isLiked
            comment.likeCount += comment.isLiked ? 1 : -1

            if (comment.isLiked) {
                uni.vibrateShort()
            }
        },

        replyComment(comment) {
            this.newComment = `回复 @${comment.name}: `
            // 滚动到发表评论区域
            uni.pageScrollTo({
                selector: '.comment-publish-section',
                duration: 300,
            })
        },

        loadMoreComments() {
            // 加载更多评论
            uni.showLoading({ title: '加载中...' })

            setTimeout(() => {
                // 模拟加载更多评论
                const moreComments = [
                    {
                        id: 5,
                        name: '时尚博主',
                        avatar: 'https://via.placeholder.com/80x80/ffa500/ffffff?text=用户5',
                        content: '春天的穿搭就是要有这种清新感，很棒的分享！',
                        time: '10分钟前',
                        likeCount: 5,
                        isLiked: false,
                        images: [],
                    },
                ]

                this.comments.push(...moreComments)
                this.hasMoreComments = false

                uni.hideLoading()
                uni.showToast({
                    title: '加载完成',
                    icon: 'success',
                })
            }, 1000)
        },

        focusQuickComment() {
            // 聚焦快速评论输入框
            this.quickComment = ''
        },

        sendQuickComment() {
            if (!this.quickComment.trim()) return

            const comment = {
                id: Date.now(),
                name: '我',
                avatar: 'https://via.placeholder.com/80x80/667eea/ffffff?text=我',
                content: this.quickComment,
                time: '刚刚',
                likeCount: 0,
                isLiked: false,
                images: [],
            }

            this.comments.unshift(comment)
            this.quickComment = ''

            uni.showToast({
                title: '评论成功',
                icon: 'success',
            })
        },

        toggleLike() {
            this.isLiked = !this.isLiked
            this.article.likeCount += this.isLiked ? 1 : -1

            if (this.isLiked) {
                uni.vibrateShort()
            }
        },

        toggleCollect() {
            this.isCollected = !this.isCollected

            uni.showToast({
                title: this.isCollected ? '收藏成功' : '取消收藏',
                icon: this.isCollected ? 'success' : 'none',
            })
        },

        shareArticle() {
            uni.showActionSheet({
                itemList: ['微信好友', '朋友圈', '复制链接'],
                success: res => {
                    const actions = ['微信好友', '朋友圈', '复制链接']
                    uni.showToast({
                        title: `分享到${actions[res.tapIndex]}`,
                        icon: 'none',
                    })
                },
            })
        },

        formatCount(count) {
            if (count < 1000) return count.toString()
            if (count < 10000) return (count / 1000).toFixed(1) + 'k'
            return (count / 10000).toFixed(1) + 'w'
        },
    },
}
</script>

<style lang="scss">
.container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
}

// 顶部轮播图
.banner-swiper {
    height: 300px;
    position: relative;
}

.banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

// 主内容滚动区域
.content-scroll {
    flex: 1;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
}

// 文章区域
.article-section {
    padding: 24px 20px;
    background: white;
    border-radius: 20px 20px 0 0;
    margin-top: -20px;
    position: relative;
    z-index: 10;
}

.article-title {
    font-size: 22px;
    font-weight: 700;
    color: #333;
    line-height: 1.4;
    margin-bottom: 16px;
    display: block;
}

.article-content {
    font-size: 16px;
    color: #666;
    line-height: 1.6;
    margin-bottom: 20px;
    display: block;
}

.author-info {
    display: flex;
    align-items: center;
    padding: 16px 0;
    border-top: 1px solid #f0f0f0;
}

.author-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    margin-right: 12px;
}

.author-details {
    flex: 1;
}

.author-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
    display: block;
}

.publish-time {
    font-size: 14px;
    color: #999;
    display: block;
}

// 发表评论区域
.comment-publish-section {
    padding: 24px 20px;
    background: white;
    border-top: 8px solid #f8f9fa;
}

.section-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    display: block;
}

.comment-input-container {
    background: #f8f9fa;
    border-radius: 16px;
    padding: 16px;
}

.comment-textarea {
    width: 100%;
    min-height: 80px;
    font-size: 16px;
    color: #333;
    background: transparent;
    border: none;
    resize: none;
    line-height: 1.5;
}

.comment-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
}

.comment-tools {
    display: flex;
    gap: 20px;
}

.tool-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(102, 126, 234, 0.1);
    border-radius: 20px;
    transition: all 0.3s ease;

    &:active {
        background: rgba(102, 126, 234, 0.2);
        transform: scale(0.95);
    }
}

.tool-icon {
    font-size: 16px;
}

.tool-text {
    font-size: 14px;
    color: #667eea;
}

.publish-btn {
    background: #ddd;
    color: white;
    padding: 8px 20px;
    border-radius: 20px;
    transition: all 0.3s ease;

    &.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
    }

    &:active {
        transform: scale(0.95);
    }
}

.publish-text {
    font-size: 14px;
    font-weight: 500;
    color: white;
}

// 评论列表区域
.comment-list-section {
    padding: 24px 20px;
    background: white;
    border-top: 8px solid #f8f9fa;
}

.comment-list {
    margin-top: 16px;
}

.comment-item {
    display: flex;
    padding: 16px 0;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }
}

.comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
}

.comment-content {
    flex: 1;
}

.comment-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.comment-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
}

.comment-time {
    font-size: 12px;
    color: #999;
}

.comment-text {
    font-size: 15px;
    color: #333;
    line-height: 1.5;
    margin-bottom: 8px;
    display: block;
}

.comment-images {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
}

.comment-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: cover;
}

.comment-actions {
    display: flex;
    gap: 20px;
}

.comment-action {
    display: flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;

    &:active {
        transform: scale(1.1);
    }
}

.action-icon {
    font-size: 16px;
    color: #999;

    &.liked {
        color: #ff4757;
    }
}

.action-count,
.action-text {
    font-size: 12px;
    color: #999;
}

.load-more {
    text-align: center;
    padding: 20px;

    &:active {
        opacity: 0.7;
    }
}

.load-more-text {
    font-size: 14px;
    color: #667eea;
    font-weight: 500;
}

// 底部操作栏
.bottom-actions {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.action-left {
    flex: 1;
}

.quick-comment {
    width: 100%;
    height: 36px;
    background: #f5f5f5;
    border: none;
    border-radius: 18px;
    padding: 0 16px;
    font-size: 14px;
    color: #333;
}

.action-right {
    display: flex;
    align-items: center;
    gap: 24px;
}

.action-item {
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.3s ease;

    &:active {
        transform: scale(1.1);
    }
}

.action-icon {
    font-size: 18px;
    color: #666;

    &.liked {
        color: #ff4757;
    }

    &.collected {
        color: #ffa502;
    }
}

.action-count,
.action-text {
    font-size: 12px;
    color: #666;
    font-weight: 500;
}
</style>
