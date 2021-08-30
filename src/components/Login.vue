<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatal_box">
        <img src="../assets/logo.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login'
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}

.login_box{
    height: 300px;
    width: 450px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 3px;
    transform: translate(-50%,-50%);

    .avatal_box{
      width: 130px;
      height: 130px;
      border-radius: 50%;
      box-shadow: 0 0 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      border: 1px solid #eee;
      padding: 10px;

      img{
        width: 100%;
        height: 100%;
        background-color: #eee;
        border-radius: 50%;
      }
    }
  }
</style>
