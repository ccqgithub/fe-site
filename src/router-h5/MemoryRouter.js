import { warning } from './utils';
import Router from './Router';
import { createMemoryHistory as createHistory } from "history";

const MemoryRouter = {
  props: {
    // just use to check if user pass history
    history: {
      validator: function (value) {
        return true;
      }
    },

    initialEntries: Array,
    initialIndex: Number,
    getUserConfirmation: Function,
    keyLength: Number
  },

  beforeCreate() {
    this._history = createHistory({
      initialEntries: this.initialEntries,
      initialIndex: this.initialIndex,
      getUserConfirmation: this.getUserConfirmation,
      keyLength: this.keyLength
    });
  },

  beforeMount() {
    if (this.history) {
      warning(
        '<MemoryRouter> ignores the history prop. To use a custom history, ' +
        'use `import { Router }` instead of `import { MemoryRouter as Router }`.'
      )
    }
  },

  render(createElement) {
    return createElement(Router, {
      history: this._history
    }, this.$slots.default);
  }
}

export default MemoryRouter;