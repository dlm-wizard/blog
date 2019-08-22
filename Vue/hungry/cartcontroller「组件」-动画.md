#
### 1. 添加「删除」食品

#### 响应式

Vue 无法检测到对象属性「源码：proxy代理 _data 属性」

> 由于 Vue 会在初始化实例时对属性执行 getter/setter 转化，属性必须在 data 对象上存在才能让 Vue 将它转换为响应式的

```js
/*食品项获取*/
v-for=item in goods
v-for=food in item.foods

<cartcontroller :food="food" @cartAdd="addFood" @decreaseCart="decreaseCart"></cartcontroller>
```

```js
<div @click.stop="decreaseCart($event)" v-show="food.count>0">/*➖*/

<div v-show="food.count>0">{{food.count}}</div>/*计数*/

<div @click.stop="addCart($event)">/*➕*/
```

#
#### 食品添加「删除」

> 不可以动态添加根级别的响应式属性「不会响应」

> > 传递➕DOM对象「重点!: 组件间通信」

添加「删除」 click 事件都会向父组件派发
```js
addCart (e) {
  if (!e._constructed) {
      return
    }
  if (!this.food.count) {
     /*vm无法响应对象属性*/
    Vue.set(this.food, 'count', 1)
  } else {
    this.food.count++
  }
  /*在当前实例上派发一个事件*/
  this.$emit('cartAdd', e.target) /*只能在父组件的当前组件监听到，父组件其他组件监听不到*/
},
decreaseCart (e) {
  if (!e._constructed) {
      return
    }
  this.food.count--
  this.$emit('decreaseCart', e.target)
}
```

#
#### 动画

v-if：**渲染**「根据值的真假，销毁或重建元素」
  比如 eleme login「组件」内短信登录与密码登录完全不同的 DOM 结构

v-show「频繁切换」：**显示**「根据真假值，切换元素的 display CSS 属性」

#### transition「组件」

> vue提供，可以给任何元素和组件添加进入/离开过渡

动态类名

![transition](https://cn.vuejs.org/images/transition.png)

**滚动效果**

> 为什么不把两个动画写在同一层盒子模型上呢？

*平移：外层组件
*旋转：内存图标

初始样式：
```css
&.move-transition // 不知道这个类有什么用
  opacity 1
  transform translate3d(0,0,0)

```

动画：
```
  &.move-enter, &.move-leave-to
    opacity 0
    transform translate3d(24px,0,0)/*向x轴平移*/
    .inner
      transform rotate(180deg)
```

#
### 2. 组件间通信

```js
<cartcontroller :food="food" 
                @cartAdd="addFood" 
                @decreaseCart="decreaseCart"
>


addFood (target) {
  this._drop(target)/*小球下落动画*/
},

decreaseCart (target) {
  if (!this.$refs.shopcart.totalCount) {
    /*购物车组件「是否显示购物车」*/
    this.$refs.shopcart.listShow = false
  }
},
```

#### 性能优化

> 两个动画[小球下落和➕➖]同时执行会比较卡(性能问题),让小球下落放入 $nextTick 回调钩子中

```js
_drop (target) {
  // 体验优化，异步执行下落动画
  this.$nextTick(() => {
    this.$refs.shopcart.listShow = true // 这只是取到他的属性，而没有设置
    this.$refs.shopcart.drop(target)
  })
  // this.$refs.shopcart.drop(target)
},
```

#
### Js 动画

#### 小球下落动画

```js
/*data：数组balls每个元素维护当前小球的状态*/
balls: [{
    show: false
  }, {
    show: false
  }, {
    show: false
  }, {
    show: false
  }, {
    show: false
  }],

/*el：cartcontrol传入的➕DOM元素*/
/*用于确定小球下落的位置*/
drop (el) {
  for (let i = 0; i < this.balls.length; i++) {
    let ball = this.balls[i]
    if (!ball.show) {
      /*
        如果有隐藏的小球，show 置位 true，添加到 dropBalls 之中
        添加到dropBalls中
       */
      ball.show = true
      ball.el = el
      this.dropBalls.push(ball)
      return
    }
  }
},
```

#
#### 钩子「动画前」

我们要计算➕与购物车组件的x、y轴的偏移

1. 

* getBoundingClientRect 获取➕与 viewport 的偏移
* 我们购物车自己写的样式 fixed+lb：32px  --> 购物车与 viewport 的偏移

2. viewport 偏移差值 = 小球与购物车距离 

```js
beforeEnter (el) {
  let count = this.balls.length
  while (count--) {
    /*当前小球*/
    let ball = this.balls[count]
    /*判断小球是否显示*/
    if (ball.show) {
      /*元素相对于viewport的位置*/
      let rect = ball.el.getBoundingClientRect() 

      /*购物车样式：fixed+「left：32px」+bottom：「32px」*/
      /*x轴为正值，y轴为负值*/
      let x = rect.left - 32
      let y = -(window.innerHeight - rect.top - 22)
      // el.style.display = '' // 因为v-show会将元素display: none, 我们首先需要将元素display置空让其显示
      /*外层元素动画样式*/
      el.style.webkitTransform = `translate3d(0,${y}px,0)`
      el.style.transform = `translate3d(0,${y}px,0)`
      /*内层元素动画样式*/
      let inner = el.getElementsByClassName('inner-hook')[0]
      inner.style.webkitTransform = `translate3d(${x}px,0,0)`
      inner.style.transform = `translate3d(${x}px,0,0)`
    }
  }
},
```

#
#### 钩子「进入/离开」

```js
/*动画进入时的状态*/
enter (el, done) {
  /* eslint-disable no-unused-vars */
  let rf = el.offsetHeight /*主动触发浏览器重绘*/
  this.$nextTick(() => { // 在下一帧(下一个eventLoop)将样式重置回来
    el.style.webkitTransform = 'translate3d(0,0,0)'
    el.style.transform = 'translate3d(0,0,0)'
    let inner = el.getElementsByClassName('inner-hook')[0]
    inner.style.webkitTransform = 'translate3d(0,0,0)'
    inner.style.transform = 'translate3d(0,0,0)'
    inner.addEventListener('transitionend', done) // css提供的transitionend事件，当transition结束后，会有一个transitionend事件派发
  })
},
```


1. 将小球移除下落数组
2. 隐藏小球
```js
afterEnter (el) {
  let ball = this.dropBalls.shift()
  if (ball) { // 将ball重置，循环利用
      ball.show = false
      el.style.display = 'none'
  }
}
```


















