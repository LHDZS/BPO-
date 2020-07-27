import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/home'
import Login from '@/pages/login/login'
// 订单
import registered from '@/pages/order/registered'
// 交易
import batchMoney from '@/pages/transaction/batchMoney'
import transactionList from '@/pages/transaction/transactionList'
// 个体户
import userAll from '@/pages/transaction/userAll'
// 财务 报表
import reportForms from '@/pages/financing/reportForms'
// 发票
import invoiceApply from '@/pages/financing/invoiceApply'
import invoiceList from '@/pages/financing/invoiceList'
import applyList from '@/pages/financing/applyList'
import information from '@/pages/financing/information'
import address from '@/pages/financing/address'


Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'Home',
    //   meta: {
    //     requireAuth: true // 配置此条，进入页面前判断是否需要登陆
    //   },
    //   component: Home
    // },
    {
      path: '/',
      name: 'registered',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: registered
    },
    // 发票
    {
      path: '/invoiceApply',
      name: 'invoiceApply',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: invoiceApply
    },
    {
      path: '/invoiceList',
      name: 'invoiceList',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: invoiceList
    },
    {
      path: '/address',
      name: 'address',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: address
    },
    {
      path: '/information',
      name: 'information',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: information
    },
    {
      path: '/applyList',
      name: 'applyList',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: applyList
    },
    // 报表
    {
      path: '/reportForms',
      name: 'reportForms',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: reportForms
    },
    {
      path: '/userAll',
      name: 'userAll',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: userAll
    },
    {
      path: '/registered',
      name: 'registered',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: registered
    },
    {
      path: '/batchMoney',
      name: 'batchMoney',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: batchMoney
    },
    {
      path: '/transactionList',
      name: 'transactionList',
      meta: {
        requireAuth: true // 配置此条，进入页面前判断是否需要登陆
      },
      component: transactionList
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
