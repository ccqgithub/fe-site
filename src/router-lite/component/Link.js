import { warning } from './utils';
import { createLocation } from "history";

const isModifiedEvent = event =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const Link = {
  props: {
    // to path
    to: {
      type: [String, Object],
      required: true
    },

    // below props not used for slot scope
    target: String,
    replace: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: 'a'
    },
    class: {
      type: [String, Object, Array],
      default: () => {}
    },
    style: {
      type: [String, Object, Array],
      default: () => {}
    }
  },

  inject: ['router'],

  methods: {
    handleClick = event => {
      this.$emit('click', event);
  
      event.preventDefault();
  
      const { history } = this.router;
      const { replace, to } = this;

      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  },

  render(h) {
    if (!this.to) {
      throw new Error('You must specify the "to" property');
    }

    if (!this.router) {
      warning('You should not use <Link> outside a <Router>');
    }

    const { history } = this.router;
    const location =
      typeof to === "string"
        ? createLocation(to, null, null, history.location)
        : to;
    const href = history.createHref(location);

    // scoped slot
    if (this.$scopedSlots.default) {
      let scopedChildren = this.$scopedSlots.default({
        href,
        history
      });
      return scopedChildren.length ? scopedChildren[0] : null;
    }

    return h(tag, {
      class: this.class,
      style: this.style,
      attrs: {
        ...this.$attrs,
        target: this.target,
        href: href
      },
      on: {
        click: this.handleClick
      }
    }, this.$children); 
  }
}

export default Link;