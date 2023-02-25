<template>
    <div id="">
        <el-card shadow="never" class="border-0 relative" :style="{ height: `${$windowHeight - 60 - 44 - 22}px` }">
            <template #header>
                <div>
                    <!-- 新增和刷新 -->
                    <ListHeader layout="create,refresh" @create="handleCreate" @refresh="getData(pager)"></ListHeader>
                </div>
            </template>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading"
                :max-height="$windowHeight - (48 + 80 + 60 + 44 + 42)">
                <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label"
                    :width="item.with || 'auto'" :formatter="item.formatter" :align="item.align || ''" />
                <el-table-column label="状态" width="120">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                            :loading="row.statusLoading" @change="handleStatusChange($event, row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button size="small" type="primary" text icon="EditPen"
                            @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm title="是否删除该会员等级?" confirm-button-text="确认" cancel-button-text="取消" width="186px"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button size="small" type="primary" icon="Delete" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="changeCurrent" background layout="prev, pager, next" :total="pager.total"
                    :page-size="pager.limit" :current-page="pager.page" />
            </div>
        </el-card>
        <FormDrawer :title="isEdit ? '编辑' : '新增'" ref="formDrawerRef" @submit="handleSubmit">
            <el-form :model="createForm" ref="DrawerRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="createForm.name" placeholder="等级名称"></el-input>
                </el-form-item>
                <el-form-item label="等级权重" prop="level">
                    <el-input v-model="createForm.level" type="number" />
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="createForm.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="升级条件">
                    <el-form-item prop="max_price" label="累计消费满">
                        <el-input v-model="createForm.max_price" type="number" style="width: 50%;">
                            <template #append>
                                元
                            </template>
                        </el-input>
                        <small class="text-gray-500 flex">
                            设置会员等级所需要的累计消费，必须大于0，单位：元
                        </small>
                    </el-form-item>
                    <el-form-item prop="max_times" label="累计次数满">
                        <el-input v-model="createForm.max_times" type="number" style="width: 50%;">
                            <template #append>
                                笔
                            </template>
                        </el-input>
                        <small class="text-gray-500 flex">
                            设置会员等级所需要的购买量，必须大于0，单位：笔
                        </small>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="折扣率" prop="discount">
                    <el-input v-model="createForm.discount" type="number" style="width: 50%;">
                        <template #append>
                            %
                        </template>
                    </el-input>
                    <small class="text-gray-500 flex">
                        折扣单位为百分比，如果输入90，表示该会员等级的用户可以以商品原价的90%购买
                    </small>
                </el-form-item>
            </el-form>
        </FormDrawer>

    </div>
</template>
  
<script setup>
import levelApi from "@/api/level";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";
import { useTableInit, useInitForm } from "@/composables/useCommon";

const {
    getData,
    handleDelete,
    changeCurrent,
    loading,
    tableData,
    handleStatusChange,
    pager,
    columns,
} = useTableInit({
    queryApi: levelApi.getUserLevels,
    deleteApi: levelApi.deleteUserLevel,
    updateStateApi: levelApi.updateUserLevelStatus,
    columns: [
        {
            label: "会员等级",
            prop: "name",
        },
        {
            label: "折扣率(%)",
            prop: "discount",
            align: 'center'
        },
        {
            label: "等级序号",
            prop: "level",
            align: 'center'
        },
    ],
    onSuccessInit: (res) => {
        pager.total = res.totalCount;
        tableData.value = res.list.map((item) => {
            item.statusLoading = false;
            return item;
        });
    },
});

const {
    formDrawerRef,
    DrawerRef,
    isEdit,
    createForm,
    handleCreate,
    handleEdit,
    handleSubmit,
    rules,
} = useInitForm({
    text: "会员等级",
    createForm: {
        editId: null,
        name: "",
        level: 100,
        status: 1,
        discount: 0,
        max_price: 0,
        max_times: 0
    },
    rules: {
        name: [
            {
                required: true,
                message: "会员等级名称名称不能为空",
                trigger: "blur",
            },
        ]
    },
    createApi: levelApi.setUserLevel,
    editApi: levelApi.updateUserLevel,
    getData,
    pager,
});
</script>
  
<style lang="scss" scoped>
.pagination {
    @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%] z-50;
    height: 60px;
}

.custom-tree-node {
    .el-tree-node__content {
        padding-top: 20px;
        padding-bottom: 20px;
    }
}
</style>
  