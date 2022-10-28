import { ref, reactive, toRaw } from 'vue'
import managerApi from '@/api/manager'
import { showModal, notification } from '@/utils/utils'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
//修改密码
const useRepassword = () => {
    const store = useStore()
    const router = useRouter()
    const formDrawerRef = ref(null)
    const formRef = ref(null)
    const formData = reactive({
        oldpassword: '',
        password: '',
        repassword: ''
    })
    const rules = {
        oldpassword: [
            {
                required: true,
                message: ' 旧密码不能为空',
                trigger: 'blur'
            }
        ],
        password: [
            {
                required: true,
                message: ' 新密码不能为空',
                trigger: 'blur'
            }
        ],
        repassword: [
            {
                required: true,
                message: ' 确认密码密码不能为空',
                trigger: 'blur'
            }
        ]
    }
    const onSubmit = () => {
        formRef.value.validate(async (valid) => {
            if (!valid) {
                return false;
            }
            formDrawerRef.value.showLoading()
            managerApi.updatePassword(toRaw(formData)).then(res => {
                notification('修改密码成功,请重新登录')
                store.dispatch('logout').finally(() => {
                    router.push('/login')
                })
            }).finally(() => {
                formDrawerRef.value.hideLoading()
            })
        })
    }
    const openRePasswordForm = () => formDrawerRef.value.open()
    return {
        formDrawerRef, formData, rules, formRef, onSubmit, openRePasswordForm
    }
}
// 退出登录
const useLogout = () => {
    const store = useStore()
    const router = useRouter()
    // 退出
    const logout = () => {
        showModal('是否要退出登录？').then(async (res) => {
            store.dispatch('logout').finally(() => {
                router.push('/login')
                notification('退出登陆成功')
            })
        })
    }

    return logout
}
export { useRepassword, useLogout }