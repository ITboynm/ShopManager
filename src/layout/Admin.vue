<template>
    <el-container>
        <el-header>
            <f-header></f-header>
        </el-header>

        <el-container>
            <el-aside class="aside" :width="$store.state.asideWidth">
                <f-menu></f-menu>
            </el-aside>
            <el-main class="main">
                <!-- 标签导航 -->
                <f-tag-list></f-tag-list>
                <!-- 主要内容 -->
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <keep-alive :max="10">
                            <component :is="Component"></component>
                        </keep-alive>
                    </transition>
                </router-view>
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
.main,
.aside {
    transition: all .5s;
}

.fade-enter-from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
}

.fade-enter-to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
}

.fade-leave-from {
    opacity: 1;
}

.fade-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s;
}

.fade-enter-active {
    transition-delay: 0.3s;
}
</style>