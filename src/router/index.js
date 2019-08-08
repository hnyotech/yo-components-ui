import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
import exampleBox from '@/examples/index/index'
const RedirectSystem = resolve => require(['@/packages/YoMenu/Src/YoRedirect.vue'], resolve);
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'exampleBox',
      component: exampleBox
    },{
      //跳转到其他平台
      path: '/redirectsystem/:redirect_url',
      name: 'redirectsystem',
      component: RedirectSystem
    }
  ]
})
