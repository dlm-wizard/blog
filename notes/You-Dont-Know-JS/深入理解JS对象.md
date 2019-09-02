
## 对象特性`（object attribute）`

* 原型对象
* class

## object type

鉴于 ECMA 是动态类型语言，需要检测给定变量的数据类型。

```js
// null 本身是原始类型
typeof null // object"
```

null 为什么会被判断为 `object type` 呢？

不同变量在底层都表示为二进制，`typeof`通过判断变量底层低 1~3 位区分不同类型。在 JavaScript 中二进制前三位都为 0 会判断为 `object` 类型，null 的二进制表示全是 0。



## 对象到底是什么？

对象是一种复杂的数据结构，将很多值`primitive type` and `object type` 聚合在一起，可以通过属性名访问。

可以将对象看成是字符串到值的映射。

不仅如此，除了可以保持自有属性之外，JavaScript 对象还可以从一个称为原型的对象中继承属性。

```js
var a = {x: 1};
one. __proto__ = Object.prototype
```

一般属性值并不存在于对象容器的内部。存储在对象容器内部的只是这些属性名，他们就像指针（技术角度来说就是引用）一样，指向这些值真正的存储位置。

1. `.` 操作符要求属性名满足标识符的命名规范。
2. `["."]` 接受任意字符串属性名「变量!」。
3. **ES6：**`["."]` 可以接受表达式


## 属性

参考：[https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)


* `in` 操作符：属性是否存在对象及其 [[Prototype]] 原型链中。

* `hasOwnProperty`：只会检查属性是否存在于对象中。

属性包括名字（字符串）和值（任意 JavaScript 数据类型）。除此之外，每个属性还有一些与之相关的值，称为"属性特性"`（property attribute）` 。




## definePropety

> Object.defineProperty(obj, prop, descriptor)

```js
obj: 要在其上定义属性的对象。

prop:  要定义或修改的属性的名称。

descriptor: 将被定义或修改的属性的描述符。
```

虽然我们可以直接添加属性和值，但是使用这种方式，我们能进行更多的配置。

属性描述符的两种形式：**数据描述符和存取描述符**

**两者均具有以下两种键值：**

configurable

```js
当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，也能够被删除（delete）。默认为 false。
```


enumerable

> 可枚举：可以出现在对象属性的遍历中

```js
当且仅当该属性的 enumerable 为 true 时，该属性才能够出现在对象的枚举属性中。默认为 false。

// 枚举属性的方法
Object.keys
for...in
```

#
**数据描述符可选键值：**

value
```js
该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
```

writable
```js
当且仅当该属性的 writable 为 true 时，该属性才能被赋值运算符改变。默认为 false。
```

## [[Get]]

object.a 是一次属性访问，但这条语句并不仅仅是在 object 中查找属性名为 a 的属性

```js
var object = { a: 1 }

object.a // 1
```

在语言规范中，实际上 object.a 在 object 上是实现了 `[[Get]]` 操作（有点像函数调用：`[[Get]]()）` 。

1. 首先在对象中查找是否有名称相同的属性。
2. 遍历可能存在的 `[[Prototype]]` 链。
3. 若无论如何都没有找到名称相同的属性，`[[Get]]` 操作会返回 undefined。

注：`[[Get]]` 与访问变量不同，如果引用了当前词法作用域不存在的变量，并不会像对象属性一样返回 undefined，而是会抛出一个 ReferenceError 异常。

## [[Put]]

既然有可以获取属性的 `[[Get]]` 操作，就一定有对应的 `[[Put]]` 操作。

如果已经存在这个属性，[[Put]] 算法大致会检查下面的内容：

```js
1. 属性是否是存取描述符？如果是并且存在 setter 就调用 setter。
2. 属性的数据描述符 writable 是否为 false？如果是，在"非严格模式"下默认失败，在"严格模式"下抛出 TypeError 异常。
3. 以上都不是，将该值设置为属性的值。
```

属性存在于 [[Prototype]] 情况将会更复杂。

**属性屏蔽**

完整的 [[Put]] 过程：

```js
object.a
```

[[Prototype]] 链会被遍历：

1. 如果原型链上找不到 a 属性，a 就会直接被添加到 object 对象上。
2. 如果 a 属性已经存在于 object 对象中，也存在于原型链上，`object.a` 「屏蔽属性」会屏蔽原型链上的 a 属性。
3. 如果 a 只存在于原型链的上层，会发生属性屏蔽（创建屏蔽属性）。

属性屏蔽简单来说就是在[[Prototype]]上存在名为 a 的普通 `数据描述符` 属性且未被标记为只读（`writable: false` ），那就会直接添加 a 到  object 对象上。否则忽略该属性。

[[Prototype]]上存在名为 a 的普通 `数据描述符` 属性且被标记为只读的栗子：

