import { warning } from './utils';
import Router from './Router';
import { createBrowserHistory as createHistory } from "history";

const BrowserRouter = {
  props: {
    // just use to check if user pass history
    history: {
      validator: function (value) {
        return true;
      }
    },

    basename: String,
    forceRefresh: Boolean,
    keyLength: Number,
    getUserConfirmation: Function
  },

  beforeCreate() {
    this._history = createHistory({
      basename: this.basename,
      forceRefresh: this.forceRefresh,
      getUserConfirmation: this.getUserConfirmation,
      keyLength: this.keyLength
    });
  },

  beforeMount() {
    if (this.history) {
      warning(
        '<MemoryRouter> ignores the history prop. To use a custom history, ' +
        'use `import { Router }` instead of `import { BrowserRouter as Router }`.'
      )
    }
  },

  render(createElement) {
    return createElement(Router, {
      history: this._history
    }, this.$slots.default);
  }
}

export default BrowserRouter;