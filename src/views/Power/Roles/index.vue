<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-button type="primary" @click="addRoledialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="{ row }">
            <el-row
              :class="['bdbottom', item1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="item1 in row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  type="success"
                  closable
                  @close="removeRightById(row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[item2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="item2 in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="showEditRoleDialog(row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(row)"
            >
              删除</el-button
            >

            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
      @close="setRightDialogClose"
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoledialogVisible"
      width="50%"
      @close="addRoleDialogClose"
    >
      <el-form
        ref="addRoleForm"
        :rules="addRoleRules"
        :model="addRoleForm"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="50%"
    >
      <el-form
        ref="editRoleForm"
        :rules="addRoleRules"
        :model="editRoleForm"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件属性的绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: "",
      addRoledialogVisible: false, //控制添加角色对话框的展示与隐藏
      // 添加角色数据的对象
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      addRoleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "角色名称的长度在2~10个字符之间",
            trigger: "blur",
          },
        ],
      },

      editRoleDialogVisible: false, //控制编辑角色对话框的展示与隐藏
      editRoleForm: {}, //编辑角色的表单数据
      deleteDialogVisible: false, //控制删除角色对话框的展示与隐藏
    };
  },

  mounted() {
    this.getRoleList();
  },
  methods: {
    // 获取所有角色的列表
    async getRoleList() {
      const { data: res } = await this.$API.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败！");

      this.roleList = res.data;
    },

    // 根据id删除对应的权限
    async removeRightById(role, rightId) {
      // 提示用户是否要删除
      const confirmRes = await this.$confirm(
        "此操作将永久删除该权限,是否继续?",
        "提示",
        {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmRes !== "confirm") {
        return this.$message.info("取消了删除");
      }

      const { data: res } = await this.$API.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) return this.$message.error("删除权限失败！");
      //   this.getRoleList();
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      // 获取所有权限的数据
      const { data: res } = await this.$API.get("rights/tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限数据失败！");
      // 获取到的权限数据，保存到data中
      this.rightslist = res.data;
      // 递归获取三级节点id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 通过递归的形式，获取角色下所有三级权限的id, 并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前节点，不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },

    // 监听分配权限对话框的关闭事件
    setRightDialogClose() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$API.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) return this.$message.error("分配权限失败！");

      this.$message.success("分配权限成功！");
      // 重新获取角色列表数据
      this.getRoleList();
      this.setRightDialogVisible = false;
    },

    // 添加角色的回调
    async addRoleInfo() {
      const { data: res } = await this.$API.post("roles", this.addRoleForm);
      if (res.meta.status !== 201) this.$message.error("添加角色失败！");
      this.addRoledialogVisible = false;
      this.$message.success("添加角色成功！");

      // 重新获取角色列表数据
      this.getRoleList();
    },

    // 添加角色对话框的关闭事件
    addRoleDialogClose() {
      // 重置表单的数据
      this.$refs.addRoleForm.resetFields();
    },

    // 展示编辑角色的对话框
    async showEditRoleDialog(row) {
      // 根据Id获取角色信息
      const { data: res } = await this.$API.get(`roles/${row.id}`);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色信息失败");
      this.editRoleForm = res.data;
      this.editRoleDialogVisible = true;
    },

    // 编辑角色信息
    async editRoleInfo() {
      const { data: res } = await this.$API.put(
        `roles/${this.editRoleForm.roleId}`,
        {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc,
        }
      );
      if (res.meta.status !== 200)
        return this.$message.error("修改角色信息失败！");

      this.getRoleList();
      this.editRoleDialogVisible = false;
      this.$message.success("修改角色信息成功！");
    },

    // 删除角色
    async deleteRole(row) {
      const conStr = await this.$confirm("确认删除该角色？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).catch((err) => err);

      // 如果用户确认删除该角色，则返回值为 confirm
      // 如果用户取消删除该角色，则返回值为cancel
      if (conStr !== "confirm") return this.$message.info("已取消删除");
      const { data: res } = await this.$API.delete(`roles/${row.id}`);
      if (res.meta.status !== 200) return this.$message.error("删除角色失败！");

      this.$message.success("删除角色成功！");
      // 获取角色列表数据
      this.getRoleList();
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>