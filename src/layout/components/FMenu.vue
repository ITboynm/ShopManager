<template>
    <div class="f-menu" :style="{ width: $store.state.asideWidth }">
        <el-menu unique-opened :collapse-transition="true" :collapse="iscollapse" :default-active="activePath" router
            style="border: 0;">
            <TreeMenu :userMenu=asideMenus />
        </el-menu>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TreeMenu from '../../components/TreeMenu.vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router'
const route = useRoute()
const activePath = ref(route.path)
const store = useStore()
const iscollapse = computed(() => store.state.asideWidth == '250px' ? false : true);
const asideMenus = [{
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
</script>

<style scoped lang='scss'>
.f-menu {
    @apply shadow-md fixed bg-light-50;
    // width: 250px;
    transition: all .5s;
    top: 60px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>