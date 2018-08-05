import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { computed } from 'mobx';
import { gentx } from 'gentx';
import NProgress from 'nprogress';
import { of } from 'rxjs';
import { todoFlows } from '../../data/flows/todo';

@inject('mainStore')
@observer
@gentx
class User extends Component {
  constructor(props) {
    super(props);
  }

  @computed
  get loginUser() {
    return this.props.mainStore.loginUser;
  }

  render() {
    return (
      <div className="page page-user">
        <div className="user">
          user: { this.loginUser.username }
        </div>
      </div>
    );
  }
}

export default User;