```js
function MyObject() {}
Object.defineProperty(MyObject.prototype, 'a', {
    configurable: true,
    writable: false, // 无法修改已有属性或被添加到 object 对象上
    enumerable: true,
    value: 1
});

var object = new MyObject();
object.a = 100;

console.log(object.a)
```

[[Prototype]]上存在名为 a 的 `存储描述符` 属性的栗子：


```js
function MyObject() {}
var value = null;
Object.defineProperty(MyObject.prototype, 'a', {
    configurable: true,
    enumerable: true,
    get () {
        return 1;
    },
    set (newValue) {
        value = newValue; // value: 100
    },

});

var object = new MyObject();
object.a = 100; // a 不会被添加到 object

console.log(object.a) // 1
```

#
**存取描述符可选键值：**

get
```js
一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。该方法返回值被用作属性值。默认为 undefined。
```

set
```js
一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。该方法将接受唯一参数，并将该参数的新值分配给该属性。默认为 undefined。
```

所有的属性描述符都是非必须的，但是 descriptor 这个字段是必须的。

```js
var obj = Object.defineProperty({}, "a", {});
```

## Getters 和 Setters

在 ECMA 5 中，属性值可以用 `getter` 与 `setter` 替代。`getter` 返回的值就是属性存取表达式的值。

由 `getter` 与 `setter` 定义的属性称为存取器属性（accessor property），不同于数据属性（data property）的 `value` 数据描述符。

```js
var obj = {}, value = null;
Object.defineProperty(obj, "a", {
    get: function(){
        console.log('执行了 get 操作')
        return value;
    },
    set: function(newValue) {
        console.log('执行了 set 操作')
        value = newValue;
    }
})

obj.a = 1 // 执行了 set 操作
obj.a // 执行了 get 操作 // 1
```

## Function

JavaScript 函数是`一等公民` （从技术角度来说就是"可调用的对象"）

在其他语言中，属于对象（也被称为"类"）的函数通常被称为"方法"。

1. 从技术角度来说，在 JavaScript 中函数永远不会"属于"一个对象，只是对于相同函数对象的多个引用。

2. 属性访问返回的函数和其他函数没有任何区别（唯一的区别就是内部的 this 引用）。

## 对象之深浅 copy

### 1. 数组的浅 copy

如果是数组，我们可以利用数组的一些方法比如：`slice、concat` 返回一个新数组的特性来实现拷贝。

```js
var arr = [{old: 'old'}, ['old']];
var new_arr = arr.concat();

arr[0].old = 'new';
arr[1][0] = 'new';

console.log(arr) // [{old: 'new'}, ['new']]
```

我们会发现其实旧数组也发生了变化，也就是 concat 方法，clone 的并不彻底。

如果数组元素是基本类型，就会 copy 一份，互不影响，而如果是对象或数组，就会只 copy 对象或数组的引用。这样无论我们在新旧数组进行了修改，两者都会发生变化。

我们把这种 copy 引用的拷贝称之为浅 copy。


### 2. 数组的深 copy

JSON 的序列化是一个简单粗暴的好方法，就是有一个问题，不能 copy 函数。


```js
var arr = [
  function() {}
];

var new_arr = JSON.parse(JSON.stringify(arr));
console.log(new_arr); // [null]
```

总结：以上 `concat ` ， `slice ` ， `JSON.stringify` 都算是技巧类，接下来我们考虑如何自己实现一个对象的 copy 函数。


shallowCopy 的具体实现：

> Object.assign(target, ...sources)

```js
1. enumerable
2. own key
3. copy（使用 "=" 运算符）
```


```js
var shallowCopy = function (obj) {
    if (typeof obj !== 'object' || typeof obj !== 'function') return 
    
   var newObj = Array.isArray(obj) ? [] : {};
   
   for (var name in obj) {
     if (obj.hasOwnProperty(name)) {
       newObj[name] = obj[name]
     }
   }
   return newObj
}
```

deepCopy 的具体实现：

```js
// 循坏引用？
var deepCopy = function (obj) {
    if (typeof obj !== 'object' || typeof obj !== 'function') return 
    
   var newObj = Array.isArray(obj) ? [] : {};
   
   for (var name in obj) {
     if (obj.hasOwnProperty(name)) {
        newObj[name] = typeof obj[name] == 'object' ? deepCopy(obj[name]) : obj[name]
     }
   }
   return newObj
}
```

## 性能问题

尽管使用深拷贝会完全的克隆一个新对象，不会产生副作用，但是深拷贝因为使用递归，性能会不如浅拷贝。













> JavaScript 核心特征：原型继承（prototypal inheritance）

##

[从__proto__和prototype来深入理解JS对象和原型链](https://github.com/creeperyang/blog/issues/9)

[ES6 系列之 defineProperty 与 proxy](https://github.com/mqyqingfeng/Blog/issues/107)

