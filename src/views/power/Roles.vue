<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button @click="addRolesDialogVisible = true" type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="RolesList" border stripe>
        <el-table-column type="expand">
          <template scope="scope">
            <el-row :class="['borderbotm', index1===0 ? 'bordertop' : '' ,'vcenter']" v-for="(item1, index1) in scope.row.children" :key="item1.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                @close="removeRole(scope.row, item1.id)"
                    closable>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row :class="[ index2===0 ? '' : 'bordertop' ,'vcenter']" v-for="(item2, index2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"
                    @close="removeRole(scope.row, item2.id)"
                    closable>
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning"
                    v-for="item3 in item2.children"
                    :key="item3.id"
                    @close="removeRole(scope.row, item3.id)"
                    closable>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoles(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="allotRoles(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色区域 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="50%"
      @close="rolesClose">
      <el-form :model="rolesForm" :rules="rolesFormrules" ref="rolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="rolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="rolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色区域 -->
    <el-dialog
      title="修改角色"
      :visible.sync="editRolesDialogVisible"
      width="50%"
      @close="editRolesClose">
      <el-form :model="editRolesForm" :rules="rolesFormrules" ref="editRolesFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edmitRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 配置权限列表 -->
    <el-dialog
      title="配置权限"
      :visible.sync="allotRolesDialogVisible"
      width="50%">
      <!-- 树形控件区域 -->
      <el-tree :data="allotList"
      :props="allotProps"
      show-checkbox
      node-key="id"
      default-expand-all
      :default-checked-keys="keyfers"
      ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allotRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAllotRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 角色列表
      RolesList: [],
      // 添加用户区域显示隐藏
      addRolesDialogVisible: false,
      // 修改用户区域显示隐藏
      editRolesDialogVisible: false,
      // 配置权限区域显示隐藏
      allotRolesDialogVisible: false,
      // 添加角色
      rolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 查询到的角色数据
      editRolesForm: [],
      // 添加用户校验
      rolesFormrules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1到 6 个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur' }
        ]
      },
      // tree权限列表
      allotList: [],
      // 树形控件的对象绑定区域
      allotProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的数组id
      keyfers: [],
      // 点击配置得到的当前角色id
      rolesId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.RolesList = res.data
    },
    // 监听添加角色对话框关闭
    rolesClose () {
      this.$refs.rolesFormRef.resetFields()
    },
    // 点击添加角色
    addRoles () {
      this.$refs.rolesFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('roles', this.rolesForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.addRolesDialogVisible = false
      })
    },
    // 查询角色
    async editRoles (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.editRolesForm = res.data
      this.editRolesDialogVisible = true
    },
    // 监听修改角色对话框关闭
    editRolesClose () {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 点击修改角色
    edmitRoles () {
      this.$refs.editRolesFormRef.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.put('roles/' + this.editRolesForm.roleId, {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.getRolesList()
        this.editRolesDialogVisible = false
      })
    },
    // 点击删除角色
    async removeRoles (id) {
      const confirmRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getRolesList()
      this.$message.success('删除成功')
    },
    // 点击删除tag权限
    async removeRole (role, id) {
      const confirmRes = await this.$confirm('此操作将删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') return this.$message.info('取消删除')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      role.children = res.data
      this.$message.success('删除成功')
    },
    // 点击获取权限列表
    async allotRoles (node) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.allotList = res.data
      this.allotRolesDialogVisible = true
      // 清楚keyfers数组
      this.keyfers = []
      this.recursionRoles(node, this.keyfers)
      this.rolesId = node.id
    },
    // 通过递归的形式获取三级权限的id并保存到数组中
    recursionRoles (node, arr) {
      if (!node.children) {
        return this.keyfers.push(node.id)
      }
      node.children.forEach(item => {
        this.recursionRoles(item, arr)
      })
    },
    // 点击确定修改角色权限
    async addAllotRoles () {
      const addAllotArr = [
        ...this.$refs.treeRef.getHalfCheckedKeys(),
        ...this.$refs.treeRef.getCheckedKeys()
      ]
      const keysId = addAllotArr.join(',')
      const { data: res } = await this.$http.post(`roles/${this.rolesId}/rights`, {
        rids: keysId
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getRolesList()
      this.allotRolesDialogVisible = false
    }
  }

}
</script>

<style lang="less" scoped>
.el-table{
  margin-top: 15px;
}
.el-tag{
  margin: 7px;
}
.bordertop{
  border-top: 1px solid #eee;
}
.borderbotm{
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
