<template>
    <el-container>
        <el-header>
            <f-header></f-header>
        </el-header>

        <el-container>
            <el-aside>
                <f-menu></f-menu>
            </el-aside>
            <el-main>
                <!-- 标签导航 -->
                <f-tag-list></f-tag-list>
                <!-- 主要内容 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import FHeader from './components/FHeader.vue';
import FMenu from './components/FMenu.vue';
import FTagList from './components/FTagList.vue';
</script>

<style scoped lang='scss'>

</style>