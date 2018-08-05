import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from "mobx";
import { AppContainer } from 'react-hot-loader';
import '@fortawesome/fontawesome-free';
import 'nprogress/nprogress.css';
import '../less/rc-app.less';
import App from '../rc-component/app';

// configure react
configure({
  enforceActions: "strict"
});

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component/>
    </AppContainer>,
    document.getElementById('app'),
  )
}

render(App);

// Webpack Hot Module Replacement API
if (process.env.NODE_ENV === 'development') {
  if (module.hot) {
    module.hot.accept('../rc-component/app', () => {
      render(require('../rc-component/app').default);
    });
  }
}

