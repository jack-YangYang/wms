import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'

import resetMessage from '@/utils/elementUiApi'
Vue.prototype.$message = resetMessage

import { scrollTop } from '@/utils/common'
Vue.prototype.$scrollTop = scrollTop

import Print from 'vue-print-nb'
Vue.use(Print)

import { getMenuId } from '@/utils/menuName'
Vue.prototype.$getMenuId = getMenuId;

import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters

Vue.use(Element, {
    size: Cookies.get('size') || 'medium' // set element-ui default size
})

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})