import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import '../less/rc-router-h5.less';

// page a
class PageA extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    // let { match, location, history, route } = this.props;



    return <div></div>
  }
}

// page a
class PageB extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return <div></div>
  }
}

// page c
class PageC extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return <div></div>
  }
}

// page c detail
class PageCDetail extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return <div></div>
  }
}

// form
class Form extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return <div></div>
  }
}

// pick
class Pick extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return <div></div>
  }
}

// 路由
const routes = [{
  path: '/a',
  component: PageA,
  children: [{
    path: '/form',
    component: Form,
    children: [{
      path: '/pick',
      component: Pick
    }]
  }]
}, {
  path: '/b',
  component: PageB,
  children: [{
    path: '/pick',
    component: Pick
  }]
}, {
  path: '/c',
  component: PageC,
  children: [{
    path: '/:id',
    component: PageCDetail,
    children: [{
      path: '/pick',
      component: Pick
    }]
  }]
}];

// app
class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.history = createBrowserHistory();
  }
  
  render() {
    let routes = this.props.routes;

    const navs = routes.map(item => {
      return (
        <Link to={{ pathname: item.path }}> {item.path} </Link>
      );
    });

    const pages = routes.map(item => {
      return (
        <Route route={item}></Route>
      );
    });

    return (
      <div className="app">
        <ul className="app-nav">
          { navs }
        </ul>
        <div className="app-pages">

        </div>
      </div>
    );
  }
}