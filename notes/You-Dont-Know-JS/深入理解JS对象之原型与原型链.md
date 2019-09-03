## [[Prototype]] 属性

[[Get]] 与 [[Put]] 操作对于不存在于对象中的属性，就需要使用对象的 [[Prototype]] 链了。

对于 ES6 的 proxy，[[Get]] 与 [[Put]] 讨论就不适用了。

## prototype

当你创建函数时，Js 会自动为这个函数添加 `prototype ` 属性。值是一个有 `constructor` 属性的对象。

`prototype` 属性指向了一个对象，这个对象正是调用该构造函数而创建的实例的原型。

```js
function Person () {};

// 虽然写在注释里，但你要注意：
// prototype是函数才会有的属性
Person.prototype.age = 20;

var person1 = new Person();
console.log(person1.age) // 20
```

引用《JavaScript权威指南》的一段描述：

> Every JavaScript object has a second JavaScript object (or null ,
but this is rare) associated with it. This second object is known as a prototype, and the first object inherits properties from the prototype.

每一个JavaScript对象(null除外)在创建的时候就会与之关联另一个对象，这个对象就是我们所说的原型。可以通过__proto__属性访问。

每一个对象都会从原型"继承"属性。

但继承意味着复制操作，然而 JavaScript 默认并不会复制对象的属性，相反，JavaScript 只是在两个对象之间创建一个关联，这样，一个对象就可以通过委托访问另一个对象的属性和函数，所以与其叫继承，委托的说法反而更准确些。


## `__proto__`

绝大部分浏览器都支持这个非标准的方法访问原型。

然而它并不存在于 Person.prototype 中，实际上，它是来自于 `Object.prototype` ，与其说是一个属性，不如说是一个 getter/setter，当使用 obj.__proto__ 时，可以理解成返回了 `Object.getPrototypeOf(obj)`。


```js
function Person () {};

var person1 = new Person();
console.log(person1.__proto__ === Person.prototype); // true
```

<div align="center">  <img src="https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype2.png" width=""/></div><br>

**操作符 instanceof**

判断一个实例是否属于某种类型：左侧隐式原型是否等于右侧显示原型

```js
function instanceof(left, right) {
    var proto = right.prototype;
    __proto__ = left.__proto__;
    
    while (true) {
      if (__proto__ === null) {
          return false;	
        }
        if (__proto__ === proto) {
          return true;	
        } 
        __proto__ = __proto__.__proto__ 
    }
}
```

通过 `instanceof` 我们可以轻松的区分出 `Object` 构造函数和其他函数。

```js
Object instanceof Object // true
Ctor instanceof Ctor // false

Function.prototype.__proto__ ===  Object.prototype
```

## constructor

每个原型都有一个 constructor 属性指向关联的构造函数。

<div align="center">  <img src="https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype3.png" width=""/></div><br>

注意：我们用字面量对象重写 `prototype` 的时候，会将 constructor 指向 Object()。

```js
Person.prototype = {
  getName: function() {
    console.log(this.name);
  }
};
```

原型继承：`{}.constructor === Object.prototype.constructor === Object`

通过原型继承了解了实例与原型之间的关系，那么原型与原型之间呢？

## 原型的原型

原型也是一个对象，既然是对象，我们就可以用最原始的方式创建他们。

JavaScript 是单继承的，`Object.prototype` 是原型链的顶端。

```js
var prototype = new Object();

// 原型对象通过 Object 构造生成
prototype.__proto__ = Object.prototype
// Object.prototype 没有原型
Object.prototype.__proto__ = null
```

<div align="center">  <img src="https://github.com/mqyqingfeng/Blog/raw/master/Images/prototype5.png" width=""/></div><br>

由相互关联的原型组成的链状结构就是原型链，也就是蓝色的这条线。

## Function.prototype === Function.__proto__

* 继承的原型链：Object.prototype(root)<---Function.prototype<---Function|Object|Array...

* Object 和 Function 的鸡和蛋的问题。

回归规范，摘录2点：

1. Function.prototype 是个不同于一般函数（对象）的函数（对象）。

> `Function.prototype` 函数总是返回undefined。

> 普通函数实际上是 Function 的实例，即普通函数继承于`Function.prototype` 。`func.__proto__ === Function.prototype` 。

> `Function.prototype` 继承于 `Object.prototype` ，并且没有 prototype 这个属性。`Function.prototype.prototype` 是 null。

> 所以，`Function.prototype` 其实是个另类的函数，可以独立于/先于Function 产生。


<div align="center">  <img src="https://uploader.shimo.im/f/cyRoTxfyChQOGNIs.png!thumbnail" width="75%" height="75%"/></div><br>

**最后总结：先有 Object.prototype（原型链顶端），Function.prototype 继承 Object.prototype而产生，最后，Function 和 Object 和其它构造函数继承 Function.prototype 而产生。**


<div align="center">  <img src="https://uploader.shimo.im/f/E0ncXb3KbN4GbBn1.png!thumbnail" width=""/></div><br>


## 参考

[从__proto__和prototype来深入理解JS对象和原型链](https://github.com/creeperyang/blog/issues/9)

[JavaScript深入之从原型到原型链](https://github.com/mqyqingfeng/Blog/issues/2)




































> JavaScript 核心特征：原型继承（prototypal inheritance）

##

[从__proto__和prototype来深入理解JS对象和原型链](https://github.com/creeperyang/blog/issues/9)

[ES6 系列之 defineProperty 与 proxy](https://github.com/mqyqingfeng/Blog/issues/107)

