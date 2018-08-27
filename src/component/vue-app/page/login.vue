<template>
  <div class="page">
    <form action="javascript:;">
      <div>
        <input type="text" placeholder="username" v-model="username">
      </div>
      <div>
        <input type="text" placeholder="password" v-model="password">
      </div>
      <div>
        <button class="button" @click="login">
          登录
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import NProgress from 'nprogress';
import { of } from 'rxjs';
import { userLoginFlow } from '../../../data/flows/user';

export default {
  name: 'page-login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      let ob = of({
        username: this.username,
        password: this.password
      });
      ob = userLoginFlow(ob);

      NProgress.start();
      this.$bindSub(
        ob.subscribe(
          res => {
            NProgress.done();
            this.$store.commit('setLoginUser', res);
            this.$router.replace('/list');
          },
          error => {
            NProgress.done();
            alert(error.message);
          }
        ),
        'login'
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

form {
  width: 500px;
  padding: 20px;
  background: rgb(64, 20, 168);
  border-radius: 4px;

  > div {
    padding: 10px 0;
  }

  input {
    background: none;
    color: #fff;
    border: 1px solid #fff;
    padding: 5px 10px;
    line-height: 20px;
    border-radius: 4px;
    width: 100%;
  }
}
</style>
