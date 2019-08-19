
### 数据结构

#### 1. 判断二维数组中是否有输入的整数「都是递增数组」

```js
/* 
 * var arr = [[1,2,4],[2,4,7],[8,9,10]]
 *   1  2  8 
 *   2  4  9
 *   4  7  10
 * 
 * 分析: 
 * 1. 可以将数组扁平化后，indexOf()「效率低」
 *  
 * 2. 数组的规律：数组与数组元素都是递增数组, 每行「列」末尾为该行「列」最大的整数值
 *  控制变量法：
 *    我们可以选取选右上角「行max + 列min」或左下角「行min + 列max」
 *    向对角线方向缩写该区域的范围「单步换行「列」的过程」
 */

  function findMatrix(arr, search) {
    let row = arr[0].length - 1
    // 选取右上角
    for (let col = 0; row < arr[col].length - 1 && col < arr.length - 1; ) {
      if (search === arr[row][col]) return true

      else if (search < arr[row][col]) {
        row--
        continue
      }
      else {
        col++
        continue
      }
    }
  }
  ```
  
#
#### 2. 替换空格

```js
function replaceSpace (str) {
  return str.replace(/\s+?/g, "20%");
}

/**  
*  不用 API 操作的话，我们使用「辅助数组」来保存每个字符，若是对原数组操作，需要考虑元素后移
*  空间换时间
*/
function replaceSpace(str) {
  if (!str.length) return

  var arr = [] // 一个空数组节约时间
  for(let i = 0; i < str.length; i++) {
    if (str.charAt(i) === " ") {
      arr.push('20%')
    } else {
      arr.push(str.charAt(i))
    }
  }
  return arr.join('')
}
```
  
#
#### 3. 输入一个链表的头结点，从尾到头反过来打印出每个结点的值 

```js
/** 
 * 分析: 
 * 1. 借助一个「辅助数组」，保存顺序遍历链表的值  
 * 2. 反转数组
 */
  function printListFromHeadToTail(head) {
    while (head.next) {
      arr.push(head.value)
      head = head.next
    }
    return earr.reverse()
  }
```

#
#### 4. 用两个栈实现队列「具有appendTail(尾插入)和deleteHead(头删除)功能」

```js
 /**
  * 栈 s1 与 栈 s2 实现队列「保证顺序一致性!」
  * 
  * 分析：预想的队列顺序会被以下两种情况分割
  * 1. s1 要往 s2 中压入数据，必须一次性全部压入
  * 2. 如果 s2 不为空，s1 绝不能向 s2 中压入数据
  * 
  */
  class Queue {
    static s1 = []
    static s2 = []
    constructor (val) {
      this.data = val
    }
    appendChild () {
      this.data.forEach(item => {
        Queue.s1.push(data)
      });
      while (Queue.s1.length && !Queue.s2.length) 
        Queue.s2.push(Queue.s1.pop())
    }
    deleteHead () {
      Queue.s2.pop()
    }
  }
```

#
#### 5. 输入某二叉树前序遍历与中序遍历的结果，重建该二叉树 

```js
 /** 
  * 前序遍历: [1，2，4，7，3，5，6，8]， 中序遍历: [4，7，2，1，5，3，8，6]
  * 
  * 分析: 重建二叉树
  *      1. 建立根结点
  *      2. 建立左(右)子树「子问题」
  *      3. 遍历结果集为空「终止条件」
  * 划分前序遍历？：中序左子树[0~index] <-对应-> 前序左子树 [1~index+1], 第一个结点是根节点
  *
  * slice(): 参数是 idx，通过 idx 划分
  */
  function reConstructBinaryTree(pre, mid) {
    if (pre.length === 0 || mid.length === 0) return null

    let index = mid.indexOf(pre[0])
    // 中序找左右
    let left = mid.slice(0, index)
    let right = mid.slice(index+1)

    return {
      val: pre[0],
      left: reConstructBinaryTree(pre.slice(1, index+1), left),
      right: reConstructBinaryTree(pre.slice(index+1), right)
    }
  }
```

#
#### 6. 把一个数组最开始的若干个元素搬到数组的末尾，我们称之为数组的旋转
        输入递增数组的一个旋转，找到数组最小值

