import '../lib/polyfill';
import Vue from 'vue';
import App from '../vue-component/router-h5/index';

import '../less/rc-router-h5.less';

Vue.debug = process.env.NODE_ENV === 'development';

const Com = Vue.extend(App);

new Com({
  store: mainStore
}).$mount('#app');