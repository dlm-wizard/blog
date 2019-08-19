#
### 树
#### 递归
一棵树要么是空树，要么有两个指针，每个指针指向一棵树。树是一种递归结构，很多树的问题可以使用递归来处理。

* 递归出口一定在函数 start 处执行
* 

#
#### 1. 二叉树的深度
* [leeocode 104. 二叉树的最大深度](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/submissions/)

```js
/**
 * 1. 二叉树只有一个结点: 深度为1
 * 2. 根结点只有左(右)子树: deep = maxDepth(left/right) + 1
 * 3. 左右子树都存在: deep = max(maxDepth(left), maxDepth(right)) + 1
 */
var maxDepth = function(root) {
  if(!root) return 0;
  
  return 1+ Math.max(maxDepth(root.left), maxDepth(root.right));
};
```

#
#### 2. 平衡二叉树
* [leeocode 110. 是否为平衡二叉树？](https://leetcode-cn.com/problems/maximum-depth-of-binary-tree/submissions/)

```js
/**
 * BST 结点左右子树高度差都小于1
 * 
 * 另一种思路：这意味着二叉树最大高度与二叉树最小高度差小于1
 */
var maxHeight = function(node) {
  if(node === null) return 0;

  return 1 + Math.max(maxHeight(node.left), maxHeight(node.right));
}

var minHeight = function(node) {
  if(node === null) return 0;

  return 1 + Math.min(minHeight(node.left), minHeight(node.right));
}
var isBalanced = function(root) {
  if(root === null) return true;
  
  var maxh = maxHeight(root);
  var minh = minHeight(root);
  
  return Math.abs(maxh - minh) <= 1;
};
```

#
#### 3. 两节点的最长路径
* [leeocode 543. 二叉树任意两个结点路径中的最大值](https://leetcode-cn.com/problems/diameter-of-binary-tree/)

```js
/**
 * 超出时间限制了
 * 
 * 1. 路径长度的最大值 = 左子树最深路径 + 右子树最深路径
 * 2. 作用域链
 */
var diameterOfBinaryTree = function (root) {

  var maxDepth = function (root) {
    if (root === null) return 0

    var maxLh = maxDepth(root.left)
    var maxRh = maxDepth(root.right)

    max = Math.max(max, maxLh + maxRh);

    return Math.max(maxDepth(root.left), maxDepth(root.right)) + 1
  }

  if (root === null) return 0
  var max = 0

  maxDepth(root) // 根节点深度最大
  return max
};
```

#
#### 4. 翻转二叉树
* [leeocode 266. 翻转二叉树](https://leetcode-cn.com/problems/diameter-of-binary-tree/)

```js
// 翻转每个结点的子树
var invertTree = function(root) {
    if(root === null) return root;
    
    [root.left, root.right] = [root.right, root.left]
    
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
};
```


#
#### 5. 归并二叉树

```js
/**
 * 没有要求原地合并
 * 
 * 1. t1存在，t2为空 [反之]
 * 2. t1, t2 都存在
 * 
 */
var mergeTrees = function () {
  if (t1 == null && t2 == null) return null;
  if (t1 == null) return t2;
  if (t2 == null) return t1;

  TreeNode root = new TreeNode(t1.val + t2.val);
  root.left = mergeTrees(t1.left, t2.left);
  root.right = mergeTrees(t1.right, t2.right);

  return root;
}
```

#
#### 6. 路径总和 [错误版本，无法判断特殊情况]
* [leeocode 112. 路径总和](https://leetcode-cn.com/problems/path-sum/submissions/)

```js
/**
 * 1. 根节点到叶子结点的路径 [不是任意结点]
 * 2. 不要在叶子结点判断 sum === 0 [先判断递归出口还是先判断路径和呢？]
 * 
 */
var hasPathSum = function(root, sum) {
    if (sum === 0) return true
    if (root === null) return false

    if (root) {
      if (root.left) return hasPathSum(root.left, sum - root.left.val)
      if (root.right) return hasPathSum(root.right, sum - root.right.val)
    }
};
```

#
#### 7. 路径总和 [不一定从根结点开始，也不需要在叶子结点结束]
* [leeocode 437. 任意路径总和](https://leetcode-cn.com/problems/path-sum-iii/submissions/)

在 pathSum() 声明 `var cnt = 0` 每次都会把递归累加和置为 0
```js
/*因为使用作用域链，且cnt为全局变量，所以导致执行答案错误...在上次运行的cnt基础上累加*/
var cnt = 0 // warning1: 全局变量
var pathSum = function(root, sum) {
  // warning2: 作用域链
  var hasPathSum = function (root, sum) {
    if (root === null) return false
  
    if (root.val === sum) {
      cnt = cnt + 1
    }
  
    return hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - root.val)
  }
  
  hasPathSum(root, sum)

  if (root) {
    // pathSum 调用 hasPathSum, 二叉树未遍历 [只有root与其左右结点count]
    if (root.left) pathSum(root.left, sum)
    if (root.right) pathSum(root.right, sum)
  }

  return cnt
};
```

```js
/**
 * 1. 通过变量赋值solve 1.全局变量  2.作用域链 [var ret = 0...]
 * 2. var ret = hasPathSum() + pathSum() + pathSum()
 */
var pathSum = function(root, sum) {
  if (root == null) return 0;

  var ret = hasPathSum(root, sum) + pathSum(root.left, sum) + pathSum(root.right, sum);
  return ret;
}
var hasPathSum = function(root, sum) {
  if (root == null) return 0;

  var cnt = 0;
  if (root.val == sum) {
    cnt = cnt + 1;
  }
  cnt += hasPathSum(root.left, sum - root.val) + hasPathSum(root.right, sum - root.val);
  
  return cnt;
}
```


#
#### 8. 树的子树
* [leeocode 572. 另一棵树的子树（LeetCode 题解子树必须相同，而不能是包含关系）](https://leetcode-cn.com/problems/subtree-of-another-tree/)

```js
// error: 将值的比较放在了递归出口之前 [空指针]
var isSubtree = function (s, t) {
  if (root === null) return false

  if (isSameTree(s, t)) return true

  return isSubtree(s.left, t) || isSubtree(s.right, t)

};
var isSameTree = function (t1, t2) {
  if (t2 === null) return true
  if (t1 === null) return false/*t2肯定不为null*/
  if (t1.val !== t2.val) return false/*error: 将值判断写在最开始*/


  return isSameTree(t1.left, t2.left) && isSameTree(t1.right, t2.right)
}
```


#
#### 9. 对称的二叉树
* [leeocode 101. 对称二叉树](https://leetcode-cn.com/problems/symmetric-tree/submissions/)

```js
/**
 * 1. 很简单，翻转左子树后判断是否与右子树相同 
 */
var isSymmetric = function(root) {
  if (root) {
    var right = reverse(root.right)
    return isSameTree(root.left, right)
  }
};
var reverse = function (root) {
  if (root) {
    [root.left, root.right] = [root.right, root.left]

    if (root.left) reverse(root.left)
    if (root.right) reverse(root.right)
  }
  return root
}
var isSameTree = function (t1, t2) {
  if (t1 === null && t2 === null) return true
  if (t1 === null || t2 === null) return false
  if (t1.val !== t2.val) return false

  return isSameTree(t1.left, t2.left) && isSameTree(t1.right, t2.right)
}
```
```js
/**
 * 层次遍历的判断方式
 * 
 * 1. 用 cacheNextLev 记录当前一层结点数量
 * 2. 当前层结点压入一半时，利用栈的特点出栈比较 [无法比较出左左的情况..]
 * 
 */
var isSymmetric = function(root) {
  var queue = [], node, tmp = [], compare = []
  var curLev = 1
  var nextLev = 0
  var cacheNextLev = 0


  if (root) {
    queue.push(root)
  }
  while (queue.length) {
    node = queue.shift()
    tmp.push(node.val)
    curLev = curLev - 1

    if (curLev === cacheNextLev/2) {

      while (curLev) {
        compare = [...tmp]
        var n = compare.pop()
  
        if ((node.left && n !== node.left.val) && (node.right && n !== node.right.val)) {
          return false
        }
      }
      curLev = curLev - 1

    } else {

      if (node.left) {
        queue.push(node.left)
        nextLev = nextLev + 1
      }
      if (node.right) {
        queue.push(node.right)
        nextLev = nextLev + 1
      }
    }
    
    if (curLev === 0) {
      curLev = nextLev
      cacheNextLev = nextLev

      nextLev = 0
      tmp = []
    }
  }
  return true
}
```

#
#### 10. 统计左叶子节点的和
* [leeocode 404. 左叶子结点之和](https://leetcode-cn.com/problems/sum-of-left-leaves/submissions/)

```js
/*当前结点的左叶子结点值（如果有） + 递归*/
var sumOfLeftLeaves = function (root) {
  if (root == null) return 0;

  if (isLeaf(root.left)) {
    return root.left.val + sumOfLeftLeaves(root.right);
  }
  return sumOfLeftLeaves(root.left) + sumOfLeftLeaves(root.right);
}
var isLeaf = function (node) {
  if (node == null) return false;
  return node.left == null && node.right == null;
}
```

#
#### 11. 最长同值路径
* [leeocode 687. 最长同值路径](https://leetcode-cn.com/problems/longest-univalue-path/)

```bash
       3
      / \
     9  20
       /  \
      15   7

# 求结点3的同值最大路径长度

1. left = 结点9的同值最大路径长度 [max(leftPath, rightPath)]
2. right = 结点20同值... [max(leftPath, rightPath)]

# => 3的同值最大路径长度 = max(leftPath, rightPath)

1. leftPath = max(left, right) + (3 == 9 ? 1 : 0)
2. rightPath = max(left, right) + (3 == 20 ? 1 : 0)
```

```js
// 自底向上访问
var longestUnivaluePath = function (root) {

  var path = 0;

  var dfs = function (root) {
    if (root == null) return 0;
  
    var left = dfs(root.left);
    var right = dfs(root.right);
  
    var leftPath = root.left && root.left.val == root.val ? left + 1 : 0; /*root.left != null*简写*/
    var rightPath = root.right && root.right.val == root.val ? right + 1 : 0;
  
    path = Math.max(path, leftPath + rightPath);
    return Math.max(leftPath, rightPath);
  }

  dfs(root);
  return path;
}
```


#
#### 12. house-robber-iii [间隔遍历]
* [leeocode 337. 间隔遍历-TODO](https://leetcode-cn.com/problems/house-robber-iii/submissions/)

```js
// 层次遍历错误解法: 只能跨越结点，要是跨越结点呢

/**
 * 因为当前层最大值 = max(curLevVal, nextLevVal)
 * 可以跨越多层遍历 [跨越层级取决于当前层的最大值]
 * 
 * 1. curLevVal: 当前层结点值
 * 2. nextLevVal: 下一层结点值
 * 
 */
var rob = function(root) {
  if (root === null) return 0

  let curLevVal = root.val

  if (root.left) curLevVal += rob(root.left.left) + rob(root.left.right)
  if (root.right) curLevVal += rob(root.right.left) + rob(root.right.right)

  let nextLevVal = rob(root.left) + rob(root.right)

  return Math.max(curLevVal, nextLevVal)
}
```

#
#### 13. 特殊二叉树中第二小的节点 
* [leeocode 671. 特殊二叉树中第二小的节点](https://leetcode-cn.com/problems/second-minimum-node-in-a-binary-tree/)

> 递归思路比较难想到
```js
/**
 * 前提条件:
 * 1. 一个节点有 0 个或 2 个子节点
 * 2. 如果有子节点，那么根节点是最小的节点
 * 
 * 思路: 比较难想
 * 1. 存在孩子节点, 第二小的节点值为 min(lval, rval)
 * 2. 孩子节点 == 根节点，需要递归寻找
 * 
 */
var findSecondMinimumValue = function(root) {

  if (root == null) return -1;

  if (root.left == null && root.right == null) return -1;

  var lval = root.left.val;
  var rval = root.right.val;

  if (lval == root.val) lval = findSecondMinimumValue(root.left);
  if (rval == root.val) rval = findSecondMinimumValue(root.right);

  if (lval != -1 && rval != -1) return Math.min(lval, rval);
  if (lval != -1) return lval;
  return rval;

}
```

#
#### 层次遍历 

* 从左到右
* 从右到左
* z 字型

#### 广度优先遍历递归方式


```js
// 无聊随便写写，没意义
(function () {
  let arr = [], tmp = []

  var bst = function(node, i) {
    if (node === null) return // 递归出口

    arr[i] = arr[i] || []
    arr[i].push(node.val)

    bst(node.left, i + 1)
    bst(node.right, i + 1)
  }
  bst(root, 0)
})(root)
```

#
#### 1. 找到树左下角的值
* [leeocode 513. 找树左下角的值](https://leetcode-cn.com/problems/second-minimum-node-in-a-binary-tree/)


```js
// 从右向左遍历即可  
var findBottomLeftValue = function (root) {
  var queue = [];
  queue.push(root);
  while (queue.length) {
    root = queue.shift();
    if (root.right != null) queue.push(root.right);
    if (root.left != null) queue.push(root.left);
  }
  return root.val;
}
```

#
#### 二叉树的遍历

#### 1. 前序遍历

* [leeocode 144. 非递归实现二叉树的前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/submissions/)
Recursive solution
```js
/**
 * 递归出口: if (!root) return [] -- 自然是当前元素是 null
 * 递归: 处理每一个子树就是缩小了规模, 难点在于如何合并结果
 *
 * 合并结果: mid.concat(left).concat(right) -- mid 是具体节点, left 和 right 递归求出即可
 */
var preorderTraversal = function (root) {
  if (!root) {
    return []
  }
  return [root.val].concat(preorderTraversal(root.left)).concat(preorderTraversal(root.right))
}
```

iterative solutuon
```js
/**
 * 根开始，那么就很简单, 先将根节点入栈
 *  1) 看有没有右节点，有则入栈
 *  2) 出栈一个元素，重复即可
 * 
 */
var preorderTraversal = function (root) {
  if (!root) return [];
  const ret = [];
  const stack = [root];
  let left = root.left;
  let t = stack.pop();

  while (t) {
    ret.push(t.val)

    if (t.right) stack.push(t.right)
    if (t.left) stack.push(t.left)

    t = stack.pop()
  }

  return ret;
};
```

#
#### 2. 中序遍历
* [leeocode 94. 非递归实现二叉树的中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/submissions/)

iterative solutuon
```js
/**
 * 无法在步骤 2 中包含步骤 3
 * 
 * 1. 根节点入栈
 * 2. 判断有没有左节点，如果有，则入栈，直到叶子节点
 * 3. 出栈，判断有没有右节点，有则入栈，继续执行 2
 * 
 */
var inorderTraversal = function (root) {
  if (!root) return [];
  
  const stack = [root];
  const ret = [];
  let node = root.left;

  let item = null; // stack 中弹出的当前项

  while (node) {
    stack.push(node);
    node = node.left;
  }

  while (item = stack.pop()) {
    ret.push(item.val);
    let t = item.right;

    while (t) {
      stack.push(t);
      t = t.left;
    }
  }
  return ret;
};
```



#
#### 3. 后续遍历

* [leeocode 145. 非递归实现二叉树的后序遍历](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/submissions/)

iterative solutuon
```js
/**
 * 根节点是最后输出
 * 难点: 左右结点出栈后，用标志位防止左右结点重复入栈
 * 
 * 1. 子节点已经遍历过了
 * 2. 叶子节点
 */
var postorderTraversal = function(root) {

  if (!root) return [];
  const ret = [];
  const stack = [root];
  let p = root; // 标识元素，用来判断节点是否应该出栈

  while (stack.length > 0) {
    const top = stack[stack.length - 1];
    if (
      top.left === p ||
      top.right === p ||
      (top.left === null && top.right === null)
    ) {
      p = stack.pop(); // 标志当前出栈元素
      ret.push(p.val);
    } else {
      if (top.right) {
        stack.push(top.right);
      }
      if (top.left) {
        stack.push(top.left);
      }
    }
  }
  return ret;
};
```


#
#### BST

* root.val >= root.left.val && root.val <= root.right.val
* 二分查找

#### 1. 修剪 BST

* [leeocode 669. 修剪BST](https://leetcode-cn.com/problems/trim-a-binary-search-tree/submissions/)

结点不要跨层级操作...递归是顺序逻辑
```js
// error: 结点换层之后，会跳过自己的本身的判断...
var trimBST = function(root, L, R) {
  if (root === null) return

  if (root && root.val < L) {
    root.left = null 
    root = root.right /*将结点2换层置结点1*/    
  }
  else if (root && root.val > R) {
    root.right = null
    root = root.left
  }
  
  /*root = root.right后，不会再经过 root.right 的校验*/
  if(root && root.left) root.left = trimBST(root.left, L, R)
  if(root && root.right) root.right = trimBST(root.right, L, R)

  return root
};
```

```js
/**
 * 不要忘记递归是什么: 从问题的结果倒推，直到问题规模缩小到寻常
 * 1. 问题的结果是什么
 * 2. 寻常是什么
 */
var trimBST = function(root, L, R) {
  if (root == null) return null;

  if (root.val > R) return trimBST(root.left, L, R); /*截断root && root.right*/
  if (root.val < L) return trimBST(root.right, L, R); /*截断root && root.left*/

  root.left = trimBST(root.left, L, R);
  root.right = trimBST(root.right, L, R);

  return root; /*不截断*/
}
```

#
#### 2. 寻找二叉查找树的第 k 个元素
* [leeocode 230. 二叉搜索树中第K小的元素](https://leetcode-cn.com/problems/kth-smallest-element-in-a-bst/submissions/)

```js
var kthSmallest = function(root, k) {
  var cnt = 0, val

  var inorder = function(node, k) {
    if (node == null) return;
  
    if (node.left) inorder(node.left, k)
    cnt++
    if (cnt === k) {
      val = node.val
      return val
    }
    if (node.right) inorder(node.right, k)
  }

  inorder(root, k)
  return val
}
```

只对左子树进行递归
```js
/**
 * 递归函数: 返回左子树中第k小节点
 * 
 * 1. 深度为0, 只有自己一个节点
 * 2. k [第k小节点] > leftCnt [左节点数]
 * 节点在右子树中, 将右子树视为 root，重新计算
 * 
 */
var kthSmallest = function(root, k) {
  var leftCnt = maxDep(root.left); /*左子树的深度*/

  if (leftCnt == k - 1) return root.val;
  if (leftCnt > k - 1) return kthSmallest(root.left, k);

  return kthSmallest(root.right, k - leftCnt - 1);
}

var maxDep = function(node) {
  if (node == null) return 0;
  return 1 + maxDep(node.left) + maxDep(node.right);
}
```



#
#### 3. 把二叉搜索树转换为累加树
* [leeocode 538. 把二叉搜索树转换为累加树](https://leetcode-cn.com/problems/convert-bst-to-greater-tree/submissions/)

```js
var convertBST = function(root) {
    var sum = 0
    /**
     * 1. 作用域链
     * 2. BST的性质
     */
    var traver = function(node) {
        if (node == null) return;
        traver(node.right);
        sum += node.val;
        node.val = sum;
        traver(node.left);
    }
    
    traver(root);
    return root;
}
```


#
#### 5. 将有序数组转为平衡二叉树
* [leeocode 108. 将有序数组转换为二叉搜索树](https://leetcode-cn.com/problems/convert-sorted-array-to-binary-search-tree/submissions/)

```js
/**
 * 如何让左右子树高度差 < 1 呢？
 * 二分查找分割 [左右数组个数 === 1 / 0]
 */
var sortedArrayToBST = function(nums) {
    return balanceTree(0, nums.length -1, nums)
};
var balanceTree = function (low, high, nums) {
    if (low > high) return null

    var mid = Math.floor((low+high)/2)

    var root = new TreeNode(nums[mid])

    root.left = balanceTree(low, mid-1, nums)
    root.right = balanceTree(mid+1, high, nums)

    return root
}
```

#
#### 6. 有序链表转换二叉搜索树
* [leeocode 109. 有序链表转换二叉搜索树](https://leetcode-cn.com/problems/convert-sorted-list-to-binary-search-tree/submissions/)

```js
/**
 * 链表如何实现二分查找?
 * 
 * 双指针 [快慢指针]
 * 1. 难点：快指针走2步，慢指针走1步 [模拟向下取余]
 *    !pre指针: 下趟查找舍去 mid 节点
 * 
 *  
 * 2. 如何截取链表... [没想到，断开链表]
 * 3. 递归出口生成节点
 * 
 */
var sortedListToBST = function(head) {
    if (head === null) return null
    if (head.next === null) return new TreeNode(head.val) 

    var pre = binarySeach(head)

    var mid = pre.next // 1. 保存右链表
    var root = new TreeNode(mid.val)

    pre.next = null // 2. 关键 [断链]

    root.left = sortedListToBST(head) // 3. head: 左链表
    root.right = sortedListToBST(mid.next) // 4. mid.next: 二分右链表

    return root
};
var binarySeach = function (head) {
    // if (head.next === null) return 仅用来查找而已

    var slow = fast = head
    var pre = slow

    // while(fast.next.next) 头脑简单
    while (fast.next && fast.next.next) {
        fast = fast.next.next

        pre = slow
        slow = slow.next
    }
    return pre
}
```


#
#### 7. 

```js

```





