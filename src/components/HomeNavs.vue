<template>
  <el-row :gutter="20" class="mt-5 mb-5">
    <el-col
      :span="3"
      :offset="0"
      v-for="(item, index) in iconNavs"
      :key="index"
    >
      <el-card shadow="hover" @click="$router.push(item.path)">
        <div class="flex flex-col items-center justify-center cursor-pointer">
          <el-icon :size="16" :color="item.color">
            <component :is="item.icon" />
          </el-icon>
          <span class="text-sm mt-2">{{ item.title }}</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
const iconNavs = [
  {
    icon: "user",
    color: "rgba(14, 165, 233, 1)",
    title: "用户",
    path: "/user/list",
  },
  {
    icon: "shopping-cart",
    color: "rgba(139, 92, 246, 1)",
    title: "商品",
    path: "/goods/list",
  },
  {
    icon: "tickets",
    color: "rgba(217, 70, 239, 1)",
    title: "订单",
    path: "/order/list",
  },
  {
    icon: "chat-dot-square",
    color: " rgba(20, 184, 166, 1)",
    title: "评价",
    path: "/comment/list",
  },
  {
    icon: "picture",
    color: "rgba(244, 63, 94, 1)",
    title: "图库",
    path: "/image/list",
  },
  {
    icon: "bell",
    color: "rgba(16, 185, 129, 1)",
    title: "公告",
    path: "/notice/list",
  },
  {
    icon: "set-up",
    color: "inherit",
    title: "配置",
    path: "/setting/base",
  },
  {
    icon: "files",
    color: " rgba(245, 158, 11, 1)",
    title: "优惠券",
    path: "/coupon/list",
  },
];
</script>

<style lang="scss" scoped></style>
