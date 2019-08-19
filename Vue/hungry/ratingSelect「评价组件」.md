#
### 1. 盒子模型覆盖

#### 1.1 组件通信

```js
<ratingSelect :select-type="selectType" /*评价类别选择：全部、推荐、吐槽*/
              :only-content="onlyContent" /*是否看有内容的评价*/
              :desc="desc" /*评价类别 hashMap*/
              :ratings="food.ratings" /*商品评论*/
              
              @toggleToAll="toggleToAll"
              @toggleToPos="toggleToPos"
              @toggleToNeg="toggleToNeg"
              @toggleContent="toggleContent"
>
```

计算属性：评价类别对应记录数的显示

```js
/*定义常量，代码可读性*/
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

return this.ratings.filter((ratings) => {
  return ratings.rateType === POSITIVE 
})
```

#
#### 1.2 更新父组件「food.vue」BScroll

1. 切换商品评价类型，@click参数为写死的类别...原谅我这太简单了~
1. 评论类型切换 -> 内容层高度变化 -> 需要派发到商品详情页更新 BScroll「严重依赖 DOM 呐!」
```js
toggleToAll (type, e) { /*查看全部评论*/
  if (!e._constructed) {
    return /*阻止浏览器与组件派发两次click事件*/
  }
  this.select_Type = type
  this.$emit('toggleToAll', type, e)
},

toggleToPos (type, e) { /*查看推荐评论*/
  // 阻止click..
  this.select_Type = type
  this.$emit('toggleToPos', type, e)
},

toggleToNeg (type, e) { /*查看吐槽评论*/
  // 阻止click..
  this.select_Type = type
  this.$emit('toggleToNeg', type, e)
},
```

food组件更新BScroll
```js
if (!e._constructed) {
    return
  }
  this.selectType = type
  this.$nextTick(() => {
    this.scroll.refresh()
  })
```


```js
/*是否只看有内容的评价*/
toggleContent (e) {
  if (!e._constructed) {
    return
  }
  this.only_Content = !this.only_Content
  let type = this.only_Content
  this.$emit('toggleContent', type, e)
}
```

#### 移动端1px线

简易实现：

1. 在元素后添加一个after伪类，将 after 设置为一条线
1. absolute + width=包含块宽度 + context=' ' + 1px的border-top
1. 在不同dpr的手机上进行媒体查询来实现对这个线的缩放
1. 因为 width 100%，所以1px线的间距就用 padding 控制就行（洒洒水啦）
```css
/*1px 细线实现*/
border-1px($color)
  position: relative
  &::after
    display: block
    position: absolute
    left: 0
    bottom: 0
    width: 100%
    border-top: 1px solid $color 
    content: ' '
  
border-none()
  &::after
    display: none

bg-img($url)
  background-image: url($url + "@2x.png")
  @media (webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3)
    background-image: url($url + "@3x.png")

/*加上webkit为了兼容性*/
@media (webkit-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)
  .border-1px
    &::after
      -webkit-transform: scaleY(0.7)
      transform: scaleY(0.7)

@media (webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2)
  .border-1px
    &::after
      -webkit-transform: scaleY(0.5)
      transform: scaleY(0.5)
```

#
### 2. 单向数据流

> 即使你改变了 props，父组件也可以轻易的覆盖改变值

#### 2.1 想要对 props 进行操作怎么办？

父级 prop 的更新会向下流动到子组件中，但是反过来则不行
1. 计算属性
```js
```

2. 在子组件 vue instance data 中创建中间值 = props 的值
```js
data () {
  return {
    /*创建新的对象进行shallowCopy*/
    select_Type: this.selectType, 
    only_Content: this.onlyContent
  }
},
```

