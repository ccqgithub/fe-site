import { warning } from './utils';

/**
 * return this single child
 */
const Single = {
  functional: true,
  render(h, context) {
    if (!context.children.length) return null;

    if (context.children > 1) {
      warning(`The component ${context.props.name || 'Single'} should have only one child!`);
    }

    return context.children[0];
  }
}

export default Single;