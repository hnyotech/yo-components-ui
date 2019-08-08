<template>
    <div id="examples">
        <yo-button :type="type">我的按钮组件</yo-button>
        <yo-menu :width="250"></yo-menu>
    </div>
</template>
<script>
import YoButton from '@/packages/YoButton/src/main.vue'
import YoMenu from '@/packages/YoMenu/src/main.vue'
export default {
    name: 'examples',
    components: {
        YoButton,
        YoMenu
    },
    data () {
        return {
            type: 'info'
        }
    }
}
</script>
<style scoped>

</style>
