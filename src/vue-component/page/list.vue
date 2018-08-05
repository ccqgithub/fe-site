<template>
  <div class="page">
    <div class="list">
      <div class="top">
        <button class="button" @click="add">
          添加
        </button>
      </div>

      <table>
        <tbody v-for="todo in todoList" :key="todo.id">
          <tr>
            <td>
              {{todo.id}}
            </td>
            <td>
              {{todo.title}}
            </td>
            <td>
              {{todo.description}}
            </td>
            <td>
              <button class="button" @click="del(todo)">
                删除
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import NProgress from 'nprogress';
import { of, observable, Subscription } from 'rxjs';
import { todoFlows } from '../../data/flows/todo';

export default {
  name: 'page-list',
  computed: {
    todoList() {
      return this.$store.state.todo.todoList;
    }
  },
  mounted() {
    this.getList();
  },
  destroyed() {
    console.log('list >>> destroyed')
  },
  methods: {
    getList() {
      NProgress.start();
      // unsubscribe previous
      this.$unsubscribe('getList');
      // create observable
      let ob = of({});
      // use flow
      ob = todoFlows.list(ob);
      // subscribe
      let sub = ob.subscribe(
        res => {
          NProgress.done();
          this.$store.commit('todo/update', res);
        },
        error => {
          NProgress.done();
          alert(error.message);
        }
      );
      // bind subscription
      this.$bindSub(sub, 'getList');
    },
    add() {
      NProgress.start();
      let ob = of({
        id: Date.now(),
        title: 'season',
        description: 'xxx'
      });
      ob = todoFlows.add(ob);
      this.$bindSub(
        ob.subscribe(
          res => {
            NProgress.done();
            this.$store.commit('todo/add', res);
          },
          error => {
            NProgress.done();
            alert(error.message);
          }
        ),
        'add'
      );
    },
    del(item) {
      NProgress.start();
      let ob =  of({
        id: item.id
      });
      ob = todoFlows.del(ob);
      this.$bindSub(
        ob.subscribe(
          res => {
            NProgress.done();
            this.$store.commit('todo/del', item.id);
          },
          error => {
            NProgress.done();
            alert(error.message);
          }
        ),
        'del'
      );
    }
  }
}
</script>

<style lang="less" scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
}

.list {
  width: 500px;
  padding: 20px;
  background: rgb(64, 20, 168);
  border-radius: 4px;
}

.top {
  margin-bottom: 50px;
}

table {
  width: 100%;
  color: #fff;
  table-layout: fixed;
}

td {
  border-bottom: 1px solid #fff;
  padding: 5px;
  text-align: center;
}
</style>
