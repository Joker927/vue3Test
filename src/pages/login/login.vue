<template>
    <view class="login-container">
        <!-- 背景装饰元素 -->
        <view class="bg-decoration">
            <view class="floating-circle circle-1"></view>
            <view class="floating-circle circle-2"></view>
            <view class="floating-circle circle-3"></view>
        </view>

        <!-- 主要内容区域 -->
        <view class="content-wrapper">
            <!-- Logo区域 -->
            <view class="logo-section">
                <view class="logo-circle">
                    <text class="logo-text">L</text>
                </view>
                <text class="app-title">欢迎回来</text>
                <text class="app-subtitle">登录您的账户继续使用</text>
            </view>

            <!-- 登录表单 -->
            <view class="login-form">
                <!-- 邮箱输入 -->
                <view class="input-group">
                    <view class="input-wrapper" :class="{ 'input-error': emailError, 'input-focus': emailFocused }">
                        <view class="input-icon">
                            <text class="icon-email">📧</text>
                        </view>
                        <input
                            class="input-field"
                            type="text"
                            placeholder="请输入邮箱地址"
                            v-model="email"
                            @focus="handleEmailFocus"
                            @blur="handleEmailBlur"
                            @input="validateEmail"
                        />
                    </view>
                    <text v-if="emailError" class="error-text">{{ emailError }}</text>
                </view>

                <!-- 密码输入 -->
                <view class="input-group">
                    <view class="input-wrapper" :class="{ 'input-error': passwordError, 'input-focus': passwordFocused }">
                        <view class="input-icon">
                            <text class="icon-password">🔒</text>
                        </view>
                        <input
                            class="input-field"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="请输入密码"
                            v-model="password"
                            @focus="handlePasswordFocus"
                            @blur="handlePasswordBlur"
                            @input="validatePassword"
                        />
                        <view class="toggle-password" @tap="togglePassword">
                            <text class="toggle-icon">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</text>
                        </view>
                    </view>
                    <text v-if="passwordError" class="error-text">{{ passwordError }}</text>
                </view>

                <!-- 忘记密码 -->
                <view class="forgot-password">
                    <text class="forgot-text" @tap="handleForgotPassword">忘记密码？</text>
                </view>

                <!-- 登录按钮 -->
                <button
                    class="login-button"
                    :class="{ 'button-loading': isLoading, 'button-disabled': !isFormValid }"
                    :disabled="!isFormValid || isLoading"
                    @tap="handleLogin"
                >
                    <text v-if="isLoading" class="loading-text">登录中...</text>
                    <text v-else class="button-text">登录</text>
                </button>

                <!-- 注册链接 -->
                <view class="register-section">
                    <text class="register-text">还没有账户？</text>
                    <text class="register-link" @tap="handleRegister">立即注册</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { userLogin } from '@/services/user.js'
export default {
    name: 'LoginPage',
    data() {
        return {
            email: '',
            password: '',
            emailError: '',
            passwordError: '',
            emailFocused: false,
            passwordFocused: false,
            showPassword: false,
            isLoading: false,
        }
    },
    computed: {
        isFormValid() {
            return this.email && this.password && !this.emailError && !this.passwordError
        },
    },
    methods: {
        // 邮箱验证
        validateEmail() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!this.email) {
                this.emailError = '请输入邮箱地址'
            } else if (!emailRegex.test(this.email)) {
                this.emailError = '请输入有效的邮箱地址'
            } else {
                this.emailError = ''
            }
        },

        // 密码验证
        validatePassword() {
            if (!this.password) {
                this.passwordError = '请输入密码'
            } else if (this.password.length < 6) {
                this.passwordError = '密码长度至少6位'
            } else {
                this.passwordError = ''
            }
        },

        // 邮箱输入框焦点事件
        handleEmailFocus() {
            this.emailFocused = true
        },

        handleEmailBlur() {
            this.emailFocused = false
            this.validateEmail()
        },

        // 密码输入框焦点事件
        handlePasswordFocus() {
            this.passwordFocused = true
        },

        handlePasswordBlur() {
            this.passwordFocused = false
            this.validatePassword()
        },

        // 切换密码显示
        togglePassword() {
            this.showPassword = !this.showPassword
        },

        // 登录处理
        async handleLogin() {
            if (!this.isFormValid) return

            this.isLoading = true

            try {
                let { data } = await userLogin({
                    email: this.email,
                    password: this.password,
                })
                console.log('🚀 ~ handleLogin ~ data:', data)

                uni.setStorageSync('token', data.accessToken)
                // 登录成功
                uni.showToast({
                    title: '登录成功',
                    icon: 'none',
                    duration: 2000,
                })
                setTimeout(() => {
                    uni.navigateTo({
                        url: '/pages/index/index',
                    })
                }, 2000)
            } catch (error) {
                uni.showToast({
                    title: error.message || '登录失败',
                    icon: 'none',
                    duration: 2000,
                })
            } finally {
                this.isLoading = false
            }
        },

        // 模拟登录API
        mockLogin() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (this.email === 'test@example.com' && this.password === '123456') {
                        resolve({ success: true })
                    } else {
                        reject(new Error('邮箱或密码错误'))
                    }
                }, 2000)
            })
        },

        // 忘记密码
        handleForgotPassword() {
            uni.showToast({
                title: '跳转到忘记密码页面',
                icon: 'none',
            })
        },

        // 注册
        handleRegister() {
            uni.navigateTo({
                url: '/pages/login/register',
            })
        },
    },
}
</script>

