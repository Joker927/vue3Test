<template>
    <view class="container">
        <!-- 自定义导航栏 -->
        <view class="custom-navbar" :style="{ paddingTop: statusBarHeight + 'px' }">
            <view class="navbar-content">
                <view class="navbar-left">
                    <view class="nav-btn" @click="goBack">
                        <text class="iconfont">&#xe601;</text>
                    </view>
                    <text class="nav-title">文章详情</text>
                </view>
                <view class="navbar-right">
                    <view class="nav-btn" @click="shareArticle">
                        <text class="iconfont">&#xe602;</text>
                    </view>
                    <view class="nav-btn" @click="showMore">
                        <text class="iconfont">&#xe603;</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 主内容区域 -->
        <scroll-view class="main-content" scroll-y="true" :style="{ height: mainHeight + 'px' }">
            <!-- 作者信息卡片 -->
            <view class="author-card card-style" @click="viewProfile">
                <view class="author-info">
                    <image class="avatar" :src="article.author.avatar" mode="aspectFill"></image>
                    <view class="author-details">
                        <text class="author-name">{{ article.author.name }}</text>
                        <text class="publish-time">{{ article.publishTime }} · {{ article.location }}</text>
                    </view>
                </view>
                <view class="follow-btn" :class="{ followed: isFollowed }" @click.stop="toggleFollow">
                    <text class="follow-text">{{ isFollowed ? '已关注' : '关注' }}</text>
                </view>
            </view>

            <!-- 主图片 -->
            <view class="main-image-container card-style">
                <image class="main-image" :src="article.mainImage" mode="aspectFill" @click="previewImage"></image>
            </view>

            <!-- 文章内容 -->
            <view class="article-content card-style">
                <text class="article-title">{{ article.title }}</text>

                <!-- 标签 -->
                <view class="tags-container">
                    <view class="tag-item" v-for="(tag, index) in article.tags" :key="index" @click="searchByTag(tag)">
                        <text class="tag-text">#{{ tag }}</text>
                    </view>
                </view>

                <!-- 文章正文 -->
                <view class="article-text">
                    <text class="text-content" v-for="(paragraph, index) in article.content" :key="index">
                        {{ paragraph }}
                    </text>
                </view>

                <!-- 详情图片网格 -->
                <view class="image-grid">
                    <view class="grid-item" v-for="(img, index) in article.detailImages" :key="index" @click="previewDetailImage(index)">
                        <image class="grid-image" :src="img" mode="aspectFill"></image>
                    </view>
                </view>
            </view>

            <!-- 互动数据 -->
            <view class="interaction-bar card-style">
                <view class="interaction-left">
                    <view class="interaction-item" @click="toggleLike">
                        <text class="interaction-icon" :class="{ liked: isLiked }">♥</text>
                        <text class="interaction-count">{{ formatCount(article.likeCount) }}</text>
                    </view>
                    <view class="interaction-item" @click="focusCommentInput">
                        <text class="interaction-icon">💬</text>
                        <text class="interaction-count">{{ formatCount(article.commentCount) }}</text>
                    </view>
                    <view class="interaction-item" @click="toggleCollect">
                        <text class="interaction-icon" :class="{ collected: isCollected }">⭐</text>
                        <text class="interaction-text">收藏</text>
                    </view>
                </view>
                <view class="interaction-right">
                    <text class="view-count">{{ formatCount(article.viewCount) }} 浏览</text>
                </view>
            </view>

            <!-- 评论区 -->
            <view class="comment-section card-style">
                <text class="comment-title">评论 ({{ article.commentCount }})</text>

                <view class="comment-list">
                    <view class="comment-item" v-for="(comment, index) in comments" :key="index" @click="replyComment(comment)">
                        <image class="comment-avatar" :src="comment.avatar" mode="aspectFill"></image>
                        <view class="comment-content">
                            <view class="comment-header">
                                <text class="comment-name">{{ comment.name }}</text>
                                <text class="comment-time">{{ comment.time }}</text>
                            </view>
                            <text class="comment-text">{{ comment.content }}</text>
                            <view class="comment-actions">
                                <view class="comment-action" @click.stop="likeComment(comment)">
                                    <text class="action-icon" :class="{ liked: comment.isLiked }">♥</text>
                                    <text class="action-count">{{ comment.likeCount }}</text>
                                </view>
                                <view class="comment-action" @click.stop="replyComment(comment)">
                                    <text class="action-text">回复</text>
                                </view>
                            </view>
                        </view>
                    </view>
                </view>

                <view class="load-more" @click="loadMoreComments">
                    <text class="load-more-text">查看全部评论</text>
                </view>
            </view>

            <!-- 相关推荐 -->
            <view class="recommend-section card-style">
                <text class="recommend-title">相关推荐</text>

                <view class="recommend-grid">
                    <view class="recommend-item" v-for="(item, index) in recommendations" :key="index" @click="goToArticle(item.id)">
                        <image class="recommend-image" :src="item.image" mode="aspectFill"></image>
                        <text class="recommend-text">{{ item.title }}</text>
                        <text class="recommend-info">{{ item.author }} · {{ formatCount(item.likeCount) }}点赞</text>
                    </view>
                </view>
            </view>
        </scroll-view>

        <!-- 底部评论输入框 -->
        <view class="comment-input-bar" :style="{ bottom: keyboardHeight + 'px' }">
            <view class="input-container">
                <input
                    class="comment-input"
                    v-model="commentText"
                    placeholder="写下你的评论..."
                    :focus="commentInputFocus"
                    @focus="onCommentFocus"
                    @blur="onCommentBlur"
                    @input="onCommentInput"
                />
                <view class="emoji-btn" @click="showEmoji">
                    <text class="emoji-icon">😀</text>
                </view>
            </view>
            <view class="send-btn" :class="{ active: commentText.trim() }" @click="sendComment">
                <text class="send-text">发送</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            statusBarHeight: 0,
            mainHeight: 0,
            keyboardHeight: 0,
            commentInputFocus: false,
            commentText: '',
            isFollowed: false,
            isLiked: false,
            isCollected: false,

            article: {
                id: 1,
                title: '今日穿搭分享｜简约而不简单的春日look',
                author: {
                    name: '时尚博主小美',
                    avatar: 'https://via.placeholder.com/100x100/667eea/ffffff?text=头像',
                },
                publishTime: '3小时前',
                location: '上海',
                mainImage: 'https://via.placeholder.com/750x500/764ba2/ffffff?text=主图',
                tags: ['穿搭', '春日', '时尚', '简约'],
                content: [
                    '今天想和大家分享一个简约而不简单的春日穿搭！这套look非常适合日常上班或者朋友聚会～',
                    '上身选择了一件白色的基础款衬衫，质感很棒，版型也很好看。搭配一条高腰的A字裙，显腿长又很有女人味。',
                    '鞋子选择了一双小白鞋，舒适又百搭。包包是最近很喜欢的一个小众品牌，颜色和整体很搭。',
                    '配饰方面，戴了一条简单的项链和一对小耳环，低调但很有质感。',
                ],
                detailImages: [
                    'https://via.placeholder.com/300x300/667eea/ffffff?text=细节1',
                    'https://via.placeholder.com/300x300/764ba2/ffffff?text=细节2',
                ],
                likeCount: 1200,
                commentCount: 89,
                viewCount: 2300,
            },

            comments: [
                {
                    id: 1,
                    name: '时尚达人',
                    avatar: 'https://via.placeholder.com/60x60/667eea/ffffff?text=用户1',
                    content: '这套搭配真的很好看！简约但很有质感，学到了～',
                    time: '2小时前',
                    likeCount: 12,
                    isLiked: false,
                },
                {
                    id: 2,
                    name: '穿搭小白',
                    avatar: 'https://via.placeholder.com/60x60/764ba2/ffffff?text=用户2',
                    content: '请问这个包包是什么牌子的？好好看！',
                    time: '1小时前',
                    likeCount: 8,
                    isLiked: false,
                },
                {
                    id: 3,
                    name: '美妆博主',
                    avatar: 'https://via.placeholder.com/60x60/667eea/ffffff?text=用户3',
                    content: '色彩搭配很和谐，给人很舒服的感觉！',
                    time: '30分钟前',
                    likeCount: 5,
                    isLiked: false,
                },
            ],

            recommendations: [
                {
                    id: 2,
                    title: '春日甜美穿搭指南',
                    author: '时尚小花',
                    image: 'https://via.placeholder.com/300x200/667eea/ffffff?text=推荐1',
                    likeCount: 1500,
                },
                {
                    id: 3,
                    title: '职场女性必备单品',
                    author: '职场达人',
                    image: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=推荐2',
                    likeCount: 2100,
                },
            ],
        }
    },

    onLoad(options) {
        this.getSystemInfo()
        this.loadArticleDetail(options.id)
    },

    onShow() {
        uni.onKeyboardHeightChange(this.onKeyboardHeightChange)
    },

    onHide() {
        uni.offKeyboardHeightChange(this.onKeyboardHeightChange)
    },

    methods: {
        getSystemInfo() {
            const systemInfo = uni.getSystemInfoSync()
            this.statusBarHeight = systemInfo.statusBarHeight || 0
            this.mainHeight = systemInfo.windowHeight - this.statusBarHeight - 50 - 60 // 减去导航栏和底部输入框高度
        },

        loadArticleDetail(id) {
            // 实际项目中这里应该调用API加载文章详情
            console.log('Loading article:', id)
        },

        goBack() {
            uni.navigateBack()
        },

        shareArticle() {
            uni.share({
                provider: 'weixin',
                scene: 'WXSceneSession',
                type: 0,
                href: `pages/article/detail?id=${this.article.id}`,
                title: this.article.title,
                summary: this.article.content[0],
                imageUrl: this.article.mainImage,
                success: () => {
                    uni.showToast({ title: '分享成功' })
                },
            })
        },

        showMore() {
            uni.showActionSheet({
                itemList: ['举报', '不感兴趣', '复制链接'],
                success: res => {
                    console.log('选择了第' + (res.tapIndex + 1) + '个按钮')
                },
            })
        },

        viewProfile() {
            uni.navigateTo({
                url: `/pages/user/profile?id=${this.article.author.id}`,
            })
        },

        toggleFollow() {
            this.isFollowed = !this.isFollowed
            uni.showToast({
                title: this.isFollowed ? '关注成功' : '取消关注',
                icon: 'none',
            })
        },

        previewImage() {
            uni.previewImage({
                urls: [this.article.mainImage],
            })
        },

        previewDetailImage(index) {
            uni.previewImage({
                urls: this.article.detailImages,
                current: index,
            })
        },

        searchByTag(tag) {
            uni.navigateTo({
                url: `/pages/search/result?keyword=${tag}`,
            })
        },

        toggleLike() {
            this.isLiked = !this.isLiked
            this.article.likeCount += this.isLiked ? 1 : -1

            // 添加点赞动画效果
            uni.vibrateShort()
        },

        toggleCollect() {
            this.isCollected = !this.isCollected
            uni.showToast({
                title: this.isCollected ? '收藏成功' : '取消收藏',
                icon: 'none',
            })
        },

        focusCommentInput() {
            this.commentInputFocus = true
        },

        onCommentFocus() {
            this.commentInputFocus = true
        },

        onCommentBlur() {
            this.commentInputFocus = false
        },

        onCommentInput(e) {
            this.commentText = e.detail.value
        },

        onKeyboardHeightChange(res) {
            this.keyboardHeight = res.height
        },

        showEmoji() {
            // 显示表情包选择器
            uni.showToast({
                title: '表情包功能开发中',
                icon: 'none',
            })
        },

        sendComment() {
            if (!this.commentText.trim()) return

            // 发送评论逻辑
            const newComment = {
                id: Date.now(),
                name: '我',
                avatar: 'https://via.placeholder.com/60x60/667eea/ffffff?text=我',
                content: this.commentText,
                time: '刚刚',
                likeCount: 0,
                isLiked: false,
            }

            this.comments.unshift(newComment)
            this.article.commentCount++
            this.commentText = ''

            uni.showToast({
                title: '评论成功',
                icon: 'success',
            })
        },

        replyComment(comment) {
            this.commentText = `回复 @${comment.name}: `
            this.focusCommentInput()
        },

        likeComment(comment) {
            comment.isLiked = !comment.isLiked
            comment.likeCount += comment.isLiked ? 1 : -1
        },

        loadMoreComments() {
            uni.navigateTo({
                url: `/pages/article/comments?id=${this.article.id}`,
            })
        },

        goToArticle(id) {
            uni.navigateTo({
                url: `/pages/article/detail?id=${id}`,
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
}

.custom-navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    height: 44px;
}

.navbar-left {
    display: flex;
    align-items: center;
}

.navbar-right {
    display: flex;
    align-items: center;
}

.nav-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    transition: all 0.3s ease;

    &:active {
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0.95);
    }
}

