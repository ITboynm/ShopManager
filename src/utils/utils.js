import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import NProgress from "nprogress";
import myxss from "@/utils/xss";
import * as XLSX from "xlsx";
// 消息提示
const notification = (
  message,
  type = "success",
  duration = 1500,
  dangerouslyUseHTMLString = false
) => {
  ElNotification({
    message,
    type,
    duration,
    dangerouslyUseHTMLString,
  });
};

// 弹出提示
const showModal = (content = "提示内容", type = "warning", title = "") => {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type,
  });
};
// 弹出带输入提示
const showPromptModal = (
  content = "提示内容",
  inputValue = "",
  confirmTitle = "确认",
  cancelTitle = "取消",
  inputPattern = false,
  inputErrorMessage = "校验失败,请重新输入"
) => {
  return ElMessageBox.prompt(content, {
    confirmButtonText: confirmTitle,
    cancelButtonText: cancelTitle,
    inputPattern,
    inputErrorMessage: inputErrorMessage,
    inputValue,
  });
};
// 显示全屏loading
const showFullLoading = () => {
  NProgress.start();
};

// 隐藏全屏loading
const hideFullLoading = () => {
  NProgress.done();
};

// 树形结构遍历加属性
const recursionTree = (options) => {
  options.arr.forEach((item) => {
    item[options.key] = options.value;
    if (item.child && item.child.length > 0)
      recursionTree({
        arr: item.child,
        key: options.key,
        value: options.value,
      });
  });
};
// 转换成时间戳
const toTime = (data = "") => {
  return data ? new Date(data).getTime() : new Date().getTime();
};

// 数组排序 上移 下移
const useArrayMove = (type, arr, index) => {
  if (type == "up") swapArray(arr, index, index - 1);
  if (type == "down") swapArray(arr, index, index + 1);
};
// 调换位置
function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

