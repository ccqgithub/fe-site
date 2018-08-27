import React from 'react';
import DevTools from 'mobx-react-devtools';
import { observer, Provider } from 'mobx-react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Link
} from 'react-router-dom';

import { MainStore } from '../../data/rc-stores/main';
import { TodoStore } from '../../data/rc-stores/todo';

import Header from './com/header';
import ComRoute from './util/com-route';
import routes from '../../rc-routes';

@observer
class App extends React.Component {
  constructor(props) {
    super(props);

    // stores
    this.stores = {
      mainStore: new MainStore(),
      todoStore: new TodoStore()
    }
  }

  render() {
    let mainStore = this.stores.mainStore;

    let routList = routes.map(item => {
      if (!mainStore.loginUser && item.name != 'login') {
        return (
          <Route 
            exact 
            key={item.name}
            path={item.path} 
            render={() => (
              <Redirect to='/login'/>
            )}
          />
        );
      }

      if (item.redirect) {
        return (
          <Route 
            exact 
            key={item.name}
            path={item.path} 
            render={() => (
              <Redirect to={item.redirect}/>
            )}
          />
        );
      }

      return (
        <ComRoute 
          exact 
          key={item.name}
          path={item.path} 
          component={item.component}
        />
      );
    });

    const baseUrl = location.pathname.replace(/^(.*?\/react\/).*$/, '$1');

    return (
      <Provider {...this.stores}>
        <Router
          basename={baseUrl}
        >
          <div className="app-main">
            
            <div className="app-header">
              <Header></Header>
            </div>

            <div className="app-pages">
              {routList}
            </div>

            {/* { process.env.NODE_ENV === 'development' ? <DevTools /> : null } */}
          
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;