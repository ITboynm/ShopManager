<template>
  <FormDrawer
    title="设置商品规格"
    ref="formDrawerRef"
    destroyOnClose
    @submit="handleSubmit"
    :size="skusForm.sku_type ? '70%' : '40%'"
  >
    <el-form :model="skusForm">
      <el-form-item label="规格类型">
        <el-radio-group v-model="skusForm.sku_type">
          <el-radio :label="0" border>单规格</el-radio>
          <el-radio :label="1" border>多规格</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="!skusForm.sku_type">
        <el-form-item label="市场价格">
          <el-input
            v-model="skusForm.sku_value.oprice"
            placeholder="请输入市场价格"
            style="width: 50%"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="销售价格">
          <el-input
            v-model="skusForm.sku_value.pprice"
            placeholder="请输入销售价格"
            style="width: 50%"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="成本价格">
          <el-input
            v-model="skusForm.sku_value.cprice"
            placeholder="请输入成本价格"
            style="width: 50%"
          >
            <template #append>元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品重量">
          <el-input
            v-model="skusForm.sku_value.weight"
            placeholder="请输入商品重量"
            style="width: 50%"
          >
            <template #append>公斤</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商品体积">
          <el-input
            v-model="skusForm.sku_value.volume"
            placeholder="请输入商品体积"
            style="width: 50%"
          >
            <template #append>立方米</template>
          </el-input>
        </el-form-item>
      </template>
      <template v-else>
        <SkuCard></SkuCard>
        <SkuTable></SkuTable>
      </template>
    </el-form>
  </FormDrawer>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
import FormDrawer from "@/components/FormDrawer.vue";
import SkuCard from "@/views/goods/components/SkuCard.vue";
import SkuTable from "@/views/goods/components/SkuTable.vue";
import { initSkuCardList, goodsId } from "@/composables/useSku";
import { notification } from "@/utils/utils";
import { cloneDeep } from "lodash";
import goodsApi from "@/api/goods";
const formDrawerRef = ref(null);
const initSkus = {
  sku_value: {
    oprice: 0,
    pprice: 0,
    cprice: 0,
    weight: 0,
    volume: 0,
  }, //单规格属性（sku_type=0时必填）
  goodsSkus: [
    {
      skus: [
        {
          goods_skus_card_id: "",
          name: "",
          order: 50,
          value: "",
          id: "",
          text: "",
        },
      ],
      image: "",
      pprice: 0,
      oprice: 0,
      cprice: 0,
      stock: 0,
      volume: 0,
      weight: 0,
      code: "",
      goods_id: null,
    },
  ], //多规格属性（sku_type=1时必填）
};
const skusForm = reactive({
  sku_type: 0, //0单规格，1多规格
  sku_value: cloneDeep(initSkus.sku_value),
  goodsSkus: cloneDeep(initSkus.goodsSkus),
});

const open = async (row) => {
  row.skusStatus = true;
  try {
    goodsId.value = row.id;
    // 真实接口
    const res = await goodsApi.readGoods(goodsId.value);
    // 测试接口
    // const res = await goodsApi.readGoodsTest(goodsId.value);
    skusForm.sku_type = res.sku_type;
    skusForm.sku_value = res.sku_value || cloneDeep(initSkus.sku_value);
    skusForm.goodsSkus = res.goodsSkus || cloneDeep(initSkus.goodsSkus);
    initSkuCardList(res);
    row.skusStatus = false;
    formDrawerRef.value.open();
  } catch (error) {
    console.table(error);
    notification("获取规格详情数据失败", "error");
    row.skusStatus = false;
  }
};
const handleSubmit = async () => {
  formDrawerRef.value.showLoading();
  try {
    let params = {
      sku_type: goodsId.value,
      goodsSkus: [],
      sku_value: {},
    };
    if (skusForm.sku_type) {
      params.goodsSkus = cloneDeep(skusForm.goodsSkus);
    } else {
      params.sku_value = cloneDeep(skusForm.sku_value);
    }
    const res = await goodsApi.updateGoodsSkus(params.sku_type, params);
    if (res) {
      notification("商品规格修改成功");
      formDrawerRef.value.close();
    } else {
      notification("商品规格修改失败", "error");
    }
    formDrawerRef.value.hideLoading();
  } catch (error) {
    notification("商品规格修改失败", "error");
    formDrawerRef.value.close();
    formDrawerRef.value.hideLoading();
  }
};
const emits = defineEmits(["reloadData"]);
defineExpose({
  open,
});
</script>

<style scoped lang="scss"></style>
