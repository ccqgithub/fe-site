import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Switch, matchPath } from 'react-router';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import '../less/rc-router-admin.less';

class PageDetail extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
}

class Page extends React.Component {
  constructor(props) {
    super(props);
    
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

// app
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openPages: [],
      activePage: props.history.pathname
    }

    this.history = props.history;
    this.routes = routes;

    this.unlisten = history.listen((location, action) => {
      let pages = this.state.openPages;
      switch(action) {
        case 'POP':
          pages = this.removePage(pages, this.state.activePage);
          pages = this.activePage(pages, location.pathname);
          this.setState({ 
            openPages: pages, 
            activePage: location.pathname
          });
          break;
        case 'PUSH':
          pages = this.activePage(pages, location.pathname);
          this.setState({ 
            openPages: pages, 
            activePage: location.pathname
          });
          break;
        case 'REPLACE':
          pages = this.removePage(pages, this.state.activePage);
          pages = this.activePage(pages, location.pathname);
          this.setState({ 
            openPages: pages, 
            activePage: location.pathname
          });
          break;
      }
    });
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
    const NavLink = ({ to, ...rest }) => (
      <Route path={to} children={({ match }) => (
        <li className={match ? 'active' : ''}>
          <Link to={to} {...rest}>{to}</Link>
        </li>
      )}/>
    );

    let transitionKey = this.props.location.pathname
      .replace(/^\/(\w+).*$/, '/$1');

    const Pages = ({ match, history, location }) => {

    };

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

          <TransitionGroup className="app-pages">
            <CSSTransition key={transitionKey} classNames="entry-page" timeout={500}>
              <Switch location={this.props.location}>
                <Route path="/a" component={PageA} exact={false} />

                <Route path="/b" component={PageB} exact={true} />
                <Route path="/b/:id" component={PageBDetail} exact={true} />

                <Route path="/c" component={PageC} exact={false} />

                <Route render={() => {
                  return (
                    <div className="app-page">
                      <p>
                        React Router H5 Demo
                      </p>
                      <p>
                        '/a': 子页面层层递进，不能单独访问
                      </p>
                      <p>
                        '/b': 子页面单独访问
                      </p>
                      <p>
                        '/c': 路由弹窗
                      </p>
                    </div>
                  )
                }} exact={false}/>
              </Switch>
            </CSSTransition>
          </TransitionGroup>

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