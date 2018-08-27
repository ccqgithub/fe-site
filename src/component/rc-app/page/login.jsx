import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer, inject } from 'mobx-react';
import { gentx } from 'gentx';
import NProgress from 'nprogress';
import { of } from 'rxjs';
import { userLoginFlow } from '../../../data/flows/user';

@inject('mainStore')
@observer
@gentx
class Login extends Component {
  @observable form = {
    username: '',
    password: ''
  }

  constructor(props) {
    super(props);
  }

  @action 
  changeFormVal(name, val) {
    this.form[name] = val;
  }

  login() {
    let ob = of(
      {
        username: this.form.username,
        password: this.form.password
      }
    );

    ob = userLoginFlow(ob);

    NProgress.start();
    this.$bindSub(
      ob.subscribe(
        (res) => {
          NProgress.done();
          this.props.mainStore.setLoginUser(res);
          this.props.history.replace('/list');
        },
        error => {
          NProgress.done();
          alert(error.message);
        }
      ),
      'login'
    );
  }

  render() {
    return (
      <div className="page page-login">
        <form action="javascript:;">
          <div>
            <input 
              type="text" 
              placeholder="username"
              value={this.form.username}
              onChange={e => {
                this.changeFormVal('username', e.target.value)
              }}
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="password" 
              value={this.form.password}
              onChange={e => {
                this.changeFormVal('password', e.target.value)
              }}
            />
          </div>
          <div>
            <button className="button" onClick={this.login.bind(this)}>
              登录
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;