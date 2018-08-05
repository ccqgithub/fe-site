import { gentx } from 'gentx';
import { observer, inject } from 'mobx-react';
import React from 'react';
import {
  Link
} from 'react-router-dom';

@gentx
@inject('mainStore')
@observer
class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  logout() {
    this.props.mainStore.setLoginUser(null);
  }

  render() {
    let user = this.props.mainStore.loginUser;

    return (
      <ul className="header">
        {
          user ? null : 
          <li>
            <Link to="/login">login</Link>   
          </li>
        }
        {
          !user ? null : 
          <li>
            <Link to="/list">list</Link>   
          </li>
        }
        {
          !user ? null : 
          <li>
            <Link to="/user">
              user: { user.username }
            </Link>
          </li>
        }
        {
          !user ? null : 
          <li>
            <a href="javascript:;" onClick={ () => this.logout() }>
              Logout
            </a>
          </li>
        }
      </ul>
    )
  }
}

Header.propTypes = {
  
}

export default Header;