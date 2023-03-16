<template>
    {{ parseInt(d.num).toFixed(0) }}
</template>

<script setup>
import { reactive,watch } from 'vue'
import gsap from 'gsap'
const props = defineProps({
    value: {
        type: Number,
        default: 0
    }
})
const d = reactive({
    num: 0
})

const AnimateToValue = () => {
    gsap.to(d, {
        duration: 0.5,
        num: props.value
    })
}
AnimateToValue()

// 防止值变化之后才进行滚动动画
watch(() => props.value, () => {
    AnimateToValue()
})
</script>

<style scoped lang="scss"></style>
