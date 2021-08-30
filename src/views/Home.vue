<template>
  <div>
    <button @click="exit">退出</button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    exit () {
      // 清空sessionStorage中token
      window.sessionStorage.clear()
      // 退回登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
