import { flowSources, groupFlows, logGuard } from 'gentx';
import * as todoSources from '../sources/todo';

// todo flows
const todoFlows = groupFlows(flowSources(todoSources), {
  groupName: 'todo',
  beforeGuards: [logGuard],
  afterGuards: [logGuard]
});

export { todoFlows };