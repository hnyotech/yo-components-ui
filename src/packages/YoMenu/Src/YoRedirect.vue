<template>
    <div>
        <span>
            {{text}}
        </span>
    </div>
</template>
<script>
export default {
data: function () {
    return {
        text:"正在跳转...",
    };
},
created: function () {
    let that = this;
        this.$nextTick(function () {
        that.goRedirectUri()
    });
},
methods: {
    goRedirectUri: function () {
        // debugger
        var url = this.$route.params.redirect_url;
        //    debugger;
        if (url && url.length > 0) {
            window.location.href = url
        }else {
            astec.showErrorToast("跳转路径为空...")
            window.location = "/"
        }
    },
},

}
</script>