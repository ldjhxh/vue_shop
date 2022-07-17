<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    // 退出登录的回调
    logout() {
      // 清空token
      window.sessionStorage.clear();
      //   跳转路由
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="less" scoped>
</style>