```js
 /**
  * 递增数组旋转之后，会出现 arr[left] > arr[right]「此时：min = arr[right]」  
  * 
  * 分析：二叉查找「arr[mid]」只有可能出现两种情况
  *  1. arr[mid] > arr[left] => arr[right] 在左边序列中
  *  2. arr[mid] < arr[right] => arr[right] 在右边序列中
  * 
  */
  // 这样滥用递归真的好吗...
  function rotateMin(arr) {
    if (arr.length === 1) return arr[0]

    let left = 0, right = arr.length - 1
    let mid = Math.floor((left+right)/2)

    if (arr[mid] > arr[left]) {
      return rotateMin(arr.slice(0, mid))
    } else {
      return rotateMin(arr.slice(mid))
    }
  }

  /**
   * @param {number[]} nums
   * @return {number}
   */
  var findMin = function(nums) {
    var s = 0;
    var e = nums.length - 1;
    var min;

    while(s<e-1) { // 二分查找指针未相遇「错误」，递归查找「利用指针减小规模」
        var mid = s + parseInt((e-s)/2);

        if(nums[mid] < nums[s]){
            e = mid;
        } else if(nums[mid] > nums[e]) {
            s = mid;
        } else {
            return nums[s];
        }
    }
    return Math.min(nums[e], nums[s]);
  };
```

#
#### 7. 一个人爬楼梯，每次只能爬 1 个或 2 个台阶，假设有 n 个台阶，那么这个人有多少种不同的爬楼梯方法？

```js
 /**
  * 1. 大量重复的计算
  * 2. Js 引擎对于代码执行栈的长度是有限制的，超过会爆栈，抛出异常
  * 
  * 我们考虑用 arr[] 进行状态保存
  * arr[n] == 0「表示 f(n) 还未计算过」，计算过的结果保存在arr[n] 中
  * 不管怎样，使用递归都是非常不可取的方法
  */
  function climbStairs(n) {
    if (n === 1) return 1;
    else if (n === 2) return 2;
    // 从结果倒推
    if (arr[n] !== 0) {
      return arr[n]
    } else {
      arr[n] = climbStairs(n - 1) + climbStairs(n - 2);
      return arr[n]
    }
   }
   
   function climbStairs(n) {
      if (n === 1) return 1; // 从寻常入手
      if (n === 2) return 2;

      let a = 1, b = 2;
      let temp;

      for (let i = 3; i <= n; i++) {
        temp = a + b; 
        a = b;
        b = temp;
      }
      return temp;
    }
```

#
#### 8. 输入整数, 输出二进制中 1 的个数

```js
 /**
  *  位运算基础「&、|、^」 js 中不太适合位运算
  *   
  *   左移「<<」：00001010<<2 = 00101000 [ 右边补0即可 ] 
  *   右移「>>」：00001010>>2 = 00000010 [ 正数左边补0 ]
  *   负数会死循坏「每次移位都补1：oxFFFF」：10001010>>3 = 11110001 [ 负数补1 ]
  */
  var numberOf1 = function (n) {
    if(n === null) return n;
    let flag = 1, count

    while (n) {
      if (n & flag) count++
      flag = flag << 1 // 左移 1 进行位运算判断「不要右移整数!」
    }
    
    return count
  }
  /**
   * 规律：一个二进制数-1「最右边1变为0，右边还有0：所有0取反」
   * 
   * 栗子：
   * 1. 1100-1=1011「将整数-1」
   * 2. 1100 & 1011 = 1000「和原整数 '&'」
   * 3. 最右边1变为0
   */
  var numberOf1 = function(n) {
    if(n === null) return n;
    let count = 0;
    
    while(n !== 0){
        n = n & (n-1);
        count++;
    }
    
    return count
  }
```

#
#### 9. 输入数字 n，按顺序打印出从1到最大 n 位的十进制数

