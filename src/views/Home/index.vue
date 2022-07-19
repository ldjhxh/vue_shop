<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">
          <svg
            t="1658110013615"
            class="icon"
            viewBox="0 0 1026 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="1353"
            width="16"
            height="16"
          >
            <path
              d="M448.512 0q26.624 0 45.568 18.944t18.944 45.568l0 319.488q0 26.624-18.944 45.568t-45.568 18.944l-319.488 0q-26.624 0-45.568-18.944t-18.944-45.568l0-319.488q0-26.624 18.944-45.568t45.568-18.944l319.488 0zM961.536 0q26.624 0 45.056 18.944t18.432 45.568l0 319.488q0 26.624-18.432 45.568t-45.056 18.944l-320.512 0q-26.624 0-45.568-18.944t-18.944-45.568l0-319.488q0-26.624 18.944-45.568t45.568-18.944l320.512 0zM448.512 512q26.624 0 45.568 18.944t18.944 45.568l0 320.512q0 26.624-18.944 45.056t-45.568 18.432l-319.488 0q-26.624 0-45.568-18.432t-18.944-45.056l0-320.512q0-26.624 18.944-45.568t45.568-18.944l319.488 0zM961.536 512q26.624 0 45.056 18.944t18.432 45.568l0 320.512q0 26.624-18.432 45.056t-45.056 18.432l-320.512 0q-26.624 0-45.568-18.432t-18.944-45.056l0-320.512q0-26.624 18.944-45.568t45.568-18.944l320.512 0z"
              p-id="1354"
              fill="#bfbfbf"
            ></path>
          </svg>
        </div>
        <!-- 侧边栏-菜单区域 -->
        <el-menu
          active-text-color="#408eff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <!-- 路由占位 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单区域
      menuList: [],
      // 字体图标
      iconsObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
    };
  },
  mounted() {
    this.getMenuList();
    this.activePath = sessionStorage.getItem("activePath");
  },
  methods: {
    // 退出登录的回调
    logout() {
      // 清空token
      window.sessionStorage.clear();
      //   跳转路由
      this.$router.push("/login");
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$API.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 点击按钮切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100vh;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #373d41;
  padding-left: 0;
  color: #fff;
  font-size: 20px;
  .avatar_box {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      width: 100px;
      height: 100%;
    }
  }
}
.el-aside {
  background-color: #fff;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #dae4ea;
  // background-color: #fffef9;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #eaeaea;
  color: #515151;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
  svg {
    margin-top: 6px;
  }
}
</style>