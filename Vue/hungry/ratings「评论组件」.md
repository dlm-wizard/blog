#
#### 1. 请求数据

```js
data () {
  return {
    ratings: [], // data.json中有ratings数组对象
    /*同商品评价页*/
    selectType: ALL,
    onlyContent: true // 默认展示有内容评价
  }
},


created () {
  this.$http.get('api/ratings').then((response) => {
    response = response.body
    if (response.errno === ERR_OK) {
      this.ratings = response.data
      this.$nextTick(() => { 
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        })
      })
    }
  })
},
```

#
#### 2. 页面与方法和商品评价页相同

复用评价列表页

#
#### 3. 移动端适配

iphone5 折行，因为水平宽度不够了..
```css
@media only screen and (max-width 320px)
  flex 0 0 120px
  width 120px
```




