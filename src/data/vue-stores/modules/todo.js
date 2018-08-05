export function getTodoModule() {
  const todoModule = {
    namespaced: true,
    state: {
      todoList: []
    },
    mutations: {
      update(state, list) {
        state.todoList = list;
      },  
      add(state, item) {
        state.todoList.push(item);
      },
      del(state, id) {
        let index = -1;
        state.todoList.forEach((item, i) => {
          if (item.id === id) index = i;
        });
        if (index != -1) state.todoList.splice(index, 1);
      },
      reverse(state) {
        state.todoList = state.todoList.reverse();
      }
    }
  }

  return todoModule;
}