```js
/**
 * 输入 n 很大时候，会发生溢出的情况，所以我们用字符串来表示
 * 
 * 递归出口：n == 1
 */
function printNums(n) {
  function print(str, n) {
    if (1 === n) {
      for (let i = 0; i < 10; i++) {
        console.log(str + i);
      }
    } else {
      n--;
      for (let i = 0; i < 10; i++) {
        if (0 === i) {
          print(str, n);
        } else {
          print(str + i, n);
        }
      }
    }
  }
  if (n < 1) {
    return;
  }
  print('', n);
}

// 大数相加「解构赋值」
function getSum(d1, d2) {

  // 如果第一个数较大则交换两个数
  if (d1.length < d2.length) {
    [d1, d2] = [d2, d1];
  }
  // 将两个数转为数组形式, 反转后相加
  let [arr1, arr2] = [[...d1].reverse(), [...d2].reverse()]; // 不用考虑 arr2 补0

  // 进位标志位
  let num = 0;

  for (let i = 0; i < arr1.length; i++) {
    if (arr2[i]) {
      arr1[i] = Number.parseInt(arr1[i]) + Number.parseInt(arr2[i]) + num;
    } else {
      arr1[i] = Number.parseInt(arr1[i]) + num;
    }
    num = arr[i] >= 10 ? 1 : 0
  }
  if (num === 1) {
    arr1[arr1.length] = num;
  }
  return arr1.reverse().join('');
}
```

#
#### 10. 给定单链表的头指针和一个结点指针，定义一个函数在 o(1) 时间删除该节点

```js
 /** 
  * 常规思路：寻找删除结点的前驱结点 o(n)
  * 
  * 我们尝试使用一下原地算法：可以用下一个结点覆盖删除结点，删除下一个结点即可
  * 边界情况：1. 删除结点位于表尾「顺序遍历」 2. 链表只有一个结点
  *   
  * @param {ListNode} node
  */
  var delNode =  function (head, node) {
    if (!node.next) {
      head.next === node ? head.next = null : seqTraversal()
    } else {
      node.val = node.next.val
      node = node.next.next
      
      node.next = null
    }
    var seqTraversal = function (head, node) {
      while (head.next) head = head.next
    }
    head = null
  }
```


#
#### 11. 输入链表头结点, 反转链表并输出反转后链表头结点

```js
/**
 * 头(尾)插法需要多链表操作「不能直接结点赋值，因为结点就是链表数据结构」
 * 需要每次都新建结点赋值
 * 
 * a -> b -> .. -> h -> i -> j > ..
 * a <- b <- .. <- h <- i  j > ..
 * 
 * 分析「原地」: 反转每一个结点
 * 
 * 假设 h、j、k 是三个相邻结点, 并且已经调整好 h 之前结点
 *  1. i 指向 h 会断链「保留后继结点」            
 *  2. 反转指向 h「保留前驱结点」
 * 
 * @param {ListNode} head
 * @return {尾结点}
 */
var reverseList = function(head) {
  var node = head;
  var prev = null;

  while(node) {
      var next = node.next;/*保存后继*/

      node.next = prev;/*反转链表*/
      prev = node;/*保存前驱*/
      node = next; 
  }
  return prev;/*最后一个结点变为头结点*/
};
```

#
#### 12. 合并两个排序链表

```js
/** 
 *   1. 空链表
 *   2. 链表长度不一致
 */
var mergeTwoLists = function (l1, l2) {
  if (!l1 && !l2) return
  var fn = new ListNode();

  while (l1 && l2) {
    if (l1.val >= l2.val) {
      fn.next = l2;
      l2 = l2.next;
    } else {
      fn.next = l1;
      l1 = l1.next;
    }
    fn = fn.next; /*不要忘记后移指针呐*/
  }

  if (l1) {
    fn.next = l1;
  } else {
    fn.next = l2;
  }

  return fn.next;
};
```

#
#### 13. 树的子结构

```js
// 查找与 s 根节点相同值的结点 [树的遍历]
var isSubtree = function (t, s) {
  let ret = false
  if (t !== null && s !== null) {
    if (t.val === s.val) ret = isSame(t, s)
    if (!ret)
      ret = isSubtree(t.left, s)
    if (!ret)
      ret = isSubtree(t.right, s)
  }
  return ret
}
/**
 * 判断t子树与s子树是否相同
 *   1. 值相同，递归判断子树
 *   2. 值不相同，肯定不同
 * 
 * 递归出口：到达了t或s的叶结点
 */
function isSame(t, s) {
  if (!s) return true/*s的叶结点*/
  if (!t) return false/*t的叶结点*/
  
  if (t.val !== s.val) return false

  return isSame(t.left, s.left) && isSame(t.right, s.right)
}
```

