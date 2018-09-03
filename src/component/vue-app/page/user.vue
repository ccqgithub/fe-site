<template>
  <div class="page">
    <div class="user">
      user: {{ user.username }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageUser',
  computed: {
    user() {
      return this.$store.state.loginUser;
    },
  },
  watch: {
    user() {
      // console.log('>>> user change')
    },
  },
  destroyed() {
    // console.log('user >>> destroyed')
  },
};
</script>

<style lang="less" scoped>
.page {
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user {
  width: 500px;
  background: rgb(64, 20, 168);
  padding: 20px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>
