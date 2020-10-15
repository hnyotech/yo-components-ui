<template>
  <div class="preImg">
    <div v-if="fileList.length > 0 ? true : false">
      <div
        v-for="file in fileList"
        :key="file.id"
        @click="handleDownLoad(file.orgurl, file)"
        class="text file-item-img file-item-img2"
      >
        <i class="el-icon-document marginright"></i>
        {{file.name}}
      </div>
    </div>
    <div v-if="fileList.length === 0">
      <div class="text file-item-img nofile">
        <i class="el-icon-warning marginright"></i>暂无文件
      </div>
    </div>
    <yo-img-viewer
      v-if="dialogVisible"
      :on-close="closeViewer"
      :url-list="GetSrcListByCache()"
      :initialIndex="PriviewStartIndex"
      :titles="dialogTitle"
    ></yo-img-viewer>
    <yo-pdf-viewer
      v-if="pdfdialogVisible"
      :title="pdfViewerTitle"
      :on-close="closePdfViewer"
      :src="pdfViewerSrc"
      :mime-type="mimeType"
    ></yo-pdf-viewer>
    <a href ref="download_a" target="_blank" v-show="false"></a>
  </div>
</template>
<script type="text/javascript">
  import YoImgViewer from "./YoImageViewer";
  import YoPdfViewer from "@/packages/YoFile/src/YoPdfViewer";

  export default {
    name: "YoImg",
    props: {
      isNeedialogTitle: {
        type: String,
        required: false,
        default: null
      },
      ids: {
        type: String,
        required: false,
        default: null
      },
      apiUrl: {
        type: String,
        required: false,
        default: process.env.AttachAPI || process.env.API
      },
      isPreviw: {
        type: Boolean,
        required: false,
        default: true
      },
      fit: {
        validator: function (value) {
          // 这个值必须匹配下列字符串中的一个
          return (
            ["fill", "contain", "cover", "none", "scale-down"].indexOf(value) !==
            -1
          );
        },
        default: "scale-down"
      }
    },
    components: {YoImgViewer, YoPdfViewer},
    data: function () {
      return {
        pdfdialogVisible: false,
        pdfViewerSrc: "",
        pdfViewerTitle: "",
        mimeType: "",
        dialogVisible: false, // 显示预览
        dialogTitle: "", // 预览标题
        fileList: [], // 附件列表(本次上传的)
        fileList2: [],
        PriviewStartIndex: 0, //預覽index
        StorageKey: "_ImgViewSrcCache"
      };
    },
    created: function () {
      this.loadData(this.ids);
    },
    mounted: function () {
    },
    watch: {
      ids: function (val) {
        // console.log("watch ids:" + val);
        // 变化后 持续加载附件
        this.loadData(this.ids);
      }
    },

    methods: {
      // 关闭查看器
      closeViewer() {
        this.dialogVisible = false;
      },
      //关闭PDF预览
      closePdfViewer() {
        this.pdfdialogVisible = false;
        this.pdfViewerSrc = "";
      },
      fileListContainId: function (id) {
        // 判断指定ID是否在fileList里面
        var that = this;
        for (var i = 0; i < that.fileList.length; i++) {
          if (that.fileList[i].id === id) {
            return true;
          }
        }
        return false;
      },
      loadData: function (ids) {
        var that = this;
        if (ids == null || ids === undefined || ids.length === 0) {
          // console.log(ids)
          that.fileList = [];
          return false;
        }
        var idArr = ids.split(",");
        var loadId = [];
        // 先判断id 是否加载过了
        idArr.forEach(function (id) {
          if (!that.fileListContainId(id)) {
            loadId.push(id);
          }
        });
        if (loadId.length === 0) {
          return false;
        }
        var newIds = loadId.join(",");
        // console.log("loadData:" + newIds);
        var param = {};
        param["ids"] = newIds;
        that.$http
          .post(that.apiUrl + "/api/Attach/GetAttachs", param)
          .then(resp => {
            resp.forEach(function (file) {
              var item = {};
              item.id = file.id;
              item.sign = file.sign;
              item.timestamp = file.timestamp;
              item.name = file.name;
              item.size = file.size;
              item.type = file.type;
              if (that.isImgType(item.type)) {
                item.orgurl =
                  //  process.env.API +
                  that.apiUrl +
                  "/api/Attach/ShowImage?id=" +
                  file.id +
                  "&sign=" +
                  file.sign +
                  "&timestamp=" +
                  file.timestamp;
                item.url =
                  //  process.env.API +
                  that.apiUrl +
                  "/api/Attach/ShowThumbImage?id=" +
                  file.id +
                  "&sign=" +
                  file.sign +
                  "&timestamp=" +
                  file.timestamp;
                // that.fileList.push(item);
                that.AddSrcCache(item); //添加到預覽緩存
              } else if (that.isCanPreviewPDFType(item.type)) {
                item.orgurl =
                  that.apiUrl +
                  "/api/Attach/Download?id=" +
                  file.id +
                  "&sign=" +
                  file.sign +
                  "&timestamp=" +
                  file.timestamp;
                item.url =
                  that.apiUrl +
                  "/api/Attach/ShowPDF?id=" +
                  file.id +
                  "&sign=" +
                  file.sign +
                  "&timestamp=" +
                  file.timestamp;
              } else {
                // 非图片
                item.orgurl =
                  //  process.env.API +
                  that.apiUrl +
                  "/api/Attach/Download?id=" +
                  file.id +
                  "&sign=" +
                  file.sign +
                  "&timestamp=" +
                  file.timestamp;
                item.url = item.orgurl;
                // that.fileList2.push(item);
              }
              that.fileList.push(item);
            });
          })
          .catch(err => {
            console.error(err);
            astec.showErrorToast(err.Message);
          });
      },

      //添加到預覽緩存組中
      AddSrcCache: function (item) {
        // debugger;
        var id = item.id;
        var src = item.orgurl;
        let that = this;
        let cacheData = JSON.parse(sessionStorage.getItem(that.StorageKey));
        if (!cacheData) {
          cacheData = new Object();
          cacheData[that.group] = {};
        }
        //保存
        var obj = cacheData[that.group];
        if (!obj) {
          obj = new Object();
        }
        //判斷存在不
        obj[id] = {src: src, title: item.name};
        cacheData[that.group] = obj;
        sessionStorage.setItem(that.StorageKey, JSON.stringify(cacheData));
      },

      //獲取地址所在index
      GetIndexByCache: function (id) {
        let that = this;
        let cacheData = JSON.parse(sessionStorage.getItem(that.StorageKey));
        if (cacheData) {
          let obj = cacheData[that.group];
          if (obj) {
            let i = 0;
            for (var key in obj) {
              if (key == id) {
                return i;
              }
              i++;
            }
            // for (let i = 0; i < obj.length; i++) {
            //   if (obj.id == id) {
            //     return i;
            //   }
            // }
          }
        }
        return -1;
      },
      //獲取當前分組的緩存列表
      GetSrcListByCache: function () {
        // debugger;
        let that = this;
        let list = [];
        let titleArr = [];
        let cacheData = JSON.parse(sessionStorage.getItem(that.StorageKey));
        if (cacheData) {
          let obj = cacheData[that.group];
          if (obj) {
            for (var a in obj) {
              list.push(obj[a].src);
              titleArr.push(obj[a].title);
            }
          }
        }
        this.dialogTitle = titleArr;
        return list;
      },
      // 判断是否图片
      isImgType: function (filetype) {
        var ctypeArr = [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/tiff",
          "image/x-icon"
          // "application/x-bmp",
          // "application/octet-stream"
        ];
        if (ctypeArr.indexOf(filetype) >= 0) {
          return true;
        } else {
          return false;
        }
      },
      // 判断是可做PDF预览的 .doc/.docx之类
      isCanPreviewPDFType: function (filetype) {
        var ctypeArr = [
          "application/pdf", //.pdf
          "application/msword", //.doc|.docx
          "application/vnd.ms-excel", //.xls|.xlsx
          "application/vnd.ms-powerpoint" //ppt
          // "text/plain" //.txt
        ];
        if (ctypeArr.indexOf(filetype) >= 0) {
          return true;
        } else {
          return false;
        }
      },
      handlePreview: function (file) {
        if (!this.isPreviw) {
          return;
        }
        this.dialogVisible = true;
        this.PriviewStartIndex = this.GetIndexByCache(file.id);
      },
      handleId: function () {
        var that = this;
        // 回调IDs用
        var newIds = "";
        that.AllfileList.forEach(function (file) {
          if (file.id) {
            newIds += file.id + ",";
          }
        });
        if (newIds.length > 0) {
          newIds = newIds.substring(0, newIds.length - 1);
        }
      },
      //预览PDF
      handlePreviewPdf(url, mimeType = "application/pdf", title = "") {
        let that = this;
        if (that.pdfdialogVisible) {
          that.pdfdialogVisible = false;
          that.pdfViewerSrc = "";
          setTimeout(() => {
            //不这么搞是不能重复打开的.by Z.C
            that.pdfViewerSrc = url;
            that.mimeType = mimeType;
            that.pdfViewerTitle = title;
            that.pdfdialogVisible = true;
          }, 200);
        } else {
          that.pdfViewerSrc = url;
          that.mimeType = mimeType;
          that.pdfViewerTitle = title;
          that.$nextTick(function () {
            that.pdfdialogVisible = true;
          })
        }
      },
      // 下载
      handleDownLoad: function (url, item) {
        if (!this.isPreviw) {
          return;
        }
        if (this.isImgType(item.type)) {
          this.handlePreview(item)
          return
        }
        if (this.isCanPreviewPDFType(item.type)) {
          this.handlePreviewPdf(item.url, item.type, item.name)
          return
        }
        if (url.length > 0) {
          url = url.toLowerCase().replace("showimage", "download");
          this.$refs.download_a.href = url;
          this.$refs.download_a.click();
        }
      }
    },
    beforeDestroy() {
      sessionStorage.removeItem(this.StorageKey);
    }
  };
