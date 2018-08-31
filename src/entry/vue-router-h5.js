import '../lib/polyfill';
import Vue from 'vue';
import App from '../component/vue-router-h5/index.vue';

import '../less/rc-router-h5.less';

Vue.debug = process.env.NODE_ENV === 'development';

const Com = Vue.extend(App);

new Com({}).$mount('#app');