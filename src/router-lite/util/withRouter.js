import Route from "./Route";

/**
 * wrap Component with Route
 */
const withRouter = Component => {
  return {
    functional: true,
    render(h, context) {
      context.data.component = Component;
      return h(Route, context.data, context.children);
    }
  }
}