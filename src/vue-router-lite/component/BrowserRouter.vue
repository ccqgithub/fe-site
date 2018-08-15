<template>
  <router :history="childHistory">
    <slot></slot>
  </router>
</template>

<script>
import { warning } from './utils';
import Router from './Router';
import { createBrowserHistory as createHistory } from "history";

const BrowserRouter = {
  components: {
    Router
  },

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

  data() {
    let history = createHistory({
      basename: this.basename,
      forceRefresh: this.forceRefresh,
      getUserConfirmation: this.getUserConfirmation,
      keyLength: this.keyLength
    });

    return {
      childHistory: history
    }
  },

  beforeMount() {
    if (this.history) {
      warning(
        '<MemoryRouter> ignores the history prop. To use a custom history, ' +
        'use `import { Router }` instead of `import { BrowserRouter as Router }`.'
      )
    }
  }
}

export default BrowserRouter;
</script>