<template>
    <view class="register-container">
        <!-- 背景装饰元素 -->
        <view class="bg-decoration">
            <view class="floating-circle circle-1"></view>
            <view class="floating-circle circle-2"></view>
            <view class="floating-circle circle-3"></view>
            <view class="floating-circle circle-4"></view>
        </view>

        <!-- 主要内容区域 -->
        <view class="content-wrapper">
            <!-- Logo区域 -->
            <view class="logo-section">
                <view class="logo-circle">
                    <text class="logo-text">R</text>
                </view>
                <text class="app-title">创建账户</text>
                <text class="app-subtitle">填写信息开始您的旅程</text>
            </view>

            <!-- 注册表单 -->
            <view class="register-form">
                <!-- 用户名输入 -->
                <view class="input-group">
                    <view class="input-wrapper" :class="{ 'input-error': usernameError, 'input-focus': usernameFocused }">
                        <view class="input-icon">
                            <text class="icon-user">👤</text>
                        </view>
                        <input
                            class="input-field"
                            type="text"
                            placeholder="请输入用户名"
                            v-model="username"
                            @focus="handleUsernameFocus"
                            @blur="handleUsernameBlur"
                            @input="validateUsername"
                        />
                    </view>
                    <text v-if="usernameError" class="error-text">{{ usernameError }}</text>
                </view>

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

                <!-- 手机号输入 -->
                <view class="input-group">
                    <view class="input-wrapper" :class="{ 'input-error': phoneError, 'input-focus': phoneFocused }">
                        <view class="input-icon">
                            <text class="icon-phone">📱</text>
                        </view>
                        <input
                            class="input-field"
                            type="number"
                            placeholder="请输入手机号码"
                            v-model="phone"
                            @focus="handlePhoneFocus"
                            @blur="handlePhoneBlur"
                            @input="validatePhone"
                        />
                    </view>
                    <text v-if="phoneError" class="error-text">{{ phoneError }}</text>
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

                    <!-- 密码强度指示器 -->
                    <view v-if="password" class="password-strength">
                        <view class="strength-bar">
                            <view
                                class="strength-fill"
                                :class="'strength-' + passwordStrength.level"
                                :style="{ width: passwordStrength.width + '%' }"
                            ></view>
                        </view>
                        <text class="strength-text" :class="'strength-' + passwordStrength.level">
                            {{ passwordStrength.text }}
                        </text>
                    </view>
                </view>

                <!-- 确认密码输入 -->
                <view class="input-group">
                    <view class="input-wrapper" :class="{ 'input-error': confirmPasswordError, 'input-focus': confirmPasswordFocused }">
                        <view class="input-icon">
                            <text class="icon-confirm">🔐</text>
                        </view>
                        <input
                            class="input-field"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            placeholder="请确认密码"
                            v-model="confirmPassword"
                            @focus="handleConfirmPasswordFocus"
                            @blur="handleConfirmPasswordBlur"
                            @input="validateConfirmPassword"
                        />
                        <view class="toggle-password" @tap="toggleConfirmPassword">
                            <text class="toggle-icon">{{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}</text>
                        </view>
                    </view>
                    <text v-if="confirmPasswordError" class="error-text">{{ confirmPasswordError }}</text>
                </view>

                <!-- 用户协议 -->
                <view class="agreement-section">
                    <view class="checkbox-wrapper" @tap="toggleAgreement">
                        <view class="checkbox" :class="{ 'checkbox-checked': agreedToTerms }">
                            <text v-if="agreedToTerms" class="checkbox-icon">✓</text>
                        </view>
                        <text class="agreement-text">
                            我已阅读并同意
                            <text class="agreement-link" @tap.stop="showTerms">《用户协议》</text>
                            和
                            <text class="agreement-link" @tap.stop="showPrivacy">《隐私政策》</text>
                        </text>
                    </view>
                </view>

                <!-- 注册按钮 -->
                <button
                    class="register-button"
                    :class="{ 'button-loading': isLoading, 'button-disabled': !isFormValid }"
                    :disabled="!isFormValid || isLoading"
                    @tap="handleRegister"
                >
                    <text v-if="isLoading" class="loading-text">注册中...</text>
                    <text v-else class="button-text">创建账户</text>
                </button>

                <!-- 登录链接 -->
                <view class="login-section">
                    <text class="login-text">已有账户？</text>
                    <text class="login-link" @tap="handleLogin">立即登录</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import { createUser } from '@/services/user.js'
export default {
    name: 'RegisterPage',
    data() {
        return {
            username: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            usernameError: '',
            emailError: '',
            phoneError: '',
            passwordError: '',
            confirmPasswordError: '',
            usernameFocused: false,
            emailFocused: false,
            phoneFocused: false,
            passwordFocused: false,
            confirmPasswordFocused: false,
            showPassword: false,
            showConfirmPassword: false,
            agreedToTerms: false,
            isLoading: false,
        }
    },
    computed: {
        isFormValid() {
            return (
                this.username &&
                this.email &&
                this.phone &&
                this.password &&
                this.confirmPassword &&
                !this.usernameError &&
                !this.emailError &&
                !this.phoneError &&
                !this.passwordError &&
                !this.confirmPasswordError &&
                this.agreedToTerms
            )
        },

        passwordStrength() {
            if (!this.password) return { level: 'weak', width: 0, text: '' }

            let score = 0
            let text = ''

            // 长度检查
            if (this.password.length >= 8) score += 25
            if (this.password.length >= 12) score += 25

            // 复杂度检查
            if (/[a-z]/.test(this.password)) score += 12.5
            if (/[A-Z]/.test(this.password)) score += 12.5
            if (/[0-9]/.test(this.password)) score += 12.5
            if (/[^A-Za-z0-9]/.test(this.password)) score += 12.5

            if (score < 30) {
                return { level: 'weak', width: score, text: '弱' }
            } else if (score < 60) {
                return { level: 'medium', width: score, text: '中等' }
            } else if (score < 90) {
                return { level: 'strong', width: score, text: '强' }
            } else {
                return { level: 'very-strong', width: 100, text: '很强' }
            }
        },
    },
    methods: {
        // 用户名验证
        validateUsername() {
            if (!this.username) {
                this.usernameError = '请输入用户名'
            } else if (this.username.length < 3) {
                this.usernameError = '用户名至少3个字符'
            } else if (this.username.length > 20) {
                this.usernameError = '用户名不能超过20个字符'
            } else if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(this.username)) {
                this.usernameError = '用户名只能包含字母、数字、下划线和中文'
            } else {
                this.usernameError = ''
            }
        },

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

        // 手机号验证
        validatePhone() {
            const phoneRegex = /^1[3-9]\d{9}$/
            if (!this.phone) {
                this.phoneError = '请输入手机号码'
            } else if (!phoneRegex.test(this.phone)) {
                this.phoneError = '请输入有效的手机号码'
            } else {
                this.phoneError = ''
            }
        },

        // 密码验证
        validatePassword() {
            if (!this.password) {
                this.passwordError = '请输入密码'
            } else if (this.password.length < 6) {
                this.passwordError = '密码长度至少6位'
            } else if (this.password.length > 50) {
                this.passwordError = '密码长度不能超过50位'
            } else {
                this.passwordError = ''
            }

            // 如果确认密码已输入，重新验证确认密码
            if (this.confirmPassword) {
                this.validateConfirmPassword()
            }
        },

        // 确认密码验证
        validateConfirmPassword() {
            if (!this.confirmPassword) {
                this.confirmPasswordError = '请确认密码'
            } else if (this.password !== this.confirmPassword) {
                this.confirmPasswordError = '两次输入的密码不一致'
            } else {
                this.confirmPasswordError = ''
            }
        },

        // 焦点事件处理
        handleUsernameFocus() {
            this.usernameFocused = true
        },

        handleUsernameBlur() {
            this.usernameFocused = false
            this.validateUsername()
        },

        handleEmailFocus() {
            this.emailFocused = true
        },

        handleEmailBlur() {
            this.emailFocused = false
            this.validateEmail()
        },

        handlePhoneFocus() {
            this.phoneFocused = true
        },

        handlePhoneBlur() {
            this.phoneFocused = false
            this.validatePhone()
        },

        handlePasswordFocus() {
            this.passwordFocused = true
        },

        handlePasswordBlur() {
            this.passwordFocused = false
            this.validatePassword()
        },

        handleConfirmPasswordFocus() {
            this.confirmPasswordFocused = true
        },

        handleConfirmPasswordBlur() {
            this.confirmPasswordFocused = false
            this.validateConfirmPassword()
        },

        // 切换密码显示
        togglePassword() {
            this.showPassword = !this.showPassword
        },

        toggleConfirmPassword() {
            this.showConfirmPassword = !this.showConfirmPassword
        },

        // 切换用户协议同意状态
        toggleAgreement() {
            this.agreedToTerms = !this.agreedToTerms
        },

        // 显示用户协议
        showTerms() {
            uni.showModal({
                title: '用户协议',
                content: '这里是用户协议的内容...',
                showCancel: false,
            })
        },

        // 显示隐私政策
        showPrivacy() {
            uni.showModal({
                title: '隐私政策',
                content: '这里是隐私政策的内容...',
                showCancel: false,
            })
        },

        // 注册处理
        async handleRegister() {
            if (!this.isFormValid) {
                uni.showToast({
                    title: '请填写完整信息',
                    icon: 'none',
                    duration: 2000,
                })
                return
            }

            if (this.agreedToTerms === false) {
                uni.showToast({
                    title: '请同意用户协议和隐私政策',
                    icon: 'none',
                    duration: 2000,
                })
                return
            }

            this.isLoading = true

            try {
                // 模拟注册API调用
                await createUser({
                    userName: this.username,
                    email: this.email,
                    phone: this.phone,
                    password: this.password,
                })

                // 注册成功
                uni.showToast({
                    title: '注册成功',
                    icon: 'success',
                    duration: 2000,
                })

                // 跳转到登录页面
                setTimeout(() => {
                    uni.redirectTo({
                        url: '/pages/login/login',
                    })
                }, 2000)
            } catch (error) {
                console.log('🚀 ~ handleRegister ~ error:', error)
            } finally {
                this.isLoading = false
            }
        },

        // 模拟注册API
        mockRegister() {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // 模拟邮箱已存在的情况
                    if (this.email === 'existing@example.com') {
                        reject(new Error('该邮箱已被注册'))
                    } else {
                        resolve({ success: true })
                    }
                }, 2000)
            })
        },

        // 跳转到登录页面
        handleLogin() {
            uni.navigateTo({
                url: '/pages/login/login',
            })
        },
    },
}
</script>

