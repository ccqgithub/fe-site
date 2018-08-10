import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { Switch, matchPath } from 'react-router';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import '../less/rc-router-h5.less';

// get first matched url from routes 
// with current location
const getFirstUrlFromRoutes = (routes, location) => {
  let key = null;

  routes.some(item => {
    let match = matchPath(location.pathname, {
      path: item.path,
      exact: false
    });

    let childMatch = matchPath(location.pathname, {
      path: item.childPaths || [],
      exact: true
    });

    if (match || childMatch) {
      key = match.url;
    }

    return !!key;
  });

  return key;
}

// add transiton route to inner page
// props: component, path, exact, location, ...other
class InnerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      match: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    let {path, exact, location} = props;
    let match = matchPath(location.pathname, {
      path,
      exact
    });

    return {
      location: match ? location : state.location,
      match
    }
  }

  render() {
    let { path, exact, component: Component } = this.props;

    if (!this.state.location) return null;

    return (
      <CSSTransition 
        in={!!this.state.match} 
        classNames="inner-page" 
        timeout={250} 
        appear={true}
        unmountOnExit={true}
      >
        <Route  
          location={this.state.location}
          path={path}
          exact={exact}
          render={({ match, ...rest }) => {
            if (!match) return null;
            return (
              <Component 
                {...this.props}
                {...rest}
              />
            )
          }}
        />
      </CSSTransition>
    )
  }
}

// gender
class Gender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usergender: this.props.form.usergender || ''
    };
  }
  
  render() {
    return (
      <div className="app-page">
        <p>
          Form Data: { JSON.stringify(this.props.form) }
        </p>
        <p>
          <label>
            <input 
              type="radio" 
              value="Male"
              checked={this.state.usergender === 'Male'}
              onChange={() => this.setState({ usergender: 'Male' })}
            /> Male
          </label>
          <span> </span>
          <label>
            <input 
              type="radio" 
              value="FeMale"
              checked={this.state.usergender === 'FeMale'}
              onChange={() => this.setState({ usergender: 'FeMale' })}
            /> FeMale
          </label>
        </p>
        <p>
          <a 
            href="javascript:;"
            onClick={() => {
              this.props.updateGender(this.state.usergender);
              this.props.history.goBack();
            }}
          > Save Gender </a>
        </p>
      </div>
    );
  }
}

// form
class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.form.username || '',
      usergender: this.props.form.usergender || '',
    }
  }
  
  render() {
    let url = this.props.parentPath + '/form';

    return (
      <Fragment>
        <div className="app-page app-page-form">
          <p>
            Page A Data: { JSON.stringify(this.props.form )}
          </p>
          <p>
            Form Data: { JSON.stringify(this.state) }
          </p>
          <p>
            username: 
            <input 
              type="text" 
              value={this.state.username} 
              onChange={e => this.setState({ username: e.target.value }) }
            />
          </p>
          <p>
            usergender: { this.state.usergender }
            <a 
              href="javascript:;"
              onClick={() => {
                this.props.history.push(`${url}/gender`)
              }}
            > Pick Gender </a>
          </p>
          <p>
            <a 
              href="javascript:;"
              onClick={() => {
                this.props.updateUser(this.state);
                this.props.history.goBack();
              }}
            > Save Form </a>
          </p>
        </div>

        {/* gender */}
        <InnerPage
          component={Gender}
          path={`${url}/gender`}
          exact={false}
          location={this.props.location}

          parentPath={url}
          form={ this.state }
          updateGender={(gender) => {
            this.setState({ usergender: gender });
          }} 
        />
      </Fragment>
    );
    return <div className="app-page">from</div>
  }
}

// page a
class PageA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'a',
      username: '',
      usergender: ''
    }
  }
  
  render() {
    let { route, match, location } = this.props;
    let url = match.url;
    let formUrl = `${url}/form`;
    let matchForm = matchPath(location.pathname, {
      path: formUrl,
      exact: false
    });

    return (
      <React.Fragment> 
        <div className="app-page app-page-a">
          <p>
            Page A Data: { JSON.stringify(this.state) }
          </p>
          <p>
            <a 
              href="javascript:;"
              onClick={() => {
                this.props.history.push(formUrl)
              }}
            > Edit User </a>
          </p>
        </div>

        {/* form */}
        <InnerPage
          component={Form}
          path={formUrl}
          exact={false}
          location={location}

          parentPath={url}
          form={ this.state }
          updateUser={(user) => {
            this.setState({ username: user.username, usergender: user.usergender });
          }} 
        />
      </React.Fragment>
    );
  }
}

// page b detail
class PageBDetail extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="app-page app-page-c-detail">
        The Detail Id: { this.props.match.params.id }
      </div>
    );
  }
}

// page a
class PageB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [1,2,3,4,6]
    };
  }
  
  render() {
    const users = this.state.users.map(item => {
      return (
        <p key={item}>
          <Link to={`/b/${item}`}> View User Detail: { item } </Link>
        </p>
      );
    });

    return (
      <div className="app-page app-page-b">
        { users }
      </div>
    );
  }
}

// page c
class PageC extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    let url = this.props.match.url;

    const MyModal = ({match, history}) => {
      return (
        <Modal 
          ariaHideApp={false}
          isOpen={!!match}
          shouldCloseOnOverlayClick={false}
        >
          <p>Modal text!</p>
          <button onClick={() => history.goBack()}>
            Close Modal
          </button>
        </Modal>
      );
    }

    return (
      <div className="app-page app-page-c">
        <div>
          <a href="javascript:;" onClick={() => {
            this.props.history.push(`${url}/mymodal`);
          }}> Show Modal </a>
        </div>

        <Route path={`${url}/mymodal`} children={(props) => {
          return <MyModal {...props} /> 
        }}/>
      </div>
    );
  }
}

// app
class App extends React.Component {
  constructor(props) {
    super(props);

    // pages
    this.routes = [{
      name: 'a',
      path: '/a',
      childPaths: ['/a/form', '/a/form/gender'],
      component: PageA
    }, {
      name: 'b',
      path: '/b',
      childPaths: ['/b/modal'],
      component: PageB
    }, {
      name: 'b-dtl',
      path: '/b/:id',
      childPaths: ['/b/:id/gender'],
      component: PageBDetail
    }, {
      name: 'c',
      path: '/c',
      childPaths: ['/c/modal'],
      component: PageC
    }];
  }
  
  render() {
    const NavLink = ({ to, ...rest }) => (
      <Route path={to} children={({ match }) => (
        <li className={match ? 'active' : ''}>
          <Link to={to} {...rest}>{to}</Link>
        </li>
      )}/>
    );

    let transitionKey = getFirstUrlFromRoutes(this.routes, this.props.location);
    console.log(transitionKey);

    return (
      <Fragment>
        <ul className="app-navs">
          <NavLink to='/a' />
          <NavLink to='/b' />
          <NavLink to='/c' />
        </ul>
        <TransitionGroup className="app-pages">
          <CSSTransition key={transitionKey} classNames="entry-page" timeout={500}>
            <Switch location={this.props.location}>
              {
                this.routes.map(item => {
                  return <Route key={item.path} path={item.path} component={item.component} exact={false} />
                })
              }
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