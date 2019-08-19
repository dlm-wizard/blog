Vue.component('plan', {
    template: '#plan',
    props: {
        name: {
            type: String,
            require: true
        }
    }
})

new Vue({
    el: '#wrap',
    data: {
        // plans: ['single', 'curious', 'addict'],
        plans: ['About', 'Project', 'Internet', 'login', 'hello'],
    },
})
new Vue({
    el: '#wrap1',
    data: {
        // plans: ['single', 'curious', 'addict'],
        plans: ['About', 'Project', 'Internet'],
    },
})
new Vue({
    el: '#anotherApp',
    data: {
        plans: [
            'About', 'Project', 'Internet', 'login',
        ],
    },
})
/*
    justify-content

    new Vue({
        el: '#anotherApp',
        data: {
            plans: ['About', 'Project', 'Internet', 'login'],
        },
    })
*/