<template>
    <div id="f-tag-list" :style="{ left: $store.state.asideWidth }">
        <el-tabs v-model="activeTab" type="card" class="demo-tabs" @tab-remove="removeTab" @tab-change="changeTab"
            style="min-width:100px;">
            <el-tab-pane :closable="item.path != '/'" v-for="item in tabList" :key="item.path" :label="item.title"
                :name="item.path">
                <!-- {{ item.content }} -->
            </el-tab-pane>
        </el-tabs>
        <span class="tag-btn" style="cursor: pointer;">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height:24px;"></div>
</template>

<script setup>
import { useTabList } from '@/composables/useTabList'
const { activeTab, tabList, changeTab, removeTab, handleClose } = useTabList()
</script>

<style scoped lang='scss'>
#f-tag-list {
    @apply fixed bg-gray-100 flex items-center z-99 px-[16px];
    top: 60px;
    right: 0;
    height: 44px;
    box-sizing: border-box;
    transition: all .5s;

    .tag-btn {
        @apply bg-white rounded ml-auto flex items-center justify-center px-2;
        height: 32px;
        // width: 32px
    }

    :deep(.el-tabs__header) {
        border-bottom: none;
        @apply mb-0;
    }

    :deep(.el-tabs__nav) {
        border: none !important;
    }

    :deep(.el-tabs__item) {
        @apply bg-white mx-1 rounded;
        border: none !important;
        height: 32px;
        line-height: 32px;
    }

    :deep(.el-tabs) {
        --el-tabs-header-height: auto;
    }

    :deep(.el-tabs__nav-next),
    :deep(.el-tabs__nav-prev) {
        transform: translateY(-50%);
        top: 50%;
    }

    :deep(.is-disabled) {
        cursor: not-allowed;
        @apply text-gray-300;
    }

    :deep(.el-tabs__nav-wrap) {
        margin-bottom: 0;
        margin-right: 8px;
    }
}
</style>