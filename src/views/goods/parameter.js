// tab选项
const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];

// 商品单位
const unitList = [
  {
    value: "数量单位",
    label: "数量单位",
    children: [
      {
        value: "个",
        label: "个",
      },
      {
        value: "双",
        label: "双",
      },
      {
        value: "对",
        label: "对",
      },
      {
        value: "套",
        label: "套",
      },
      {
        value: "张",
        label: "张",
      },
      {
        value: "盒",
        label: "盒",
      },
      {
        value: "件",
        label: "件",
      },
    ],
  },
  {
    value: "重量单位",
    label: "重量单位",
    children: [
      {
        value: "克",
        label: "克",
      },
      {
        value: "千克",
        label: "千克",
      },
      {
        value: "吨",
        label: "吨",
      },
      {
        value: "斤",
        label: "斤",
      },
      {
        value: "kg",
        label: "kg",
      },
      {
        value: "g",
        label: "g",
      },
      {
        value: "t",
        label: "t",
      },
    ],
  },
  {
    value: "长度单位",
    label: "长度单位",
    children: [
      {
        value: "纳米",
        label: "纳米",
      },
      {
        value: "微米",
        label: "微米",
      },
      {
        value: "毫米",
        label: "毫米",
      },
      {
        value: "分米",
        label: "分米",
      },
      {
        value: "米",
        label: "米",
      },
      {
        value: "千米",
        label: "千米",
      },
      {
        value: "公里",
        label: "公里",
      },
      {
        value: "公尺",
        label: "公尺",
      },
      {
        value: "m",
        label: "m",
      },
      {
        value: "km",
        label: "km",
      },
    ],
  },
  {
    value: "面积单位",
    label: "面积单位",
    children: [
      {
        value: "平方毫米",
        label: "平方毫米",
      },
      {
        value: "平方分米",
        label: "平方分米",
      },
      {
        value: "平方米",
        label: "平方米",
      },
      {
        value: "平方千米",
        label: "平方千米",
      },
    ],
  },
  {
    value: "体积单位",
    label: "体积单位",
    children: [
      {
        value: "立方毫米",
        label: "立方毫米",
      },
      {
        value: "立方分米",
        label: "立方分米",
      },
      {
        value: "立方米",
        label: "立方米",
      },
      {
        value: "立方千米",
        label: "立方千米",
      },
    ],
  },
  {
    value: "钱的单位",
    label: "钱的单位",
    children: [
      {
        value: "分",
        label: "分",
      },
      {
        value: "角",
        label: "角",
      },
      {
        value: "元",
        label: "元",
      },
      {
        value: "美元",
        label: "美元",
      },
      {
        value: "￥",
        label: "￥",
      },
      {
        value: "$",
        label: "$",
      },
    ],
  },
];

export {
    tabbars,
    unitList
}