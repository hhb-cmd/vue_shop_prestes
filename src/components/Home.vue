
<template>
    <el-container class="Home-container">
      <!-- 头部区域 -->
      <el-header>
        <div>
          <img src="../assets/img/logo.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button class="btn" type="info" @click="exit">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
      <el-container>
        <!-- 侧边栏区域 -->
        <el-aside :width="isCollpace ? '64px' : '200px'">
          <!-- 侧边栏内容区域 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff"
            unique-opened
            :collapse="isCollpace"
            :collapse-transition="false"
            router
            :default-active="userActive">
            <div class="toggle_button" @click="toggleCollpace">|||</div>
            <!-- 一级菜单 -->
            <el-submenu :index="List.id + '' " v-for="List in MenuList" :key="List.id">
              <!-- 一级菜单模板区域 -->
              <template slot="title">
                <!-- 字体图标 -->
                <i :class="iconfontObj[List.id]"></i>
                <!-- 内容区域 -->
                <span>{{List.authName}}</span>
              </template>
                <el-menu-item :index="item.path" v-for="item in List.children" :key="item.id"
                @click="isDefaultActive(item.path)">
                <template  slot="title">
                  <i class="el-icon-menu"></i>
                  <span>{{item.authName}}</span>
                </template>
                </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 内容区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      MenuList: [],
      iconfontObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollpace: false,
      userActive: ''
    }
  },
  created () {
    this.getMenuList()
    this.userActive = window.sessionStorage.getItem('pathActive')
  },
  methods: {
    exit () {
      // 清空sessionStorage中token
      window.sessionStorage.clear()
      // 退回登录页面
      this.$router.push('/login')
    },
    // 获取左侧菜单栏数据
    async getMenuList () {
      // 请求成功并结构赋值重命名
      const { data: res } = await this.$http.get('menus')
      // 是否请求成功
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 赋值给MenuList
      this.MenuList = res.data
      // console.log(res)
    },
    toggleCollpace () {
      this.isCollpace = !this.isCollpace
    },
    isDefaultActive (path) {
      window.sessionStorage.setItem('pathActive', path)
      this.userActive = window.sessionStorage.getItem('pathActive')
    }
  }
}
</script>

<style lang="less" scoped>
.Home-container{
  height: 100%;
}
.el-header{
  background-color: #333744;
  display: flex;
  justify-content: space-between;
  align-items:center;
  color: #fff;
  font-size: 20px;
  div{
    display: flex;
    align-items: center;
  }
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #EAEDF1;
}
.btn{
    display: flex;
    justify-content: flex-end;
  }
.iconfont{
  margin-right: 10px;
}
.toggle_button{
  text-align: center;
  background-color: #4a5064;
  cursor: pointer;
  color: #fff;
  letter-spacing: 0.2rem;
  line-height: 24px;
  margin-top: 10px;
}
</style>