.nav-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.main-content {
    padding: 60px 16px 80px;
}

.card-style {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    margin-bottom: 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:active {
        transform: translateY(-2px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    }
}

.author-card {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.author-info {
    display: flex;
    align-items: center;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 12px;
}

.author-details {
    display: flex;
    flex-direction: column;
}

.author-name {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.publish-time {
    font-size: 14px;
    color: #666;
}

.follow-btn {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 8px 24px;
    border-radius: 20px;
    transition: all 0.3s ease;

    &.followed {
        background: linear-gradient(135deg, #10b981, #059669);
    }

    &:active {
        transform: scale(1.05);
    }
}

.follow-text {
    font-size: 14px;
    font-weight: 500;
    color: white;
}

.main-image-container {
    overflow: hidden;
    position: relative;
}

.main-image {
    width: 100%;
    height: 250px;
    border-radius: 16px;
}

.article-content {
    padding: 24px;
}

.article-title {
    font-size: 20px;
    font-weight: 700;
    color: #333;
    line-height: 1.4;
    margin-bottom: 16px;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
}

.tag-item {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
    border: 1px solid rgba(102, 126, 234, 0.2);
    border-radius: 16px;
    padding: 6px 12px;
    transition: all 0.3s ease;

    &:active {
        background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2));
        transform: scale(1.05);
    }
}

.tag-text {
    font-size: 14px;
    color: #667eea;
}

.article-text {
    line-height: 1.6;
    margin-bottom: 24px;
}

.text-content {
    display: block;
    font-size: 16px;
    color: #333;
    margin-bottom: 16px;
}

.image-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
}

.grid-item {
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:active {
        transform: scale(0.98);
    }
}

.grid-image {
    width: 100%;
    height: 120px;
}

.interaction-bar {
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.interaction-left {
    display: flex;
    align-items: center;
    gap: 24px;
}

.interaction-item {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:active {
        transform: scale(1.1);
    }
}

.interaction-icon {
    font-size: 20px;
    color: #666;
    transition: all 0.3s ease;

    &.liked {
        color: #ff4757;
    }

    &.collected {
        color: #ffa502;
    }
}

.interaction-count,
.interaction-text {
    font-size: 14px;
    color: #666;
    font-weight: 500;
}

.interaction-right {
    .view-count {
        font-size: 14px;
        color: #999;
    }
}

.comment-section {
    padding: 20px;
}

.comment-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
}

.comment-list {
    margin-bottom: 16px;
}

.comment-item {
    display: flex;
    padding: 12px;
    border-radius: 12px;
    margin-bottom: 8px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;

    &:active {
        background: rgba(255, 255, 255, 0.8);
        transform: translateX(4px);
    }
}

.comment-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 12px;
}

