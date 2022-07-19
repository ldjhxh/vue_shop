import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式表
import '@/assets/css/global.css'
// 导入字体图标
import '@/assets/fonts/iconfont.css'

// import axios from 'axios'

import request from '@/utils/request'
// 配置请求的根路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

Vue.prototype.$API = request

import { Form, FormItem, Input, Button, Message, Container, Header, Aside, Main, Menu, MenuItem, Submenu, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox } from 'element-ui'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