<style scoped>
.register-container {
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
    top: 8%;
    left: 10%;
}

.circle-2 {
    width: 60rpx;
    height: 60rpx;
    top: 15%;
    right: 15%;
    animation-delay: -2s;
}

.circle-3 {
    width: 40rpx;
    height: 40rpx;
    bottom: 25%;
    left: 20%;
    animation-delay: -4s;
}

.circle-4 {
    width: 50rpx;
    height: 50rpx;
    bottom: 15%;
    right: 25%;
    animation-delay: -1s;
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
    padding: 80rpx 60rpx 60rpx;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Logo区域 */
.logo-section {
    text-align: center;
    margin-bottom: 60rpx;
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

/* 注册表单 */
.register-form {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 32rpx;
    padding: 60rpx 40rpx;
    backdrop-filter: blur(20rpx);
    border: 1rpx solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);
}

.input-group {
    margin-bottom: 32rpx;
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

/* 密码强度指示器 */
.password-strength {
    margin-top: 16rpx;
    padding-left: 20rpx;
}

.strength-bar {
    width: 100%;
    height: 6rpx;
    background: #e5e7eb;
    border-radius: 3rpx;
    overflow: hidden;
    margin-bottom: 8rpx;
}

.strength-fill {
    height: 100%;
    transition: all 0.3s ease;
    border-radius: 3rpx;
}

.strength-weak {
    background: #ef4444;
}
.strength-medium {
    background: #f59e0b;
}
.strength-strong {
    background: #10b981;
}
.strength-very-strong {
    background: #059669;
}

.strength-text {
    font-size: 24rpx;
    font-weight: 500;
}

/* 用户协议 */
.agreement-section {
    margin-bottom: 40rpx;
}

.checkbox-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
}

.checkbox {
    width: 36rpx;
    height: 36rpx;
    border: 2rpx solid #d1d5db;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
    margin-top: 2rpx;
}

.checkbox-checked {
    background: #667eea;
    border-color: #667eea;
}

.checkbox-icon {
    color: white;
    font-size: 20rpx;
    font-weight: bold;
}

.agreement-text {
    font-size: 28rpx;
    color: #6b7280;
    line-height: 1.5;
    flex: 1;
}

.agreement-link {
    color: #667eea;
    font-weight: 500;
}

/* 注册按钮 */
.register-button {
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

.register-button:not(.button-disabled):active {
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

/* 登录区域 */
.login-section {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8rpx;
}

.login-text {
    color: #6b7280;
    font-size: 28rpx;
}

.login-link {
    color: #667eea;
    font-size: 28rpx;
    font-weight: 600;
}
</style>
