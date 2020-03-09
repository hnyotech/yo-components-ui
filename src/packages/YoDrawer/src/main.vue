<template>
  <el-drawer
    :title="title"
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
  >
    <slot name="title"></slot>
  </el-drawer>
</template>
<script type="text/javascript">
export default {
  //抽屉 by Z.C
  //基于ElementUI的Drawer
  //主要实现可以控制打开的方向，大小
  //额外实现：最小化（贴边），拖拽改变大小
  name: "YoDrawer",
  props: {
    title: {
      type: String
    },
    direction: {
      type: String
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    //多媒体预览模式 application/pdf

    //提供的关闭事件
    onClose: {
      type: Function,
      default: () => {}
    },
    //pdf打开页码，默认空也是第一页,正整数
    page: {
      type: Number,
      default: null
    },
    //显示模式，不建议改，现在默认是适用屏幕，全屏可以改成"FitH,top",或者空
    view: {
      type: String,
      default: "Fit"
    }
  },
  components: {},
  data: function() {
    return {
      drawer: false
    };
  },
  computed: {
    
  },
  methods: {
    //显示错误提示
    showerr(msg) {
      var that = this;
      that.loading = false;
      that.$alert(msg, {
        showClose: false,
        callback: function(action, instance) {
          that.hide();
        }
      });
    },
    initSrc() {
      //測試地址 沒問題才顯示
      var that = this;
      that.loading = true;
      var instance = that.$http.create();
      instance
        .options(that.src)
        .then(resp => {
          if (resp.status == 200) {
            that.realpdfSrc = that.pdfSrc;
            this.deviceSupportInstall(); //载入按键事件
          } else if (resp.status == 204) {
            //接口主動返回的204 表示內容還沒有 友好提示
            that.showerr("文件正在转码，请稍后再试...");
          } else {
            that.showerr("预览失败!");
          }
        })
        .catch(err => {
          console.log(err);
          if (err && err.response && err.response.status == 404) {
            that.showerr("不支持预览!");
          } else {
            that.showerr("加载失败!");
          }
        });
    },
    hide() {
      this.deviceSupportUninstall();
      this.onClose();
    },
    //注册键盘事件 esc退出
    deviceSupportInstall() {
      this._keyDownHandler = rafThrottle(e => {
        const keyCode = e.keyCode;
        switch (keyCode) {
          // ESC
          case 27:
            this.hide();
            break;
        }
      });
      on(document, "keydown", this._keyDownHandler);
    },
    //卸载键盘事件
    deviceSupportUninstall() {
      off(document, "keydown", this._keyDownHandler);
      this._keyDownHandler = null;
    },
    handlePdfLoad(e, x) {
      this.loading = false;
      console.log("load");
      this.isShow = true; //加载完成显示
    }
  },
  created: function() {},
  mounted() {
    this.initSrc();

    this.$refs["el-image-viewer__wrapper"].focus();
  }
};
</script>
<style scoped>
.el-image-viewer__close {
  top: 50px;
  color: #fff;
}
</style>