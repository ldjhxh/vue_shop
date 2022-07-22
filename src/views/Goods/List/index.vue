<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="90px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="140px">
          <template slot-scope="{ row }">
            {{ row.add_time | dataFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="{ row }">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>

    <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%">
      <el-form
        ref="editCateFormRef"
        :model="editCate"
        label-width="100px"
        :rules="editCateRules"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editCate.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editCate.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editCate.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editCate.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍">
          <el-input v-model="editCate.goods_introduce"></el-input>
        </el-form-item>

        <!-- 渲染表单的Item项 -->
        <el-form-item
          :label="item.attr_name"
          v-for="item in editCate.attrs"
          :key="item.attr_id"
        >
          <!-- 复选框组 -->
          <el-checkbox-group v-model="item.attr_vals">
            <el-checkbox
              :label="cb"
              v-for="(cb, i) in item.attr_vals"
              :key="i"
              border
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1, //当前页
        pagesize: 10, //每页显示几条数据
      }, //查询参数对象
      goodsList: [],
      total: 0, //总数据条数
      editDialogVisible: false,
      editCate: {
        goods_introduce: "",
      }, //商品的信息
      uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload", //上传图片的url地址
      previewVisible: false,
      previewPath: "",
      editCateRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
      },
      cateId: 0, //商品id
    };
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$API.get(`goods`, {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取商品列表失败！");
      this.$message.success("获取商品列表成功！");

      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },

    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },

    // 根据id 删除对应的商品
    async removeById(id) {
      const conStr = await this.$confirm(
        "此操作将永久删除该商品,是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (conStr !== "confirm") return this.$message.info("已取消删除");

      const { data: res } = await this.$API.delete(`goods/${id}`);
      if (res.meta.status !== 200) return this.$message.error("删除失败！");
      this.$message.success("删除成功！");
      this.getGoodsList();
    },

    goAddPage() {
      this.$router.push("/goods/add");
    },

    // 展示编辑商品的对话框
    async showEditDialog(row) {
      // 根据Id查询商品信息
      const { data: res } = await this.$API.get(`goods/${row.goods_id}`);
      if (res.meta.status !== 200)
        return this.$message.error("获取商品信息失败！");
      // 存储服务器返回的商品信息
      const cateInfo = {};
      this.cateId = res.data.goods_id;
      cateInfo.goods_name = res.data.goods_name;
      cateInfo.goods_price = res.data.goods_price;
      cateInfo.goods_number = res.data.goods_number;
      cateInfo.goods_weight = res.data.goods_weight;
      //
      // console.log(res.data);
      res.data.attrs.forEach((item) => {
        item.attr_vals =
          item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
      });
      cateInfo.attrs = res.data.attrs;
      this.editCate = cateInfo;
      this.editDialogVisible = true;
    },

    // 修改商品信息
    editCateInfo() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return;
        this.editCate.goods_cat = "0";
        const { data: res } = await this.$API.put(
          `goods/${this.cateId}`,
          this.editCate
        );
        if (res.meta.status !== 200)
          return this.$message.error("修改商品失败！");
        this.$message.success("修改商品成功！");
        this.getGoodsList();
        this.editDialogVisible = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>