<style scoped>
.login-container {
    width: 100%;
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: relative;
    overflow: hidden;
}

/* 背景装饰 */
.bg-decoration {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.floating-circle {
    position: absolute;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    animation: floating 6s ease-in-out infinite;
}

.circle-1 {
    width: 80rpx;
    height: 80rpx;
    top: 10%;
    left: 10%;
}

.circle-2 {
    width: 60rpx;
    height: 60rpx;
    top: 20%;
    right: 15%;
    animation-delay: -2s;
}

.circle-3 {
    width: 40rpx;
    height: 40rpx;
    bottom: 30%;
    left: 20%;
    animation-delay: -4s;
}

@keyframes floating {
    0%,
    100% {
        transform: translateY(0px);
    }
    50% {
        transform: translateY(-20rpx);
    }
}

/* 内容区域 */
.content-wrapper {
    position: relative;
    z-index: 1;
    padding: 100rpx 60rpx 60rpx;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Logo区域 */
.logo-section {
    text-align: center;
    margin-bottom: 80rpx;
}

.logo-circle {
    width: 120rpx;
    height: 120rpx;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    margin: 0 auto 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(20rpx);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
}

.logo-text {
    font-size: 48rpx;
    font-weight: 600;
    color: white;
}

.app-title {
    display: block;
    font-size: 48rpx;
    font-weight: 700;
    color: white;
    margin-bottom: 16rpx;
}

.app-subtitle {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
}

/* 登录表单 */
.login-form {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 32rpx;
    padding: 60rpx 40rpx;
    backdrop-filter: blur(20rpx);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.input-group {
    margin-bottom: 40rpx;
}

.input-wrapper {
    position: relative;
    background: #f8fafc;
    border-radius: 16rpx;
    border: 2rpx solid transparent;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    height: 96rpx;
}

.input-wrapper.input-focus {
    border-color: #667eea;
    background: white;
    transform: translateY(-2rpx);
    box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.15);
}

.input-wrapper.input-error {
    border-color: #ef4444;
    background: #fef2f2;
}

.input-icon {
    margin-right: 20rpx;
    font-size: 32rpx;
}

.input-field {
    flex: 1;
    height: 100%;
    font-size: 32rpx;
    color: #1f2937;
    background: transparent;
    border: none;
    outline: none;
}

.input-field::placeholder {
    color: #9ca3af;
}

.toggle-password {
    padding: 10rpx;
    font-size: 28rpx;
    color: #6b7280;
}

.error-text {
    color: #ef4444;
    font-size: 24rpx;
    margin-top: 12rpx;
    padding-left: 20rpx;
}

/* 忘记密码 */
.forgot-password {
    text-align: right;
    margin-bottom: 40rpx;
}

.forgot-text {
    color: #667eea;
    font-size: 28rpx;
    font-weight: 500;
}

/* 登录按钮 */
.login-button {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16rpx;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 40rpx;
    transition: all 0.3s ease;
    box-shadow: 0 8rpx 25rpx rgba(102, 126, 234, 0.3);
}

.login-button:not(.button-disabled):active {
    transform: translateY(-4rpx);
    box-shadow: 0 12rpx 35rpx rgba(102, 126, 234, 0.4);
}

.button-disabled {
    opacity: 0.6;
    transform: none !important;
}

.button-loading {
    opacity: 0.8;
}

.button-text,
.loading-text {
    color: white;
    font-size: 32rpx;
    font-weight: 600;
}

/* 注册区域 */
.register-section {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8rpx;
}

.register-text {
    color: #6b7280;
    font-size: 28rpx;
}

.register-link {
    color: #667eea;
    font-size: 28rpx;
    font-weight: 600;
}
</style>
