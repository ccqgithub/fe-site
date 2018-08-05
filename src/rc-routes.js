export default [
  {
    name: 'index',
    path: '/',
    redirect: '/list'
  },
  {
    name: 'list',
    path: '/list',
    component: require('./rc-component/page/list').default,
  },
  {
    name: 'login',
    path: '/login',
    component: require('./rc-component/page/login').default,
  },
  {
    name: 'user',
    path: '/user',
    component: require('./rc-component/page/user').default,
  },
];