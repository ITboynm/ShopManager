import { onMounted, ref, reactive, nextTick, toRaw } from "vue";

export function useTableCommon() {
    const queryformRef = ref(null);
    const queryform = reactive({
        keyword: "",
    });
    // 分页参数
    const pager = reactive({
        page: 1,
        limit: 10,
        total: 0,
    });
    const loading = ref(false);
    const tableData = ref([]);
    const formDrawerRef = ref(null);
    const DrawerRef = ref(null);
    const isEdit = ref(false);
    const resetForm = () => {
        if (DrawerRef.value) DrawerRef.value.clearValidate();
    };
    const reset = () => {
        if (DrawerRef.value) DrawerRef.value.resetFields();
    };
    const selectData = ref([]);
    const createForm = reactive({
        editId: null,
        username: "",
        password: "",
        role_id: null,
        status: 1,
        avatar: "",
    });
    const rules = reactive({
        username: [
            {
                required: true,
                message: "用户名不能为空",
                trigger: "blur",
            },
            { min: 3, max: 10, message: "用户名的长度在3~10位", trigger: "blur" },
        ],
        password: [
            {
                required: true,
                message: "用户密码不能为空",
                trigger: "blur",
            },
            { min: 3, max: 5, message: "密码的长度在3~5位", trigger: "blur" },
        ],
    });
    // 表格列头
    const columns = [
        {
            label: "所属管理员",
            prop: "role",
            align: "center",
            formatter: (row) => {
                return row.role?.name || "-";
            },
        },
        {
            label: "创建时间",
            prop: "create_time",
            with: 380,
            formatter: (row) => {
                return moment(row.create_time).format("YYYY-MM-DD HH:mm:ss");
            },
        },
    ];
    const getData = async (param = pager, data) => {
        loading.value = true;
        try {
            const res = await adminApi.getManagers(param, data);
            pager.total = res.totalCount;
            selectData.value = res.roles;
            tableData.value = res.list.map((item) => {
                item.statusLoading = false;
                return item;
            });
            loading.value = false;
        } catch (error) {
            loading.value = false;
        }
    };
    // 删除
    const handleDelete = async (id) => {
        loading.value = true;
        try {
            const res = await adminApi.deleteManager(id);
            if (res) {
                notification("删除成功");
                getData();
            } else {
                notification("删除失败", "error");
            }
            loading.value = false;
        } catch (error) {
            notification("删除失败", "error");
            loading.value = false;
        }
    };
    // 新增
    const handleCreate = async () => {
        resetForm();
        formDrawerRef.value.open();
    };
    // 编辑
    const handleEdit = async (row) => {
        isEdit.value = true;
        resetForm();
        formDrawerRef.value.open();
        nextTick(() => {
            Object.assign(createForm, {
                editId: row.id,
                username: row.username,
                password: row.password,
                role_id: row.role_id,
                status: row.status,
                avatar: row.avatar,
            });
        });
    };
    // 修改状态
    const handleStatusChange = async (status, row) => {
        row.statusLoading = true;
        try {
            const res = await adminApi.updateManagerState(row.id, { status });
            if (res) {
                notification("状态修改成功");
                row.status = status;
            } else {
                notification("状态修改失败", "error");
            }
            row.statusLoading = false;
        } catch (error) {
            notification("状态修改失败", "error");
            row.statusLoading = false;
        }
    };
    // 查询
    const handleQuery = () => {
        queryform.keyword
            ? getData(pager, { keyword: queryform.keyword })
            : getData();
    };
    // 重置
    const handleQueryRest = () => {
        queryform.keyword = "";
        getData();
    };
    // 初始化状态
    const resetLoading = () => {
        formDrawerRef.value.hideLoading();
        formDrawerRef.value.close();
        reset();
    };
    // 提交
    // 提交表单
    const handleSubmit = () => {
        DrawerRef.value.validate(async (valid, fields) => {
            if (!valid) return false;
            formDrawerRef.value.showLoading();
            let text = "操作";
            try {
                let res;
                if (!isEdit.value) {
                    res = await adminApi.setManager(createForm);
                    if (res) text = "新增";
                    pager.page = 1;
                } else {
                    res = await adminApi.updateManager(createForm.editId, {
                        username: createForm.username,
                        password: createForm.password,
                        role_id: createForm.role_id,
                        status: createForm.status,
                        avatar: createForm.avatar,
                    });
                    if (res) text = "编辑";
                }
                resetLoading();
                await getData();
                notification(`${text}管理员成功`);
            } catch (error) {
                notification(`${text}管理员失败`, "error");
                resetLoading();
            }
        });
    };
    const changeCurrent = async (cur) => {
        pager.page = cur;
        await getData(toRaw(pager));
    };

    return {
        getData,
        handleDelete,
        handleCreate,
        handleEdit,
        handleStatusChange,
        handleQuery,
        handleQueryRest,
        resetLoading,
        changeCurrent
    }
}