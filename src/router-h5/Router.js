import { warning } from './utils';

const Router = {
  props: {
    history: {
      type: Object,
      required: true
    }
  },

  // inject: ['router'],

  provide () {
    return {
      router: {
        history: this.history,
        route: {
          location: this.history.location,
          match: this.match
        }
      }
    }
  },

  data() {
    return {
      match: this.computeMatch(this.history.location.pathname)
    }
  },

  beforeMount() {
    const { history } = this.props;
    this.unlisten = history.listen(() => {
      this.match = this.computeMatch(history.location.pathname);
    });
  },

  befreDestory() {
    this.unlisten();
  },

  watch: {
    history(val, oldVal) {
      warning('You cannot change <Router history>');
    }
  },

  methods: {
    computeMatch(pathname) {
      return {
        path: "/",
        url: "/",
        params: {},
        isExact: pathname === "/"
      };
    }
  },

  render() {
    return this.$slots.default[0];
  }
}

export default Router;