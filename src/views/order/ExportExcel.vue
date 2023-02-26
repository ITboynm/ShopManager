<template>
    <el-drawer title="导出订单" v-model="dialogVisible" size="40%">
        <el-form :model="form" label-width="80px">
            <el-form-item label="订单类型">
                <el-select v-model="form.tab" placeholder="请选择">
                    <el-option v-for="item in tabs" :key="item.key" :label="item.name" :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间范围">
                <el-date-picker v-model="form.time" type="daterange" range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" value-format="YYYY-MM-DD" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="loading">导出</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script setup>
import { ref, reactive } from "vue"
import orderApi from "@/api/order";
import { fetchData, notification } from "@/utils/utils";
defineProps({
    tabs: Array
})
const dialogVisible = ref(false)
const form = reactive({
    tab: null,
    time: ""
})
const open = () => dialogVisible.value = true
const close = () => dialogVisible.value = false
const loading = ref(false)
const onSubmit = async () => {
    if (!form.tab) return notification('订单类型不能为空', 'warning')
    loading.value = true
    const params = {
        tab: form.tab
    }
    if (Array.isArray(form.time) && form.time[0]) params.starttime = form.time[0]
    if (Array.isArray(form.time) && form.time[1]) params.endtime = form.time[1]
    const res = await fetchData(orderApi.excelExportOrder, params, '订单导出')
    if (!res.error) {
        //下载blog文件，导出excel
        let url = window.URL.createObjectURL(new Blob([res]))
        let link = document.createElement("a")
        link.style.display = "none"
        link.href = url
        let filename = (new Date()).getTime() + ".xlsx"
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        close()
    } else {
        console.log(res.error)
    }
    loading.value = false
}
defineExpose({
    open,
    close
})
</script>

<style lang="scss" scoped></style>