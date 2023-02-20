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
export {
  notification,
  showModal,
  showPromptModal,
  showFullLoading,
  hideFullLoading,
  recursionTree,
  toTime,
};
