<template>
  <transition name="viewer-fade">
    <div
      tabindex="-1"
      class="yo-pdf-viewer-body"
      ref="el-image-viewer__wrapper"
      :style="viewerDivStyle"
      @mousedown="handleMouseDown"
      @mouseover="handleMouseOver"
      @mouseleave="handleMouseLeave"
    >
      <div class="yo-pdf-viewer-title" title="按住拖动" v-if="!isFullScreen">
        <span style="padding-left: 5px;text-align: left;">{{title}}</span>
        <div style="padding-right: 5px;text-align: right;float: right;">
          <i class="el-icon-full-screen" title="全屏" @click="fullscreen"></i>
          <i class="el-icon-close" @click="hide" title="关闭"></i>
        </div>
      </div>
      <div class="yo-pdf-viewer-mask" :class="CustosmMaskClassObject"></div>
      <span class="el-image-viewer__btn el-image-viewer__close" @click="hide" v-if="isFullScreen">
        <i class="el-icon-circle-close" v-if="fullScreenClose"></i>
        <i class="el-icon-c-scale-to-original" v-if="!fullScreenClose"></i>
      </span>
      <div class="yo-pdf-viewer-canvas" :class="CustosmCanvasClass">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script type="text/javascript">
import { on, off } from "element-ui/src/utils/dom";
import { rafThrottle, isFirefox } from "element-ui/src/utils/util";
const mousewheelEventName = isFirefox() ? "DOMMouseScroll" : "mousewheel";
const Mode = {
  FullScreen: {
    name: "FullScreen"
  },
  Dialog: {
    name: "Dialog"
  }
};
export default {
  //弹出框 by Z.C
  //主要实现可以全屏或者窗口
  //额外实现：最小化（贴边），拖拽改变大小
  name: "YoDialogViewer",
  props: {
    title: {
      type: String
    },
    //默认全屏
    fullScreen: {
      type: Boolean,
      default: false
    },
    //窗口宽度
    width: {
      type: Number,
      default: 800
    },
    //窗口高度
    height: {
      type: Number,
      default: 600
    },
    //弹出div的z-index
    zIndex: {
      type: Number,
      default: 2000
    },
    //全屏模式立即关闭，false 是缩小到窗口模式
    fullScreenClose: {
      type: Boolean,
      default: false
    },
    //提供的关闭事件
    onClose: {
      type: Function,
      default: () => {}
    },
    CustosmCanvasClass: {},
    CustosmMaskClass: {}
  },
  components: {},

  data: function() {
    return {
      mode: null,
      ismoving: false,
      iszooming: false,
      ismouseover: false,
      zoomType: 0, //1上 2右 3下 4左
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
      }
    };
  },
  computed: {
    //实际的mode
    realmode: function() {
      if (this.mode) {
        return this.mode;
      } else if (this.fullScreen) {
        return Mode.FullScreen;
      } else {
        return Mode.Dialog;
      }
    },
    CustosmMaskClassObject() {
      if (this.CustosmMaskClass) {
        return this.CustosmMaskClass;
      } else {
        // :class="isFullScreen?'fullscreen':'dialog'"
        return {
          fullscreen: this.isFullScreen,
          dialog: !this.isFullScreen
        };
      }
    },
    viewerDivStyle() {
      const style = {
        "z-index": this.zIndex
      };
      if (this.realmode === Mode.FullScreen) {
        style.position = "fixed";
        style.top = "0";
        style.right = "0";
        style.bottom = "0";
        style.left = "0";
      } else if (this.realmode === Mode.Dialog) {
        style.position = "fixed";
        style.margin = "0 auto";
        style.width = `${this.DialogStyle.width}px`;
        style.height = `${this.DialogStyle.height}px`;
        style.top = `${this.DialogStyle.top}px`;
        style.left = `${this.DialogStyle.left}px`;
        style.cursor = "move";
        switch (this.zoomType) {
          case 1: //上
            style.cursor = "n-resize";
            break;
          case 2:
            style.cursor = "e-resize";
            break;
          case 3:
            style.cursor = "s-resize";
            break;
          case 4:
            style.cursor = "w-resize";
            break;
        }
      }
      return style;
    },
    solttyle() {
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
        transform:
          this.ismoving || this.iszooming
            ? ""
            : `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? "transform .3s" : "",
        "margin-left": `${offsetX}px`,
        "margin-top": `${offsetY}px`,
        width: `${width}`,
        height: `${height}`
      };
      return style;
    },
    dialogDefaultLeft: function() {
      return (
        (document.documentElement.clientWidth - this.DialogStyle.width) / 2
      );
    },
    dialogDefaultTop: function() {
      return (
        (document.documentElement.clientHeight - this.DialogStyle.height) / 2
      );
    },
    isFullScreen: function() {
      return this.realmode === Mode.FullScreen;
    }
  },
  methods: {
    handleMouseDown(e) {
      let that = this;
      // if (that.loading || e.button !== 0) return;
      console.log("鼠标按下");
      // console.log(e);
      //首先移除一下之前的吧 免得有没移除掉的
      off(document, "mousemove", that._dragHandler);
      if (that.realmode === Mode.Dialog) {
        //窗口模式
        const { top, left, width, height } = that.DialogStyle;
        //判断是边框缩放还是拖动
        const startX = e.pageX;
        const startY = e.pageY;
        that._dragHandler = rafThrottle(ev => {
          if (that.zoomType > 0) {
            that.iszooming = true;
            // console.log("zooming...");
            let newHeight = height;
            let newWidth = width;
            if (that.zoomType == 1) {
              //上 位置也需要移动
              newHeight = height + startY - ev.pageY;
              that.DialogStyle.top = top + ev.pageY - startY;
            }
            if (that.zoomType == 2) {
              newWidth = width + ev.pageX - startX;
            }
            if (that.zoomType == 3) {
              newHeight = height + ev.pageY - startY;
            }
            if (that.zoomType == 4) {
              //左 位置也需要移动
              newWidth = width + (startX - ev.pageX);
              that.DialogStyle.left = left + ev.pageX - startX;
            }

            that.DialogStyle.width = newWidth;
            that.DialogStyle.height = newHeight;
            this.$emit("onYoZooming", ev);
          } else {
            that.ismoving = true;
            console.log("moving...");
            let newTop = top + ev.pageY - startY;
            let newLeft = left + ev.pageX - startX;
            // console.log(" newTop:"+ newTop+", newLeft:"+newLeft)
            if (newTop < 28) {
              return false;
            }
            that.DialogStyle.top = newTop;
            that.DialogStyle.left = newLeft;
            this.$emit("onYoMoveing", ev); //触发一下事件
          }
        });
        on(document, "mousemove", that._dragHandler);
        on(document, "mouseup", ev => {
          if (that.ismoving) {
            this.$emit("onYoMoveEnd", ev);
          }
          if (that.iszooming) {
            this.$emit("onYoZoomEnd", ev);
          }
          that.ismoving = false;
          that.iszooming = false;
          off(document, "mousemove", that._dragHandler);
        });
      } else if (that.realmode === Mode.FullScreen) {
        //全屏模式 -暂时也不支持移动
        return;
      } else {
        //不支持的模式
        return;
      }

      e.preventDefault();
    },
    hide() {
      if (this.isFullScreen && !this.fullScreenClose) {
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
      let that = this;
      that._keyDownHandler = rafThrottle(e => {
        const keyCode = e.keyCode;
        switch (keyCode) {
          // ESC
          case 27:
            that.hide();
            break;
        }
      });
      on(document, "keydown", that._keyDownHandler);
    },
    //卸载键盘事件
    deviceSupportUninstall() {
      off(document, "keydown", this._keyDownHandler);
      this._keyDownHandler = null;
    },
    handleMouseOver(e) {
      let that = this;
      if (that.ismouseover) {
        return false;
      }
      that.ismouseover = true;
      that._dropHandler = rafThrottle(ev => {
        that.canZoom(ev.clientX, ev.clientY);
      });
      on(document, "mousemove", that._dropHandler);
    },
    handleMouseLeave(e) {
      let that = this;
      that.ismouseover = false;
      off(document, "mousemove", that._dropHandler);
    },
    //判断能不能缩放
    //0 不能 1上2右3下4左--不支持上 上面太乱
    canZoom(clientX, clientY) {
      let _boundary = 3; //边界3px
      let that = this;
      if (that.ismoving || that.iszooming) {
        return;
      }
      const { top, left, width, height } = that.DialogStyle;
      //判断是边框缩放还是拖动
      if (clientY - (top - 28) <= _boundary) {
        // console.log("上边框缩放:" + (clientY - (top - 28)));
        that.zoomType = 1;
      } else if (left + width - clientX <= _boundary) {
        // console.log("右边框缩放");
        that.zoomType = 2;
      } else if (clientX - left <= _boundary) {
        // console.log("左边框缩放");
        that.zoomType = 4;
      } else if (top + height - clientY <= _boundary) {
        // console.log("下边框缩放");
        that.zoomType = 3;
      } else {
        that.zoomType = 0;
      }
    }
  },
  created: function() {
    //默认宽高计算 （屏幕宽-窗口宽）/2
    this.DialogStyle.top = this.dialogDefaultTop;
    this.DialogStyle.left = this.dialogDefaultLeft;
  },
  mounted() {
    this.deviceSupportInstall(); //载入按键事件
  }
};
</script>
<style scoped>
.el-image-viewer__close {
  top: 60px;
  color: #000;
}
.yo-pdf-viewer-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #fff;
}
.yo-pdf-viewer-mask.fullscreen {
  background: #fff;
}
.yo-pdf-viewer-mask.dialog {
  border: solid 1px var(--main-bg-color);
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.yo-pdf-viewer-title {
  height: 28px;
  line-height: 28px;
  color: #fff;
  background-color: var(--main-bg-color);
  border-color: var(--main-bg-color);
  top: -28px;
  position: absolute;
  width: 100%;
}
.yo-pdf-viewer-title i {
  margin-left: 10px;
  cursor: pointer;
}
.yo-pdf-viewer-canvas {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  text-align: left;
  /* padding: 10px 10px; */
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