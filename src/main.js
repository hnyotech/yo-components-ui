// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
/* ui plguin */
import ElementUI from 'element-ui'
// 引用element-ui
import 'element-ui/lib/theme-chalk/index.css'
//初始化elementui
Vue.use(ElementUI, {})
import '@/assets/css/theme.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
