#
### 1. 盒子模型覆盖

#### 1.1 显示商品详情动画

```js
<li class="food-item border-1px"
    v-for="food in item.foods"
    @click="selectFood(food, $event)"
    :key="food.id"
>

selectFood (food, e) {
  if (!e._constructed) {
    return
  }
  this.selectedFood = food
  this.$refs.food.show()
},
```

在展示的时候再初始化一遍数据，组件可能被不同商品使用，但希望一直保持初始化状态

没有使用路由...使用了 fixed 同时盖住下方的商品页
```js
// goods 组件 => 点击食品展示食品详情页
this.$refs.food.show()

show () { 
  this.selectType = ALL
  this.onlyContent = true
  /*显示商品详情页*/
  /*最外层food容器 => v-show = true*/
  this.showFlag = true 
  
  /*
    绑定父元素没有固定高度 => viewport 高度
      position fixed /*拉伸父元素高度样式*/
      left 0
      top 0
      bottom 48px
     
    内容层高度为图片+详情+商品介绍+评价组件高度
   */
  this.$nextTick(() => {
    /*组件多次显隐，但我们只声明一次BScroll实例*/

    if (!this.scroll) {
      this.scroll = new BScroll(this.$refs.food, {
        click: true
      })
    } else {
      this.scroll.refresh()
    }
  })
},
```

#### 返回商品界面

```js
<div class="back" @click="hide">
  <i class="icon-arrow_lift"></i>/*返回图标字体*/
</div>

hide () {
  this.showFlag = false/*最外层food容器 => v-show = false*/
}
```

#
#### 1.2 动画

商品详情页显示动画

左右缓动显示渐变效果
```css
transition all 0.2s linear
transform translate3d(0,0,0)
&.move-enter, &.move-leave-to
  transform translate3d(100%,0,0)

```

加入购物车 按钮覆盖了'➕''➖'组件，设置了透明度过渡效果的动画
```css
opacity 1
transition all 0.2s
&.fade-enter, &.fade-leave-to
  opacity 0

```

#
#### 1.3 宽高相等图片加载

不能写死img height，因为 height = width，但如果不设置 height，初始加载图片的时候页面会抖动!!（一开始未加载，内容没高度）

利用 css 百分比的小特性，margin、padding 是基于包含块宽度的。因为父元素未设置 height，此时 height = 子元素height

```css
.image-header
  /*实现一个宽高相等的容器*/
  width 100%
  height 0
  padding-top 100%/*撑开父元素，页面加载不会抖动*/
  img
    position absolute
    top 0px
    left 0
    width 100%
    height 100%
```

#
#### 1.4 加入购物车 按钮与'➕''➖'组件

我们为什么要设置加入购物车透明度渐变的效果呢，只是为了用户体验吗？

若没有动画，小球下落的位置会出现不对的情况。点击 加入购物车 时，v-show 被切换 => display：none（传入shopcart「购物车组件」DOM信息被删除），
我们加一个渐变动画，点击时可以将  加入购物车 DOM 元素正常传入，不会立即被 v-show 切换!

#
#### 1.5 点击穿透

详情页点击'➕''➖'，商品页也会变化
```js
<div @click.stop.prevent="addFirst($event)"
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

#
#
### 3. 时间戳
#### 3.1 转化为时间字符串

```js
  import {formatDate} from '../../common/js/date' /*引入格式化字符串模块*/

  filters: {
    formatDate (time) {
      let date = new Date(time)
      /*将日期格式替换为真实的日期*/
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
```

#
#### 3.1 转化为时间字符串

通过方法放在 /common/js 目录下
```js
export function formatDate(date, fmt) { // 写死的正则替换,连接符不会被匹配
  /**
   * date: 标准日期
   * fmt(日期格式) --- yyyy-MM-dd hh:mm
   *  1. RegExp.$1: 匹配的第一个分组内容
   *  2. 可以根据日期格式返回不同形式的日期显示方式
   */
  if (/(y+)/.test(fmt)) {
    /*匹配到几个y就截取几位年数*/
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1))
  }

  /**
   * 动态匹配的正则替换: hashMap
   * 
   * {正则表达式: 对应其所应被替换的内容}
   */
  let o = {
    'M+': date.getMonth() + 1,/*getMonth() 从零开始计算*/
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      /*MM 与 M 显示样式不同*/
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

/*只有一位从第一位开始截取，否则从第二位截取「00被截取」*/
function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}
```










