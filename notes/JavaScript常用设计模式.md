### 单例模式

> 一个类只能构造出唯一单例

使用场景：vuex

```js
// 静态属性实现方式
function Singleton(name, age) {
  if (typeof Singleton.instance === 'object') return

  this.name = name
  this.age = age
  Singleton.instance = this
}

var Singleton = (() => {
  let instance
  // 闭包实现方式
  return function (name, age) {
    if (instance) return instance

    this.name = name
    this.age = age
    return this
  }
})()

var p1 = new Person(), p2 = new Person();
console.log(p1 === p2);  //true
```

#
## 创建对象多种方式及优缺点

### 1. 工厂模式

> 提供创建对象的你方法

缺点：对象无法识别，因为所有实例都指向一个原型

```js
function Factory(name) {
  /*方法也不引用 this 对象*/
  let obj = new Object()
  obj.name = name
  obj.getName = function () {
    console.log(`My name is ${name}`)
  }
  return obj
}

var person1 = createPerson('kevin');
```

#
### 2. 构造函数模式

缺点：创建每个实例，都要创建 getName()，内存泄漏

```js
function Person(name) {
    this.name = name;
    this.getName = function () {
        console.log(this.name);
    };
}
```

构造函数优化：

> 这叫啥封装..

```js
function Person(name) {
    this.name = name;
    this.getName = getName;
}

function getName() {
    console.log(this.name);
}
```


#
### 3. 原型模式

缺点：共享所有属性和方法「不能初始化参数」

```js
function Person(name) {}

/*重写原型注意constructor指向*/
Person.prototype = {
    constructor: Person,
    name: 'kevin',
    getName: function () {
        console.log(this.name);
    }
};
```

### 4. 组合模式

> 最广泛的使用方式，但是有人就是希望写在一起

```js
function Person(name) {
  this.name = name
}

Person.prototype = {
    constructor: Person,
    getName: function () {
        console.log(this.name);
    }
};
```
#
#### 更好的封装

> new的底层实现与字面量重写原型

```js
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype.getName = function () {
            console.log(this.name);
        }
    }
}

/*注意不可以用字面量重写原型*/
/*
  new() 的过程为「指定对象原型在构造函数前执行..」
   1.obj._proto_ = Person.prototype
   2.Person.apply(obj)
   
   实例原型指向老的原型「而非被覆盖的原型」
 */
function Person(name) {
    this.name = name;
    if (typeof this.getName != "function") {
        Person.prototype = {
            constructor: Person,
            getName: function () {
                console.log(this.name);
            }
        }
    }
    /*
       如果你实在想用字面量对象：那就只有再重复构造一次对象了..
       return new Person(name)
     */
}
```

#
### 迭代器模式

> 为遍历一个数据结构提供方法

```js
function createIterator(items) {
    let i = 0;
    return {
    	// 双层闭包
        next () {
            let done = i >= item.length;
            let value = !done ? items[i++] : undefined;

            return {
                done,
                value
            };
        }
    };
}
```

#
### 装饰者模式

> 增加普通对象的功能

```js
function Sale(price) {
    this.price = price;
    this.decorators_list = [];
}

Sale.decorators = {};
Sale.decorators.fedtax = {
    getPrice: function (price) {
        return price + price * 5 / 100;
    }
};
Sale.decorators.money = {
    getPrice: function (price) {
        return '$' + price.toFixed(2);
    }
};

Sale.prototype.decorate = function (decorator) {
    this.decorators_list.push(decorator);  
};

Sale.prototype.getPrice = function () {
    var price = this.price,
    i,
    len = this.decorators_list.length,
    name;
    for (i = 0; i < len; i++) {
        name = this.decorators_list[i];
        price = Sale.decorators[name].getPrice(price);
    }
    return price;
};

var sale = new Sale(100);
sale.decorate('fedtax');
sale.getPrice();  //105
sale.decorate('money');
sale.getPrice();  //$105.00
```

### 策略模式
> 根据不同命令可以命中不同算法

```
let operator = {
  add (a, b) {
    return a + b
  },
  sub (a, b) {
    return a - b
  },
  mul (a, b) {
    return a * b
  },
  div (a, b) {
    return a / b
  }
}
let calc = function (cmd, arg1, arg2) {
  return operator[cmd](arg1, arg2)
}
```

### 外观模式
//为复杂的子系统功能提供简单的调用接口
//在重构工作和写兼容代码中很有帮助

var myevent = {
  //阻止冒泡和默认事件
  stop: function (e) {
      if (typeof e.preventDefault === 'function') {
          e.preventDefault();
      }
      if (typeof e.stopPropagation === 'function') {
          e.stopPropagation();
      }
      //IE
      if (typeof e.returnValue === 'boolean') {
          e.returnValue = false;
      }
      if (typeof e.cancelBubble === 'boolean') {
          e.cancelBubble = true;
      }
  }
};

#
### 代理模式

> 通过包装一个对象以控制对它的访问

以缓存代理为例
```js
const requestResult = async function (id) {
    let requestConfig = {
        credentials: 'include',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        mode: "cors",
        cache: "force-cache"
    };
    let url = '/service/v1/' + id;
    const response = await fetch(url, requestConfig);
    const responseJson = await response.json();
    return responseJson;
};

const proxy = {
    cache: {},
    request: async function (id) {
        if (!this.cache[id]) {
            this.cache[id] = requestResult(id);
        } 
        /*有缓存直接读取*/
        return this.cache[id] 
    }
};

proxy.request(1);
proxy.request(1);  //从缓存获取
```

### 发布订阅模式

> 当发生一个感兴趣的事件时，将该事件通告给所有订阅者「形成对象之间的松散耦合」

```js
function EventTarget() {
  this.handlers = {};
}
EventTarget.prototype = {
  constructor: EventTarget,
  // 注册订阅者
  addHandler: function (type, handler) {
      if (typeof this.handlers[type] == "undefined") {
          this.handlers[type] = [];
      }
      this.handlers[type].push(handler);
  },
  fire: function (event) {
      if (!event.target) {
          event.target = this;
      }
      if (this.handlers[event.type] instanceof Array) {
          var handlers = this.handlers[event.type];
          for (var i = 0, len = handlers.length; i < len; i++) {
              handlers[i](event);
          }
      }
  },
  removeHandler: function (type, handler) {
      if (this.handlers[type] instanceof Array) {
          var handlers = this.handlers[type];
          for (var i = 0, len = handlers.length; i < len; i++) {
              if (handlers[i] === handler) {
                  break;
              }
          }
          handlers.splice(i, 1);
      }
  }
};

var publisher = new EventTarget();  //定义发布者
//向发布者中注册订阅者
publisher.addHandler('call1',function () {
  console.log('call1');
});
publisher.addHandler('call1',function () {
  console.log('call1 again');
});
//发布者发布消息
publisher.fire({type: 'call1'});  //call1 call1 again
```

### 事件代理模式

> 给每一个子元素注册监听器比较耗内存，基于 DOM 事件冒泡的原理，将事件监听器注册在父元素上。

给 ul 下的 li 绑定点击事件
```
var ul = document.getElementById('list');
ul.addEventListener('click', function (e) {
    var target = e.target;
    if (target.node === 'LI') {
        //处理逻辑
    }
});
```










