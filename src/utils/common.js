import Vue from 'vue'
import resetMessage from './elementUiApi'
import {
    Loading
} from 'element-ui'
let loadingInstance
let timeout = null;
export const debounce = (fn, wait) => {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn, wait);
};
/* 重置 */
export const clearObjValue = (obj) => {
    Object.keys(obj).forEach(key => obj[key] = '')
}
export const getMenuID = path => {
    const id = JSON.parse(sessionStorage.getItem('munuIdList'))[path]
    return {
        id
    }
}
/**
 * 
 * @param {*} obj 需要清除值得对象
 * @param {*} keyList 不需要清空的键值
 */

export const clearSearch = (obj, keyList = []) => {
    for (let key in obj) {
        if (!keyList.includes(key)) {
            Array.isArray(obj[key]) ? obj[key] = [] : obj[key] = ''
        }
    }
}
// 下载文件流 
/**
 * @param data 后台返回的文件流
 * @param name 自定已文件名
 */
export const getDateString = (value = undefined) => {
    let date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    const d = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
    const h = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
    const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
    const s = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
    if (value) {
        return `${value}${y}${m}${d}${h}${min}${s}`
    }
    return `${y}-${m}-${d} ${h}:${min}:${s}`
}
export const dateFormat = (dateArray, type = 1) => {
    if (typeof dateArray !== 'array') {
      let time = new Date(dateArray)
      const sy = time.getFullYear()
      const sm = time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : time.getMonth() + 1
      const sd = time.getDate() < 10 ? `0${time.getDate()}` : time.getDate()
      const sh = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours()
      const smin = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()
      const sec = time.getSeconds() < 10 ? `0${time.getSeconds()}` : time.getSeconds()
      if (type === 2) {
          return `${sy}-${sm}-${sd}`
      }
      return `${sy}-${sm}-${sd} ${sh}:${smin}:${sec}`
    }
    else {
      const startTime = new Date(dateArray[0])
      const endTime = new Date(dateArray[1])
      const sy = startTime.getFullYear()
      const sm = startTime.getMonth() + 1 < 10 ? `0${startTime.getMonth() + 1}` : startTime.getMonth() + 1
      const sd = startTime.getDate() < 10 ? `0${startTime.getDate()}` : startTime.getDate()
      const ey = endTime.getFullYear()
      const em = endTime.getMonth() + 1 < 10 ? `0${endTime.getMonth() + 1}` : endTime.getMonth() + 1
      const ed = endTime.getDate() < 10 ? `0${endTime.getDate()}` : endTime.getDate()
      return `${sy}-${sm}-${sd}-${ey}-${em}-${ed}`
    }

}
export const downlaod = (data, name) => {
    const dom = document.createElement('a') // 隐藏的a标签，href为输出流
    const blob = new Blob([data], {
        type: 'application/vnd.ms-excel'
    }) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    const url = window.URL.createObjectURL(blob) // 生成一个Blob对象
    dom.style.display = 'none'
    dom.href = url
    document.body.appendChild(dom)
    dom.setAttribute('download', name) // 指示浏览器下载url,而不是导航到它
    dom.click()
    document.body.removeChild(dom)
    // 手动释放创建的URL对象所占内存
    URL.revokeObjectURL(url)
}
export const loading = () => {
    loadingInstance = Loading.service({
        fullscreen: true,
        text: '拼命加载中',
        spinner: 'el-icon-loading',
        target: '.main-container'
    })
}
export const loadingClose = () => {
    loadingInstance.close()
}
/** 
    @param type 当前弹框的类型
    @param title 当前提示标题文字
    @param msg 提示的信息
    @param success 成功的回调函数
    @param calcel 取消的回调函数
*/
export const scrollTop = () => {
    if (window.document.querySelector('.el-table__body-wrapper')) {
        if (window.document.querySelector('.el-table__body-wrapper').scrollTop) {
            window.document.querySelector('.el-table__body-wrapper').scrollTop = 0;
        }
    }
    if (document.getElementsByClassName('router_view_box')[0]) {
        if (document.getElementsByClassName('router_view_box')[0].scrollTop) {
            document.getElementsByClassName('router_view_box')[0].scrollTop = 0 // 让滚动条回到顶部
        }
    }
}
// export const notify = (title, message, type="success") => {
//     Vue.prototype.$notify({
//         title,
//         message,
//         type,
//         duration: 3000
//     })
// }
export const confirmMsg = (type, title, msg, success, cancel) => {
    Vue.prototype.$confirm(msg, title, {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type
        })
        .then(() => {
            if (typeof success == 'function') {
                success();
            }
        })
        .catch(() => {
            if (typeof cancel == 'function') {
                cancel();
            }
        });
}
/** 
    @param type 当前message的类型 warning success info error
    @param title 当前提示文字
*/
export const message = (type, message, duration = 3000) => {
    resetMessage({
        type,
        message,
        duration
    })
}
export const promptMessage = (res) => {
    const {
        data: {
            errorInfo,
            error,
            success,
            total
        }
    } = res
    let errorMsg = errorInfo.map(item => item.msg).join()
    let msg = `总共导入${total}条数据，成功${success}条,失败${error}条`
    if (!success) {
        message('error', msg + ' ' + errorMsg)
        return
    }
    if (success < total) {
        message('warning', msg + ' ' + errorMsg)
        return
    }
    message('success', msg)
}
export const voicePlay = function (text) {
    var msg = new SpeechSynthesisUtterance()
    msg.rate = 1.5 //播放语速
    msg.pitch = 100 //音调高低
    msg.text = text
    msg.volume = 1 //播放音量
    window.speechSynthesis.speak(msg)
}
export function formatDecimal(num, decimal) {
    num = num.toString()
    let index = num.indexOf('.')
    if (index !== -1) {
        num = num.substring(0, decimal + index + 1)
    } else {
        num = num.substring(0)
    }
    return parseFloat(num).toFixed(decimal)
}
export const setTime = time => {
    if (!time) return ''
    let date = new Date(time[1])
    date.setHours(23)
    date.setMinutes(59)
    date.setSeconds(59)
    return dateFormat(date)
}