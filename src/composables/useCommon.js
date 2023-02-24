import { onMounted, ref, reactive, toRaw, nextTick } from "vue";
import { notification } from "@/utils/utils";
/**
 *
 * @param {*} options
 * @returns
 */

// 初始化搜索、分页、删除、修改状态
export function useTableInit(options = {}) {
  const queryRules = options.queryRules || [];
  const columns = options.columns || [];
  // 搜索表单组件
  const queryformRef = options.queryformRef || ref(null);
  const multipleTableRef = options.multipleTableRef || ref(null);
  const queryform = reactive(options.queryform || {});
  // 全局搜索状态
  let searchStatus = 0;
  // 分页参数
  const pager = reactive({
    page: 1,
    limit: 10,
    total: 0,
  });
  //   loading状态
  const loading = ref(false);
  const tableData = ref([]);

  const getData = async (param = pager, data) => {
    loading.value = true;
    try {
      const res = await options.queryApi(param, data);
      if (options.onSuccessInit && typeof options.onSuccessInit == "function") {
        options.onSuccessInit(res);
      } else {
        pager.total = res.totalCount;
        tableData.value = res.list;
      }
      loading.value = false;
      if (searchStatus) {
        setTimeout(() => {
          searchStatus = 0;
        }, 0);
      }
    } catch (error) {
      loading.value = false;
      if (searchStatus) {
        setTimeout(() => {
          searchStatus = 0;
        }, 0);
      }
      console.log(error);
    }
  };

  /**
   * 查询
   *
   * */
  const getParams = (config = pager) => {
    const querParams = {};
    for (const key in toRaw(queryform)) {
      let val = toRaw(queryform)[key];
      if (val || val == 0 || val == false) querParams[key] = val;
    }
    Object.keys(querParams).length
      ? getData(config, querParams)
      : getData(config);

    return querParams;
  };

  const handleQuery = async (isOk) => {
    searchStatus = 1;
    if (isOk() != "undefined") {
      const res = await isOk();
      if (!res) return;
      pager.page = 1;
      getParams();
    } else {
      queryformRef.value.validate(async (valid, fields) => {
        getParams();
      });
    }
  };
  // 重置
  const handleQueryRest = () => {
    queryformRef.value.resetFields();
    getData();
  };
  // 清除多选状态
  const resetMultipleTable = () => {
    if (multipleTableRef.value) multipleTableRef.value.clearSelection();
  };
  // 多选方法以及最终返回的数据
  const multiSelectionIds = ref([]);
  const handleSelectionChange = (e) => {
    multiSelectionIds.value = e.map((item) => item.id);
  };
  // 分页操作
  const changeCurrent = (cur) => {
    if (searchStatus) {
      setTimeout(() => {
        searchStatus = 0;
      }, 0);
      return;
    }
    pager.page = cur;
    getParams();
  };
  // 删除/批量删除/彻底删除
  const handleDelete = async (id) => {
    if (id instanceof Array && !id.length)
      return notification(`请选择商品`, "info");
    loading.value = true;
    try {
      const res = await options.deleteApi(id);
      if (res) {
        notification("删除成功");
        getData();
      } else {
        notification("删除失败", "error");
      }
      resetMultipleTable();
      loading.value = false;
    } catch (error) {
      notification("删除失败", "error");
      resetMultipleTable();
      loading.value = false;
    }
  };

  // 彻底删除/恢复商品 options.destroyApi
  const handleShopStatus = async (id, type) => {
    if (id instanceof Array && !id.length)
      return notification(`请选择商品`, "info");
    loading.value = true;
    let res;
    let text = "操作";
    try {
      if (type == "destroy") {
        res = await options.destroyApi(id);
        text = "彻底删除";
      } else {
        res = await options.restoreApi(id);
        text = "商品恢复";
      }

      if (res) {
        notification(`${text}成功`);
        getData();
      } else {
        notification(`${text}失败`, "error");
      }
      resetMultipleTable();
      loading.value = false;
    } catch (error) {
      notification(`${text}失败`, "error");
      resetMultipleTable();
      loading.value = false;
    }
  };
  // 修改状态
  const handleStatusChange = async (status, row) => {
    if (row instanceof Array) {
      if (!row.length) return notification(`请选择商品`, "info");
      let text;
      status ? (text = "上架") : (text = "下架");
      try {
        const res = await options.updateStateApi(row, status);
        if (res) {
          notification(`${text}成功`);
          getData();
        } else {
          notification(`${text}失败`, "error");
        }
      } catch (error) {
        console.table(error);
        notification(`${text}失败`, "error");
      }
    } else {
      row.statusLoading = true;
      try {
        const res = await options.updateStateApi(row.id, { status });
        if (res) {
          notification("状态修改成功");
          row.status = status;
        } else {
          notification("状态修改失败", "error");
        }
        row.statusLoading = false;
      } catch (error) {
        console.table(error);
        notification("状态修改失败", "error");
        row.statusLoading = false;
      }
    }
  };
  onMounted(() => {
    getData();
  });

  return {
    getData,
    handleQuery,
    handleQueryRest,
    changeCurrent,
    handleDelete,
    handleStatusChange,
    handleSelectionChange,
    handleShopStatus,
    multiSelectionIds,
    queryRules,
    columns,
    loading,
    queryform,
    queryformRef,
    multipleTableRef,
    tableData,
    pager,
  };
}

// 初始化新增与修改
export function useInitForm(options = {}) {
  const rules = options.rules || [];
  const formDrawerRef = ref(null);
  const DrawerRef = ref(null);
  const isEdit = ref(false);
  const resetForm = () => {
    if (DrawerRef.value) DrawerRef.value.clearValidate();
  };
  const reset = () => {
    if (DrawerRef.value) DrawerRef.value.resetFields();
  };

  const resetPicker = () => {
    if (options.picker) {
      createForm[options.picker.start] = "";
      createForm[options.picker.end] = "";
    }
  };

  const createForm = reactive(options.createForm);

  // 新增
  const handleCreate = async () => {
    isEdit.value = false;
    resetForm();
    reset();
    resetPicker();
    formDrawerRef.value.open();
  };
  // 编辑
  const handleEdit = async (row) => {
    isEdit.value = true;
    resetForm();
    formDrawerRef.value.open();
    nextTick(() => {
      Object.assign(createForm, row);
      createForm.editId = row.id;
    });
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
      let subBody = {};
      if (options.beforeSubmit && typeof options.beforeSubmit == "function") {
        subBody = options.beforeSubmit({ ...createForm });
      } else {
        subBody = createForm;
      }
      try {
        let res;
        let { editId, ...params } = subBody;
        if (!isEdit.value) {
          res = await options.createApi(params);
          if (res) text = "新增";
          options.pager.page = 1;
        } else {
          res = await options.editApi(editId, params);
          if (res) text = "编辑";
        }
        resetLoading();
        formDrawerRef.value.hideLoading();
        await options.getData();
        notification(`${text}${options.text}成功`);
      } catch (error) {
        console.log(error);
        formDrawerRef.value.hideLoading();
        notification(`${text}${options.text}失败`, "error");
        resetLoading();
      }
    });
  };

  return {
    formDrawerRef,
    DrawerRef,
    isEdit,
    createForm,
    rules,
    handleCreate,
    handleEdit,
    handleSubmit,
  };
}
