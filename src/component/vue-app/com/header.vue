<template>
  <ul class="header">
    <li v-if="!user">
      <router-link to="login">login</router-link>
    </li>

    <li v-if="user">
      <router-link to="list">list</router-link>
    </li>

    <li v-if="user">
      <router-link to="user">
        user: {{ user.username }}
      </router-link>
    </li>

    <li v-if="user">
      <a 
        href="javascript:;" 
        @click="logout"
      >Logout</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      //
    };
  },
  computed: {
    user() {
      return this.$store.state.loginUser;
    },
  },
  mounted() {},
  methods: {
    logout() {
      this.$root.logout();
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  background: rgb(64, 20, 168);
  display: flex;
  justify-content: center;

  li {
    line-height: 50px;
    border-right: 1px solid #fff;

    &:first-child {
      border-left: 1px solid #fff;
    }

    a {
      padding: 0 50px;
      color: #fff;
      display: block;
    }
  }
}
</style>
