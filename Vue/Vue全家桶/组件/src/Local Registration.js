


let childComponent = {
    template: '#child',
    props: {
        name: {
            type: String,
            require: true
        }
    },
}

let parentComponent = {
    template: '#parent',
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
    components: {
        plan: childComponent
    }
}


new Vue({
    el: '#app',
    components: {
        planb: parentComponent
    }
})

