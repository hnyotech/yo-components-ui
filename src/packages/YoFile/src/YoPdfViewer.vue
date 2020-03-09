<template>
  <transition name="viewer-fade">
    <div
      tabindex="-1"
      class="yo-pdf-viewer-body"
      ref="el-image-viewer__wrapper"
      :style="viewerDivStyle"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.2)"
      @mousedown="handleMouseDown"
    >
      <div class="yo-pdf-viewer-title" title="按住拖动">
        <div style="padding-right: 5px;">
          <i class="el-icon-full-screen" title="全屏" @click="fullscreen"></i>
          <i class="el-icon-close" @click="hide" title="关闭"></i>
        </div>
      </div>
      <div class="el-image-viewer__mask"></div>
      <span class="el-image-viewer__btn el-image-viewer__close" @click="hide" v-if="isFullScreen">
        <i class="el-icon-circle-close"></i>
      </span>
      <div class="el-image-viewer__canvas">
        <embed
          v-show="true"
          :src="realpdfSrc"
          :type="mimeType"
          class="el-image-viewer__img"
          :style="pdftyle"
          @load="handlePdfLoad"
        />
      </div>
    </div>
  </transition>
</template>
<script type="text/javascript">
import { on, off } from "element-ui/src/utils/dom";
import { rafThrottle, isFirefox } from "element-ui/src/utils/util";
const Mode = {
  FullScreen: {
    name: "FullScreen"
  },
  Dialog: {
    name: "Dialog"
  }
};
const mousewheelEventName = isFirefox() ? "DOMMouseScroll" : "mousewheel";
export default {
  name: "YoPdfViewer",
  props: {
    src: {
      //pdf地址
      type: String,
      required: true
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    //多媒体预览模式 application/pdf
    mimeType: {
      type: String,
      default: "application/pdf"
    },
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
      type: String
      // default: "Fit"
    }
  },
  components: {},
  data: function() {
    return {
      isShow: false, //没什么作用 不显示也不糊加载
      realpdfSrc: "", //实际显示的PDF地址
      loading: true,
      mode: Mode.Dialog,
      transform: {
        width: "100%",
        height: "100%",
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      },
      DialogStyle: {
        width: 800,
        height: 600,
        top: 0,
        left: 0
      },
      ismoving: false
    };
  },
  // watch:{
  //   src:function (val) {
  //     console.log("src="+val)
  //   }
  // },
  computed: {
    //pdf实际地址带显示控制，详见https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf
    pdfSrc: function() {
      let that = this;
      let _src = that.src;
      if (that.mimeType === "application/pdf") {
        //pdf模式增加控制参数
        if (!_src.endsWith("#")) {
          _src += "#";
        }
        if (that.page > 0) {
          _src += "page=" + that.page + "&";
        }
        if (that.view) {
          _src += "view=" + that.view + "&";
        } else {
          if (this.mode === Mode.FullScreen) {
            _src += "view=Fit&";
          } else {
            _src += "view=FitH,top&";
          }
        }
        // console.log("PDF Src:" + _src);
      }

      return _src;
    },
    pdftyle() {
      const {
        scale,
        deg,
        offsetX,
        offsetY,
        enableTransition,
        width,
        height
      } = this.transform;
      const style = {
        transform: this.ismoving ? "" : `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? "transform .3s" : "",
        "margin-left": `${offsetX}px`,
        "margin-top": `${offsetY}px`,
        width: `${width}`,
        height: `${height}`,       
      };
      // if (this.mode === Mode.CONTAIN) {
      //   style.maxWidth = style.maxHeight = "100%";
      // }
      return style;
    },
    viewerDivStyle() {
      const style = {
        "z-index": this.zIndex
      };
      if (this.mode === Mode.FullScreen) {
        style.position = "fixed";
        style.top = "0";
        style.right = "0";
        style.bottom = "0";
        style.left = "0";
      } else if (this.mode === Mode.Dialog) {
        style.position = "fixed";
        style.margin = "0 auto";
        style.width = `${this.DialogStyle.width}px`;
        style.height = `${this.DialogStyle.height}px`;      
        style.top = `${this.DialogStyle.top}px`;
        style.left = `${this.DialogStyle.left}px`;
          style.cursor='move';
      }
      return style;
    },
    dialogDefaultLeft: function() {
      return (document.documentElement.clientWidth - this.DialogStyle.width) / 2;
    },
    dialogDefaultTop: function() {
      // console.log("document.body.clientHeight:"+document.body.clientHeight);
      // console.log("document.body.scrollHeight:"+document.body.scrollHeight);
      // console.log("document.documentElement.clientHeight:"+document.documentElement.clientHeight);
      return (document.documentElement.clientHeight - this.DialogStyle.height) / 2;
    },
    isFullScreen: function() {
      return this.mode === Mode.FullScreen;
    }
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
      if (this.isFullScreen) {
        this.mode = Mode.Dialog;
      } else {
        this.deviceSupportUninstall();
        this.onClose();
      }
    },
    fullscreen() {
      //全屏
      this.mode = Mode.FullScreen;
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
    handlePdfLoad(e) {
      this.loading = false;
      // console.log("load");
      this.isShow = true; //加载完成显示
    },
    handleMouseDown(e) {
      let that = this;
      that.ismoving = true;
      // if (that.loading || e.button !== 0) return;
      console.log("鼠标按下");
      console.log(e);
      if (that.mode === Mode.Dialog) {
        //窗口模式
        const { top, left } = that.DialogStyle;
        const startX = e.pageX;
        const startY = e.pageY;
        that._dragHandler = rafThrottle(ev => {
          let newTop = top + ev.pageY - startY;
          let newLeft = left + ev.pageX - startX;
          // console.log(" newTop:"+ newTop+", newLeft:"+newLeft)
          if (newTop < 28) {
            return false;
          }
          that.DialogStyle.top = newTop;
          that.DialogStyle.left = newLeft;
        });
        on(document, "mousemove", that._dragHandler);
        on(document, "mouseup", ev => {
          that.ismoving = false;
          off(document, "mousemove", that._dragHandler);
        });
      } else if (that.mode === Mode.FullScreen) {
        //全屏模式 -暂时也不支持移动
        return;
      } else {
        //不支持的模式
        return;
      }

      e.preventDefault();
    },
    handleMouseUp(e) {
      console.log("松开");
      off(document, "mousemove", this._dragHandler);
    }
  },
  created: function() {
      //默认宽高计算 （屏幕宽-窗口宽）/2
    this.DialogStyle.top = this.dialogDefaultTop;
    this.DialogStyle.left = this.dialogDefaultLeft;
  },
  mounted() {
    this.initSrc();

    this.$refs["el-image-viewer__wrapper"].focus();
  }
};
</script>
<style scoped>
.el-image-viewer__close {
  top: 15px;
  color: #fff;
}
.yo-pdf-viewer-title {
  height: 28px;
  line-height: 28px;
  color: #fff;
  background-color: #323639;
  top: -28px;
  position: absolute;
  width: 100%;
  text-align: right;
  /* cursor:move; */
}
.yo-pdf-viewer-title i {
  margin-left: 10px;
  cursor: pointer;
}
/* 滚动条的不显示和美化，不好实现，别折腾了--来自前辈的关爱 */
/* .el-image-viewer__img::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}
.el-image-viewer__img::-webkit-scrollbar {
  width: 12px;
  background-color: #f5f5f5;
}
.el-image-viewer__img::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #555;
}
.el-image-viewer__img::-webkit-scrollbar {display:none} */
</style>