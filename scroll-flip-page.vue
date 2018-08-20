<template>
  <div>
    <slot name="pulldown"></slot>
    <slot></slot>
    <slot name="loadmore" :is-no-data="isNoData"></slot>
  </div>
</template>

<script>
import Fmover from 'finger-mover'
import simulationScrollY from 'simulation-scroll-y'
const extend = (to, from) => {
  for (const key in from) {
    to[key] = from[key]
  }
  return to
}
const noop = () => {}
const fetchType = {
  PULL_DOWN: 'PULL_DOWN',
  LOAD_MORE: 'LOAD_MORE',
  INIT_FETCH: 'INIT_FETCH'
}

export default {
  name: 'ScrollFlipPage',
  data () {
    return {
      pageNum: 0,
      currentData: [],
      noData: false
    }
  },
  computed: {
    isNoData: function () {
      return this.noData || this.currentData.length === 0
    }
  },
  model: {
    prop: 'value',
    event: 'set-data'
  },
  props: {
    scrollBar: {
      type: Boolean,
      default: true
    },
    unidirectional: {
      type: Boolean,
      default: false
    },
    bounce: {
      type: Boolean,
      default: true
    },
    pullDown: {
      type: Object,
      default: function () {
        return {}
      }
    },
    loadMore: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // 请求数据的方法，返回一个 Promise
    fetch: {
      type: Function,
      required: true
    },
    dataField: {
      type: String,
      required: true
    },
    check: {
      type: Function,
      required: true
    },
    // 是否初始化加载数据
    initial: {
      type: Boolean,
      default: true
    },
    // 每页数据尺寸
    pageSize: {
      type: Number,
      default: 20
    },
    // 设置起始页码，因为并不是所有的业务页码都从0开始，有的是从1开始，你可以随意设置起始页码
    startPage: {
      type: Number,
      default: 0
    },
    // 数据赋值前对数据进行预处理
    interceptor: Function
  },
  methods: {
    scrollTo (target, time, limit) {
      this.fm[0].scrollTo(target, time, limit)
    },
    loadEnd () {
      setTimeout(() => {
        this.fm[0].loadEnd()
      }, 500)
    },
    refresh (callBack) {
      this.fm[0].refresh(callBack)
    },
    refreshSize () {
      this.fm[0].refreshSize()
    },
    getValueByField (res, field) {
      const fields = field.split('.')
      let finalValue = res
      fields.forEach(key => {
        try {
          finalValue = finalValue[key]
        } catch (e) {
          console.error(`Error accessing '${field}': ` + e.toString())
        }
      })
      return finalValue
    },
    setData (data) {
      const finalData = this.interceptor && this.interceptor(data)
      if (finalData) {
        this.$emit('set-data', finalData)
      } else {
        this.$emit('set-data', data)
      }
    },
    fetchData (type) {
      this.noData = false
      type = type || fetchType.INIT_FETCH
      if (type === fetchType.INIT_FETCH || type === fetchType.PULL_DOWN) {
        // 重置页码为起始页码
        this.pageNum = this.startPage
      }
      if (type === fetchType.LOAD_MORE) {
        this.pageNum += 1
      }
      return this.fetch(this.pageNum).then(res => {
        const dataFieldVal = this.getValueByField(res, this.dataField)
        if (this.check(res)) {
          if (dataFieldVal.length === 0 && this.pageNum === this.startPage) {
            // 一条数据都没有
            this.$emit('on-nothing')
            this.setData(dataFieldVal)
          } else if (dataFieldVal.length < this.pageSize) {
            this.$emit('on-having')
            // 没有更多数据
            this.noData = true
            // 第一页数据就不足一页
            if (type === fetchType.INIT_FETCH) {
              this.currentData = []
              this.setData(dataFieldVal)
              this.$nextTick(() => {
                this.scrollTo(0, 0)
              })
              // 第一页数据就不足一页的时候，页码需要减1，因为下一次加载更多的时候页码会加1，这样就能保证仍然请求第一页数据
              this.pageNum -= 1
            }
            if (type === fetchType.LOAD_MORE) {
              this.setData(this.currentData.concat(dataFieldVal))
              // 还原页码，保证下次请求仍然请求该页数据
              this.pageNum -= 1
              this.loadEnd()
            }
            if (type === fetchType.PULL_DOWN) {
              this.pageNum -= 1
              this.refresh(() => {
                this.setData(dataFieldVal)
              })
            }
          } else {
            this.$emit('on-having')
            this.currentData = type === fetchType.LOAD_MORE
              ? this.currentData.concat(dataFieldVal)
              : dataFieldVal
            if (type === fetchType.INIT_FETCH) {
              this.setData(this.currentData)
              this.$nextTick(() => {
                this.scrollTo(0, 0)
              })
            }
            if (type === fetchType.LOAD_MORE) {
              this.setData(this.currentData)
              this.loadEnd()
            }
            if (type === fetchType.PULL_DOWN) {
              this.refresh(() => {
                this.setData(this.currentData)
              })
            }
          }
        } else {
          this.$emit('on-backend-error', res)
          if (type === fetchType.LOAD_MORE) {
            // 还原页码，保证下次请求仍然请求该页数据
            this.pageNum -= 1
            this.loadEnd()
          }
          if (type === fetchType.PULL_DOWN) {
            this.refresh()
          }
        }
      }).catch(err => {
        this.$emit('on-network-error', err)
        if (type === fetchType.LOAD_MORE) {
          // 还原页码，保证下次请求仍然请求该页数据
          this.pageNum -= 1
          this.loadEnd()
        }
        if (type === fetchType.PULL_DOWN) {
          this.refresh()
        }
      })
    },
    handlePullDown () {
      this.fetchData(fetchType.PULL_DOWN)
      this.$emit('on-pull-refresh')
    },
    handleLoadMore () {
      this.fetchData(fetchType.LOAD_MORE)
      this.$emit('on-load-more')
    },
    createInstance () {
      if (this.fm) {
        this.fm[0].refreshSize()
        return
      }
      this.fm = new Fmover({
        el: this.$el,
        plugins: [
          simulationScrollY({
            scrollBar: this.scrollBar,
            unidirectional: this.unidirectional,
            bounce: this.bounce,
            pullDown: extend({
              use: true,
              distance: 50,
              onBegin: noop,
              onActive: this.handlePullDown,
              onAfter: noop
            }, this.pullDown),
            loadMore: extend({
              distance: 10,
              onLoadMore: this.handleLoadMore
            }, this.loadMore),
            onTouchStart: (isMotion) => {
              this.$emit('on-touchstart', isMotion)
            },
            onTouchMove: (currentY) => {
              this.$emit('on-touchmove', currentY)
            },
            onTouchEnd: (isMotion) => {
              this.$emit('on-touchend', isMotion)
            },
            onTransMove: (currentY) => {
              this.$emit('on-transmove', currentY)
            },
            onTransMoveEnd: (currentY) => {
              this.$emit('on-transmove-end', currentY)
            },
            onMotionStop: (currentY) => {
              this.$emit('on-motion-stop', currentY)
            }
          })
        ]
      })
    }
  },
  mounted () {
    this.createInstance()
    this.initial && this.fetchData(fetchType.INIT_FETCH)
  },
  updated () {
    this.createInstance()
  },
  created () {
    this.pageNum = this.startPage
  }
}
</script>