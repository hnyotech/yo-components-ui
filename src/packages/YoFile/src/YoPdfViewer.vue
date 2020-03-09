<template>
  <yo-dialog-viewer
    :on-close="hide"
    :z-index="zIndex"
    @onYoZooming="handleYoZooming"
    @onYoMoveing="handleYoMoveing"
    @onYoZoomEnd="handleYoZoomEnd"
    @onYoMoveEnd="handleYoMoveEnd"
     :custosm-canvas-class="{'yo-pad-viewer-custom-canvas': true}"
     :custosm-mask-class="{'yo-pad-viewer-custom-mask': true}"
  >
    <embed
      v-show="true"
      :src="realpdfSrc"
      :type="mimeType"
      class="el-image-viewer__img"
      :style="pdftyle"
      @load="handlePdfLoad"
    />
  </yo-dialog-viewer>
</template>
<script type="text/javascript">
import YoDialogViewer from "@/packages/YoDialogViewer/src/main.vue";
const Mode = {
  FullScreen: {
    name: "FullScreen"
  },
  Dialog: {
    name: "Dialog"
  }
};
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
  components: { YoDialogViewer },
  data: function() {
    return {
      isShow: false, //没什么作用 不显示也不糊加载
      realpdfSrc: "", //实际显示的PDF地址
      loading: true,
      mode: Mode.Dialog,
      ismoving: false,
      iszooming: false,
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
          // _src += "view=Fit&";
          if (this.mode === Mode.FullScreen) {
            _src += "view=Fit&";
          } else {
            _src += "view=FitH,top&";
          }
        }
        console.log("PDF Src:" + _src);
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
        transform: (this.ismoving||this.iszooming )? "" : `scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? "transform .3s" : "",
        "margin-left": `${offsetX}px`,
        "margin-top": `${offsetY}px`,
        width: `${width}`,
        height: `${height}`
      };
      return style;
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
      this.onClose();
    },
    fullscreen() {
      //全屏
      this.mode = Mode.FullScreen;
    },

    handlePdfLoad(e) {
      this.loading = false;
      // console.log("load");
      this.isShow = true; //加载完成显示
    },
    handleYoZooming(e) {
      this.iszooming = true;
    },
    handleYoMoveing(e) {
      this.ismoving = true;
    },
    handleYoZoomEnd(e) {
      this.iszooming = false;
    },
    handleYoMoveEnd(e) {   
      this.ismoving = false;
    }
  },
  created: function() {},
  mounted() {
    this.initSrc();
    // this.$refs["el-image-viewer__wrapper"].focus();
  }
};
</script>
<style>
.yo-pad-viewer-custom-canvas{
position: initial !important;
}
.yo-pad-viewer-custom-mask{
background: #000 !important;
opacity: 0.5 !important;
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