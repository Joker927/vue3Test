/**
 * 关闭当前页面，返回上一页面或多级页面
 * 
 * @param {String} url: 需要跳转的应用内非 tabBar 的页面的路径
 * @param {String} animationType: 窗口显示的动画效果
 * @param {Number} animationDuration: 窗口动画持续时间，单位为 ms
 */
export const goBack = (delta = 1, animationType = 'pop-out', animationDuration = 300) => {
    let pages = getCurrentPages();

    if (pages.length < delta) {
        delta = pages.length - 1
    }
    if (pages.length == 1) {
        return
    }

    uni.navigateBack({
        delta,
        animationType,
        animationDuration,
        success: function (res) { },
        fail: function (e) { }
    })
}

//判断是否IOS浏览器场景
export const judgeIsIos = () => {
    let u = navigator.userAgent;
    // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 //android终端
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    return isIOS ? true : false;
}

export const debounce = (fn, t) => {
    let delay = t || 200;
    let timer = null;
    return function () {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, delay);
    };
}

export const deepCopy = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    const copy = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            copy[key] = deepCopy(obj[key]);
        }
    }
    return copy;
}