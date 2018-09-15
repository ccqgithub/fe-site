import { makeObservable } from 'gentx';

/**
 * todo sources
 */

// todo list
export function list({ page = 1, count = 20 }) {
  let todoList = [
    {
      id: 1,
      title: 'title',
      description: 'description',
    },
  ];

  // equal to: Observable.from([todoList])
  return makeObservable([todoList]);
}

// add todo
export function add(todo) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      let data = {
        ...todo,
        id: Date.now(),
      };
      resolve(data);
    }, 1000);
  });

  // equal to: Observable.from(promise)
  return makeObservable(promise);
}

// del todo
export function del(todoId) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  // equal to: Observable.from(promise)
  return makeObservable(promise);
}
