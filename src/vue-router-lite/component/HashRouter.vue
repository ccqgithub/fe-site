<template>
  <router :history="childHistory">
    <slot></slot>
  </router>
</template>

<script>
import { warning } from './utils';
import Router from './Router';
import { createHashHistory as createHistory } from "history";

const HashRouter = {
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
    hashType: {
      validator: function (value) {
        return ["hashbang", "noslash", "slash"].indexOf(value) !== -1
      }
    },
    getUserConfirmation: Function
  },

  data() {
    let history = createHistory({
      basename: this.basename,
      hashType: this.hashType,
      getUserConfirmation: this.getUserConfirmation
    });

    return {
      childHistory: history
    }
  },

  beforeMount() {
    if (this.history) {
      warning(
        '<HashRouter> ignores the history prop. To use a custom history, ' +
        'use `import { Router }` instead of `import { HashRouter as Router }`.'
      )
    }
  }
}

export default HashRouter;
</script>