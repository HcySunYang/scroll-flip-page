<template>
  <div :class="$style.box">
    <scroll-flip-page
      v-model="contributors"
      :fetch="fetchData"
      data-field="body"
      :start-page="1"
      :check="res => res.ok"
      @on-backend-error="handleBackendError"
      @on-network-error="handleNetworkError"
    >
      <!-- DOM for pulling down the refresh -->
      <div :class="$style.pullDownDom" slot="pulldown">
        <div class="ball-clip-rotate">
          <div></div>
        </div>
      </div>
      <!-- For infinite scrolling of DOM -->
      <div :class="$style.loadMoreDom" slot="loadmore" slot-scope="{ isNoData }">
        <div :class="{
          'ball-clip-rotate': !isNoData
        }">
          <div><span v-show="isNoData">No more data</span></div>
        </div>
      </div>

      <div
        v-for="contributor of contributors"
        :key="contributor.id"
        :class="{
          [$style.item]: true,
          [$style.superItem]: contributor.login === 'HcySunYang'
        }"
      >
        <img :src="contributor.avatar_url"/>
        <h3>{{contributor.login}}</h3>
      </div>
    </scroll-flip-page>
  </div>
</template>

<script>
import ScrollFlipPage from '../dist/scroll-flip-page.js'

export default {
  name: 'Demo',
  data () {
    return {
      contributors: []
    }
  },
  methods: {
    fetchData (pageNum) {
      return this.$http.get('https://api.github.com/repos/vuejs/vue/contributors', {
        params: {
          page: pageNum,
          per_page: 28
        }
      })
    },
    handleBackendError (res) {
      // Usually you need to print the message that the interface brings
      console.log(res.msg)
    },
    handleNetworkError (err) {
      // This function is executed when the network requests an exception
      console.log('network anomaly')
      // But it does not rule out the code error
      console.error(err)
    }
  },
  components: {
    ScrollFlipPage
  }
}
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
@-webkit-keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes rotate {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.ball-clip-rotate > div {
  border-radius: 100%;
  border: 2px solid #333;
  border-bottom-color: transparent;
  height: 20px;
  width: 20px;
  background: 0 0!important;
  display: inline-block;
  -webkit-animation: rotate .75s 0s linear infinite;
  animation: rotate .75s 0s linear infinite;
}
</style>
<style module>
.box {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.item {
  display: flex;
  box-shadow: 0 0 4px #999 inset;
  height: 50px;
  line-height: 50px;
  padding: 10px;
}
.super-item {
  box-shadow: 0 0 10px red inset;
}
.item img {
  width: 50px;
  height: 50px;
}
.item h3 {
  font-size: 20px;
  margin-left: 20px;
}
.pull-down-dom {
  position: absolute;
  top: -50px;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.load-more-dom {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
