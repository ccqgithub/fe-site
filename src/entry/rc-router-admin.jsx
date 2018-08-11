import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Switch, matchPath } from 'react-router';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import '../less/rc-router-admin.less';

class PageDetail extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return <div></div>
  }
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.time = Date.now();
  }
  
  render() {
    return <div className={`app-page ${this.props.className}`}>
      <p>{this.time}</p>
    </div>
  }
}

class TPage extends React.Component {
  constructor(props) {
    super(props); 
  }
  
  render() {
    return (
      <CSSTransition 
        in={this.props.status == 'show'} 
        timeout={5000} 
        appear={true} 
        classNames="page"
      >
        <Route component={this.props.component} location={this.props.location}/>
      </CSSTransition>
    )
  }
}

// routes
const routes = [
  {
    path: '/a',
    component: Page,
    name: 'a'
  },
  {
    path: '/a/:id',
    component: PageDetail,
    name: 'a-dtl'
  },
  {
    path: '/b',
    component: Page,
    name: 'b'
  },
  {
    path: '/b/:id',
    component: PageDetail,
    name: 'b-dtl'
  },
  {
    path: '/c',
    component: Page,
    name: 'c'
  },
  {
    path: '/c/:id',
    component: Page,
    name: 'c-dtl'
  }
];

const NavLink = ({ to, ...rest }) => (
  <Route path={to} children={({ match }) => (
    <li className={match ? 'active' : ''}>
      <Link to={to} {...rest}>{to}</Link>
    </li>
  )}/>
);

// app
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openPages: [props.location.pathname],
      activePage: props.location.pathname
    }

    this.routes = routes;
  }

  static getDerivedStateFromProps(props, state) {
    let page = props.location.pathname;
    let pages = state.openPages;
    let index = pages.indexOf(page);
    if (index != -1) pages.splice(index, 1);
    pages.push(page);

    return  {
      openPages: pages,
      activePage: page
    }
  }

  // active page
  activePage(pages, page) {
    let index = pages.indexOf(page);
    if (index != -1) pages.splice(index, 1);
    pages.push(page);
    return pages;
  }

  // remove page
  removePage(pages, page) {
    let index = pages.indexOf(page);
    if (index != -1) pages.splice(index, 1);
    return pages;
  }

  componentWillUnMount() {
    this.unlisten();
  }
  
  render() {
    let pathname = this.props.location.pathname;
    let openPages = this.state.openPages;

    const pages = openPages.map(path => {
      let match;
      let route;
      
      this.routes.some(item => {
        match = matchPath(path, {path: item.path, exact: true});
        route = item;
        return !!match;
      });
      
      if (!match) return null;
      
      let matchActive = matchPath(pathname, {path: route.path, exact: true});
      let status = matchActive ? 'show' : 'hide';

      return (
        <TPage 
          key={match.url} 
          status={status} 
          component={route.component} 
          location={this.props.location}>
        </TPage>
      )
    });

    return (
      <Fragment>
        <ul className="app-navs">
          <NavLink to='/a' />
          <NavLink to='/b' />
          <NavLink to='/c' />
        </ul>

        <div className="app-con">

          <div className="app-ctrl">

          </div>

          <div className="app-pages">
            {pages}           
          </div>
          
        </div>
      </Fragment>
    );
  }
}

ReactDOM.render(
  <Router>
    <Route render={(props) => {
      return <App {...props} />
    }}/>
  </Router>,
  document.getElementById('app')
);