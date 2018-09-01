import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import { matchPath } from 'react-router';
import { HashRouter as Router, Route, Link, Redirect } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import '../less/rc-router-h5.less';

// get first matched routes
// with current location
const getMatchedRoute = (routes, location) => {
  let key = null;
  let route = null;
  let index = -1;

  routes.some((item, i) => {
    let match = matchPath(location.pathname, {
      path: item.path,
      exact: true,
    });

    let keyMatch = matchPath(location.pathname, {
      path: item.path,
      exact: false,
    });

    let childMatch = matchPath(location.pathname, {
      path: item.childPaths || [],
      exact: true,
    });

    if (match || childMatch) {
      key = keyMatch.url;
      route = item;
      index = i;
    }

    return !!key;
  });

  return { key, route, index };
};

// gender
class Gender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usergender: this.props.form.usergender || '',
    };
  }

  render() {
    return (
      <div className="app-page">
        <p>Form Data: {JSON.stringify(this.props.form)}</p>
        <p>
          <label>
            <input
              type="radio"
              value="Male"
              checked={this.state.usergender === 'Male'}
              onChange={() => this.setState({ usergender: 'Male' })}
            />{' '}
            Male
          </label>
          <span />
          <label>
            <input
              type="radio"
              value="FeMale"
              checked={this.state.usergender === 'FeMale'}
              onChange={() => this.setState({ usergender: 'FeMale' })}
            />{' '}
            FeMale
          </label>
        </p>
        <p>
          <a
            onClick={() => {
              this.props.updateGender(this.state.usergender);
              this.props.history.goBack();
            }}
          >
            {' '}
            Save Gender{' '}
          </a>
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
    };
  }

  render() {
    let { match, location } = this.props;
    let genderUrl = `${match.url}/gender`;
    let matchForm = matchPath(location.pathname, {
      path: [genderUrl],
      exact: false,
    });

    return (
      <Fragment>
        <div className="app-page app-page-form">
          <p>Page A Data: {JSON.stringify(this.props.form)}</p>
          <p>Form Data: {JSON.stringify(this.state)}</p>
          <p>
            username:
            <input
              type="text"
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })}
            />
          </p>
          <p>
            usergender: {this.state.usergender}
            <a
              onClick={() => {
                this.props.history.push(genderUrl);
              }}
            >
              {' '}
              Pick Gender{' '}
            </a>
          </p>
          <p>
            <a
              onClick={() => {
                this.props.updateUser(this.state);
                this.props.history.goBack();
              }}
            >
              {' '}
              Save Form{' '}
            </a>
          </p>
        </div>

        <TransitionGroup>
          <CSSTransition
            key={matchForm ? 'form' : 'def'}
            classNames="inner-page"
            timeout={500}
          >
            <Route
              location={this.props.location}
              path={genderUrl}
              exact={false}
              render={(props) => (
                <Gender
                  {...props}
                  form={this.state}
                  updateGender={(gender) => {
                    this.setState({ usergender: gender });
                  }}
                />
              )}
            />
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    );
  }
}

// page a
class PageA extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'a',
      username: '',
      usergender: '',
    };
  }

  componentDidMount() {
    this.clickForm = false;
  }

  render() {
    let { match, location } = this.props;
    let formUrl = `${match.url}/form`;
    let matchForm = matchPath(location.pathname, {
      path: [formUrl, `${formUrl}/gender`],
      exact: false,
    });

    // 不能直接访问子页面
    if (matchForm && !this.clickForm) {
      return <Redirect from={formUrl} to={match.url} push={false} />;
    }

    return (
      <React.Fragment>
        <div className="app-page app-page-a">
          <p>Page A Data: {JSON.stringify(this.state)}</p>
          <p>
            <a
              onClick={() => {
                this.clickForm = true;
                this.props.history.push(formUrl);
              }}
            >
              {' '}
              Edit User{' '}
            </a>
          </p>
        </div>

        <TransitionGroup>
          <CSSTransition
            key={matchForm ? 'form' : 'def'}
            classNames="inner-page"
            timeout={500}
          >
            <Route
              location={this.props.location}
              path={formUrl}
              exact={false}
              render={(props) => (
                <Form
                  {...props}
                  form={this.state}
                  updateUser={(user) => {
                    this.setState({
                      username: user.username,
                      usergender: user.usergender,
                    });
                  }}
                />
              )}
            />
          </CSSTransition>
        </TransitionGroup>
      </React.Fragment>
    );
  }
}

