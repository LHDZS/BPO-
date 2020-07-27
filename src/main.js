// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '../theme/index.css'
import echarts from 'echarts'
import axios from 'axios'
import Router from 'vue-router'
import {ReportBalance, Profits, Cashflow} from 'nga-report-sheet'
import moment from "vue-moment"
Vue.use(moment); //实例

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.prototype.$http = axios

Vue.prototype.$echarts = echarts

//全局修改默认配置
ElementUI.Dialog.props.closeOnClickModal.default=false;
console.info(ElementUI.Dialog);

Vue.use(ElementUI)

Vue.use(ReportBalance)

Vue.use(Profits)

Vue.use(Cashflow)

Vue.config.productionTip = false

const whiteList = ['/login'] // 免登录白名单

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) { // 验证是否需要登陆
    if (sessionStorage.getItem('xggsaamerchantsid')) { // 查询本地存储信息是否已经登陆
      next()
    } else {
      if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
        next()
      } else {
        return next({
          path: '/login' // 未登录则跳转至login页面
          // query: {redirect: to.fullPath} // 登陆成功后回到当前页面，这里传值给login页面，to.fullPath为当前点击的页面
        }) // 否则全部重定向到登录页
      }
    }
  } else {
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
