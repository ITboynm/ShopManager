<template>
  <template v-for="menu in userMenu" :key="menu._id">
    <!-- 判断是不是菜单 且下面的儿子也是菜单 -->
    <el-sub-menu v-if="menu.child && menu.child.length > 0" :index="menu.name">
      <template #title>
        <el-icon>
          <component :is="menu.icon"></component>
        </el-icon>
        <span>{{ menu.name }}</span>
      </template>
      <!-- 递归 -->
      <tree-menu :userMenu="menu.child" />
    </el-sub-menu>
    <!-- 如果下面没有儿子了 -->
    <el-menu-item v-else :index="menu.frontpath">
      <el-icon>
        <component :is="menu.icon"></component>
      </el-icon>
      {{ menu.name }}
    </el-menu-item>
  </template>
</template>

<script setup>
const props = defineProps({
  userMenu: {
    type: Array,
    default: [],
  },
});
</script>

<style scoped lang="scss"></style>
