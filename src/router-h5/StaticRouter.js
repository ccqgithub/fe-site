import { warning } from './utils';
import { createLocation, createPath } from "history";
import Router from "./Router";

const addLeadingSlash = path => {
  return path.charAt(0) === "/" ? path : "/" + path;
};

const addBasename = (basename, location) => {
  if (!basename) return location;

  return {
    ...location,
    pathname: addLeadingSlash(basename) + location.pathname
  };
};

const stripBasename = (basename, location) => {
  if (!basename) return location;

  const base = addLeadingSlash(basename);

  if (location.pathname.indexOf(base) !== 0) return location;

  return {
    ...location,
    pathname: location.pathname.substr(base.length)
  };
};

const createURL = location =>
  typeof location === "string" ? location : createPath(location);

const staticHandler = methodName => () => {
  throw new Error(`You cannot ${methodName} with <StaticRouter>`);
};

const noop = () => {};

const StaticRouter = {
  props: {
    // just use to check if user pass history
    history: {
      validator: function (value) {
        return true;
      }
    },

    basename: {
      type: 'String',
      default: '' 
    },
    context: {
      type: Object,
      required: true
    },
    location: {
      type: [String, Object],
      default: '/'
    }
  },

  provide() {
    return {
      router: {
        staticContext: this.context
      }
    };
  },

  beforeCreate() {
    this.createHref = (path) => addLeadingSlash(this.basename + createURL(path));
    this.handlePush = (location) => {
      const { basename, context } = this;
      context.action = "PUSH";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    }
    this.handleReplace = (location) => {
      const { basename, context } = this;
      context.action = "REPLACE";
      context.location = addBasename(basename, createLocation(location));
      context.url = createURL(context.location);
    }
    this.handleListen = () => noop;
    this.handleBlock = () => noop;
  },

  beforeMount() {
    if (this.history) {
      warning(
        '<StaticRouter> ignores the history prop. To use a custom history, ' +
        'use `import { Router }` instead of `import { StaticRouter as Router }`.'
      )
    }
  },

  render(h) {
    let { basename, context, location, ...props } = this.$props;

    const history = {
      createHref: this.createHref,
      action: "POP",
      location: stripBasename(basename, createLocation(location)),
      push: this.handlePush,
      replace: this.handleReplace,
      go: staticHandler("go"),
      goBack: staticHandler("goBack"),
      goForward: staticHandler("goForward"),
      listen: this.handleListen,
      block: this.handleBlock
    };

    return h(Router, {
      ...props,
      history: history
    });
  }
}

export default StaticRouter;