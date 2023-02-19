<template>
    <div id="">
        <el-card shadow="never" class="border-0 relative" :style="{ height: `${$windowHeight - 60 - 44 - 22}px` }">
            <template #header>
                <div>
                    <!-- 新增和刷新 -->
                    <ListHeader @create="handleCreate" @refresh="getData(pager)"></ListHeader>
                </div>
            </template>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading"
                :max-height="$windowHeight - (48 + 80 + 60 + 44 + 22)">
                <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label"
                    :width="item.with || 'auto'" :formatter="item.formatter" />
                <el-table-column label="状态" width="120">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                            :loading="row.statusLoading" @change="handleStatusChange($event, row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template #default="scope">
                        <el-button size="small" type="primary" text icon="EditPen"
                            @click="handleEdit(scope.row)">修改</el-button>
                        <el-popconfirm title="是否删除该角色?" confirm-button-text="确认" cancel-button-text="取消" width="158px"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button size="small" type="primary" icon="Delete" text>删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="changeCurrent" background layout="prev, pager, next"
                    :total="pager.total" :page-size="pager.limit" :current-page="pager.page" />
            </div>
        </el-card>
        <FormDrawer :title="isEdit ? '编辑' : '新增'" ref="formDrawerRef" @submit="handleSubmit">
            <el-form :model="createForm" ref="DrawerRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="createForm.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="createForm.desc" type="textarea" placeholder="角色描述" />
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="createForm.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<script setup>
import moment from "moment";
import roleApi from "@/api/role";
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
    queryApi: roleApi.getRoles,
    deleteApi: roleApi.deleteRole,
    updateStateApi: roleApi.updateRoleStatus,
    columns: [
        {
            label: "角色名称",
            prop: "name",
        },
        {
            label: "角色描述",
            prop: "desc",
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
    text: "角色",
    createForm: {
        editId: null,
        name: "",
        desc: "",
        status: 1,
    },
    rules: {
        name: [
            {
                required: true,
                message: "角色名称不能为空",
                trigger: "blur",
            },
        ],
        desc: [
            {
                required: true,
                message: "描述内容不能为空",
                trigger: "blur",
            },
        ],
    },
    createApi: roleApi.setRole,
    editApi: roleApi.updateRole,
    getData,
    pager,
});
</script>

<style scoped lang="scss">
.pagination {
    @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%];
    height: 60px;
}
</style>
