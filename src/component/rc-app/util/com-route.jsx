import React from 'react';
import { Route } from 'react-router-dom';

const ComRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      return <Component {...props} {...rest} />;
    }}
  />
);

export default ComRoute;
