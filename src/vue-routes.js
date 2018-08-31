export default [
  {
    name: 'index',
    path: '/',
    redirect: '/list',
  },
  {
    name: 'list',
    path: '/list',
    component: require('./component/vue-app/page/list').default,
  },
  {
    name: 'login',
    path: '/login',
    component: require('./component/vue-app/page/login').default,
  },
  {
    name: 'user',
    path: '/user',
    component: require('./component/vue-app/page/user').default,
  },
];
