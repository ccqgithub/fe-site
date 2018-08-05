import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { gentx } from 'gentx';
import NProgress from 'nprogress';
import { of } from 'rxjs';
import { todoFlows } from '../../data/flows/todo';

@inject('mainStore', 'todoStore')
@observer
@gentx
class List extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getList();
  }

  getList() {
    // unsubscribe last request if exists
    this.$unsubscribe('getList');
    
    // ui progress
    NProgress.start();

    // create aobservable
    let ob = of({});

    // use todoFlows.list flow
    ob = todoFlows.list(ob);
    
    // subscribe
    let sub = ob.subscribe(
      res => {
        NProgress.done();
        // change store data
        this.props.todoStore.update(res);
      },
      error => {
        NProgress.done();
        alert(error.message);
      }
    );

    // bind sub to component, easy to unbind automatically
    this.$bindSub(sub, 'getList', true);
  }

  add() {
    let ob = of({
      id: Date.now(),
      title: 'ooooo',
      description: 'xxxxx'
    });
    ob = todoFlows.add(ob);

    NProgress.start();
    this.$bindSub(
      ob.subscribe(
        (res) => {
          NProgress.done();
          this.props.todoStore.add(res);
        },
        error => {
          NProgress.done();
          alert(error.message);
        }
      ),
      'add'
    );
  }

  del(item) {
    let ob = of({ id: item.id });
    ob = todoFlows.del(ob);

    NProgress.start();
    this.$bindSub(
      ob.subscribe(
        (res) => {
          NProgress.done();
          this.props.todoStore.del(item.id);
        },
        error => {
          NProgress.done();
          alert(error.message);
        }
      ),
      'del'
    );
  }

  render() {
    let todoList = this.props.todoStore.todoList;
    let $trs = todoList.map(todo => {
      return (
        <tr key={todo.id}>
          <td>
            { todo.id }
          </td>
          <td>
            { todo.title }
          </td>
          <td>
            { todo.description }
          </td>
          <td>
            <button className="button" onClick={() => { this.del(todo) }}>
              删除
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div className="page page-list">
        <div className="list">
          <div className="top">
            <button className="button" onClick={ this.add.bind(this) }>
              添加
            </button>
          </div>

          <table>
            <tbody>
              { $trs }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default List;