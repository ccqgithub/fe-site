import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { computed } from 'mobx';

@inject('mainStore')
@observer
class User extends Component {
  componentDidMount() {
    // console.log('user===')
  }

  @computed
  get loginUser() {
    return this.props.mainStore.loginUser;
  }

  render() {
    return (
      <div className="page page-user">
        <div className="user">user: {this.loginUser.username}</div>
      </div>
    );
  }
}

export default User;
