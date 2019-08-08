<template>
    <div class="my-content" :class="{'with-side':$slots.side}">
        <div v-if="title!=''" class="title"><h2>{{title}}</h2></div>
        <div class="my-content__side" v-if="$slots.side" v-bind:style="sideStyle">
            <slot name="side"></slot>
        </div>
        <div id="contentMain" class="my-content__main">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: "MyContent",
    props: {
        title:{
             type: String,
             require: false,
             default:'',
        }
    },
    data() {
        return {
            sideStyle: null
        }
    },
    mounted() {
        if (this.$slots.side) {
        }
    }
}
</script>