#
#### 14. 二叉树的镜像

```js
/**
 * 其实就是翻转二叉树
 * 
 * 递归：遍历时交换左右子树
 */
var invertTree = function(root) {
  if (!root) return []

  if (root.left && root.right) {
    var tmp = root.left;
    root.left = root.right;
    root.right = tmp;
  }
    return [root.val].concat(invertTree(root.left)).concat(invertTree(root.right))
};
```

#
#### 15. 顺时针打印矩阵

```js
/** 分析
 * 1. 通过 row 和 cols 指针找到对应元素
 *    a) 遍历时行与列循坏次数不变
 
 *    [1    2   3]  [4 「重要!!拐点位于 row-1 和 cols-1」
 *    [5    6   7    8
 *     9   10  11   12]
 *    13] [14  15   16]
 * 
 *    b) 一次循环后, row 和 cols '-' 2 [ 规模缩小不一定只运用于递归 ]
 * 
 * 2. 找到起点位置：起点 (x,y) = (0,0), (1,1)
 * 3. 只有 row(cols) 时, 只用遍历 cols(row)
 */
var spiralOrder = function (matrix) {
  var result = [];

  if (matrix === null || matrix.length === 0 || matrix[0].length === 0) {
    return result;
  }

  var rows = matrix.length;
  var cols = matrix[0].length;

  var x = 0;
  var y = 0;

  while (rows > 0 && cols > 0) {
    if (rows === 1) {
      for (var i = 0; i < cols; i++) {
        result.push(matrix[x][y++]);
      }
      break;
    } else if (cols === 1) {
      for (i = 0; i < rows; i++) {
        result.push(matrix[x++][y]);
      }
      break;
    }

    for (i = 0; i < cols - 1; i++) {
      result.push(matrix[x][y++]);
    }
    for (i = 0; i < rows - 1; i++) {
      result.push(matrix[x++][y]);
    }
    for (i = 0; i < cols - 1; i++) {
      result.push(matrix[x][y--]);
    }
    for (i = 0; i < rows - 1; i++) {
      result.push(matrix[x--][y]);
    }

    x++;
    y++;
    cols -= 2;
    rows -= 2;
  }
  return result;
}
```

#
#### 16. 输入两个整数序列，第一个为栈的压入顺序，判断第二个是否为弹出序列。

```js
  /**
   * 辅助栈模拟序列压入过程 --- 重要呐!!
   * 
   * 将压入顺序依次压入辅助栈, 栈顶元素与弹出序列相比
   *   1. 相同 -> 出栈
   *   2. 不同 -> 继续压栈至压入顺序所有元素都入栈
   *   
   * 检测辅助栈中是否为空， 若空，则该序列是压栈序列对应的一个弹出序列。
   * 
   * @param {辅助栈} stack
   */
  var validateStackSequences = function (pushed, popped) {
    if (pushed.length === 0 || popped.length === 0) {
      return;
    }
    var stack = [];
    var popIndex = 0;
    for (var i = 0; i < pushed.length; i++) {
      stack.unshift(pushed[i]);
      while (stack.length && stack[0] === popped[popIndex]) {
        stack.shift();
        popIndex++;
      }
    }
    return (stack.length === 0);
  }
```

#
#### 17. 从上到下打印二叉树 --- 层次遍历

