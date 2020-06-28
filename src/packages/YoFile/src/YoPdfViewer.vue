<template>
  <div>
    <div class="el-image-viewer__mask"></div>
    <!-- CLOSE -->
    <span class="el-image-viewer__btn el-image-viewer__close" @click="hide">
        <i class="el-icon-circle-close"></i>
      </span>

    <yo-dialog-viewer
      :on-close="hide"
      :z-index="zIndex"
      :title="title"
      :full-screen="fullScreen"
      :full-screen-close="fullScreenClose"
      :width="width"
      :height="height"
      @onYoZooming="handleYoZooming"
      @onYoMoveing="handleYoMoveing"
      @onYoZoomEnd="handleYoZoomEnd"
      @onYoMoveEnd="handleYoMoveEnd"
      @onYoModelChange="handleYoModelChange"
      :custosm-canvas-class="{'yo-pad-viewer-custom-canvas': true}"
      :custosm-mask-class="{'yo-pad-viewer-custom-mask': true}"
    >
      <!-- <template v-if="!isSingle">
        <span
          class="el-image-viewer__btn el-image-viewer__prev"
          :class="{ 'pdf-is-disabled': isFirst }"
          @click="prev"
        >
          <i class="el-icon-arrow-left" />
        </span>
        <span
          class="el-image-viewer__btn el-image-viewer__next"
          :class="{ 'pdf-is-disabled': isLast }"
          @click="next"
        >
          <i class="el-icon-arrow-right" />
        </span>
      </template> -->
      <div v-if="isImg" class="el-image-viewer__btn el-image-viewer__actions">
        <div class="el-image-viewer__actions__inner">
          <i class="el-icon-zoom-out" @click="handleActions('zoomOut')"></i>
          <i class="el-icon-zoom-in" @click="handleActions('zoomIn')"></i>
          <i class="el-icon-download" @click="handleDownLoad()"></i>
          <i class="el-icon-refresh-left" @click="handleActions('anticlocelise')"></i>
          <i class="el-icon-refresh-right" @click="handleActions('clocelise')"></i>
        </div>
      </div>
      <img
        v-if="isImg"
        :src="src"
        class="el-image-viewer__img"
        :style="imgstyle"
        @load="handleImgLoad"
        @error="handleImgError"
        @mousedown="handleImgMouseDown"
      />
      <a href ref="download_a" target="_blank" v-show="false"></a>
      <div v-show="edgeShow" id="temppdf" style="width: 100%;height: 100%;">
        <embed
          v-if="isPdf"
          :src="realpdfSrc"
          :type="mimeType"
          class="el-image-viewer__img"
          :style="pdfStyle"
          @load="handlePdfLoad"
        />
      </div>
      <!--      <iframe v-show="edgeShow" :style="pdfStyle" :src="realpdfSrc"></iframe>-->
    </yo-dialog-viewer>
  </div>
