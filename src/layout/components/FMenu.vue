<template>
  <div class="f-menu" :style="{ width: $store.state.asideWidth }">
    <el-menu
      unique-opened
      :collapse-transition="true"
      :collapse="iscollapse"
      :default-active="activePath"
      router
      style="border: 0"
    >
      <TreeMenu :userMenu="asideMenus" />
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import TreeMenu from "../../components/TreeMenu.vue";
import { useStore } from "vuex";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
const route = useRoute();
const store = useStore();
const router = useRouter();
// 默认选中
const activePath = ref(store.state.userInfo.menus[0].child[0].frontpath);
watch(
  () => router.currentRoute.value.path,
  (newValue, oldValue) => {
    activePath.value = newValue;
  },
  { immediate: true }
);
// onBeforeRouteUpdate((to, from) => {
//   console.log(1);
//   activePath.value = to.path;
// });

// 是否展开
const iscollapse = computed(() =>
  store.state.asideWidth == "250px" ? false : true
);
/**
 * 测试菜单数据
[{
    "name": "后台面板",
    "icon": 'help',
    "child": [
        {
            "name": "主控台",
            "icon": 'help-filled',
            "frontpath": '/'
        }
    ]
}, {
    "name": "商城管理",
    "icon": 'shopping-bag',
    "child": [
        {
            "name": "商品管理",
            "icon": 'home-filled',
            "frontpath": '/good/list'
        }
    ]
}]
*/
const asideMenus = computed(() => store.state.menus);
</script>

<style scoped lang="scss">
.f-menu {
  @apply shadow-md fixed bg-light-50;
  // width: 250px;
  transition: all 0.5s;
  top: 60px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
}
// 隐藏滚动条
.f-menu::-webkit-scrollbar {
  width: 0px;
}
</style>
