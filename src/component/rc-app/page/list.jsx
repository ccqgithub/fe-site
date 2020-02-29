import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import NProgress from 'nprogress';
import * as todoApis from '../../../data/apis/todo';

@inject('mainStore', 'todoStore')
@observer
class List extends Component {
  componentDidMount() {
    // console.log('list===');
    this.getList();
  }

  getList() {
    // ui progress
    NProgress.start();

    todoApis
      .list({})
      .then((res) => {
        NProgress.done();
        // change store data
        this.props.todoStore.update(res);
      })
      .catch((error) => {
        NProgress.done();
      });
  }

  add() {
    NProgress.start();

    todoApis
      .add({
        id: Date.now(),
        title: 'ooooo',
        description: 'xxxxx'
      })
      .then((res) => {
        NProgress.done();
        this.props.todoStore.add(res);
      })
      .catch((error) => {
        NProgress.done();
      });
  }

  del(item) {
    NProgress.start();
    todoApis
      .del({
        id: item.id
      })
      .then((res) => {
        NProgress.done();
        this.props.todoStore.del(item.id);
      })
      .catch((error) => {
        NProgress.done();
      });
  }

  render() {
    let todoList = this.props.todoStore.todoList;
    let $trs = todoList.map((todo) => (
      <tr key={todo.id}>
        <td>{todo.id}</td>
        <td>{todo.title}</td>
        <td>{todo.description}</td>
        <td>
          <button
            type="button"
            className="button"
            onClick={() => {
              this.del(todo);
            }}
          >
            删除
          </button>
        </td>
      </tr>
    ));

    return (
      <div className="page page-list">
        <div className="list">
          <div className="top">
            <button
              type="button"
              className="button"
              onClick={this.add.bind(this)}
            >
              添加
            </button>
          </div>

          <table>
            <tbody>{$trs}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default List;
