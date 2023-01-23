<template>
    <el-container>
        <el-header>
            <f-header></f-header>
        </el-header>

        <el-container>
            <el-aside class="aside" :width="$store.state.asideWidth">
                <f-menu></f-menu>
            </el-aside>
            <suspense>
                <!-- #default 异步组件加载完成后页面呈现的内容 -->
                <template #default>
                    <el-main class="main">
                        <!-- 标签导航 -->
                        <f-tag-list></f-tag-list>
                        <!-- 主要内容 -->
                        <router-view></router-view>
                    </el-main>
                </template>
                <!-- #fallback 异步组件加载完成前页面呈现的内容 -->
                <template #fallback>
                    <h1>loading...</h1>
                </template>
            </suspense>
        </el-container>
    </el-container>
</template>

<script setup>
import FHeader from './components/FHeader.vue';
import FMenu from './components/FMenu.vue';
import FTagList from './components/FTagList.vue';
</script>

<style scoped lang='scss'>
.main,
.aside {
    transition: all .5s;
}
</style>