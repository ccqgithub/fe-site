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
              {{ todo.id }}
            </td>
            <td>
              {{ todo.title }}
            </td>
            <td>
              {{ todo.description }}
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
import * as todoApis from '../../../data/apis/todo';

export default {
  name: 'PageList',
  computed: {
    todoList() {
      return this.$store.state.todo.todoList;
    }
  },
  mounted() {
    this.getList();
  },
  destroyed() {
    // console.log('list >>> destroyed')
  },
  methods: {
    getList() {
      NProgress.start();

      todoApis
        .list({})
        .then((res) => {
          NProgress.done();
          this.$store.commit('todo/update', res);
        })
        .catch((error) => {
          NProgress.done();
        });
    },
    add() {
      NProgress.start();

      todoApis
        .add({
          id: Date.now(),
          title: 'season',
          description: 'xxx'
        })
        .then((res) => {
          NProgress.done();
          this.$store.commit('todo/add', res);
        })
        .catch((error) => {
          NProgress.done();
        });
    },
    del(item) {
      NProgress.start();

      todoApis
        .del({
          id: item.id
        })
        .then((res) => {
          NProgress.done();
          this.$store.commit('todo/del', item.id);
        })
        .catch((error) => {
          NProgress.done();
        });
    }
  }
};
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