.comment-content {
    flex: 1;
}

.comment-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
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
    font-size: 14px;
    color: #333;
    line-height: 1.4;
    margin-bottom: 8px;
}

.comment-actions {
    display: flex;
    align-items: center;
    gap: 16px;
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
    font-size: 12px;
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
    padding: 8px;

    &:active {
        opacity: 0.7;
    }
}

.load-more-text {
    font-size: 14px;
    color: #667eea;
    font-weight: 500;
}

.recommend-section {
    padding: 20px;
}

.recommend-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
}

.recommend-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
}

.recommend-item {
    transition: all 0.3s ease;

    &:active {
        transform: scale(0.98);
    }
}

.recommend-image {
    width: 100%;
    height: 100px;
    border-radius: 12px;
    margin-bottom: 8px;
}

.recommend-text {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    margin-bottom: 4px;
    line-height: 1.3;
}

.recommend-info {
    font-size: 12px;
    color: #999;
}

.comment-input-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s ease;
}

.input-container {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 0 16px;
    position: relative;
}

.comment-input {
    flex: 1;
    height: 36px;
    font-size: 14px;
    color: #333;
    background: transparent;
    border: none;
    outline: none;
}

.emoji-btn {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:active {
        transform: scale(1.2);
    }
}

.emoji-icon {
    font-size: 18px;
}

.send-btn {
    background: #ccc;
    color: white;
    padding: 8px 16px;
    border-radius: 18px;
    transition: all 0.3s ease;

    &.active {
        background: linear-gradient(135deg, #667eea, #764ba2);
    }

    &:active {
        transform: scale(1.05);
    }
}

.send-text {
    font-size: 14px;
    font-weight: 500;
    color: white;
}

/* 字体图标样式 */
.iconfont {
    font-family: 'iconfont';
    font-size: 18px;
    color: #667eea;
}

/* 滚动条隐藏 */
::-webkit-scrollbar {
    display: none;
}
</style>
