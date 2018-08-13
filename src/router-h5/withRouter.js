import Route from "./Route";

const withRouter = Component => {
  return {
    name: `withRouter(${Component.name})`,
    render(h) {
      // return h(Route)
    }
  }
}