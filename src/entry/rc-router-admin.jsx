import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { matchPath } from 'react-router';
import { HashRouter as Router, Route, Link } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import '../less/rc-router-admin.less';

const PageDetail = () => <div />;

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.time = Date.now();
  }

  render() {
    const { className } = this.props;
    return (
      <div className={`app-page ${className}`}>
        <p>{this.time}</p>
      </div>
    );
  }
}

const TPage = (props) => {
  const { status, component, location } = props;
  return (
    <CSSTransition
      in={status === 'show'}
      timeout={5000}
      appear
      classNames="page"
    >
      <Route component={component} location={location} />
    </CSSTransition>
  );
};

// routes
const routes = [
  {
    path: '/a',
    component: Page,
    name: 'a',
  },
  {
    path: '/a/:id',
    component: PageDetail,
    name: 'a-dtl',
  },
  {
    path: '/b',
    component: Page,
    name: 'b',
  },
  {
    path: '/b/:id',
    component: PageDetail,
    name: 'b-dtl',
  },
  {
    path: '/c',
    component: Page,
    name: 'c',
  },
  {
    path: '/c/:id',
    component: Page,
    name: 'c-dtl',
  },
];

const NavLink = ({ to, ...rest }) => (
  <Route
    path={to}
    children={({ match }) => (
      <li className={match ? 'active' : ''}>
        <Link to={to} {...rest}>
          {to}
        </Link>
      </li>
    )}
  />
);

// app
class App extends React.Component {
  static getDerivedStateFromProps(props, state) {
    let page = props.location.pathname;
    let pages = state.openPages;
    let index = pages.indexOf(page);
    if (index !== -1) pages.splice(index, 1);
    pages.push(page);

    return {
      openPages: pages,
      activePage: page,
    };
  }

  // active page
  static activePage(pages, page) {
    let index = pages.indexOf(page);
    if (index !== -1) pages.splice(index, 1);
    pages.push(page);
    return pages;
  }

  // remove page
  static removePage(pages, page) {
    let index = pages.indexOf(page);
    if (index !== -1) pages.splice(index, 1);
    return pages;
  }

  constructor(props) {
    super(props);

    this.state = {
      openPages: [props.location.pathname],
    };

    this.routes = routes;
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    let pathname = this.props.location.pathname;
    let openPages = this.state.openPages;

    const pages = openPages.map((path) => {
      let match;
      let route;

      this.routes.some((item) => {
        match = matchPath(path, { path: item.path, exact: true });
        route = item;
        return !!match;
      });

      if (!match) return null;

      let matchActive = matchPath(pathname, { path: route.path, exact: true });
      let status = matchActive ? 'show' : 'hide';

      return (
        <TPage
          key={match.url}
          status={status}
          component={route.component}
          location={this.props.location}
        />
      );
    });

    return (
      <Fragment>
        <ul className="app-navs">
          <NavLink to="/a" />
          <NavLink to="/b" />
          <NavLink to="/c" />
        </ul>

        <div className="app-con">
          <div className="app-ctrl" />

          <div className="app-pages">{pages}</div>
        </div>
      </Fragment>
    );
  }
}

ReactDOM.render(
  <Router>
    <Route render={(props) => <App {...props} />} />
  </Router>,
  document.getElementById('app'),
);
