/* eslint-disable no-undef */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
  ]
})

// 为路由对象 添加beforeEach前置路由守卫
router.beforeEach((to, from, next) => {
  // 用户访问登录页面直接放行
  if (to.path === '/login') return next()
  // 获取sessionStorage中保存的token
  const token = window.sessionStorage.getItem('token')
  // 用户访问其它页面没有token直接强制返回登录页面
  if (!token) return next('./login')
  next()
})

export default router
