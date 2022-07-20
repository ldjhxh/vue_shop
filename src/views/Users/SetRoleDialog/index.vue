<template>
  <el-dialog
    title="分配角色"
    :visible.sync="setRoleDialogVisible"
    width="50%"
    @close="setRoleDialogClosed"
  >
    <p>当前的用户：{{ userinfo.username }}</p>
    <p>当前的角色：{{ userinfo.role_name }}</p>
    <p>
      分配新角色：
      <el-select v-model="selectedRoleId" placeholder="请选择">
        <el-option
          v-for="item in roleList"
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="setRoleDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveRoleInfo">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["userinfo", "roleList"],
  data() {
    return {
      setRoleDialogVisible: false, //控制分配角色对话框的显示与隐藏
      selectedRoleId: "", // 已选中的角色id值
      userInfo: this.userinfo,
    };
  },

  methods: {
    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择要分配的角色！");
      }

      const { data: res } = await this.$API.put(
        `users/${this.userinfo.id}/role`,
        { rid: this.selectedRoleId }
      );
      if (res.meta.status !== 200) return this.$message.error("更新角色失败！");

      this.$message.success("更新角色成功！");
      //触发自定义事件
      this.$emit("getUserList");
      this.setRoleDialogVisible = false; //关闭对话框
    },

    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = "";
      this.userInfo = {};
    },
  },
};
</script>

<style>
</style>