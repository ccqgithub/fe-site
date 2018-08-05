export default [
  {
    name: 'index',
    path: '/',
    redirect: '/list'
  },
  {
    name: 'list',
    path: '/list',
    component: require('./vue-component/page/list').default,
  },
  {
    name: 'login',
    path: '/login',
    component: require('./vue-component/page/login').default,
  },
  {
    name: 'user',
    path: '/user',
    component: require('./vue-component/page/user').default,
  },
];