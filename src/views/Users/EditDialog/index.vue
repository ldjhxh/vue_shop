<template>
  <el-dialog
    title="编辑用户"
    :visible.sync="editDialogVisible"
    width="50%"
    @close="editDialogClosed"
  >
    <!-- 内容主体区域 -->
    <el-form
      :model="editForm"
      :rules="editFormRules"
      ref="editForm"
      label-width="70px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="editUser">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail =
        /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };

    // var 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 通过查询的用户信息对象
      editForm: {},
      editDialogVisible: false,
      // 修改用户 表单的规则验证对象
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            validator: checkEmail,
            message: "邮箱格式不正确，请重新输入",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            validator: checkMobile,
            message: "手机号码不正确，请重新输入",
            trigger: "blur",
          },
        ],
      },
      // 保存外部传递进来的id
      id: null,
    };
  },

  methods: {
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      this.id = id; //接收外部传递进来的id
      this.editDialogVisible = true;
      const { data: res } = await this.$API.get(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editForm = res.data;
    },
    // 修改用户信息的回调
    editUser() {
      // 用户点击修改按钮后，验证表单数据
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return this.$message.error("请填写完整用户信息");
        // 发请求修改用户信息
        const { data: res } = await this.$API.put(
          `users/${this.id}`,
          this.editForm
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改用户信息失败！");
        this.$message.success("修改用户信息成功");
        this.editDialogVisible = false; //关闭对话框
        // 通知父组件发请求
        this.$emit("changeEditUser");
      });
    },
    // 监听编辑用户对话框的关闭事件
    editDialogClosed() {
      // 重置表单
      this.$refs.editForm.resetFields();
    },
  },
};
</script>

<style>
</style>