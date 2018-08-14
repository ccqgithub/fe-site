import { warning } from './utils';
import Route from './Route';
import Link from './Link';

const NavLink = {
  functional: true,
  render(h, context) {
    let {
      to,
      exact,
      strict,
      location,
      activeClassName,
      className,
      activeStyle,
      style,
      isActive: getIsActive,
      "aria-current": ariaCurrent
    } = context.props;

    const path = typeof to === "object" ? to.pathname : to;
    // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
    const escapedPath = path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

    return h(Route, context.data, [
      h(Link, {

      }, this.$slot)
    ]);
  }
}

export default NavLink;