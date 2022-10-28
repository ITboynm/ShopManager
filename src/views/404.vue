<template>
    <div class="nFound">
        <el-result icon="warning" title="404提示" sub-title="你找的页面走丢了~">
            <template #extra>
                <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
            </template>
        </el-result>
    </div>
</template>

<script setup>
</script>

<style scoped lang='scss'>
.nFound {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
</style>