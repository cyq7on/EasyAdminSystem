import VueRouter from 'vue-router'
import addUser from './components/addUser'
import updateUser from './components/updateUser'
import home from './components/home'
import login from './components/login'
import user from './components/user'


// 1、创建路由对象
var router = new VueRouter({
    routes: [
        {
            path: '/home', component: home,
            children: [
                { path: 'user', component: user ,name:'user' },
                { path: 'addUser', component: addUser },
                { path: 'updateUser', component: updateUser ,name:'updateUser'},
            ]
        },
        { path: '/', component: login }
    ]
})

// 2、把路由对象暴露出去
export default router