const PageBDetail = (props) => {
  let { match, location } = props;
  let url = match.url;
  let matchModal = matchPath(location.pathname, {
    path: [`${url}/modal`],
    exact: false,
  });

  const mymodal = (
    <div className="app-modal">
      <p>{props.match.params.id}</p>
      <p>
        <a
          onClick={() => {
            props.history.goBack();
          }}
        >
          {' '}
          Back{' '}
        </a>
      </p>
    </div>
  );

  return (
    <div className="app-page app-page-b-detail">
      <p>{props.match.params.id}</p>

      <p>
        <Link to={`${url}/modal`}> Modal </Link>
      </p>

      <TransitionGroup component={null}>
        <CSSTransition
          key={matchModal ? 'modal' : 'def'}
          classNames="modal"
          timeout={500}
        >
          {matchModal ? mymodal : <div />}
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

// page a
class PageB extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [1, 2, 3, 4, 6],
    };
  }

  render() {
    let { match, location } = this.props;
    let url = match.url;
    let matchModal = matchPath(location.pathname, {
      path: [`${url}/modal`],
      exact: false,
    });

    const users = this.state.users.map((item) => (
      <p key={item}>
        <Link to={`${url}/${item}`}> View User Detail: {item} </Link>
      </p>
    ));

    const mymodal = (
      <div className="app-modal">
        <p>modal</p>
        <p>
          <a
            onClick={() => {
              this.props.history.goBack();
            }}
          >
            {' '}
            Back{' '}
          </a>
        </p>
      </div>
    );

    return (
      <div className="app-page app-page-b">
        <p>
          <Link to={`${url}/modal`}> Modal </Link>
        </p>

        {users}

        <TransitionGroup component={null}>
          <CSSTransition
            key={matchModal ? 'modal' : 'def'}
            classNames="modal"
            timeout={500}
          >
            {matchModal ? mymodal : <div />}
          </CSSTransition>
        </TransitionGroup>
      </div>
    );
  }
}

const PageC = (props) => {
  let url = props.match.url;

  return (
    <div className="app-page app-page-c">
      <div>
        <a
          onClick={() => {
            props.history.push(`${url}/modal`);
          }}
        >
          {' '}
          Show Modal{' '}
        </a>
      </div>

      <Route
        path={`${url}/modal`}
        children={({ match, history }) => (
          <Modal
            ariaHideApp={false}
            isOpen={!!match}
            shouldCloseOnOverlayClick={false}
          >
            <p>Modal text!</p>
            <button type="button" onClick={() => history.goBack()}>
              Close Modal
            </button>
          </Modal>
        )}
      />
    </div>
  );
};

// nav link
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
  constructor(props) {
    super(props);

    // pages
    this.routes = [
      {
        name: 'a',
        path: '/a',
        childPaths: ['/a/form', '/a/form/gender'],
        component: PageA,
        extra: { strict: false, sensitive: true },
      },
      {
        name: 'b',
        path: '/b',
        childPaths: ['/b/modal'],
        component: PageB,
        extra: { strict: false, sensitive: true },
      },
      {
        name: 'b-dtl',
        path: '/b/:id',
        childPaths: ['/b/:id/modal'],
        component: PageBDetail,
        extra: { strict: false, sensitive: true },
      },
      {
        name: 'c',
        path: '/c',
        childPaths: ['/c/modal'],
        component: PageC,
        extra: { strict: false, sensitive: true },
      },
    ];
  }

  render() {
    let matchedRoute = getMatchedRoute(this.routes, this.props.location);
    let route = matchedRoute.route;

    return (
      <Fragment>
        {/* navs */}
        <ul className="app-navs">
          <NavLink to="/a" />
          <NavLink to="/b" />
          <NavLink to="/c" />
        </ul>

        {/* pages */}
        <TransitionGroup className="app-pages">
          <CSSTransition
            key={matchedRoute.key || 'def'}
            classNames="entry-page"
            timeout={500}
          >
            {matchedRoute.key ? (
              <Route
                location={this.props.location}
                path={route.path}
                component={route.component}
                exact={false}
                {...route.extra || {}}
              />
            ) : (
              <div className="app-page">
                <p>React Router H5 Demo</p>
                <p>'/a': 子页面层层递进，不能单独访问</p>
                <p>'/b': 子页面单独访问</p>
                <p>'/c': 路由弹窗</p>
              </div>
            )}
          </CSSTransition>
        </TransitionGroup>
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
