<template>
  <div class="login">
    <el-row class="login-row">
      <el-col :lg="16" :md="12" class="login-col-lf">
        <div class="group-right-sm absolute z-1"></div>
        <div class="group-right-lg absolute z-1"></div>
        <div>
          <!-- <div class="title">欢迎光临</div>
          <div class="text-gray-200 text-sm">欢迎光临牛XXX的商城</div> -->
          <img
            src="../assets/images/banner.png"
            alt=""
            srcset=""
            class="z-20 relative"
          />
        </div>
      </el-col>
      <el-col :lg="8" :md="12" class="login-col-rt">
        <h2 class="font-bold text-3xl text-gray-800">欢迎回来</h2>
        <div class="title">
          <span class="title-line"></span>
          <span>账号密码登录</span>
          <span class="title-line"></span>
        </div>
        <el-form :model="form" class="w-[250px]" ref="formRef" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名">
              <template #prefix>
                <el-icon>
                  <UserFilled />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              show-password
              type="password"
            >
              <template #prefix>
                <el-icon>
                  <Lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              color="#626aef"
              class="w-[250px]"
              round
              @click="onSubmit"
              :loading="loading"
              >登录
            </el-button>
          </el-form-item>
          <el-form-item>
            <ColdBtn class="w-[250px]" @coldClick="coldClick" />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
import { addRoutes } from "@/router";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import ColdBtn from "@/components/ColdBtn.vue";
import { notification, xss } from "@/utils/utils";
import { useCookies } from "@vueuse/integrations/useCookies";
const cookies = useCookies(["locale"]);
const store = useStore();
const router = useRouter();
const formRef = ref(null);
const loading = ref(false);
const form = reactive({
  username: "",
  password: "",
});
const rules = {
  username: [
    {
      required: true,
      message: " 用户名不能为空",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: " 密码不能为空",
      trigger: "blur",
    },
  ],
};
const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) {
      return false;
    } else {
      loading.value = true;
      const { xssData, xssText, xssIndicesObj } = xss(toRaw(form), [
        "用户名",
        "密码",
      ]);
      if (xssText) {
        notification(xssText, "error");
        xssIndicesObj.map((item) => (form[item] = null));
        loading.value = false;
      } else {
        store
          .dispatch("login", xssData)
          .then(async (res) => {
            addRoutes(res.userInfo.menus);
            setTimeout(() => {
              router.push("/");
            }, 500);
            notification("登录成功");
          })
          .finally(() => {
            loading.value = false;
          });
      }
    }
  });
};

const coldClick = () => {
  cookies.set(
    "access-token",
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEVOVUpHTkVNMVFURTRNMEZCTWpkQ05UZzVNRFUxUlRVd1FVSkRNRU13UmtGRVFrRXpSZyJ9.eyJodHRwczovL2FwaS5vcGVuYWkuY29tL3Byb2ZpbGUiOnsiZW1haWwiOiJ6dzE4NTY5MjU0Njc1QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlfSwiaHR0cHM6Ly9hcGkub3BlbmFpLmNvbS9hdXRoIjp7InVzZXJfaWQiOiJ1c2VyLXVDWE1PdTMyQW9GaU5HMTZ1bWplZjN6TyJ9LCJpc3MiOiJodHRwczovL2F1dGgwLm9wZW5haS5jb20vIiwic3ViIjoiYXV0aDB8NjQyMTA4MmE4NTI4YWRlODM4OTkwMzdiIiwiYXVkIjpbImh0dHBzOi8vYXBpLm9wZW5haS5jb20vdjEiLCJodHRwczovL29wZW5haS5vcGVuYWkuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTY4NTY4NTY4NywiZXhwIjoxNjg2ODk1Mjg3LCJhenAiOiJwZGxMSVgyWTcyTUlsMnJoTGhURTlWVjliTjkwNWtCaCIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgbW9kZWwucmVhZCBtb2RlbC5yZXF1ZXN0IG9yZ2FuaXphdGlvbi5yZWFkIG9mZmxpbmVfYWNjZXNzIn0.EbeIJXw43E1eTmIFRAviYLIwjDQreD2hKboFB3J-CFfcxPOafagdIpHzDAMt_o4eFDPyPYKt2T_YUt3y6DyOBReXHeOGJesmr70kH4NrmFHEwr8jXWy6j6dFwkLnEFl0eiUzQUIRB7DiU0R8xb7AVeY7_7e1q-sPZkWkQShJBwm8kU232evah6xyE37wKNwFqeS6x7fgFJBGANNU98Dj84jAchOXgzkwi1DCCDHd9jgO0EVnS30G0ANPCIVxN4MkOjPFRHRtNWRpLjeE7Mx03rlIiCTqr-iq61Ki342BBNyXqlsrFvUXbEV9Vh6tGg8CP3Dc7VlVyCE8HwTWASj9aw"
  );
  window.open("http://zwnb.cc:8080", "_blank");
};

// 监听回车事件
function onKeyUp(e) {
  if (e.key == "Enter") onSubmit();
}

// 添加键盘监听事件
onMounted(() => {
  document.addEventListener("keyup", onKeyUp, false);
});
// 移除
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp, false);
});
</script>

<style scoped lang="scss">
.iframe-container {
  width: 100%;
  height: 100%;
}
.login {
  &-row {
    @apply min-h-screen;
  }

  &-col-lf,
  &-col-rt {
    @apply flex items-center justify-center;
  }

  &-col-lf {
    position: relative;
    box-shadow: -2px 0px 21px 0px rgba(190, 190, 190, 0.56);
    background-image: linear-gradient(
      90deg,
      rgba(57, 0, 133, 1) 0,
      rgba(57, 0, 133, 1) 0,
      rgba(136, 91, 255, 1) 100%,
      rgba(136, 91, 255, 1) 100%
    );
    // .title {
    //   @apply font-bold text-5xl text-light-50 mb-4;
    // }
    .group-right-sm {
      background-image: linear-gradient(
        90deg,
        rgba(57, 0, 133, 1) 0,
        rgba(57, 0, 133, 1) 0,
        rgba(136, 91, 255, 1) 100%,
        rgba(136, 91, 255, 1) 100%
      );
      border-radius: 50%;
      width: 42%;
      height: 70%;
      top: 0;
      right: 0;
    }
    .group-right-lg {
      background-image: linear-gradient(
        90deg,
        rgba(57, 0, 133, 1) 0,
        rgba(57, 0, 133, 1) 0,
        rgba(136, 91, 255, 1) 100%,
        rgba(136, 91, 255, 1) 100%
      );
      border-radius: 50%;
      height: 84%;
      width: 93%;
      bottom: 0;
      right: 0;
    }
  }

  &-col-rt {
    @apply flex-col;
    box-shadow: -2px 0px 21px 0px rgba(190, 190, 190, 0.56);
    background-color: rgba(255, 255, 255, 1);

    .title {
      @apply flex items-center justify-center my-5 text-gray-300 space-x-2;

      &-line {
        @apply h-[1px] w-16 bg-gray-200;
      }
    }
  }
}
</style>
