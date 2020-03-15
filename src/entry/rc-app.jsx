import React from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import '@fortawesome/fontawesome-free';
import 'nprogress/nprogress.css';
import '../less/rc-app.less';
import App from '../component/rc-app/app';

// configure react
configure({
  enforceActions: 'always'
});

ReactDOM.render(<App />, document.getElementById('app'));
