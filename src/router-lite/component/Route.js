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
    component: Object
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

  render(h) {
    let { computedMatch, location, path, strict, exact, sensitive, ...props } = this.$props;
    const { match } = this;
    const { history, route, staticContext } = this.router;
    const location = this.location || route.location;
    const childProps = { match, location, history, staticContext };

    if (!match) return null;

    if (this.component) {
      return h(this.component, {...props, ...childProps});
    }
    
    if (this.$scopedSlots.default) {
      return this.$scopedSlots.default(childProps)[0];
    }
  }
}

export default Route;