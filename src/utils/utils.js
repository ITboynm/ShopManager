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
      param.fetchContent ? res = await api(fetchId, param.fetchContent) : res = await api(fetchId, param);
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

export {
  useArrayMove,
  notification,
  showModal,
  showPromptModal,
  showFullLoading,
  hideFullLoading,
  recursionTree,
  cartesianProductOf,
  toTime,
  fetchData,
};
