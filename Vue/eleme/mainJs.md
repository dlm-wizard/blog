
```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './router/router'
import store from './store/'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'

if ('addEventListener' in document) {/*解决移动端300ms延迟*/
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

Vue.use(VueRouter)
const router = new VueRouter({
	routes,
	mode: routerMode,
	scrollBehavior (to, from, savedPosition) {/*生命周期mounted后beforeUpdate前执行*/
	    if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
        			/*scrollTop: 获取元素垂直向下滚动的像素数*/
				from.meta.savedPosition = document.body.scrollTop;
			}
		    return { x: 0, y: to.meta.savedPosition || 0 }
		}
	}
})
new Vue({
	router,
	store,
}).$mount('#app')
```


```js
<keep-alive>
    <router-view v-if="$route.meta.keepAlive">
    
scrollBehavior (to, from, savedPosition) {/*在按下 后退/前进 按钮时，就会像浏览器的原生表现那样*/
	    if (savedPosition) {
		    return savedPosition
		} else {
			if (from.meta.keepAlive) {
        			/*解决使用keep-alive标签后部分安卓机返回缓存页位置不精确问题*/
				from.meta.savedPosition = document.body.scrollTop;
			}
		    return { x: 0, y: to.meta.savedPosition || 0 }
		}
	}


```

```js
// 返回滚动位置的对象信息
scrollBehaviorHandler = (
  to: Route,
  from: Route,
  // popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时才可用
  { selector: string, offset? : { x: number, y: number }}
) 
```
