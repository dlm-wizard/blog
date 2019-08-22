#
### 1. 通信过程

#### 1.1 选择食品'➕'

> cartcontroller.vue

```js
/*给每个食品动态添加count属性*/
if (!this.food.count) {
  Vue.set(this.food, 'count', 1)
} else {
  this.food.count++
}
```

#
#### 1.2 动态计算选中食品

> goods.vue「单向数据流」

每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值「父级 prop 的更新会向下流动到子组件中，但是反过来则不行」
```js
selectFoods () {
  let foods = []
  this.goods.forEach((good) => {
    good.foods.forEach((food) => {
      // cartController 选中后add {count: 1}
      if (food.count) {
        foods.push(food)
      }
    })
  })
  return foods
}
```


#
#### 1.3 动态计算选中食品

> goods.vue

父组件改变子组件状态
```js
addFood (target) { /*'➕'DOM元素*/
  this._drop(target)
}

_drop 相关函数

/**/
this.$refs.shopcart.listShow = true
```

#
#### 1.4 购物车列表

> data fold 属性控制购物车列表显示

计算属性 listshow 使用 getter/setter 原因：BScroll 依赖 DOM 的变化，每次购物车列表内容变化都需要刷新 BScroll
```js
listShow: {
  get () {
    return !this.fold /*间接访问fold控制显隐*/
  },
  set (newVal) {
    if (!this.totalCount) {
      this.fold = true
    }
    /*每次添加食品时，都要重新更新计算购物车列表高度*/
    /*vue 中 DOM 更新为异步操作*/
    if (newVal) { 
      this.$nextTick(() => {
        /*防止初始化重复BScroll实例*/
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.listContent, {
            click: true
          })
        } else {
          this.scroll.refresh() // 也会重新计算高度差决定是否滚动
        }
      })
    } else {
         /*没有被选中食物清除better-scroll*/
         if (!this.selectFoods.length) this.scroll = null
      }
  }
}
```


#
### 2. 计算属性

```js
/*所有选中食品价格汇总*/
totalPrice () {
  let total = 0
  this.selectFoods.forEach((food) => {
    total += food.price * food.count/*食品总价=食品count*食品价格*/
  })
  return total
}
```

#
#### 2.2 清空购物车

```
/*
  1. 单个食品 food.count>0 => v-show'➖'按钮「'➕➖'组件」
  2. food.count=0 => 加入购物车 按钮覆盖'➕➖'组件「food「食品详情组件」」
  3. selectFoods => 被选中食品数组变化「shopcart「购物车组件」」
 */
empty (e) {
  this.selectFoods.forEach((food) => {
    food.count = 0
  })
  this.fold = !this.fold
},
```










