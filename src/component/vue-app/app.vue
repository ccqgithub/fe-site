<template>
<div id="app" class="app">
  
  <div class="app-header">
    <x-header></x-header>
  </div>

  <div class="app-pages">
    <transition :name="transitionName">
      <keep-alive :include="includeReg">
        <router-view :key="$route.path" ref="router"></router-view>
      </keep-alive>
    </transition>
  </div>

</div>
</template>

<script>
import { Vue, Component, Watch } from 'vue-property-decorator'
import VueRouter from 'vue-router';
import routes from '../../vue-routes';
import { getBaseUrl } from '../../lib/site';
import { __ } from '../../lib/i18n';
import XHeader from './com/header';
import { mainStore } from '../../data/vue-stores/main';

// router
const baseUrl = location.pathname.replace(/^(.*?\/vue\/).*$/, '$1');
const router = new VueRouter({
  mode: 'history',
  base: baseUrl,
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});
// check login
router.beforeEach((to, from, next) => {
  if (
    !mainStore.state.loginUser
    && to.name != 'login'
  ) {
    next('/login');
    return;
  }
  next(true);
});

const routeQueue = [];
let historyLength = history.length;

@Component({
  name: 'App',
  router: router,
  components: {
    XHeader
  }
})  
export default class App extends Vue {
  
  data() {
    return {
      routeQueue: [this.$router.currentRoute],
      historyLength: history.length,
      transitionName: 'slide-left',
      init: false
    }
  }

  get user() {
    return this.$store.state.loginUser;
  }

  // 控制 keep-alive 缓存
  get includeReg() {
    return this.user ? /.*/ : /[\s|S]/;
  }

  beforeCreate() {
    this.cachePages = {};
  }

  mounted() {
    // 当前路由加入队列
    routeQueue.push(this.$router.currentRoute);
  }

  clearCachePages() {
    Object.keys(this.cachePages).forEach(key => {
      this.cachePages[key].$destroy();
      delete this.cachePages[key];
    });
  }

  logout() {
    this.$store.commit('setLoginUser', null);
    this.$router.replace('/login');
  }

  @Watch('user') 
  onUserChange(to ,from) {
    console.log(to)
  }

  @Watch('$route')
  onRouteChange(to, from) {
    if (to.path === '/login') {
      this.clearCachePages();
    }
    // cache current pages
    this.cachePages[this.$route.path] = this.$refs.router;

    let transitionName = 'slide-left';
    let curHistoryLength = history.length;
    let routeQueue = this.routeQueue;

    // back
    if (
      curHistoryLength <= this.historyLength
      && routeQueue.length > 1 
      && from.fullPath == routeQueue[routeQueue.length - 1].fullPath
      && to.fullPath == routeQueue[routeQueue.length - 2].fullPath
    ) {
      routeQueue.pop();
      transitionName = 'slide-right';
    } else {
      routeQueue.push(to);
    }

    this.transitionName = transitionName;
    this.historyLength = curHistoryLength;
  }
}
</script>

<style lang="less">
.app {
  .app-header {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 50px
  }

  .app-pages {
    position: absolute;
    left: 0;
    top: 50px;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
  }

  .page {
    height: 100%;
    overflow: auto;
    transition: all .5s ease;
    z-index: 1;
  }
  .slide-left-enter, .slide-right-leave-active {
    transform: translate(100%, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    transform: translate(-100%, 0);
  }
}
</style>
