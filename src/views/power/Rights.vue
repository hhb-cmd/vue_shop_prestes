<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="nauthorityList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="authName" label="权限说明"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data () {
    return {
      // 权限列表数据
      nauthorityList: []
    }
  },
  created () {
    this.obtainNauthorityList()
  },
  methods: {
    // 获取权限列表
    async obtainNauthorityList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.nauthorityList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
