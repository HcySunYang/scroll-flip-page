# scroll-filp-page

A super easy to use infinite scroll component.(Vue component)

## Intro

`scroll-flip-page` 是一个 `Vue` 组件，它让你轻松的就能够实现无限滚动加载(翻页)的功能，而不需要考虑更多。

## Installation

该组件封装自开源框架 [finger-mover](https://fmover.hcysun.me/#/zh-cn/) 的 [simulation-scroll-y](https://fmover.hcysun.me/#/zh-cn/plugins/simulation-scroll-y) 插件，故你需要安装之：

```sh
npm install --save finger-mover simulation-scroll-y scroll-filp-page
```

## Why?

在做移动设备上的应用时，我们经常会开发无限滚动加载更多、下拉刷新的功能，也就是移动端的翻页，那么下面我们就看看实现这样一个功能你需要考虑什么：

**假设起始页码是 `1`，每页数据 `20` 条：**

* 一、加载第一页数据

加载第一页数据的时候分三种情况，①：一条数据都没有；②：数据少于 `20` 条，即不足一页；③、数据满足一页

* 二、第一页数据加载完之后，向上滑动加载更多数据

第一页数据加载完成后，根据三种不同的情况，向上滑动加载更多的行为也不同：

④：对于 ①，由于一条数据都没有，此时可能会展示无数据页面，所以不存在加载更多的情况

⑤：对于 ②，有数据，但不足一页，此时用户可以向上滑动加载更多，那么问题来了，加载更多的时候应该加载第一页数据还是第二页数据？你可能会觉得第一页数据已经不足一页了，还有必要让用户上滑加载更多吗？有肯定是有，不过你也可以选择不再加载更多数据，但是更好的行为是**仍然加载第一页数据，二不是第二页**，因为虽然目前第一页数据不足，但你并不能保证下一秒钟第一页数据还不足，很可能在你打个喷嚏的时候，数据库中的数据就多了几十条。所以此时页码不能 `+1`。

⑥：对于 ③，数据满足一页，那么理所当然的页码要 `+1`，继续请求第二页数据

* 三、加载第二页数据

⑦：假设我们来到了情况 ⑥，此时第一页数据满足一页，我们需要页码 `+1` 请求第二页数据，第二页数据的请求结果同样有三种情况：⑧：一条数据都没有；⑨：数据少于 `20` 条，即不足一页；⑩、数据满足一页

* 四、第二页数据加载完之后，向上滑动加载更多数据

对于 ⑧：此时第二页数据为空，所以页码要 `-1`，以允许下次继续请求该页数据。

对于 ⑨：此时第二页有数据，但是不足一页，那么此时与情况 ⑤ 类似，即下一次加载更多的时候仍然请求第二页数据，所以此时页码要 `-1`，以保证下一次仍然请求第二页数据并替换之前的第二页数据(不替换掉岂不是会有重复数据)

对于 ⑩：此时第二页数据满足一页，这时什么都不用做了，下一次加载更多时候页码 `+1` 请求第三页数据。

* 五、下拉刷新需要重置页码

除了以上四点需要考虑，下拉刷新的时候，你需要把页码重置为起始页码。

* 六、更新滚动区域

无论是下拉刷新还是加载更多，亦或是其他导致列表数据变化，你都调用滚动插件的重新计算滚动尺寸的方法。

## Features

* `scroll-flip-page` 的第一点特性就是上面提到的所有内容，你都不需要考虑，因为这些复杂的事情 `scroll-flip-page` 都帮你做好了。
* 由于 `scroll-flip-page` 组件封装自开源框架 [finger-mover](https://fmover.hcysun.me/#/zh-cn/) 的 [simulation-scroll-y](https://fmover.hcysun.me/#/zh-cn/plugins/simulation-scroll-y) 插件。所以该插件拥有的好特性 `scroll-flip-page` 将全部继承，具体请查看 [simulation-scroll-y 与现有解决方案的对比](https://fmover.hcysun.me/#/zh-cn/plugins/simulation-scroll-y?id=%E4%B8%8E%E7%8E%B0%E6%9C%89%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88%E7%9A%84%E5%AF%B9%E6%AF%94)

## Demo

该项目提供一个获取 `Vue` 项目 `contributors` 列表的 Demo：

![](https://ws4.sinaimg.cn/large/006tNc79ly1fmeanv17wvg30bq0i27wh.gif)

如何运行该 Demo？使用简单强大的 [poi](https://poi.js.org/#/)，也强烈推荐你说用。

```
git clone 该项目
npm install -g poi
npm run dev
```

即将会有一个针对该 Demo 的教程，敬请期待...

## Usage

```js
import ScrollFlipPage from 'scroll-flip-page'

// register globally
Vue.component(ScrollFlipPage)

// or locally
export default {
  components: {
    ScrollFlipPage
  }
}
```

## v-model

使用 `v-model` 绑定列表数据：

```html
<scroll-flip-page v-model="dataList">
  <div v-for="item of dataList">{{item.name}}</div>
</scroll-flip-page>
```

## Props

| name              | type          | required  | default  | description  |
| -------------     |:-------------:| --------: | --------:| ------------:|
| scroll-bar        | `Boolean`     | NO        | `true`   | 是否显示滚动条  |
| unidirectional    | `Boolean`     | NO        | `false`  | 是否单向滑动，详情查看[unidirectional](/zh-cn/plugins/simulation-scroll-y?id=unidirectional) |
| bounce            | `Boolean`     | NO        | `true`   | 是否开启边界弹性 |
| pullDown          | `Object`      | NO        | 查看[pullDown](/zh-cn/plugins/simulation-scroll-y?id=pulldown)   | 下拉刷新配置 |
| loadMore          | `Object`      | NO        | 查看[loadMore](/zh-cn/plugins/simulation-scroll-y?id=loadmore)   | 无限滚动配置 |
| fetch             | `Function`    | YES       | 无   | `scroll-flip-page` 将使用该函数获取数据，该函数需要返回一个 `Promise` |
| dataField         | `String`      | YES       | 无   | 告诉 `scroll-flip-page` 使用数据的哪一个字段作为列表数据 |
| check             | `Function`    | YES       | 无   | `scroll-flip-page` 用来判断获取数据是否成功 |
| initial           | `Boolean`     | NO        | `true`   | 是否初始化渲染数据 |
| pageSize          | `Number`      | NO        | `20`     | 每页数据尺寸，`scroll-flip-page` 将用它来判断数据是否满足一页 |
| startPage         | `Number`      | NO        | `0`      | 第一页的页码，默认从 `0` 开始 |
| interceptor       | `Function`    | NO        | 无        | 用来预处理数据，在列表数据真正被赋值到通过 `v-model` 绑定的字段之前被调用，该函数必须返回处理后的列表数据，并且该数据将会被赋值给通过 `v-model` 绑定的字段 |

#### Slots

| name              | description  |
| -------------     | ------------:|
| pulldown          | 下拉动作(如下拉刷新)自定义的DOM内容插槽  |
| loadmore          | 无限滚动自定义DOM内容插槽  |

```html
<scroll-flip-page
  v-model="contributors"
  :fetch="fetchData"
  data-field="body"
  :start-page="1"
  :check="res => res.ok"
>
  <!-- DOM for pulling down the refresh -->
  <div :class="$style.pullDownDom" slot="pulldown">下拉刷新</div>

  
  <!-- For infinite scrolling of DOM -->
  <div :class="$style.loadMoreDom" slot="loadmore" slot-scope="{ isNoData }">
    <span v-show="isNoData">没有更多数据</span>
    <span v-else>加载中...</span>
  </div>
</scroll-flip-page>
```

`scroll-flip-page` 组件并没有提供内置的 `pulldown` 和 `loadmore` DOM结构以及布局，原因是一直以来大家在开发这块相关的内容时，基本都会有自己自定义的下拉刷新和无限滚动的样式。

比如有的产品要求下拉刷新的DOM结构要跟随可滚动元素一起动，有的产品则设计为下拉刷新DOM隐藏在可滚动元素后面，当拖动下拉时会展示下拉刷新DOM，而不是与可滚动元素一起滚动，出于此，组件的思想是：你可以完全自定义你想要的刷新DOM的模式以及样式。

如果你需要一些思路可以查看：[pulldown 的示例部分](/zh-cn/plugins/simulation-scroll-y?id=pulldown) 以及 [loadmore 的示例部分](/zh-cn/plugins/simulation-scroll-y?id=loadmore)

#### Events

##### 运动相关事件

| name              | description         | parameters   |
| -------------     |:-------------------:| ------------:|
| on-touchstart     | `touchstart` 事件    | `(isMotion)`：当 `touchstart` 事件触发时，元素是否在滚动  |
| on-touchmove      | `touchmove` 事件     | `(currentY)`：滚动元素当前的位置  |
| on-touchend       | `touchend` 事件      | `(isMotion)`：当 `touchend` 事件触发时，元素是否在滚动  |
| on-transmove      | 元素惯性滚动时持续触发  | `(currentY)`：滚动元素当前的位置  |
| on-transmove-end  | 元素滚性滚动结束时触发  | `(currentY)`：滚动元素当前的位置  |
| on-motion-stop    | 元素运动停止时触发(`on-transmove-end` 是 `on-motion-stop` 的子集) | `(currentY)`：当滚动元素运动停止时触发  |

##### 业务逻辑相关事件

| name              | description         | parameters          |
| -------------     |:-------------------:| ------------:|
| on-nothing        | 当页码为起始页码且没有数据时触发，即：第一页就没有数据  | 无        |
| on-having         | 无论何时，只要请求有数据返回就会触发                  | 无        |
| on-backend-error  | 当 `check` props 检验为假时触发             | `(res)`：请求返回的数据对象   |
| on-network-error  | 网络出错时触发，比如无网状态等，注意：*不排除是代码报错引起的原因所引起*  | `(err)`：捕获到的错误信息    |
| on-pull-refresh   | 达到下拉刷新临界点后触发 `pullDown: { onActive: function () {} }` 的封装 | 无        |
| on-load-more      | 达到加载更多临界点后触发 `loadMore: { onLoadMore: function () {} }` 的封装 | 无        |

#### Methods

通过给 `<scroll-flip-page></scroll-flip-page>` 组件定义 `ref` 属性：

```html
<scroll-flip-page ref="sfp"></scroll-flip-page>
```

可以在父组件中方法该组件，从而调用组件的方法：

```js
mounted () {
  const sfp = this.$refs.sfp
  sfp.fetchData() // 如果 initial Props 设置为 false，那么可以通过该方法手动获取数据
  sfp.scrollTo(-300, 1000) // 手动滚动元素
}
```

可调用的组件方法以及方法的调用方式请参考：[simulation-scroll-y 的实例方法](/zh-cn/plugins/simulation-scroll-y?id=%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2017, HcySunYang