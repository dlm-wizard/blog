## JavaScript

* 弱类型语言（Weak）：隐式类型转化

* 动态类型（Dynamic）：执行（LHS）时确定变量的数据类型

<div align="center"><img src="https://uploader.shimo.im/f/LVqAXkAwwzs8N2Ci.png!thumbnail" width="75%" height="75%"/></div><br>

<div align="center">  <img src="https://uploader.shimo.im/f/e70pHVOVjTU8J33B.png!thumbnail" width="75%" height="75%"/></div><br>



## 数据类型

参考：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)

JavaScript 的数据类型分为两类: `primitive type` and `object type`。

* `primitive type` - stack storage
* `object type` - heap storage「无法直接操纵，只能通过对象在栈中的引用」

为什么要分别用 stack 和 heap 存储呢？

能量是守衡的，无非是时间换空间，空间换时间的问题。堆比栈大，栈比堆的运算速度快,对象是一个复杂的结构，并且可以自由扩展。

<div align="center">  <img src="https://pic1.zhimg.com/80/v2-c69bc8d698afe4328206592f3c3a89a2_hd.jpg" width=""/></div><br>


## 从 '=='运算 开始了解类型转换

[ECAMScript 11.9.3 中的定义](https://yanhaijing.com/es5/#203)

主要关注其中**不同类型之间比较的隐式类型转换**规则

<div align="center"><img src="https://uploader.shimo.im/f/HMtK2OzdBB8OVaHh.png!thumbnail" width="75%" height="75%"/></div>
<div align="center"><img src="https://uploader.shimo.im/f/TzXpHynO4vE4a8ts.png!thumbnail" width="75%" height="75%"/></div><br>

**The Abstract Equality Comparison Algorithm**


* N：操作数 ToNumber

* P：操作数 ToPrimitive

<div align="center"><img src="https://pic3.zhimg.com/80/0ea77966986b068628b17c33419e4476_hd.png" width="75%" height="75%"/></div>



### 1. 有和无

* String、Number、Boolean 和 Object (对应左侧的大矩形框) - 存在的世界

* Undefined 和 Null (对应右侧的矩形框) - 空的世界

两个世界任意值做 '==' 比较为 false 是很容易理解的。

#
### 2. 空和空

undefined 和 null 是一个让人崩溃的地方「设计缺陷」

```js
null == undefined
```

#
### 3. 存在世界间的转化

`ToPrimitive(obj)` 执行过程等价于，[伪代码实现可以参照这里的ToPrimitive小节](https://juejin.im/entry/58acf34f0ce463006b1fc884/)

> 例外：Date 类型的对象

1.首先计算 `obj.valueOf()` ，如果返回值为 primitive 类型，返回之

2.继续计算 `obj.toString()` ，如果返回值为 primitive 类型，返回之

3.抛出异常

#
### 4. 真与假

布尔值与其他类型的值作比较时，布尔值会转化为数字。~ 在C语言中，根本没有布尔类型，通常用来表示逻辑真假的正是整数1和0。

```js
true -> 1
false -> 0
```

#
### 5. 字符的序列

String 和 Number 都是数值的序列(至少在字面上如此)。详细请参考[ECAMScript 8.4 String 类型 8.5 Number 类型](https://yanhaijing.com/es5/#203)

在 String 和 Number 做==运算时，需要使用 `ToNumber()` 操作

<div align="center">  <img src="https://uploader.shimo.im/f/A4yeuFQ6aO4ZS1Q2.png!thumbnail" width="75%" height="75%"/></div><br>

规范上描述的很复杂，简单来说就是：

1.去掉字符串两边的空白符，去掉字符串两边的引号

2.如果能组成一个合法的数字，返回这个数字「例外：空白字符串转化为 0」

```js
Number('') // 0
```

3.否则返回 NaN

## 总结

稍微分析一下对象类型与布尔类型比较时（需要由布尔先转型）的过程我们可以得出这样的结论：对象类型与原始类型比较时，全部由对象转为原始类型也是等价的。

<div align="center">  <img src="https://pic2.zhimg.com/80/0fc2dd69d7f9d4083f347784446b7f0d_hd.png" width="75%" height="75%"/></div><br>

1. 记住那些内置对象的 `toString()` 和 `valueOf()` 方法的规则。包括 `Object、Array、Date、Number、String、Boolean` 等。

2. 万物皆数。


## 举个栗子：[]==![]

1. `!` 优先级高于 `==` ， `![]` 返回 true。

2. 匹配 ECMA 抽象相等比较算法条件 8，返回比较 `x == ToNumber(y)` 。

3. ToNumber(true) = 1，即转化为比较 `x == 1` ， 匹配 ECMA 抽象相等比较算法条件 10，返回比较 `ToPrimitive(x) == y` 。

4. `[].valueOf()` ，返回值为 []，继续计算 `[].toString()` ，返回 "" 字符串。

5. 简化为比较 `"" == 0` ， 匹配 ECMA 抽象相等比较算法条件 5，返回 `ToNumber("") == 0` ，答案显而易见为 true。


<div align="center">  <img src="https://uploader.shimo.im/f/kXhfp4dS8K0hh9no.png!thumbnail" width="75%" height="75%"/></div><br>



## 参考

[弱类型、强类型、动态类型、静态类型语言的区别是什么？](https://www.zhihu.com/question/19918532)



[知乎--彻底搞懂 == 运算](https://zhuanlan.zhihu.com/p/21650547)

[ 从 `[]` == `![]` 为 true 来剖析 Js 各种蛋疼的类型转换 
](https://juejin.im/entry/58acf34f0ce463006b1fc884/)

