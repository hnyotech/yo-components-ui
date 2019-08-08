<template>
    <ul class="my-nav">
        <slot></slot>
    </ul>
</template>
<script>
export default {
    name: 'MyNav',

    data() {
        return {
            activeIndex: 0
        };
    },
    mounted() {
        var contentMain = document.getElementById("contentMain");

        var subs = [];

        var count = this.$children.length;
        for (var i = 0; i < count; i++) {
            var anchor = document.getElementById(this.$children[i].href.substring(1));
            if (anchor != null) {
                subs.push({
                    min: anchor.offsetTop - 20,
                    max: 9999
                });

                if (i != 0) {
                    subs[i - 1].max = anchor.offsetTop - 20;
                }
            }
        }

        var that = this;
        contentMain.onscroll = function() {
            var scrollTop = this.scrollTop;
            for (var i = 0; i < subs.length; i++) {
                if (scrollTop >= subs[i].min && scrollTop < subs[i].max) {
                    that.activeIndex = i;
                    break;
                }
            }
        };
    },
    methods: {
    }
}
</script>