import { ref, nextTick, computed } from "vue";
import goodsApi from "@/api/goods";
import { notification } from "@/utils/utils";
import { useArrayMove } from "@/utils/utils";
import { cloneDeep } from "lodash";
// 当前商品ID
export const goodsId = ref(0);

// 规格选项列表
export const sku_card_list = ref([]);

export const sku_list = ref([]);
// 初始化规格选项列表
export function initSkuCardList(data) {
  sku_card_list.value = data.goodsSkusCard.map((item) => {
    item.text = item.name;
    item.loading = false;
    item.delLoading = false;
    item.upLoading = false;
    item.downLoading = false;
    item.goodsSkusCardValue.map((i) => {
      i.text = i.value || "属性值";
    });
    return item;
  });
  sku_list.value = data.goodsSkus;
}

// 添加规格选项
export const btnLoading = ref(false);
export async function addSkuCardEvent() {
  btnLoading.value = true;
  try {
    const res = await goodsApi.setGoodsSkusCard({
      goods_id: goodsId.value,
      name: "规格选项",
      order: 50,
      type: 0,
    });
    if (res.goods_id) {
      sku_card_list.value.push({
        ...res,
        text: res.name,
        loading: false,
        goodsSkusCardValue: res.goodsSkusCardValue || [],
      });
      notification("添加规格选项成功");
    } else {
      notification("添加规格选项失败", "error");
    }
    btnLoading.value = false;
  } catch (error) {
    notification("添加规格选项失败", "error");
    console.table(error);
    btnLoading.value = false;
  }
}

// 修改商品规格选项
export async function handleUpdateSkuCard(item) {
  item.loading = true;
  const { goods_id, name, order, type, text } = item;
  try {
    const res = await goodsApi.updateGoodsSkusCard(item.id, {
      goods_id, //商品ID
      name: text, //规格名称
      order, //排序
      type, //规格类型 0文字
    });
    if (res) {
      item.name = text;
      notification("修改规格名称成功");
    } else {
      item.text = name;
      notification("修改规格名称失败", "error");
    }
    item.loading = false;
  } catch (error) {
    item.text = name;
    notification("修改规格名称失败", "error");
    console.table(error);
    item.loading = false;
  }
}

// 删除规格选项
export async function handleDeleteSkuCard(item) {
  item.delLoading = true;
  try {
    const res = await goodsApi.deleteGoodsSkusCard(item.id);
    if (res) {
      notification("删除规格选项成功");
      const index = sku_card_list.value.findIndex((i) => i.id == item.id);
      if (index > -1) sku_card_list.value.splice(index, 1);
    } else {
      notification("删除规格选项失败", "error");
    }
    item.delLoading = false;
  } catch (error) {
    notification("删除规格选项失败", "error");
    console.table(error);
    item.delLoading = false;
  }
}

// 排序规格选项
export async function sortCard(type, index, row) {
  row[`${type}Loading`] = true;
  const olist = cloneDeep(sku_card_list.value);
  useArrayMove(type, olist, index);
  let sortdata = olist.map((item, index) => {
    return { id: item.id, order: index + 1 };
  });

  try {
    const res = await goodsApi.sortGoodsSkusCard({ sortdata });
    if (res) {
      useArrayMove(type, sku_card_list.value, index);
      notification("规格选项排序成功");
    } else {
      notification("规格选项排序失败", "error");
    }
    row[`${type}Loading`] = false;
  } catch (error) {
    row[`${type}Loading`] = false;
    notification("规格选项排序失败", "error");
    console.table(error);
  }
}

// 选择配置规格
export async function handleChooseSetGoods(id, data) {
  const item = sku_card_list.value.find((item) => item.id == id);
  item.loading = true;
  try {
    const res = await goodsApi.setGoodsSkusCardValue(id, data);
    if (res) {
      item.name = item.text = res.goods_skus_card.name;
      item.goodsSkusCardValue = res.goods_skus_card_value.map((i) => {
        i.text = i.name || "属性值";
        return i;
      });
      notification("设置商品规格和选项成功", "error");
    } else {
      notification("设置商品规格和选项失败", "error");
    }
    item.loading = false;
  } catch (error) {
    notification("设置商品规格和选项失败", "error");
    item.loading = false;
    console.log(error);
  }
}

