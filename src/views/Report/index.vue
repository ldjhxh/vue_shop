<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <div id="main" style="width: 900px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import _ from "lodash";
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        series: [{ smooth: true }],
      },
    };
  },

  async mounted() {
    this.initChart();
  },

  methods: {
    async initChart() {
      var myChart = echarts.init(document.getElementById("main"));

      const { data: res } = await this.$API.get("reports/type/1");
      if (res.meta.status !== 200)
        return this.$message.error("获取折线图数据失败！");
      console.log(res.data);
      // 数据配置项
      const result = _.merge(res.data, this.options);
      myChart.setOption(result);
    },
  },
};
</script>

<style>
</style>