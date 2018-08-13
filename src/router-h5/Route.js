import { warning } from './utils';
import matchPath from "./matchPath";

const Route = {
  props: {
    computedMatch: Object, // private, from <Switch>
    path: String,
    exact: Boolean,
    strict: Boolean,
    sensitive: Boolean,
    location: Object,
    tag: String
  },

  inject: ['router'],

  provide () {
    return {
      router: {
        history: this.router.history,
        route: {
          location: this.location || this.router.route.location,
          match: this.match
        }
      }
    };
  },

  data() {
    return {
      //
    }
  },

  computed: {
    match() {
      let { computedMatch, location, path, strict, exact, sensitive, router } = this;
      if (computedMatch) return computedMatch; // <Switch> already computed the match for us
  
      if (!router) {
        throw new Error(`You should not use <Route> or withRouter() outside a <Router>`);
      }
  
      const { route } = router;
      const pathname = (location || route.location).pathname;
  
      return matchPath(pathname, { path, strict, exact, sensitive }, route.match);
    }
  },

  render() {
    const { match, children, component, render } = this;
    const { history, route, staticContext } = this.router;
    const location = this.location || route.location;
    const props = { match, location, history, staticContext };

    // if (!this.$slots.default)

    if (component) return match ? React.createElement(component, props) : null;

    if (render) return match ? render(props) : null;

    if (typeof children === "function") return children(props);

    if (children && !isEmptyChildren(children))
      return React.Children.only(children);

    return null;
  }
}

export default Route;