import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'
import NProgress from "nprogress"
// 消息提示
const notification = (message, type = 'success', duration = 1500, dangerouslyUseHTMLString = false) => {
    ElNotification({
        message,
        type,
        duration,
        dangerouslyUseHTMLString
    })
}

// 弹出提示
const showModal = (content = '提示内容', type = 'warning', title = '') => {
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type,
        }
    )
}
// 显示全屏loading
const showFullLoading = () => {
    NProgress.start()
}

// 隐藏全屏loading
const hideFullLoading = () => {
    NProgress.done()
}
export {
    notification,
    showModal,
    showFullLoading,
    hideFullLoading
}