import { warning } from './utils';
import Router from './Router';
import { createHashHistory as createHistory } from "history";

const HashRouter = {
  props: {
    // just use to check if user pass history
    history: {
      validator: function (value) {
        return true;
      }
    },

    basename: String,
    hashType: {
      validator: function (value) {
        return ["hashbang", "noslash", "slash"].indexOf(value) !== -1
      }
    },
    getUserConfirmation: Function
  },

  beforeCreate() {
    this._history = createHistory({
      basename: this.basename,
      hashType: this.hashType,
      getUserConfirmation: this.getUserConfirmation
    });
  },

  beforeMount() {
    if (this.history) {
      warning(
        '<HashRouter> ignores the history prop. To use a custom history, ' +
        'use `import { Router }` instead of `import { HashRouter as Router }`.'
      )
    }
  },

  render(createElement) {
    return createElement(Router, {
      history: this._history
    }, this.$slots.default);
  }
}

export default HashRouter;