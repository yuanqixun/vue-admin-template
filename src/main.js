import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css
// vxetable
import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import {Vue2Storage} from 'vue2-storage'
import 'vxe-table/lib/index.css'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import { readAllFunction } from '@/utils/fd-reader'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI, { size: 'small', zIndex: 3000 })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.use(VXETable)
Vue.prototype.$XEUtils = XEUtils
Vue.use(Vue2Storage, {
  prefix: 'app_',
  driver: 'local',
  ttl: 60 * 60 * 24 * 1000 // 24 hours
})

/**
 * 关闭页签
 */
Vue.prototype.$closePage = function() {
  this.$store.dispatch('tagsView/delVisitedView', this.$route).then(() => {
    const latestView = this.$store.getters.visitedViews.slice(-1)[0]
    if (latestView) {
      this.$router.push(latestView.fullPath)
    }
  })
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  mounted() {
    readAllFunction(this)
  },
  render: h => h(App)
})
