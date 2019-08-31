import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router.js'
import VueResource from 'vue-resource'
import Moment from 'moment'

// 安装 ElementUI（ui）
Vue.use(ElementUI)

// 安装 路由（url）
Vue.use(VueRouter)

// 绑定 vue-resource（ajax）
Vue.use(VueResource)

import { message } from "element-ui";

// 绑定 moment 进行时间格式化 ✔
Vue.prototype.$moment = Moment;//赋值使用

// 如果我们通过全局配置了，请求的数据接口 根域名，则 ，在每次单独发起 http 请求的时候，请求的 url 路径，应该以相对路径开头，前面不能带 /  ，否则 不会启用根路径做拼接；
Vue.http.options.root = 'http://127.0.0.1:8080/';

// 全局启用 emulateJSON 选项:如果Web服务器无法处理编码为application/json的请求，你可以启用emulateJSON选项。
// Vue.http.options.emulateJSON = true;

// Vue.http.options.xhr = { withCredentials: true }
Vue.http.interceptors.push((request, next) => {
  // 请求发送前的处理逻辑
  let token = sessionStorage.getItem('STORAGE_TOKEN');
  if (token) {
    //如果请求时TOKEN存在,就为每次请求的headers中设置好TOKEN,后台根据headers中的TOKEN判断是否放行
    request.headers.set('Authorization', token);
  }

  next((response) => {
    // 请求发送后的处理逻辑
    // 根据请求的状态，response参数会返回给successCallback或errorCallback
    if (response.ok) {
      // 注意： 通过 $http 获取到的数据，都在 result.body 中放着
      var body = response.body;
      switch (body.errorCode) {
        case 0:
          return response;
        //重新登录
        case 401:
          this.$router.push({ path: '/login' });
          break;
        case 500:
          // 无用
          // this.$message.error('服务器错误！');
          alert('服务器错误！')
          break;
        default:
          // this.$message.error(body.message);
          alert(body.message)
          break;
      }
    } else {
      alert("请求失败！");
    }
  })
})
new Vue({
  el: '#app',
  render: h => h(App),
  // 挂在路由对象到 VM 实例上
  router
})

