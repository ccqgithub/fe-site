import { observable, action } from 'mobx';

export class TodoStore {
  @observable
  todoList = [];

  @action.bound
  update(list) {
    this.todoList = list;
  }

  @action.bound
  add(item) {
    this.todoList.push(item);
  }

  @action.bound
  del(id) {
    let index = -1;
    this.todoList.forEach((item, i) => {
      if (item.id === id) index = i;
    });
    if (index !== -1) this.todoList.splice(index, 1);
  }

  @action.bound
  reverse() {
    this.todoList = this.todoList.reverse();
  }
}
