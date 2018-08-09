import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import { Switch } from 'react-router';
import { HashRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import '../less/rc-router-h5.less';

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
    let url = this.props.parentUrl + '/form';

    return (
      <Fragment>
        <div className="app-page">
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
        <Route  
          path={`${url}/gender`}
          render={({ match, ...rest }) => {
            if (!match) return null;
            return (
              <Gender 
                {...rest} 
                parentUrl={url}
                form={this.state} 
                updateGender={(gender) => {
                  this.setState({ usergender: gender });
                }} 
              />
            )
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
    let { route, match } = this.props;
    let url = match.url;

    return (
      <React.Fragment> 
        <div className="app-page">
          <p>
            Page A Data: { JSON.stringify(this.state) }
          </p>
          <p>
            <a 
              href="javascript:;"
              onClick={() => {
                this.props.history.push(`${url}/form`)
              }}
            > Edit User </a>
          </p>
        </div>

        {/* form */}
        <Route  
          path={`${url}/form`}
          render={({ match, ...rest }) => {
            if (!match) return null;
            return (
              <Form 
                {...rest} 
                parentUrl={url}
                form={this.state} 
                updateUser={(user) => {
                  this.setState({ username: user.username, usergender: user.usergender });
                }} 
              />
            )
          }}
        />
      </React.Fragment>
    );
  }
}

// page a
class PageB extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return <div>b</div>
  }
}

// page c detail
class PageCDetail extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return <div>c detail</div>
  }
}

// page c
class PageC extends React.Component {
  constructor(props) {
    super(props);
    
  }
  
  render() {
    return <div>c</div>
  }
}

// app
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let routes = this.props.routes;

    const ListItemLink = ({ to, ...rest }) => (
      <Route path={to} children={({ match }) => (
        <li className={match ? 'active' : ''}>
          <Link to={to} {...rest}>{to}</Link>
        </li>
      )}/>
    );

    return (
      <div className="app">
        <ul className="app-navs">
          <ListItemLink to='/a' />
          <ListItemLink to='/b' />
          <ListItemLink to='/c' />
        </ul>
        <div className="app-pages">
          <Switch>
            <Route path="/a" component={PageA} />
            <Route path="/b" component={PageB} />
            <Route path="/c" component={PageC} />
            <Route render={() => {
              return (
                <div className="app-page">
                  <p>
                    React Router H5 Demo
                  </p>
                  <p>
                    '/a': 层层递进，不能直接访问子url
                  </p>
                  <p>
                    '/b':
                  </p>
                  <p>
                    '/c': 
                  </p>
                </div>
              )
            }} />
          </Switch>
        </div>
      </div>
    );
  }
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('app')
);