```js
/**
 *  1. 从下到上打印二叉树：反转最后结果
 *  2. 之字型打印二叉树：反转 idx=odd 中间数组结果
 * 
 * 难点: 将同一层的数组元素打印在一个数组中，将二叉树想象为数组顺序存储结构，两个变量控制层次信息
 * 
 * @param {指向每一层遍历元素的指针} curLvlCnt
 * @param {下一层元素个数} nextLvlCnt
 * 
 * @return {number[][]}
 */
var levelOrder = function(root) {
  var result = [];
  
  if(root === null) return result;
  
  var queue = [], tmp = []
  /*题解的关键*/
  var curLvlCnt = 1;
  var nextLvlCnt = 0;
  
  queue.push(root);
  
  while(queue.length !== 0){
      var p = queue.shift();/*队列先进先出*/
      tmp.push(p.val);
      curLvlCnt--;
      
      if(p.left){
          queue.push(p.left);
          nextLvlCnt++;
      }
      if(p.right){
          queue.push(p.right);
          nextLvlCnt++;
      }
      
      if(curLvlCnt === 0){
          result.push(tmp);
          curLvlCnt = nextLvlCnt;
          nextLvlCnt = 0;
          tmp = [];
      }
  }
  return result;
};
```

#
#### 18. 判断是否为二叉搜索树后续遍历的结果

```js
/**
 * 思路：后续遍历可以找到根节点
 *
 *  1. 将第一个大于根结点之前的元素都作为左子树
 *  2. 判断剩余右子树元素是否都大于根结点
 * 
 * 递归出口: 叶子结点
 * 
 * @param {*} len 
 */
var verifyBst = function (arr) {
  if (arr.length == 1) return

  let len = arr.length
  let root = arr[len-1]

  let i = 0, /*左子树位置*/
      j /*右子树位置*/ 

  for (let i = 0; i < len; i++) {
    if(arr[i] > root.val) {
      break
    }
  }
  for (let j = i; j < len; j++) {
    if(arr[j] > root.val) {
      return false
    }
  }
  left = verifyBst(arr.slice(0, i)) || true
  right = verifyBst(arr.slice(i)) || true

  return left && right
}
```


#
#### 19. 二叉树中和为某一值的路径

```js
/**
 *  二叉树中是否有和为某一值的路径[从根节点到叶子结点]
 *    思路：只要存在一条路径即可
 */
var hasPathSum = function(root, sum) {
  if (root === null) {
      return false;
  }
  
  var left = root.left;
  var right = root.right;
  
  if (left === null && right === null) {
      return root.val === sum;
  }
  /*在函数表达式中减小规模，更少的code /sum -= root.val, sum += root.val/, 更清晰逻辑*/
  return hasPathSum(left, sum - root.val) || hasPathSum(right, sum - root.val);
};

// 打印二叉树中和为某一值的路径
var findPaths = function (root, sum) {
  let path = [];
  let node = root;
  
  find(node, path, sum);
}
/**
 * 回溯法
 * 
 *  1. 在函数表达式中减小规模需要兼容叶子结点的判断
 *  2. 弹出不符合要求结点
 */
var find = function (node, path, sum) {

  path.push(node);
  if (sum === 0) console.log(path)

  if ((!node.left) && (!node.right)) {/*叶子结点*/
    sum -= node.val
    if (sum === 0) console.log(path)
    return
  }

  if (node.left) find(node.left, path, sum - node.val);
  path.pop() /*弹出不符合条件路径结点，回溯法*/

  if (node.right) find(node.right, path, sum - node.val);
  path.pop()
}
```

#
#### 20. 随机指针链表的copy

```js
/**
 * 我们先观察找出其中的对应关系
 * 
 * hashMap 通过 node.val 建立对应的关系
 *  1. 不能建立 node 对应关系 [node 是原链表结点]
 *  2. 两层递归 [正向复制next][反向复制random]
 */
var copyRandomList = function(head) {
  var hashMap = {};
  var newHead = new Node(0);
  newHead.next = copyList(head);
  
  function copyList(node)   {
    if(node === null) {
        return node;
    }
      
    if(hashMap[node.val]) {
        return hashMap[node.val];
    }
    
    var newNode = new Node(node.val);
    hashMap[node.val] = newNode;/*结点与值的对应关系*/
    
    newNode.next = copyList(node.next);
    newNode.random = copyList(node.random);
    
    return newNode;
  }
  
  return newHead.next;
}
```

#
#### 21. 二叉搜索树 -> 双向链表