</template>
<script type="text/javascript">
  import YoDialogViewer from "@/packages/YoDialogViewer/src/main.vue";
  import {on, off} from "element-ui/src/utils/dom";
  import {rafThrottle, isFirefox} from "element-ui/src/utils/util";

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
    name: "YoPdfViewer",
    props: {
      urlList: {
        type: Array,
        default: () => []
      },

      src: {
        //pdf地址
        type: String,
        required: true
      },
      title: {
        type: String
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
      //默认全屏
      fullScreen: {
        type: Boolean,
        default: false
      },
      //全屏模式立即关闭，false 是缩小到窗口模式
      fullScreenClose: {
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
      //提供的关闭事件
      onClose: {
        type: Function,
        default: () => {
        }
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
    components: {YoDialogViewer},
    data: function () {
      return {
        isIE: window.ActiveXObject || "ActiveXObject" in window,
        edgeShow: false,
        isShow: false, //没什么作用 不显示也不糊加载
        realpdfSrc: "", //实际显示的PDF地址
        loading: true,
        mode: this.fullScreen ? Mode.fullScreen : Mode.Dialog,
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
    computed: {
      //pdf实际地址带显示控制，详见https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf
      pdfSrc: function () {
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
          // console.log("PDF Src:" + _src);
        }

        return _src;
      },
      pdfStyle() {
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
      imgstyle() {
        const {scale, deg, offsetX, offsetY, enableTransition} = this.transform;
        const style = {
          transform:
            this.ismoving || this.iszooming
              ? ""
              : `scale(${scale}) rotate(${deg}deg)`,
          transition: enableTransition ? "transform .3s" : "",
          "margin-left": `${offsetX}px`,
          "margin-top": `${offsetY}px`
        };
        style.maxWidth = style.maxHeight = "100%";
        return style;
      },
      isPdf() {
        return this.mimeType === "application/pdf";
      },
      isImg() {
        var ctypeArr = [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/tiff",
          "image/x-icon",
          "application/x-bmp"
        ];
        if (ctypeArr.indexOf(this.mimeType) >= 0) {
          return true;
        } else {
          return false;
        }
      },
      isSingle() {
        // return false;
        return this.urlList.length <= 1;
      },
      isFirst() {
        // return false;
        return this.index === 0;
      },
      isLast() {
        // return true;
        return this.index === this.urlList.length - 1;
      }
    },
    methods: {
      //显示错误提示
      showerr(msg) {
        var that = this;
        that.loading = false;
        that.$alert(msg, {
          showClose: false,
          callback: function (action, instance) {
            that.hide();
          }
        });
      },
      //鼠標滾輪縮放事件註冊
      deviceSupportInstall() {
        var that = this;
        if (that.isImg) {
          this._mouseWheelHandler = rafThrottle(e => {
            const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
            if (delta > 0) {
              this.handleActions("zoomIn", {
                zoomRate: 0.015,
                enableTransition: false
              });
            } else {
              this.handleActions("zoomOut", {
                zoomRate: 0.015,
                enableTransition: false
              });
            }
          });
          on(document, mousewheelEventName, this._mouseWheelHandler);
        }
      },
      deviceSupportUninstall() {
        off(document, mousewheelEventName, this._mouseWheelHandler);
        this._mouseWheelHandler = null;
      },
      initSrc() {
        //測試pdf地址 沒問題才顯示
        let that = this;
        if (that.isPdf) {
          that.loading = true;
          this.edgeShow = false;
          let instance = that.$http.create();
          instance.options(that.src)
            .then(resp => {
              if (resp.status == 200) {
                // 下面代码都是处理IE浏览器的情况
                if (window.ActiveXObject || "ActiveXObject" in window) {
                  let flag = false
                  //判断是否为IE浏览器，"ActiveXObject" in window判断是否为IE11
                  //判断是否安装了adobe Reader
                  for (let x = 2; x < 10; x++) {
                    try {
                      let oAcro = eval("new ActiveXObject('PDF.PdfCtrl." + x + "');");
                      if (oAcro) {
                        flag = true;
                      }
                    } catch (e) {
                      flag = false;
                    }
                  }
                  try {
                    let oAcro4 = new ActiveXObject('PDF.PdfCtrl.1');
                    if (oAcro4) {
                      flag = true;
                    }
                  } catch (e) {
                    flag = false;
                  }
                  try {
                    let oAcro7 = new ActiveXObject('AcroPDF.PDF.1');
                    if (oAcro7) {
                      flag = true;
                    }
                  } catch (e) {
                    flag = false;
                  }
                  if (flag) {//支持
                    that.realpdfSrc = that.pdfSrc;
                    that.$nextTick(function () {
                      let html = document.querySelector('#temppdf').innerHTML
                      document.querySelector('#temppdf').innerHTML = '<span></span>'
                      document.querySelector('#temppdf').innerHTML = html
                      this.edgeShow = true;
                    })
                  } else {//不支持
                    alert("尊敬的用户，对不起。您还没有安装PDF在线预览软件,为了方便在线预览PDF文档,请下载安装！");
                    location = "http://ardownload.adobe.com/pub/adobe/reader/win/9.x/9.3/chs/AdbeRdr930_zh_CN.exe";
                  }
                } else {
                  that.realpdfSrc = that.pdfSrc;
                  that.$nextTick(function () {
                    let html = document.querySelector('#temppdf').innerHTML
                    document.querySelector('#temppdf').innerHTML = '<span></span>'
                    document.querySelector('#temppdf').innerHTML = html
                    this.edgeShow = true;
                  })
                }
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
        }
      },
      hide() {
        this.onClose();
        this.deviceSupportUninstall();
      },
      // fullscreen() {
      //   //全屏
      //   this.mode = Mode.FullScreen;
      // },

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
      },
      //模式切換事件
      handleYoModelChange(e) {
        // console.log("模式切換：" + e.name);
        this.mode = Mode[e.name];
        // console.log("當前模式：" + this.mode.name);
        const {transform} = this;
        if (this.mode == Mode.FullScreen) {
          //切換到全屏模式
        } else if ((this.mode = Mode.Dialog)) {
          //切換會對話框模式 復位
          transform.offsetX = 0;
          transform.offsetY = 0;
          transform.scale = 1;
          transform.deg = 0;
        }
      },
      handleActions(action, options = {}) {
        if (this.loading) return;
        const {zoomRate, rotateDeg, enableTransition} = {
          zoomRate: 0.2,
          rotateDeg: 90,
          enableTransition: true,
          ...options
        };
        const {transform} = this;
        switch (action) {
          case "zoomOut":
            if (transform.scale > 0.2) {
              transform.scale = parseFloat(
                (transform.scale - zoomRate).toFixed(3)
              );
            }
            break;
          case "zoomIn":
            transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
            break;
          case "clocelise":
            transform.deg += rotateDeg;
            break;
          case "anticlocelise":
            transform.deg -= rotateDeg;
            break;
        }
        transform.enableTransition = enableTransition;
      },
      handleImgLoad(e) {
        this.loading = false;
      },
      handleImgError(e) {
        this.loading = false;
        e.target.alt = "加载失败";
      },
      handleDownLoad: function () {
        if (this.src.length > 0) {
          let url = this.src.toLowerCase().replace("showimage", "download");
          this.$refs.download_a.href = url;
          this.$refs.download_a.click();
        }
      },
      ///圖片鼠標點下事件
      handleImgMouseDown: function (e) {
        //非全屏的 不給拖動圖片
        console.log("當前模式:" + this.mode.name);
        if (this.loading || this.mode == Mode.Dialog) return;

        off(document, "mousemove", this._dragHandler);
        const {offsetX, offsetY} = this.transform;
        const startX = e.pageX;
        const startY = e.pageY;
        this._dragHandler = rafThrottle(ev => {
          this.transform.offsetX = offsetX + ev.pageX - startX;
          this.transform.offsetY = offsetY + ev.pageY - startY;
        });
        on(document, "mousemove", this._dragHandler);
        on(document, "mouseup", ev => {
          off(document, "mousemove", this._dragHandler);
        });

        e.preventDefault();
      },
      prev() {
        if (this.isFirst) return;
        const len = this.urlList.length;
        this.index = (this.index - 1 + len) % len;
      },
      next() {
        if (this.isLast) return;
        const len = this.urlList.length;
        this.index = (this.index + 1) % len;
      }
    },
    created: function () {
    },
    mounted() {
      this.initSrc();
      this.deviceSupportInstall();
    }
  };
</script>
<style>
  .yo-pad-viewer-custom-canvas {
    position: initial !important;
    justify-content: center !important;
    display: flex !important;
    align-items: center !important;
  }

  .yo-pad-viewer-custom-mask {
    background: #000 !important;
    opacity: 0.5 !important;
  }

  .pdf-is-disabled {
    color: #7e7e7e;
    background-color: #eaeaea;
    border: 1px solid #eaeaea;
    cursor: default;
  }

  #app div.el-image-viewer__mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: .5;
    background: #000;
    z-index: 999;
  }

  #app span.el-image-viewer__close {
    z-index: 9999;
    position: fixed;
    color: #fff;
  }

</style>
