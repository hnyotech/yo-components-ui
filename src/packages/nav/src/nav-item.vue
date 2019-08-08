<template>
    <li class="my-nav-item" @click="handleItemClick" :class='{"is-active": active,"is-disabled": disabled}'>
        <slot></slot>
    </li>
</template>
<script>
export default {
    name: 'MyNavItem',
    props: {
        href: {
            type: String,
            required: true
        },
        disabled: {
            type: Boolean,
            required: false
        }
    },
    data() {
        return {
            index: 0
        }
    },
    computed: {
        active() {
            return this.index === this.$parent.activeIndex;
        }
    },
    created() {
        this.index = this.$parent.$children.length - 1;

    },
    mounted() {
    },
    methods: {
        handleItemClick() {
            debugger;
            if (this.disabled) {
                return;
            }

            this.$parent.activeIndex = this.index;

            var anchor = document.getElementById(this.href.substring(1));
            var contentMains = document.getElementsByClassName("my-content__main");
            if (contentMains != null) {
                contentMains[0].scrollTop = anchor.offsetTop - 20;
            }
        }
    }
}
</script>
