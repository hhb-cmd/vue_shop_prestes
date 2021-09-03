/* eslint-disable no-undef */
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../views/Welcome.vue'
import Users from '../views/users/Users.vue'
import Rights from '../views/power/Rights.vue'
import Roles from '../views/power/Roles.vue'
import Categories from '../views/goods/Categories.vue'
import Params from '../views/goods/Params.vue'
import GoodsList from '../views/goods/List.vue'
import Add from '../views/goods/Add.vue'
import Orders from '../views/orders/Orders.vue'
import Report from '../views/report/Report.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Categories },
        { path: '/params', component: Params },
        { path: '/goods', component: GoodsList },
        { path: '/add', component: Add },
        { path: '/orders', component: Orders },
        { path: '/reports', component: Report }
      ]
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
