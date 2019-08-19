
//  最简单的组件 demo

Vue.component('plan', { // 组件函数?
    template: '#plan',
    props: {
        name: {
            type: String,
            require: true
        }
    },
    data() {
        return {
            done: null
        }
    },
    methods: {
        todo () {
            this.done = true
        }
    },
})

new Vue({
    el: '#app',
    data: {
        plans: ['name', 'age', 'mail'],
    },
})

// 服务端渲染，不再 vue源码动态解析生成界面 
// 服务器返回已经解析完成的页面 -- jsp...,更快的展示时间，不再需要 js 解析 html

// 1. 生命周期钩子无法使用
// 2. 更多的服务端负载，显然比仅仅提供静态资源占用更多的 CPU

/*
现在我们想要在应用程序的其他组件中应用我们的组件，使我们的组件成为可复用与独立的部分

Vue.component('planb', {
    template: '#planB',
    props: {
        name: {
            type: String,
            require: true
        }
    },
    data() {
        return {
            plans: ['name', 'age', 'mail'],
        }
    },
})

Vue.component('plan', {
    template: '#plan',
    props: {
        name: {
            type: String,
            require: true
        }
    },
})
*/