```js
/** 
 * 递归出口: 遍历到叶节点
 */
function convertNode(t) {
  if (!t) return

  if (t.left) {
    convertNode(t.left);

    treeNode = findMaxNodeInLeft(t)/*左子树最大结点连接在根节点左侧*/
    treeNode.pre = t
    t.next = treeNode
  }
  if (t.right) {
    convertNode(T.right);

    treeNode = findMinNodeInRight(t)/*右子树最小结点连接在根节点右侧*/
    treeNode.next = t
    t.pre = treeNode
  }
}

// 查找左子树中最大的节点
function findMaxNodeInLeft(t) {
  if (t.left)
    while (t.right) t = t.right

  return t;
}
function findMinNodeInRight(t) {
  if (t.right)
    while (t.left) t = t.left

  return t
}
```


#
#### 22. 全排列 --- 回溯法 [辅助数组]

```js
.../*回溯法通用题解框架*/

// 通过 visited[] 数组降低 slice() 时间
var permute = function (nums) {
  var result = [], visited = []

  generate(nums, 0, visited, [], result);
  return result;
};
/**
 * 减小规模: 辅助数组 visited 建立对应关系
 * 递归出口: 已经完成一次排列
 */
var generate = function (nums, idx, visited, output, result) {
  if (nums.length === output.length) {
    result.push(output.slice());
    return;
  }
  for (var i = 0; i < nums.length; i++) {
    if (!visited[i]) {
      visited[i] = true;
      output.push(nums[i]);
      generate(nums, idx + 1, visited, output, result);
      output.pop();
      visited[i] = false;
    }
  }
}
```

#
#### 23. 找到数组中第 k 大的元素

递归：从问题的结果倒推，直到规模缩小到平常 [真的一定要从结果倒推吗？]

```js
/**
 * 快速选择：通过 pivot 划分数组为两部分[无序]，并从后向前查找
 * 递归出口：因为只能确定 pivot 位置有序性，只有 k is part of pivot，返回结果
 *
 *   1. k 在数组较大部分 <-- k <= larger.length
 *   2. k 在基准点 <-- k - larger.length - pivotCnt <= 0
 *   3. k 在数组较小部分 <-- else
 */
var findKthLargest = function(nums, k) {
  var smaller = [];
  var larger = [];
  var pivot = nums[parseInt(nums.length/2)];
  var pivotCnt = 0;
  
  for(var i = 0; i < nums.length; i++) {
      var num = nums[i];      
    
      if(num > pivot) {
          larger.push(num);
      } else if(num < pivot) {
          smaller.push(num);
      } else {
          pivotCnt++;
      }
  }
    
  if(k <= larger.length) { // if larger includes k
      return findKthLargest(larger, k);
  } else if(k - larger.length - pivotCnt <= 0) { // k is part of pivot
      return pivot;
  } else { // if smaller inclues k
      return findKthLargest(smaller, k - larger.length - pivotCnt);
  }
};
```

#
#### 24. 验证二叉树的前序序列化 -- 栈与括号匹配

```js
// 不可以构建二叉树
// 规约思想：[num # #] 可以规约为 [#] 叶节点
var isValidSerialization = function (preorder) {
  var stack = [],
    arr = preorder.split(',');
  for (var i = 0; i < arr.length; i++) {
    stack.push(arr[i]);
    if (arr[i] == '#')
      jc(stack);
  }
  if (stack.length == 1 && stack[0] == '#')
    return true;
  return false;
  function jc(arr) {
    if (arr.length > 2) {
      if (arr[arr.length - 1] == '#' && arr[arr.length - 2] == '#' && arr[arr.length - 3] !== '#') {
        arr.pop();
        arr.pop();
        arr.pop();
        arr.push('#');
        jc(arr);
      }
    }
  }
};
```

#
#### 25. 连续子数组的最大和

```js
/**
 * 
 * dp[i]: nums[i] 子序列最大值
 * 状态转移方程: 
 *  1. dp[i] = dp[i-1] + nums[i] （dp[i-1] >=  0）
 *  2. dp[i] = nums[i] （dp[i-1] <  0）
 */
function maxSum(nums) {
  let tmp = nums[0]
  for (let i = 0; i < nums.length; i++) {
    if (tmp < 0) tmp = nums[i]
    else tmp = tmp + nums[i]
  }
  return tmp
}
```  

#
#### 26. 

```js
```  




 
 

 


