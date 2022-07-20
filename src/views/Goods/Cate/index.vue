<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        index-text="#"
        border
        class="treeTable"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="{ row }">
          <i
            class="el-icon-success"
            v-if="row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="{ row }">
          <el-tag size="mini" v-if="row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="{ row }">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditCateDialog(row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteCate(row)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10]"
        :page-size="querInfo.pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total,sizes,prev, pager, next,jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormrules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!-- options:用来指定数据源
                props: 用来指定配置对象
             -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <el-form
        ref="editCateForm"
        :model="editCateForm"
        label-width="80px"
        :rules="editCateRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cateList: [], //商品分类的数据列表，默认为空

      total: 0, //数据总条数
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "isok",
        },

        {
          label: "排序",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          // 表示，将当前列定义为模板列
          type: "template",
          // 表示当前这一列使用模板名称
          template: "opt",
        },
      ], //为table指定列
      addCateDialogVisible: false, //控制添加分类对话框的显示与隐藏
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 分类的等级，默认添加的是1级分类
        cat_level: 0,
      },
      // 添加分类表单的规则验证对象
      addCateFormrules: {
        cat_name: [
          { required: true, message: "请输入分类的名称", trigger: "blur" },
        ],
      },
      parentCateList: [], //父级分类的列表
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: true,
        checkStrictly: true,
      }, //指定级联选择器配置对象
      selectedKeys: [], //选中的父级分类的Id数组
      editCateDialogVisible: false, //控制修改分类对话框的显示与隐藏
      editCateForm: {}, //编辑用户的表单数据
      editCateRules: {
        cat_name: [
          { required: true, message: "请填写分类名称", trigger: "blur" },
          {
            min: 2,
            max: 13,
            message: "分类名称长度在2~13之间",
            trigger: "blur",
          },
        ],
      }, //编辑用户的校验规则
    };
  },

  mounted() {
    this.getCateList();
  },

  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$API.get("categories", {
        params: this.querInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败！");

      // 把数据列表给 cateList
      this.cateList = res.data.result;
      this.total = res.data.total;
    },

    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听 pagenum 的改变
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    // 点击按钮展示分类的对话框
    showAddCateDialog() {
      // 先获取父级分类的数据列表
      this.getParentCateList();
      // 展示对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$API.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取父级分类数据失败！");
      this.parentCateList = res.data;
    },
    // 选择项发生变化时触发这个回调
    parentCateChanged() {
      console.log(this.selectedKeys);
      //   如果selectedKeys 数组中的 length长度 大于0,证明选中的是父级分类
      // 反之, 就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        //    为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 父级分类的id
        this.addCateForm.cat_pid = 0;
        //    为当前分类的等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    // 点击按钮,添加新的分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$API.post(
          `categories`,
          this.addCateForm
        );
        if (res.meta.status !== 201)
          return this.$message.error("添加分类失败!");

        this.$message.success("添加分类成功!");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },

    // 监听对话框的关闭事件,重置表单数据
    addCateDialogClose() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 点击编辑按钮, 获取分类
    async showEditCateDialog(row) {
      this.editCateDialogVisible = true;
      // 获取分类数据
      const { data: res } = await this.$API.get(`categories/${row.cat_id}`);
      this.editCateForm = res.data;
    },

    // 编辑分类
    editCate() {
      this.$refs.editCateForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$API.put(
          `categories/${this.editCateForm.cat_id}`,
          {
            cat_name: this.editCateForm.cat_name,
          }
        );

        if (res.meta.status !== 200)
          return this.$message.error("更新分类失败!");

        this.$message.success("更新分类成功!");
        this.getCateList();
        this.editCateDialogVisible = false;
      });
    },

    // 删除分类的回调
    async deleteCate(row) {
      const conStr = await this.$confirm("确认删除该分类？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);

      if (conStr !== "confirm") return this.$message.info("已取消删除分类");

      const { data: res } = await this.$API.delete(`categories/${row.cat_id}`);
      if (res.meta.status !== 200) return this.$message.error("删除分类失败！");
      this.$message.success("删除分类成功！");
      this.getCateList();
    },
  },
};
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>