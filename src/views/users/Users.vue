<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
        <el-input v-model="parameter.query" placeholder="请输入内容" clearable @clear="userData">
          <el-button @click="userData" slot="append" icon="el-icon-search">
            </el-button></el-input>
        </el-col>
        <el-col :span="4"><el-button @click="addDialogVisible = true" type="primary">添加用户</el-button></el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="userList" border stripe="">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template scope="scope">
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template scope="scope">
            <el-button @click="ModifyUser(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button  type="danger" icon="el-icon-share" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button @click="removeUser(scope.row.id)" type="warning" icon="el-icon-delete" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userList.pagenum"
        :page-sizes="[6,9,11]"
        :page-size="userList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </el-card>
  <!-- 添加用户对话框区域 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%" @close="addDialogClose">
      <!-- 主题内容区域 -->
      <el-form :model="usersRuleForm" :rules="usersFormRules" ref="usersRuleFormRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="usersRuleForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="usersRuleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="usersRuleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="usersRuleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 按钮区域 -->
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框区域 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addModifyVisible"
      width="50%" @close="editDialogClose">
      <!-- 主题内容区域 -->
      <el-form :model="editForm" :rules="usersFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名" >
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 按钮区域 -->
        <el-button @click="addModifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="editVisible">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    // 自定义验证邮箱
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    var checkMobile = (rule, value, cb) => {
      const regMbbile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMbbile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户列表数据
      parameter: {
        // 查询参数
        query: '',
        // 当前的页面数
        pagenum: 1,
        // 当前页面显示多少条数据
        pagesize: 6
      },
      // 用户数据列表
      userList: [],
      // 一共多少条数据
      total: 0,
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户数据
      usersRuleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      usersFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在 5到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      addModifyVisible: false,
      // 查询到的用户信息对象
      editForm: []
    }
  },
  created () {
    this.userData()
  },
  methods: {
    // 请求用户数据
    async userData () {
      const { data: res } = await this.$http.get('users', { params: this.parameter })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 更新页面显示多少条数据
    handleSizeChange (newPagesize) {
      this.parameter.pagesize = newPagesize
      this.userData()
    },
    // 更新页面数
    handleCurrentChange (newPagenum) {
      this.parameter.pagenum = newPagenum
      this.userData()
    },
    // 修改用户状态
    async userStatus (userlist) {
      const { data: res } = await this.$http.put(`users/${userlist.id}/state/${userlist.mg_state}`)
      if (res.meta.status !== 200) {
        userlist.mg_state = !userlist.mg_state
        return this.$message.error('修改状态失败')
      }
      this.$message.success('修改状态成功')
    },
    // 重置表单
    addDialogClose () {
      this.$refs.usersRuleFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.usersRuleFormRef.validate(async vaild => {
        if (!vaild) return
        // 发起用户添加请求
        const { data: res } = await this.$http.post('users', this.usersRuleForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        // 隐藏对话框
        this.addDialogVisible = false
        // 更新列表
        this.userData()
      })
    },
    // 点击按钮，修改用户
    async ModifyUser (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editForm = res.data
      this.addModifyVisible = true
    },
    // 监听修改用户的关闭事件
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editVisible () {
      this.$refs.editFormRef.validate(async vaild => {
        if (!vaild) return
        // 发起修改用户请求
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 刷新列表
        this.addModifyVisible = false
        this.userData()
        // 提示更新成功
        this.$message.success(res.meta.msg)
      })
    },
    // 根据id删除用户
    async removeUser (id) {
      // 点击按钮弹框是否删除用户
      const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmRes)
      if (confirmRes !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userData()
      this.$message.success(res.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped>
.el-table{
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination{
  margin-top: 15px;
}
</style>
