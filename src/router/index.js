import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login')
  },
  {
    path: '/home',
    component: () => import('@/views/Home'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('@/views/Welcome')
      },
      {
        path: '/users',
        component: () => import('@/views/Users')
      },
      {
        path: '/rights',
        component: () => import('@/views/Power/Rights')
      },
      {
        path: '/roles',
        component: () => import('@/views/Power/Roles')
      }
    ]
  }


]

const router = new VueRouter({
  routes
})

// 配置路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路径跳转进来
  // next 放行
  // 用户访问的是登录页
  if (to.path === '/login') return next()

  // 获取token
  const token = sessionStorage.getItem('token')

  //  token是否存在？
  if (!token) return next('/login')
  next()

})

export default router
