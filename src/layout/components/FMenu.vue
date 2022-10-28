<template>
    <div class="f-menu">
        <el-menu default-active="2" style="border: 0;">
            <el-sub-menu index="1">
                <template #title>
                    <el-icon>
                        <location />
                    </el-icon>
                    <span>Navigator One</span>
                </template>
                <el-menu-item-group title="Group One">
                    <el-menu-item index="1-1">item one</el-menu-item>
                    <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                    <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                    <template #title>item four</template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="2">
                <el-icon>
                    <icon-menu />
                </el-icon>
                <span>Navigator Two</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
                <el-icon>
                    <document />
                </el-icon>
                <span>Navigator Three</span>
            </el-menu-item>
            <el-menu-item index="4">
                <el-icon>
                    <setting />
                </el-icon>
                <span>Navigator Four</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const asideMenus = ref([{
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
    "icon": 'help',
    "child": [
        {
            "name": "商品管理",
            "icon": 'help-filled',
            "frontpath": '/'
        }
    ]
}])
</script>

<style scoped lang='scss'>
.f-menu {
    @apply shadow-md fixed bg-light-50;
    width: 250px;
    top: 60px;
    bottom: 0;
    left: 0;
    overflow: auto;
}
</style>