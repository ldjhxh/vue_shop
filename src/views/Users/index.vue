<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="showAddDialog">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.mg_state"
              @change="userStateChanged(row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(row)"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <AddDialog
      v-show="scene === 1"
      @changeAddUser="changeAddUser"
      ref="addDialog"
    ></AddDialog>

    <!-- 修改用户的对话框 -->
    <EditDialog
      v-show="scene === 2"
      ref="editDialog"
      @changeEditUser="changeEditUser"
    ></EditDialog>
  </div>
</template>

<script>
// 引入adddialog
import AddDialog from "@/views/Users/AddDialog";
import EditDialog from "@/views/Users/EditDialog";
export default {
  data() {
    // 定义自定义校验规则
    // 验证邮箱的规则
    // var 验证手机号的规则
    return {
      // 获取用户列表参数对象
      queryInfo: {
        // 搜索关键字
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userList: [],
      total: 0,

      // 添加与修改对话框的展示
      scene: 0, // 1代表展示添加用户的对话框 2代表展示修改用户的对话框
    };
  },
  mounted() {
    // 获取用户列表数据
    this.getUserList();
  },
  methods: {
    // 获取用户信息
    async getUserList() {
      const { data: res } = await this.$API.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      //   console.log(newSize);
      this.queryInfo.pagesize = newSize;
      //   发请求
      this.getUserList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      //   console.log(newPage);
      this.queryInfo.pagenum = newPage;
      // 发请求
      this.getUserList();
    },
    // 监听switch 开关状态的改变
    async userStateChanged(userinfo) {
      const { data: res } = await this.$API.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功");
    },

    // 添加新用户的回调
    // 当添加用户成功后 ， 刷新数据列表
    changeAddUser() {
      // 获取用户列表数据
      this.getUserList();
    },

    changeEditUser() {
      // 当编辑用户信息成功后，重新获取用户列表数据
      this.getUserList();
    },

    // 展示添加用户的对话框
    showAddDialog() {
      // 切换场景
      this.scene = 1;
      this.$refs.addDialog._data.addDialogVisible = true;
    },
    // 展示编辑用户的对话框
    showEditDialog(row) {
      // 切换场景
      this.scene = 2;
      // 调用editDialog组件中的方法
      //   获取用户列表信息
      this.$refs.editDialog.showEditDialog(row.id);
    },

    // 根据Id删除对应的用户信息
    async removeUserById(id) {
      // 询问用户是否删除数据
      const conResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      if (conResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$API.delete(`users/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除用户失败！");

      this.$message.success("删除用户成功！");
      //  获取数据
      this.getUserList();
    },
  },

  components: {
    AddDialog,
    EditDialog,
  },
};
</script>

<style lang="less" scoped>
</style>