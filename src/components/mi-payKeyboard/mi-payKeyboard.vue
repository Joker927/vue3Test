<template>
    <view class="keyboard-content">
        <view class="content_">
            <view class="title">{{ title }}</view>
            <view class="input-content">
                <view class="input_">
                    <view v-for="(item, idx) in inputArr" :key="idx" :class="idx == actIdx ? 'active' : ''">
                        <view v-if="item === '·'" class="dot"></view>
                        <text v-else></text>
                    </view>
                </view>
            </view>

            <view class="board-content">
                <view class="board">
                    <view class="key" hover-class="hoverStyle" @tap="inputNum(item.id)" :class="{ small: item.id === 'cancel' || item.id === 'del' }" v-for="item in boardArr" :key="item.id">
                        <image class="backspace" v-if="item.id === 'del'" src="./exit.png" mode=""></image>
                        <text v-else>{{ item.text }}</text>
                    </view>
                </view>
            </view>

            <view style="height: 80rpx" v-if="isIos"></view>
        </view>
    </view>
</template>

<script>
export default {
    /**
     * 安全键盘
     * @param {String} title 标题
     * @param {Boolean} isShuffleBoard 是否打乱数字键盘顺序
     */
    props: {
        title: {
            type: String,
            default: '安全键盘',
        },
        isShuffleBoard: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isIos: false,
            inputArr: ['', '', '', '', '', ''],
            passwordInput: '',
            actIdx: 0,
            passwordError: false,
            boardArr: [
                { id: '1', text: '1' },
                { id: '2', text: '2' },
                { id: '3', text: '3' },
                { id: '4', text: '4' },
                { id: '5', text: '5' },
                { id: '6', text: '6' },
                { id: '7', text: '7' },
                { id: '8', text: '8' },
                { id: '9', text: '9' },
                { id: 'cancel', text: '取消' },
                { id: '0', text: '0' },
                { id: 'del', text: 'del' },
            ],
        }
    },
    mounted() {
        const IS_JIAOWOBAN = typeof android !== 'undefined' || typeof innoPlus !== 'undefined'
        if (IS_JIAOWOBAN) {
            if (typeof innoPlus !== 'undefined') {
                this.isIos = true
            }
        }

        if (this.isShuffleBoard) this.shuffleBoard()
    },
    methods: {
        // 打乱数字键盘顺序
        shuffleBoard() {
            let numberKeys = this.boardArr.filter(item => !isNaN(item.id))
            for (let i = numberKeys.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[numberKeys[i], numberKeys[j]] = [numberKeys[j], numberKeys[i]]
            }
            this.boardArr = [...numberKeys.slice(0, 9), { id: 'cancel', text: '取消' }, numberKeys[9], { id: 'del', text: 'del' }]
        },
        // 输入密码
        inputNum(id) {
            if (id === 'del') {
                // 点击[删除]按钮
                this.del()
                return
            }
            if (id === 'cancel') {
                // 点击[取消]按钮
                this.cancel()
                return
            }
            if (this.passwordInput.length > 11) {
                // 6位密码输入完毕
                return
            }

            let passwordInput = this.passwordInput
            this.passwordInput = passwordInput + id + '|'

            this.initPass()

            if (this.passwordInput.length === 12) {
                // 输入完毕
                this.testPassword()
            }
        },
        // 删除一位
        del() {
            this.passwordInput = this.passwordInput.substring(0, this.passwordInput.length - 2)
            this.initPass()
        },
        // 取消 可退出输入
        cancel() {
            this.inputArr = ['', '', '', '', '', '']
            this.passwordInput = ''
            this.$emit('close')
        },

        initPass() {
            let arr = this.passwordInput.split('|')
            arr.pop()
            this.actIdx = arr.length
            let arr_ = []
            for (let i = 0; i < 6; i++) {
                if (i < arr.length) {
                    arr_.push('·')
                } else {
                    arr_.push('')
                }
            }
            this.inputArr = arr_
        },

        // 输入完毕之后 验证密码是否正确
        testPassword() {
            let arr = this.passwordInput.split('|')
            arr.pop()
            let passStr = arr.join('')

            // 测试数据  在此处可添加个人的业务代码
            var isTrue = true
            if (isTrue) {
                this.$emit('success', passStr)
                this.passwordError = false
                this.inputArr = ['', '', '', '', '', '']
                this.passwordInput = ''
            } else {
                this.passwordError = true
                this.inputArr = ['', '', '', '', '', '']
                this.passwordInput = ''
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.hoverStyle {
    background: #e5e5e5;
}
.keyboard-content {
    background: rgba($color: #000000, $alpha: 0.7);
    height: 100vh;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: column;
    z-index: 999;
    .content_ {
        background: #ffffff;
        width: 100%;
        border-radius: 24rpx 24rpx 0rpx 0rpx;
        .title {
            text-align: center;
            padding: 40rpx 0;
            font-weight: bold;
            // border-bottom: 1px solid #dddddd;
            background: #fff;
            color: #1f2324;
            font-size: 30rpx;
            letter-spacing: 1rpx;
            border-radius: 24rpx 24rpx 0rpx 0rpx;
        }
        .password-error {
            background: #f7f7f7;
            padding: 10rpx 0;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #f00;
            font-size: 12rpx;
        }
        .input-content {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: #fff;
            .input_ {
                display: flex;
                justify-content: center;
                align-items: center;
                background: #ffffff;
                .active {
                    border: 2rpx solid #3489ff;
                }
                > view {
                    box-sizing: border-box;
                    width: 94rpx;
                    height: 94rpx;
                    border: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: #f8f8f8;
                    margin-right: 24rpx;
                    border-radius: 12rpx;
                    &:last-child {
                        margin-right: none;
                    }
                    .dot {
                        width: 20rpx;
                        height: 20rpx;
                        background: #000000;
                        border-radius: 50%;
                    }
                }
            }
        }
        .forget {
            color: #666;
            font-size: 24rpx;
            background: #fff;
            padding: 20rpx 40rpx;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
        .board-content {
            margin-top: 10px;
            .title_ {
                display: flex;
                justify-content: center;
                align-items: center;
                color: #222;
                font-size: 20rpx;
                padding: 10rpx 0;
                > image {
                    width: 22rpx;
                    height: 26rpx;
                    margin-right: 8rpx;
                }
            }
            .board {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-wrap: wrap;
                border-top: 1px solid #f2f2f2;
                .key {
                    height: 110rpx;
                    flex: 33%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid #f2f2f2;
                    color: #222;
                    font-size: 50rpx;
                    border-left: none;
                    border-top: none;
                }
                .small {
                    font-size: 34rpx;
                    letter-spacing: 2rpx;
                    background-color: #f7f7f7;
                    color: #686868;
                }
            }
        }
        .backspace {
            width: 45rpx;
            height: 33rpx;
        }
    }
}
</style>
