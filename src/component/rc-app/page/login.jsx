import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import NProgress from 'nprogress';
import * as userApis from '../../../data/apis/user';

@inject('mainStore')
@observer
class Login extends Component {
  @observable
  form = {
    username: '',
    password: '',
  };

  @action
  changeFormVal(name, val) {
    this.form[name] = val;
  }

  login() {
    NProgress.start();
    userApis
      .login({
        username: this.form.username,
        password: this.form.password,
      })
      .then((res) => {
        NProgress.done();
        this.props.mainStore.setLoginUser(res);
        this.props.history.replace('/list');
      })
      .catch((error) => {
        NProgress.done();
      });
  }

  render() {
    return (
      <div className="page page-login">
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <input
              type="text"
              placeholder="username"
              value={this.form.username}
              onChange={(e) => {
                this.changeFormVal('username', e.target.value);
              }}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="password"
              value={this.form.password}
              onChange={(e) => {
                this.changeFormVal('password', e.target.value);
              }}
            />
          </div>
          <div>
            <button
              type="button"
              className="button"
              onClick={this.login.bind(this)}
            >
              登录
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
