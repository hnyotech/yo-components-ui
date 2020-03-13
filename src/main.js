// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
/* ui plguin */
import ElementUI from 'element-ui'
import Auth from '@/auth'
import axios from 'axios'
// 导入字体图标
import '@/assets/font_system/iconfont.css'
// 引用element-ui
import 'element-ui/lib/theme-chalk/index.css'
// 导入阻止elementUIselect重复点击崩溃的js
import visibleChange from '@/assets/js/visibleChange.js'
Vue.prototype.visibleChange = visibleChange
axios.defaults.baseURL = process.env.API
Vue.prototype.$http = Vue.http = axios
//初始化elementui
Vue.use(ElementUI, {})
Vue.use(Auth)
import '@/assets/css/theme.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
