<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1">
                <Discount />
            </el-icon>
            标题
        </span>
        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
            <Fold v-if="$store.state.asideWidth == '250px'" />
            <Expand v-else/>
        </el-icon>
        <el-tooltip effect="dark" content="刷新" placement="top-start">
            <el-icon class="icon-btn" @click="handleRefresh">
                <Refresh />
            </el-icon>
        </el-tooltip>
        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" content="全屏" placement="top-start">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center">
                    <el-avatar :size="25" :src="$store.state.userInfo.avatar" class="mr-2" />
                    {{ $store.state.userInfo.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
    <!-- <el-drawer v-model="showDrawer" title="修改密码" size="45%" :close-on-click-modal="false">
 
    </el-drawer> -->
    <FormDrawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
        <el-form :model="formData" ref="formRef" :rules="rules" label-width="80px" size="small">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="formData.oldpassword" placeholder="请输入旧密码">
                </el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input v-model="formData.password" placeholder="请输入新密码" show-password type="password">
                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input v-model="formData.repassword" placeholder="请确认新密码" show-password type="repassword">
                </el-input>
            </el-form-item>
        </el-form>
    </FormDrawer>
</template>

<script setup>

import { useFullscreen } from '@vueuse/core'
import FormDrawer from '../../components/FormDrawer.vue';
import { useRepassword, useLogout } from '@/composables/useManager'
// 全屏状态
const { isFullscreen, toggle } = useFullscreen()
// 修改密码
const { formDrawerRef, formData, rules, formRef, onSubmit, openRePasswordForm } = useRepassword()
//  退出登录
const { logout } = useLogout()
// 刷新
const handleRefresh = () => location.reload()
// 下拉触发
const handleCommand = (c) => {
    switch (c) {
        case 'logout':
            logout()
            break;
        case 'rePassword':
            // 修改密码
            openRePasswordForm()
            break;
    }
}
</script>

<style scoped lang='scss'>
.f-header {
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
    height: 60px;

    .dropdown {
        height: 60px;
        cursor: pointer;
        @apply flex justify-center items-center text-light-300 mx-5;
    }
}

.logo {
    width: 250px;
    @apply flex justify-center items-center text-xl font-thin;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 60px;
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-indigo-600;
}
</style>