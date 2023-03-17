<template>
  <div
    v-loading="loading"
    class="bg-white p-4 rounded"
    :style="{ height: `${$windowHeight.value - 60 - 44 - 24}px` }"
  >
    <el-form :model="form" label-width="160px">
      <el-form-item label="物流查询key">
        <div>
          <el-input v-model="form.ship" placeholder="物流查询key"></el-input>
          <small class="text-gray-500 flex mt-1">
            用于查询物流信息，接口申请（仅供参考）
          </small>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="submit"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import sysconfigApi from "@/api/sysconfig";
import { fetchData } from "@/utils/utils";

const form = reactive({
  ship: "",
});

const loading = ref(false);
const getData = async () => {
  loading.value = true;
  const res = await fetchData(
    sysconfigApi.getSysconfig,
    "",
    "获取系统配置",
    true
  );
  if (!res.error) {
    for (const k in form) {
      form[k] = res[k];
    }
    form.password_encrypt = res.password_encrypt.split(",");
  } else {
    console.log(res.error);
  }
  loading.value = false;
};

const submit = async () => {
  loading.value = true;
  const res = await fetchData(
    sysconfigApi.updateSysconfig,
    {
      ...form,
    },
    "修改系统配置"
  );
  res.error ? console.log(res.error) : getData();
  loading.value = false;
};

onMounted(() => {
  getData();
});
</script>
