<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addSort">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- table-tree区域 -->
      <tree-table :data="cateList" :columns="columns"
      :show-row-hover='false' border show-index index-text="#"
      :expand-type='false' :selection-type="false">
      <template slot="isok" scope="scope">
        <i class="el-icon-error"
        v-if="scope.row.cat_deleted === true"
        style="color: red"></i>
        <i class="el-icon-success" v-else
        style="color: lightgreen"></i>
      </template>
      <template slot="order" scope="scope">
        <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
        <el-tag type="warning" v-else>三级</el-tag>
      </template>
        <template slot="btn" scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editCateName(scope.row.cat_id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteCateName(scope.row)">删除</el-button>
      </template>
      </tree-table>
      <!-- 分页器区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateList.pagenum"
        :page-sizes="[6,9,11]"
        :page-size="cateList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
    </el-card>

    <!-- 添加分类对话框区域 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addSoltModifyVisible"
      width="50%"
      @close="soundParentName">
      <!-- 主题内容区域 -->
      <el-form :model="addcatFrom" :rules="addcatFromRules"
      ref="addcatFromRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addcatFrom.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options用来指定数据源 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
          v-model="cateKeys"
          :options="parentCateList"
          :props="parentCateProps"
          clearable
          @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 按钮区域 -->
        <el-button @click="addSoltModifyVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSorteditVisible">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改分类名称对话框区域 -->
    <el-dialog
      title="分类名称"
      :visible.sync="editSoltDialogVisible"
      width="50%" @close="editSoltDialogClose">
      <!-- 主题内容区域 -->
      <el-form :model="cateFromName" :rules="editRuleFormRules" ref="editRuleFormRef" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="cateFromName.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- 按钮区域 -->
        <el-button @click="editSoltDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data () {
    return {
      // 获取用户列表数据
      querInfo: {
        // 定义获取到哪个层级
        type: 3,
        // 当前的页面数
        pagenum: 1,
        // 当前页面显示多少条数据
        pagesize: 6
      },
      // 商品分类数据列表
      cateList: [],
      // 商品分类总条数
      total: 0,
      // 为table-tree定义列
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      },
      {
        label: '是否有效',
        // 表示当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'isok'
      },
      {
        label: '排序',
        // 表示当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'order'
      },
      {
        label: '操作',
        // 表示当前列定义为模板列
        type: 'template',
        // 表示当前这一列使用模板名称
        template: 'btn'
      }],
      // 控制对话框的显示与隐藏
      addSoltModifyVisible: false,
      // 添加分类的父级表单对象
      addcatFrom: {
        // 将要添加的分类名称
        cat_name: '',
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认要添加的时一级分类
        cat_level: 0
      },
      // 添加分类名称验证
      addcatFromRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentCateList: [],
      // 选中的父级分类数组
      cateKeys: [],
      // 父级分类的配置项
      parentCateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 通过id查询得到的分类
      cateFromName: {},
      // 控制编辑分类名称对话框的显示与隐藏
      editSoltDialogVisible: false,
      // 修改分类名称验证
      editRuleFormRules: {
        cat_name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 请求商品列表数据
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 监听数据显示条的变化
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听数据显示页的变化
    handleCurrentChange (newNum) {
      this.querInfo.pagenum = newNum
      this.getCateList()
    },
    // 点击添加分类
    addSort () {
      this.addSoltModifyVisible = true
      this.getParentCatList()
    },
    async getParentCatList () {
      const { data: res } = await this.$http.get('categories', { type: 2 })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.parentCateList = res.data
    },
    // 监听级联选择器关闭事件
    parentCateChange () {
      // 如果 cateKeys 数组中的 length 大于0 证明选中父级id
      // 反之就没有选中任何父级分类
      if (this.cateKeys.length > 0) {
        // 父级分类id
        this.addcatFrom.cat_pid = this.cateKeys[this.cateKeys.length - 1]
        // 当前分类等级赋值
        this.addcatFrom.cat_level = this.cateKeys.length
      } else {
        // 父级分类id
        this.addcatFrom.cat_pid = 0
        // 当前分类等级赋值
        this.addcatFrom.cat_level = 0
      }
    },
    // 点击确定添加分类
    addSorteditVisible () {
      this.$refs.addcatFromRef.validate(async vaild => {
        if (!vaild) return
        // 发起修改用户请求
        const { data: res } = await this.$http.post('categories', this.addcatFrom)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        // 刷新列表
        this.addSoltModifyVisible = false
        this.getCateList()
        // 提示更新成功
        this.$message.success(res.meta.msg)
      })
    },
    // 监听父级分类名称的关闭事件，清空form表单
    soundParentName () {
      this.$refs.addcatFromRef.resetFields()
      this.cateKeys = []
      this.addcatFrom.cat_pid = 0
      this.addcatFrom.cat_level = 0
    },
    // 编辑分类名称
    async editCateName (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.cateFromName = res.data
      this.editSoltDialogVisible = true
    },
    // 监听修改对话框的关闭事件，清空form
    editSoltDialogClose () {
      this.$refs.editRuleFormRef.resetFields()
    },
    // 确定修改分类名称
    editCate () {
      this.$refs.editRuleFormRef.validate(async vaild => {
        if (!vaild) return
        // 发起修改用户请求
        const { data: res } = await this.$http.put('categories/' + this.cateFromName.cat_id, {
          cat_name: this.cateFromName.cat_name
        })
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 刷新列表
        this.editSoltDialogVisible = false
        this.getCateList()
        // 提示更新成功
        this.$message.success(res.meta.msg)
      })
    },
    // 删除该分类
    async deleteCateName (row) {
      // 点击按钮弹框是否删除用户
      const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('categories/' + row.cat_id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.getCateList()
      this.$message.success(res.meta.msg)
    }
  }
}
</script>

<style lang="less" scoped>
i{
  font-size: 18px;
}
.el-button{
  margin-bottom: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
