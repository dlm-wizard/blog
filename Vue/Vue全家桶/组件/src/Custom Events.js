

/*
    Q: planb 组件中进行 plan 的选择？
    A: @click + emit + @自定义 + 自定义方法更新 data 数据 + prop 传递变更

    
1. 在 plan 组件 data 中添加一个 selected（Boolean） 来辨别这个 plan 是否被选中，
   再定义一个 select 方法，以事件回调的方式更新我们选中的数据 + v-bind 绑定特定类名

   Q: 选择一条 plan
   A: 怎么才能在组件中知道另一条 plan 被选择了呢？父组件维持选择状态通过 props 传递


2. on emit 让父组件知道我们的选择，并在 data 中声明 selectPlan 存储，通过 props 传递

*/
Vue.component('planPicker')

let planComponent = { // 组件对象
    template: '#plan',
    props: {
        name: {
            type: String,
            require: true
        },
        plan: {
            type: String
        }
    },
    computed: {
        isSelected () {
            console.log(this.plan === this.name)
            return this.plan === this.name
        }
    },
    methods: {
        select () {
            this.$emit('select-plan', this.name)
        },
    },
}

let planPickerComponent = {
    template: '#plan-picker',
    props: {
        name: {
            type: String,
            require: true
        }
    },
    data() {
        return {
            plans: ['name', 'age', 'mail'],
            selectedPlan: null,
        }
    },
    components: {
        "plan": planComponent
    },
    methods: {
        selectPlan (name) {            
            this.selectedPlan = name
            console.log(this.selectedPlan)
        }
    },
}


new Vue({
    el: '#app',
    components: {
        'plan-picker': planPickerComponent
    }
})

