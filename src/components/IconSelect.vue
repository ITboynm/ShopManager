<template>
    <div class="flex items-center">
        <el-select filterable :modelValue="selectIcon" @change="handleChange" placeholder="请选择图标">
            <el-option v-for="item in icons" :key="item" :label="item" :value="item">
                <div class="flex justify-between items-center">
                    <span class="text-gray-500">
                        {{ item }}
                    </span>
                    <el-tag>
                        <el-icon>
                            <component :is="item"></component>
                        </el-icon>
                    </el-tag>
                </div>
            </el-option>
        </el-select>
        <el-tag  v-if="selectIcon" class="ml-2" size="large">
            <el-icon size="large">
                <component :is="selectIcon"></component>
            </el-icon>
        </el-tag>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import * as iconList from "@element-plus/icons-vue";
defineProps({
    selectIcon: String
})
const emits = defineEmits(['update:selectIcon'])
const icons = ref(Object.keys(iconList))
const handleChange = (val) => {
    emits('update:selectIcon', val)
}
</script>

<style scoped lang='scss'>

</style>