// 初始化规格值
export function initSkusCardItem(id) {
  const itemLoading = ref(false);
  const item = sku_card_list.value.find((item) => item.id == id);
  const inputValue = ref("");
  const inputVisible = ref(false);
  const InputRef = ref();

  const handleClose = async (tag) => {
    itemLoading.value = true;
    try {
      const res = await goodsApi.deleteGoodsSkusCardValue(tag.id);
      if (res) {
        const index = item.goodsSkusCardValue.findIndex((i) => i.id == tag.id);
        if (index != -1) item.goodsSkusCardValue.splice(index, 1);
        notification("规格选项值删除成功");
      } else {
        notification("规格选项值删除失败", "error");
      }
      itemLoading.value = false;
    } catch (error) {
      itemLoading.value = false;
      notification("规格选项值删除失败", "error");
      console.table(error);
    }
  };

  const showInput = () => {
    inputVisible.value = true;
    nextTick(() => {
      InputRef.value.input.focus();
    });
  };

  const handleInputConfirm = async () => {
    if (!inputValue.value) return (inputVisible.value = false);
    itemLoading.value = true;
    try {
      const res = await goodsApi.createGoodsSkusCardValue({
        goods_skus_card_id: id, //规格ID
        name: item.name, //规格名称
        order: 50, //排序
        value: inputValue.value, //规格选项名称
      });
      if (res.id) {
        notification("规格选项值新增成功");
        item.goodsSkusCardValue.push({
          ...res,
          text: res.value,
        });
      } else {
        notification("规格选项值新增失败", "error");
      }
      itemLoading.value = false;
      inputVisible.value = false;
      inputValue.value = "";
    } catch (error) {
      notification("规格选项值新增失败", "error");
      itemLoading.value = false;
      inputVisible.value = false;
      inputValue.value = "";
      console.table(error);
    }
  };

  const handleChange = async (val, tag) => {
    itemLoading.value = true;
    try {
      const res = await goodsApi.updateGoodsSkusCardValue(tag.id, {
        goods_skus_card_id: id, //规格ID
        name: item.name, //规格名称
        order: tag.order, //排序
        value: val, //规格选项值名称
      });
      if (res) {
        tag.value = val;
        notification("规格选项值修改成功");
      } else {
        tag.text = tag.value;
        notification("规格选项值修改失败", "error");
      }
      itemLoading.value = false;
    } catch (error) {
      itemLoading.value = false;
      tag.text = tag.value;
      notification("规格选项值修改失败", "error");
      console.table(error);
    }
  };

  return {
    item,
    inputValue,
    inputVisible,
    InputRef,
    itemLoading,
    handleChange,
    handleClose,
    showInput,
    handleInputConfirm,
  };
}

// 初始化表格
export function initSkuTable() {
  const skuLabels = computed(() =>
    sku_card_list.value.filter((v) => v.goodsSkusCardValue.length > 0)
  );

  // 获取表头
  const tableThs = computed(() => {
    let length = skuLabels.value.length;
    return [
      {
        name: "商品规格",
        colspan: length,
        width: "",
        rowspan: length > 0 ? 1 : 2,
      },
      {
        name: "销售价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "市场价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "成本价",
        width: "100",
        rowspan: 2,
      },
      {
        name: "库存",
        width: "100",
        rowspan: 2,
      },
      {
        name: "体积",
        width: "100",
        rowspan: 2,
      },
      {
        name: "重量",
        width: "100",
        rowspan: 2,
      },
      {
        name: "编码",
        width: "100",
        rowspan: 2,
      },
    ];
  });

  return {
    skuLabels,
    tableThs,
    sku_list,
  };
}
