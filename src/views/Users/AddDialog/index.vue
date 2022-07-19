<template>
  <el-dialog
    title="添加用户"
    :visible.sync="addDialogVisible"
    width="50%"
    @close="addDialogClosed"
  >
    <!-- 内容主体区域 -->
    <el-form
      :model="addFormData"
      :rules="addFormRules"
      ref="addFormRef"
      label-width="70px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addFormData.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="addFormData.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addFormData.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addFormData.mobile"></el-input>
      </el-form-item>
    </el-form>
    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="addUser">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    // 定义自定义校验规则
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
    var checkMObile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };
    return {
      //   添加表单验证的规则对象
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名的长度在3~10个字符间",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "用户名的长度在6~15个字符间",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMObile, trigger: "blur" },
        ],
      },
      //   控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //   添加用户的表单数据
      addFormData: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
    };
  },

  methods: {
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async (vaild) => {
        if (!vaild) return;
        // 发请求添加用户
        const { data: res } = await this.$API.post("users", this.addFormData);
        if (res.meta.status !== 201)
          return this.$message.error("添加用户失败！");
        this.$message.success("添加用户成功");

        // 隐藏添加用户的对话框
        this.addDialogVisible = false;

        // 添加用户信息成功后，通知父组件发请求获取用户列表信息
        this.$emit("changeAddUser");
      });
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields();
    },
  },
};
</script>

<style>
</style>