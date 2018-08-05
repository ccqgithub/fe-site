import '../lib/polyfill';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import { VueGentX } from 'gentx';
import wx from "../lib/jweixin-1.3.2";
import { mainStore } from '../data/vue-stores/main';
import App from '../vue-component/app';

import '../less/vue-app.less';
import '../lib/vue-filters';
import 'nprogress/nprogress.css';

Vue.debug = process.env.NODE_ENV === 'development';
Vue.use(Vuex);
Vue.use(VueGentX);
Vue.use(VueRouter);

// global wx
window.wx = wx;
wx.error(function(res) {
  console.log(res);
});

const Com = Vue.extend(App);

new Com({
  store: mainStore
}).$mount('#app');

// mobile keyboard
// window.addEventListener("resize", function() {
//   if(
//     document.activeElement.tagName=="INPUT"
//     || document.activeElement.tagName=="TEXTAREA"
//   ) {
//     window.setTimeout(function() {
//       document.activeElement.scrollIntoViewIfNeeded();
//     },0);
//   }
// });
