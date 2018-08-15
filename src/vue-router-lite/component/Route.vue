<template>
  <single v-if="match">
    <component v-if="component" :is="component" v-bind="childProps"></component>
    <slot v-bind="childProps"></slot>
  </single>
</template>

<script>
import { warning } from './utils';
import matchPath from "./matchPath";
import Single from '../util/Single';

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
    },

    childProps() {
      let { computedMatch, location, match } = this;
      const { history, route, staticContext } = this.router;
      const location = this.location || route.location;

      return { ...this.$attrs, match, location, history, staticContext };
    }
  }
}

export default Route;
</script>