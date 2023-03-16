import { ElNotification, ElMessage, ElMessageBox } from "element-plus";
import NProgress from "nprogress";
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

// xss攻击封装
function xss(ctx, val) {
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
          ? (info.xssText = `位于${info.xssIndices.join(",")}的参数违规！`)
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
          info.xssIndicesObj = Object.values(targetData).map((item, index) => {
            if (!ctx.$xss(item)) return Object.keys(targetData)[index];
          });
          objData = val.data;
        } else {
          for (const key in val) {
            if (!ctx.$xss(val[key])) info.xssIndicesObj.push(key);
          }
          objData = val;
        }
        info.xssIndicesObj.length
          ? (info.xssText = `属性${info.xssIndicesObj.join(",")}违规！`)
          : (info.xssData = objData);
      }
      break;
    default:
      ctx.$xss(val) ? (info.xssData = ctx.$xss(val)) : (info.xssText = "非法字符");
      break;
  }
  // 如果传过来的是单个数据
  return info;
}
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
};
