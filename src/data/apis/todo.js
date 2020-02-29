// todo list
export function list({ page = 1, count = 20 }) {
  let todoList = [
    {
      id: 1,
      title: 'title',
      description: 'description',
    }
  ];

  return Promise.resolve(todoList);
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

  return promise;
}

// del todo
export function del(todoId) {
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  return promise;
}