</script>
<style scope>
  .text {
    font-size: 12px;
  }

  .file-item-img {
    display: inline-block;
    width: calc(50% - 18px);
    margin-bottom: 5px;
    margin-right: 10px;
    padding: 3px 10px 4px 2px;
    background-color: #eee;
    border-radius: 2px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #666;
  }

  .file-item-img2:nth-of-type(2n) {
    margin-right: 0;
  }

  .file-item-img:hover {
    cursor: pointer;
    color: #365fa4;
  }

  .nofile {
    width: auto;
    background-color: #eee;
    color: #999;
  }

  .nofile:hover {
    cursor: not-allowed;
    background-color: #eee;
    color: #999;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .marginright {
    margin-right: 3px;
  }

  .flexpic {
    display: flex;
  }

  .preImg .flexpic .image-slot, .preImg .flexpic .el-image__placeholder {
    width: 220px;
    height: 180px;
    background: #eeeeee url("./noImg.png") no-repeat 50% 40%;
    padding-top: 100px;
    box-sizing: border-box;
  }

  .image-slot-placeholder {
    font-size: 14px;
    color: #999;
    width: 220px;
    height: 180px;
    text-align: center;
    line-height: 180px;
    background-color: #eee;
  }

  .errorInfo {
    text-align: center;
    padding-top: 40px;
    color: #aaaaaa;
    font-size: 14px;
  }

  .el-image img {
    width: 220px;
    height: 180px;
  }

  /* 文件上传组件样式 */
  .preImg >>> .avatar-uploader .el-upload {
    border: none !important;
  }
</style>