// sku排列算法
function cartesianProductOf() {
  return Array.prototype.reduce.call(
    arguments,
    function (a, b) {
      var ret = [];
      a.forEach(function (a) {
        b.forEach(function (b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    },
    [[]]
  );
}

// 通用请求流程
async function fetchData(api, data, text, unnotification = false) {
  try {
    let res;
    const { fetchId, ...param } = data;
    if (fetchId) {
      param.fetchContent
        ? (res = await api(fetchId, param.fetchContent))
        : (res = await api(fetchId, param));
    } else {
      res = await api(data);
    }
    if (res) {
      if (!unnotification) {
        notification(`${text}成功`);
      }
    } else {
      notification(`${text}失败`, "error");
      return Promise.resolve({ error: `${text}失败` });
    }
    return Promise.resolve(res);
  } catch (error) {
    notification(`${text}失败`, "error");
    return Promise.resolve({ error });
  }
}
// 将query对象转成url参数
function queryParams(query) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }
  let r = q.join("&");
  r = r ? "?" + r : "";
  return r;
}

// 对象过滤器
/**
 *
 * @param {Object} mainObject -目标对象
 * @param {Object} filterFunction - 过滤条件
 * @returns {Object}
 */
Object.filter = function (mainObject, filterFunction, filterKey = false) {
  return Object.keys(mainObject)
    .filter(function (ObjectKey) {
      // 过滤条件
      return filterFunction(filterKey ? ObjectKey : mainObject[ObjectKey]);
    })
    .reduce(function (result, ObjectKey) {
      // 合并对象
      result[ObjectKey] = mainObject[ObjectKey];
      return result;
    }, {});
};

// 空值过滤器
function hasStrOk(val) {
  // null的情况
  if (val == null) return false;
  // undifind情况
  if (typeof val == "undefined") return false;
  // 输入空格
  if (val.replace(/(^s*)|(s*$)/g, "").length == 0) return false;
  // 字符串空
  if (val.length == 0) return false;
  // 没有上述情况
  return true;
}

// xss攻击封装
function xss(val, validNames = []) {
  const ctx = {
    $xss: (val) => {
      return myxss.process(val);
    },
  };
  // 最终返回的信息
  let info = {
    xssData: null,
    xssText: null,
    // 校验不通过的数组下标
    xssIndices: [],
    // 校验不通过的对象属性名
    xssIndicesObj: [],
  };
  let type = typeof val;
  switch (type) {
    case "function":
      // 函数直接报错
      info.xssData = "传参错误，校验参数不能为函数！";
      break;
    case "object":
      // 分两种 数组 与 对象
      if (Array.isArray(val)) {
        // 必须是参数数组
        let validArray = val.map((item) => {
          return ctx.$xss(item) || false;
        });
        // 提示数组
        let idx = validArray.indexOf(false);
        while (idx != -1) {
          info.xssIndices.push(idx);
          idx = validArray.indexOf(false);
        }
        info.xssIndices.length
          ? (info.xssText = `位于${info.xssIndices.join(",")}的数据违规！`)
          : (info.xssData = val);
      } else {
        let objData = null;
        if (val.valid && val.data) {
          // 过滤出需要校验的字段 val.valid必须是属性值数组
          let targetData = Object.filter(
            val.data,
            function (data) {
              return val.valid.includes(data);
            },
            true
          );
          // 校验不通过的字段
          Object.values(targetData).map((item, index) => {
            if (hasStrOk(item) && !ctx.$xss(item))
              info.xssIndicesObj.push(Object.keys(targetData)[index]);
          });
          objData = val.data;
        } else {
          for (const key in val) {
            if (!ctx.$xss(val[key])) info.xssIndicesObj.push(key);
          }
          objData = val;
        }
        // 如果传进来字段映射名
        let errorNames = [];
        if (validNames.length && info.xssIndicesObj.length) {
          info.xssIndicesObj.map((item) => {
            if (val.valid) {
              errorNames.push(
                validNames[val.valid.indexOf(item)] || `字段${item}未匹配到映射`
              );
            } else {
              errorNames.push(
                validNames[Object.keys(val).indexOf(item)] ||
                  `字段${item}未匹配到映射`
              );
            }
          });
        }
        let errorText = null;
        errorNames.length
          ? (errorText = `${errorNames.join(",")}违规！`)
          : (errorText = `属性${info.xssIndicesObj.join(",")}违规！`);
        info.xssIndicesObj.length
          ? (info.xssText = errorText)
          : (info.xssData = objData);
      }
      break;
    default:
      ctx.$xss(val)
        ? (info.xssData = ctx.$xss(val))
        : (info.xssText = "非法字符");
      break;
  }
  // 如果传过来的是单个数据
  return info;
}

// 函数重载
class MethodOverload {
  constructor() {
    this.functions = {};
  }

  // 添加函数重载
  overload() {
    const argTypes = [...arguments].slice(0, -1).join("").toLowerCase();
    this.functions[argTypes] = arguments[arguments.length - 1];
  }

  // 调用函数重载
  callMethod() {
    const actualArgs = [...arguments]; // 实际传入的参数列表
    const argTypes = [...arguments]
      .map((arg) => typeof arg)
      .join("")
      .toLowerCase(); // 根据实际参数类型生成标识符
    const method = this.functions[argTypes];
    if (typeof method === "function") {
      return method.apply(this, actualArgs);
    } else {
      throw new Error("No matching method found");
    }
  }
}

const myMethod = new MethodOverload();
// 添加函数重载
myMethod.overload("string", function (str) {
  console.log(`String: ${str}`);
});

myMethod.overload("number", function (num) {
  console.log(`Number: ${num}`);
});

myMethod.overload("number", "string", function (number, string) {
  console.log(`numberstring: ${number}${string}`);
});

// 导出excel（单导出，多sheet页）
const exportExcelWithMappings = (sheets, filename) => {
  const wb = XLSX.utils.book_new();

  sheets.forEach((sheet) => {
    const { data, name, mappings, columnWidths } = sheet;

    const headers = mappings.map((mapping) => mapping.label);
    const rows = data.map((item) =>
      mappings.map((mapping) => item[mapping.field])
    );

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // 设置列宽和行高
    mappings.forEach((mapping, columnIndex) => {
      const mappingWidth = mapping.width;
      const columnWidth = columnWidths && columnWidths[columnIndex];

      const width = mappingWidth || columnWidth;

      if (width) {
        const column = XLSX.utils.encode_col(columnIndex);
        worksheet["!cols"] = worksheet["!cols"] || [];
        worksheet["!cols"][columnIndex] = { wch: width };
      }

      if (mapping.height) {
        const row = 1; // 表头所在行索引
        const rowIndex = row - 1;
        worksheet["!rows"] = worksheet["!rows"] || [];
        worksheet["!rows"][rowIndex] = {
          hpt: mapping.height,
          hpx: mapping.height * 20,
        };
      }
    });

    XLSX.utils.book_append_sheet(wb, worksheet, name);
  });

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

  if (typeof window !== "undefined") {
    const isIE = window.navigator.msSaveOrOpenBlob;

    if (isIE) {
      // 兼容 IE 浏览器
      const blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      });
      window.navigator.msSaveOrOpenBlob(blob, `${filename}.xlsx`);
    } else {
      // 其他浏览器
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(
        new Blob([s2ab(wbout)], { type: "application/octet-stream" })
      );
      link.download = `${filename}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};

// 字符串转字节数组
const s2ab = (s) => {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
};

// excel导出范例数据
// const sheets = [
//   {
//     name: "Sheet 1",
//     data: [
//       { id: 1, username: "user1", mobile: "123456789", nickname: "nickname1" },
//       { id: 2, username: "user2", mobile: "987654321", nickname: "nickname2" },
//     ],
//     mappings: [
//       { field: "username", label: "用户名", width: 100 },
//       { field: "mobile", label: "手机号", width: 120 },
//       { field: "nickname", label: "昵称", width: 80 },
//     ],
//   },
// {
//     name: "Sheet 2",
//     data: [
//       { id: 1, username: "user1", mobile: "123456789", nickname: "nickname1" },
//       { id: 2, username: "user2", mobile: "987654321", nickname: "nickname2" },
//     ],
//     mappings: [
//       { field: "username", label: "用户名" },
//       { field: "mobile", label: "手机号", width: 120 },
//       { field: "nickname", label: "昵称", width: 80 },
//     ],
//         columnWidths: [20], // 设置列宽 mappings 未配置就使用这里的，配置了就优先使用mappings
//         rowHeights: [20, 20], // 设置行高 统一设置一一对应 大概用不上
//   },
// ];

// const filename = "excel_file";
// exportExcelWithMappings(sheets,excel_file)
export {
  useArrayMove,
  queryParams,
  notification,
  showModal,
  showPromptModal,
  showFullLoading,
  hideFullLoading,
  recursionTree,
  cartesianProductOf,
  toTime,
  fetchData,
  xss,
  exportExcelWithMappings,
  MethodOverload,
  myMethod,
};
