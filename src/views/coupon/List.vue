<template>
  <div id="">
    <el-card
      shadow="never"
      class="border-0 relative"
      :style="{ height: `${$windowHeight - 60 - 44 - 22}px` }"
    >
      <template #header>
        <div>
          <!-- 新增和刷新 -->
          <ListHeader
            layout="create,refresh"
            @create="handleCreate"
            @refresh="getData(pager)"
          ></ListHeader>
        </div>
      </template>

      <el-table
        :data="tableData"
        stripe
        style="width: 100%"
        v-loading="loading"
        :max-height="$windowHeight - (48 + 80 + 60 + 44 + 42)"
      >
        <el-table-column label="优惠劵名称" width="350">
          <template #default="{ row }">
            <div
              class="border border-dashed py-2 px-4 rounded"
              :class="formatStatus(row).className"
            >
              <h5 class="font-bold text-md">{{ row.name }}</h5>
              <small>{{ row.start_time }} - {{ row.end_time }}</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{ row }">
            <el-tag effect="dark" :type="formatStatus(row).type">
              {{ formatStatus(row).text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="优惠"  >
          <template #default="{ row }">
            <div class="flex">
              <el-tag type="warning" effect="dark" class="br">
                {{ !row.type ? "满减" : "折扣" }}
              </el-tag>
              <el-tag class="bl">
                {{ !row.type ? `￥${row.value}` : ` ${row.value}折` }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.with || 'auto'"
          :align="item.align || ''"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              text
              icon="EditPen"
              v-if="formatStatus(row).text == '未开始'"
              @click="handleEdit(row)"
              >修改</el-button
            >
            <el-popconfirm
              v-if="formatStatus(row).text != '领取中'"
              title="是否删除该优惠券?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              width="166px"
              @confirm="handleDelete(row.id)"
            >
              <template #reference>
                <el-button size="small" type="primary" icon="Delete" text
                  >删除</el-button
                >
              </template>
            </el-popconfirm>
            <el-popconfirm
              v-if="formatStatus(row).text == '领取中'"
              title="是否让该优惠券失效?"
              confirm-button-text="失效"
              cancel-button-text="取消"
              width="180px"
              @confirm="handleStatusChange(0, row)"
            >
              <template #reference>
                <el-button size="small" type="danger" icon="Delete"
                  >失效</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="changeCurrent"
          background
          layout="prev, pager, next"
          :total="pager.total"
          :page-size="pager.limit"
          :current-page="pager.page"
        />
      </div>
    </el-card>
    <FormDrawer
      :title="isEdit ? '编辑' : '新增'"
      ref="formDrawerRef"
      @submit="handleSubmit"
    >
      <el-form
        :model="createForm"
        ref="DrawerRef"
        :rules="rules"
        label-width="120px"
        :inline="false"
      >
        <el-form-item label="优惠券名称" prop="name">
          <el-input
            v-model="createForm.name"
            placeholder="请输入优惠券名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="createForm.type" label="请选择优惠券类型">
            <el-radio :label="0" border>满减 </el-radio>
            <el-radio :label="1" border>折扣 </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠券面值" prop="value">
          <el-input
            v-model="createForm.value"
            placeholder="请输入优惠券面值"
            style="width: 50%"
          >
            <template #append>{{ createForm.type ? "折扣" : "元" }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="优惠券发行量" prop="total">
          <el-input-number v-model="createForm.total" :min="0" :max="10000" />
        </el-form-item>
        <el-form-item label="最低使用价格" prop="min_price">
          <el-input-number
            v-model="createForm.min_price"
            :min="0"
            :max="100000000"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="createForm.order" :min="0" :max="1000" />
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="timerange"
            type="datetimerange"
            :editable="false"
            range-separator=" - "
            value-format="YYYY-MM-DD HH:mm:ss"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="优惠券描述" prop="desc">
          <el-input
            v-model="createForm.desc"
            placeholder="请输入优惠券描述"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>

<script setup>
import couponApi from "@/api/coupon";
import FormDrawer from "@/components/FormDrawer.vue";
import ListHeader from "@/components/ListHeader.vue";
import { useTableInit, useInitForm } from "@/composables/useCommon";
import { computed } from "vue";
import { toTime } from "@/utils/utils";
const {
  getData,
  handleDelete,
  changeCurrent,
  handleStatusChange,
  loading,
  tableData,
  pager,
  columns,
} = useTableInit({
  queryApi: couponApi.getCoupons,
  deleteApi: couponApi.deleteCoupon,
  updateStateApi: couponApi.updateCouponStatus,
  columns: [
    {
      label: "发放数量",
      align: "center",
      prop: "total",
    },
    {
      label: "已使用",
      align: "center",
      prop: "used",
    },
  ],
});

const formatStatus = (row) => {
  let text = "领取中";
  let type = "danger";
  let className = "active";
  let start_time = toTime(row.start_time);
  let now = toTime();
  let end_time = toTime(row.end_time);
  if (start_time > now) {
    text = "未开始";
    className = "startActive";
    type = "success";
  } else if (end_time < now) {
    text = "已结束";
    className = "inactive";
    type = "info";
  } else if (row.status == 0) {
    text = "已失效";
    className = "inactive";
    type = "info";
  }
  return { text, className, type };
};

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
  text: "优惠券",
  createForm: {
    editId: null,
    name: "",
    type: 0,
    value: 1,
    total: 100,
    min_price: 1,
    start_time: null,
    end_time: null,
    order: 50,
    desc: "",
  },
  picker: {
    start: "start_time",
    end: "end_time",
  },
  rules: {
    name: [
      {
        required: true,
        message: "优惠券名称不能为空",
        trigger: "blur",
      },
    ],
    value: [
      {
        required: true,
        message: "面值不能为空",
        trigger: "blur",
      },
    ],
    total: [
      {
        required: true,
        message: "发行量不能为空",
        trigger: "blur",
      },
    ],
    min_price: [
      {
        required: true,
        message: "最低使用金额不能为空",
        trigger: "blur",
      },
    ],
    order: [
      {
        required: true,
        message: "排序不能为空",
        trigger: "blur",
      },
    ],
    desc: [
      {
        required: true,
        message: "描述不能为空",
        trigger: "blur",
      },
    ],
  },
  // 提交之前对参数进行修改
  beforeSubmit: (res) => {
    if (isNaN(res.start_time)) res.start_time = toTime(res.start_time);
    if (isNaN(res.end_time)) res.end_time = toTime(res.end_time);
    return res;
  },
  createApi: couponApi.setCoupon,
  editApi: couponApi.updateCoupon,
  getData,
  pager,
});

const timerange = computed({
  get() {
    return createForm.start_time && createForm.end_time
      ? [createForm.start_time, createForm.end_time]
      : [];
  },
  set(val) {
    createForm.start_time = val[0];
    createForm.end_time = val[1];
  },
});
</script>

<style scoped lang="scss">
.pagination {
  @apply flex items-center justify-center mt-5 absolute bottom-0 left-0 right-0 py-2 w-[100%];
  height: 60px;
}
.bl{
  border-top-left-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
}
.br{
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}
.startActive {
  @apply border-green-200 bg-green-50 text-green-400;
}
.active {
  @apply border-rose-200 bg-rose-50 text-red-400;
}

.inactive {
  @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>
