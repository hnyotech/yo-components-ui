<template>
  <div>
    <div
      v-show="imageUrl.length>0&&uploadType==1"
      style="position: relative;margin-top: 5px;margin-bottom: 5px;"
    >
      <img :src="imageUrl" class="avatar" />
      <span class="el-upload-act">
        <span class="el-upload-act-preview">
          <i class="el-icon-zoom-in" @click.stop="handlePreview(singleFile)"></i>
        </span>
        <span class="el-upload-act-delete" v-show="!readOnly">
          <i class="el-icon-delete" @click.stop="handleRemove(singleFile)"></i>
        </span>
      </span>
    </div>
    <el-upload
      ref="upload"
      v-show="IsShow"
      class="avatar-uploader yo-file-upload"
      :class="fileList.length>=fileLimit?'table-upload-type':''"
      :with-credentials="true"
      :action="action"
      :multiple="IsMultiple"
      :limit="FileLimit"
      :accept="FileAccept"
      :auto-upload="autoupload"
      :show-file-list="isShowFileList"
      :list-type="ListType"
      :data="ExData"
      :file-list="fileList"
      :on-exceed="onExceed"
      :before-remove="beforeRemove"
      :before-upload="beforeUpload"
      :on-change="onChange"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :http-request="httpRequest"
      :disabled="readOnly"
    >
      <!--<template v-if="uploadType==1">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </template>-->
      <template v-if="uploadType==2 || uploadType==1">
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <!-- <el-button size="small" type="primary">选择</el-button> -->
        <el-progress type="circle" :percentage="25"></el-progress>
      </template>
      <template v-else-if="uploadType==4">
        <el-button
          size="small"
          type="text"
          class="table-btn"
          v-show="fileList.length<fileLimit&&!readOnly"
          @click.native="uploadBtn"
        >{{uploadBtnName}}</el-button>
      </template>
      <template v-else>
        <!-- <el-button
          size="small"
          type="primary"
          v-show="!readOnly"
          :disabled="fileLimit>0&&showFileList.length>=fileLimit"
          @click.native="uploadBtn"
        >{{uploadBtnName}}
        </el-button>-->
        <div
          slot="trigger"
          v-if="fileLimit>0&&showFileList.length>=fileLimit&&!readOnly"
          class="el-button el-button--primary el-button--small is-disabled u-btn-s btn-height"
        >{{uploadBtnName}}</div>
        <div
          v-if="fileLimit>0&&showFileList.length>=fileLimit&&!readOnly"
          class="el-button el-button--primary el-button--small is-disabled btn-height"
        >{{uploadBtnName}}</div>
        <div
          slot="trigger"
          v-if="fileLimit>0&&showFileList.length<fileLimit&&!readOnly"
          class="el-button el-button--primary el-button--small btn-height"
        >{{uploadBtnName}}</div>
      </template>
      <!-- <div v-if="IsShowTip" slot="tip" class="el-upload__tip">{{Tip}}</div> -->
    </el-upload>
    <div v-if="IsShowTip" slot="tip" class="el-upload__tip">{{Tip}}</div>

    <ul
      class="el-upload-list el-upload-list--text"
      v-if="fileList && fileList.length > 0 && fileType === 2 && isShowFileList === false"
    >
      <li
        tabindex="0"
        class="el-upload-list__item is-success"
        v-for="item in fileList"
        :key="item.id"
      >
        <yo-row :gutter="20">
          <yo-col :span="12" class="left-content" style="position: relative;">
            <a class="el-upload-list__item-name" @click.stop="handlePreview(item)">
              <i class="el-icon-document"></i>
              {{item.name}}
            </a>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-circle-check"></i>
            </label>
            <i class="el-icon-close" @click.stop="handleRemove(item,null)"></i>
            <i class="el-icon-close-tip">按 delete 键可删除</i>
          </yo-col>
          <yo-col :span="12">
            <el-input :id="item.id" size="mini" v-model.trim="item.name"></el-input>
          </yo-col>
        </yo-row>
      </li>
    </ul>

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
import YoImgViewer from "@/packages/YoImg/src/YoImageViewer";
import YoPdfViewer from "@/packages/YoFile/src/YoPdfViewer";
import YoRow from "@/packages/YoRow/src/main";
import YoCol from "@/packages/YoCol/src/main";

export default {
  name: "YoFile",
  props: {
    ids: {
      type: String,
      required: false,
      default: null,
    },
    id: {
      type: String,
      required: false,
      default: null,
    },
    uploadBtnName: {
      type: String,
      required: false,
      default: "上传",
    },
    fileListArr: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
    // 文件上传组件类型  1默认  2可修改文件名
    fileType: {
      type: Number,
      required: false,
      default: 1,
    },
    // 是否展示 已上传 文件列表
    isShowFileList: {
      type: Boolean,
      required: false,
      default: true,
    },
    // 控件类型:1 img,2 imageList 3 files
    uploadType: {
      type: Number,
      required: false,
      default: 1,
    },
    // 文件最大上传个数限制 0不限
    fileLimit: {
      type: Number,
      required: false,
      default: 0,
    },
    // 文件大小B, 0不限 默认10M(n/1024/1024)
    fileSize: {
      type: Number,
      required: false,
      default: 104857600,
    },
    // 文件后缀
    fileExtension: {
      type: String,
      required: false,
      default: ".pdf,.png,.jpg,.jpeg,.gif,.word,.doc,.docx,.xls,.xlsx,.txt",
    },
    Extension: {
      type: Object,
      required: false,
      default: () => {
        return {
          isCheckExtension: false,
          formation: "符合",
        };
      },
    },
    // 支持多选文件
    isMultiple: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 是否显示 tip
    isShowTip: {
      type: Boolean,
      required: false,
      default: true,
    },
    // 附加信息
    exData: {
      type: Object,
      required: false,
      default: null,
    },
    // 匿名附件
    allowAnonymous: {
      type: Boolean,
      required: false,
      default: false,
    },
    apiUrl: {
      type: String,
      required: true,
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
    //圖片預覽組件
    imgViewer: {
      type: String,
      default: "YoImgViewer",
      validator: function (value) {
        if (value) {
          let has = ["YoImgViewer", "YoPdfViewer"].indexOf(value) !== -1;
          if (!has) {
            // console.error("props参数必须匹配下面的值之一:['YoImgViewer','YoPdfViewer']")
          }
          return has;
        } else {
          //空的 表示默認
          return true;
        }
      },
    },
  },
  components: {
    YoImgViewer,
    YoPdfViewer,
    YoRow,
    YoCol,
  },
  data: function () {
    return {
      // action:process.env.API + "/api/Attach/SaveAttach", //上传附件接口地址
      action: this.apiUrl + "/api/Attach/SaveAttach", // 上传附件接口地址
      autoupload: true, // 自动上传
      imageUrl: "", // uploadType=1时候 显示图片  //"http://wx3.sinaimg.cn/large/006nLajtly1fpi9ikmj1kj30dw0dwwfq.jpg"
      fileList: [], // 附件列表(本次上传的)
      fileListOrg: [], // 原始附件列表-默认带着的
      dialogVisible: false, // 显示预览
      pdfdialogVisible: false,
      pdfViewerSrc: "",
      pdfViewerTitle: "",
      mimeType: "",
      dialogTitle: "", // 预览标题
      showFileList: [], // 需要提交的文件列表
      delInd: "", // 待删除的文件索引
      singleFile: "", // 单个文件

      PriviewStartIndex: 0, //預覽index
      StorageKey: "_ImgViewSrcCache",
    };
  },
  created: function () {
    this.loadData(this.ids);
  },
  mounted: function () {},
  watch: {
    ids: function (val) {
      // 变化后 持续加载附件
      this.loadData(this.ids);
    },
    fileListArr: {
      handler(val) {
        if (val && val.length === 0) {
          this.fileList = [];
          this.showFileList = [];
          sessionStorage.removeItem(this.StorageKey);
        }
        for (let i in val) {
          let same = false;
          for (let a in this.fileList) {
            if (this.fileList[a].id === val[i].id) {
              same = true;
            }
          }
          if (!same) {
            this.fileList.push(val[i]);
          }
        }
      },
      deep: true,
    },
    fileList: {
      handler(val) {
        this.fileList = val;
        this.$emit("update:fileList", val);
      },
      deep: true,
      immediate: true,
    },
    showFileList: function (newVal, fromVal) {
      // console.log(newVal)
      // TODO:
    },
  },
  // 计算属性
  computed: {
    AllfileList: function () {
      // 所有附件
      let allList = [];
      if (this.fileListOrg != null && this.fileListOrg.length > 0) {
        allList = allList.concat(this.fileListOrg);
      }
      if (this.showFileList != null && this.showFileList.length > 0) {
        allList = allList.concat(this.showFileList);
      }
      return allList;
    },
    IsShow: function () {
      if (this.uploadType === 1 && this.imageUrl.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    ExData: function () {
      // 附加信息
      let param = {};
      param.test = "admin";
      if (this.exData != null) {
        Object.assign(param, this.exData);
      }
      return param;
    },
    // 文件列表的显示类型
    ListType: function () {
      if (this.uploadType === 1) {
        return "picture-card";
      } else if (this.uploadType === 2) {
        return "picture-card";
      } else {
        return "text";
      }
    },
    // 显示文件列表:单图片时候不显示
    IsShowFileList: function () {
      if (this.uploadType === 1) {
        return false;
      } else {
        return true;
      }
    },
    // 允许的文件类型
    FileAccept: function () {
      let acceptstr = "";
      if (this.fileExtension.length > 0) {
        acceptstr = this.fileExtension;
      } else {
        // 未单独指定的 根据uploadType自定义
        if (this.uploadType === 1 || this.uploadType === 2) {
          // 图片的
          acceptstr = ".jpg,.jpeg,.png,.ico,.gif,.svg,.pdf";
        }
      }
      return acceptstr;
    },
    // 显示的 提示语
    Tip: function () {
      let tipStr = "";
      if (this.FileAccept.length > 0) {
        tipStr += "只能上传 " + this.FileAccept + " 类型的文件,";
      }
      if (this.FileLimit > 0) {
        tipStr += "允许上传最多" + this.FileLimit + "个文件,";
      }
      if (this.fileSize > 0) {
        let sizeStr = this.fileSize + "B,";
        if (this.fileSize < 1024) {
        } else if (this.fileSize < 1024 * 1024) {
          sizeStr = Math.round(this.fileSize / 1024, 2) + "KB,";
        } else {
          // M
          sizeStr = Math.round(this.fileSize / 1024 / 1024, 2) + "MB,";
        }
        tipStr += "单个文件不能超过" + sizeStr;
      }
      if (tipStr.length > 0) {
        tipStr = tipStr.substring(0, tipStr.length - 1);
      }
      return tipStr;
    },
    // 是否显示提示
    IsShowTip: function () {
      return this.isShowTip && this.Tip.length > 0;
    },
    // 是否允许多选
    IsMultiple: function () {
      if (this.uploadType === 1) {
        return false;
      } else {
        return this.isMultiple;
      }
    },
    // 文件上传数量
    FileLimit: function () {
      if (this.uploadType === 1) {
        return 1;
      } else {
        return this.fileLimit;
      }
    },
    //分组
    group: function () {
      let defStr = "___ImgViewSrcCache_Group_";
      if (window.location.pathname.length > 0) {
        defStr = window.location.pathname;
      }
      return defStr;
    },
  },
  methods: {
    fileListContainId: function (id) {
      // 判断指定ID是否在fileList里面
      let that = this;
      for (let i = 0; i < that.showFileList.length; i++) {
        if (that.showFileList[i].id === id) {
          return true;
        }
      }
      return false;
    },
    loadData: function (ids) {
      let that = this;
      if (ids == null || ids === undefined || ids.length === 0) {
        that.showFileList = [];
        that.fileList = [];
        that.fileListOrg = [];
        that.imageUrl = "";
        that.singleFile = {};
        return false;
      }
      let idArr = ids.split(",");
      let loadId = [];
      // 先判断id 是否加载过了
      idArr.forEach(function (id) {
        if (!that.fileListContainId(id)) {
          loadId.push(id);
        }
      });
      if (loadId.length === 0) {
        return false;
      }
      let newIds = loadId.join(",");

      let param = {};
      param["ids"] = newIds;
      that.$http
        .post(that.apiUrl + "/api/Attach/GetAttachs", param)
        .then((resp) => {
          resp.forEach(function (file) {
            let item = {};
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
            }
            if (that.uploadType === 1) {
              that.singleFile = item;
              that.imageUrl = item.url;
            } else {
              that.fileList.push(item);
              that.showFileList.push(item);
            }
            that.handleId();
          });
        })
        .catch((err) => {
          console.error(err);
          astec.showErrorToast(err.Message);
        });
    },
    //添加到預覽緩存組中
    AddSrcCache: function (item) {
      let id = item.id;
      let src = item.orgurl;
      let that = this;
      let cacheData = JSON.parse(sessionStorage.getItem(that.StorageKey));
      if (!cacheData) {
        cacheData = new Object();
        cacheData[that.group] = {};
      }
      //保存
      let obj = cacheData[that.group];
      if (!obj) {
        obj = new Object();
      }
      //判斷存在不
      obj[id] = { src: src, title: item.name };
      cacheData[that.group] = obj;
      sessionStorage.setItem(that.StorageKey, JSON.stringify(cacheData));
    },
    RemoveSrcCache: function (item) {
      let id = item.id;
      let src = item.orgurl;
      let that = this;
      for (let a in that.fileList) {
        if (that.fileList[a].id == item.id) {
          that.fileList.splice(a, 1);
          return false;
        }
      }

      let cacheData = JSON.parse(sessionStorage.getItem(that.StorageKey));
      if (cacheData) {
        let obj = cacheData[that.group];
        if (obj) {
          if (obj[id]) {
            delete obj[id];
            cacheData[that.group] = obj;
            sessionStorage.setItem(that.StorageKey, JSON.stringify(cacheData));
          }
        }
      }
    },
    //獲取地址所在index
    GetIndexByCache: function (id) {
      let that = this;
      let cacheData = JSON.parse(sessionStorage.getItem(that.StorageKey));
      if (cacheData) {
        let obj = cacheData[that.group];
        if (obj) {
          let i = 0;
          for (let key in obj) {
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
      let that = this;
      let list = [];
      let titleArr = [];
      let cacheData = JSON.parse(sessionStorage.getItem(that.StorageKey));
      if (cacheData) {
        let obj = cacheData[that.group];
        if (obj) {
          for (let a in obj) {
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
      let ctypeArr = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/tiff",
        "image/x-icon",
        "application/x-bmp",
      ];
      if (ctypeArr.indexOf(filetype) >= 0) {
        return true;
      } else {
        return false;
      }
    },
    // 判断是可做PDF预览的 .doc/.docx之类
    isCanPreviewPDFType: function (filetype) {
      let ctypeArr = [
        "application/pdf", //.pdf
        "application/msword", //.doc|.docx
        "application/vnd.ms-excel", //.xls|.xlsx
        "application/vnd.ms-powerpoint", //ppt
        // "text/plain" //.txt
      ];
      if (ctypeArr.indexOf(filetype) >= 0) {
        return true;
      } else {
        return false;
      }
    },
    onPreview: function (file) {
      // 点击文件列表中已上传的文件时的钩子
      if (this.isImgType(file.type) || this.isCanPreviewPDFType(file.type)) {
        this.handlePreview(file);
      } else {
        // 直接触发下载
        this.handleDownLoad(file.url);
      }
    },
    onRemove: function (file, fileList) {
      if (file && file.status === "success") {
        // 文件列表移除文件时的钩子
        let that = this;
        if (that.readOnly) {
          return;
        }
        let delFile =
          this.delInd !== "" ? that.showFileList[this.delInd] : file;
        if (this.delInd === 0) {
          delFile = that.showFileList[0];
        }
        // 从服务器端删除
        that.$http
          .post(
            that.apiUrl +
              "/api/Attach/Delete?id=" +
              delFile.id +
              "&sign=" +
              delFile.sign +
              "&timestamp=" +
              delFile.timestamp
          )
          .then((resp) => {
            // 移除列表
            if (that.uploadType === 1) {
              that.imageUrl = "";
              that.singleFile = {};
            } else {
              that.showFileList = that.showFileList.filter(
                (t) => t.id !== delFile.id
              );
            }

            that.handleId();
            that.RemoveSrcCache(file);
          })
          .catch((err) => {
            astec.showErrorToast(err.Message);
          });
      }
    },
    onChange: function (file, fileList) {
      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    },
    beforeUpload: function (file) {
      // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      let sameFileName = false;
      for (let a in this.fileList) {
        if (this.fileList[a].name == file.name) {
          sameFileName = true;
        }
      }
      if (sameFileName) {
        this.$message.error("上传附件不可重名!");
        return false;
      }
      if (this.fileSize > 0 && file.size > this.fileSize) {
        this.$message.error(
          "上传附件大小不能超过" +
            Math.round(this.fileSize / 1024 / 1024, 2) +
            "MB!"
        );
        return false;
      }
      let temp = file.name.toString().split(".");
      if (typeof temp === "object" && temp.length > 0) {
        if (
          ["exe", "bat", "msi", "dll", "sh", "js", "sql"].indexOf(
            temp[temp.length - 1]
          ) === -1
        ) {
          if (this.Extension.isCheckExtension === true) {
            let index = file.name.lastIndexOf(".");
            let suffix = file.name;
            let str = suffix.substring(index, suffix.length);
            let isLeagalFile = this.fileExtension.indexOf(str) === -1;
            if (isLeagalFile === true) {
              this.$message.error(
                `您选择的文件格式不正确，请上传${this.Extension.formation}格式文件！`
              );
            }
            return !isLeagalFile;
          }
        } else {
          this.$message.error(`您选择的文件格式无法上传，请重新上传！`);
          return false;
        }
      } else {
        this.$message.error(`您选择的文件格式无法识别，请重新上传！`);
        return false;
      }
    },
    beforeRemove: function (file, fileList) {
      // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      if (this.readOnly) {
        return false;
      }
      if (file.id) {
        this.delInd = "";
      } else {
        for (let i = 0; fileList.length; i++) {
          if (file.name === fileList[i].name) {
            this.delInd = i;
            break;
          }
        }
      }

      // return astec.showConfirmDialog('警告', '确认要删除文件吗?', '', '')
    },
    onExceed: function (files, fileList) {
      // 文件超出个数限制时的钩子
      if (this.uploadType === 1) {
        return true;
      } else {
        astec.showErrorToast("文件超出个数限制!");
        return false;
      }
    },
    httpRequest: function (param) {
      let that = this;
      // 自定义上传 ,否则无法获取当前用户--暂时先不用,因为无法获取正确的状态
      //  return;
      let form = new FormData();
      form.append("file", param.file, param.file.name);
      form.append("filename", param.file.name);
      form.append("exData", param.file.uid);
      if (that.allowAnonymous) {
        // 匿名附件
        form.append("allowanonymous", true);
      }
      if (param.data) {
        // TODO:附加信息
      }
      //   that.$refs.upload.clearFiles();//
      that.$http
        .post(param.action, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            let percent =
              ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
            param.onProgress({ percent: percent });
          },
        })
        .then((response) => {
          let item = {};
          item.id = response.id;
          item.sign = response.sign;
          item.timestamp = response.timestamp;
          let resFileName = response.name;
          let resFileNameArr = response.name.split("\\");
          if (resFileName && resFileNameArr && resFileNameArr.length > 0) {
            resFileName = resFileNameArr[resFileNameArr.length - 1];
          }
          item.name = resFileName;
          item.size = response.size;
          item.type = response.type;
          if (that.isImgType(item.type)) {
            item.orgurl =
              //  process.env.API
              that.apiUrl +
              "/api/Attach/ShowImage?id=" +
              response.id +
              "&sign=" +
              response.sign +
              "&timestamp=" +
              response.timestamp;
            item.url =
              //  process.env.API
              that.apiUrl +
              "/api/Attach/ShowThumbImage?id=" +
              response.id +
              "&sign=" +
              response.sign +
              "&timestamp=" +
              response.timestamp;
          } else if (that.isCanPreviewPDFType(item.type)) {
            item.orgurl =
              that.apiUrl +
              "/api/Attach/Download?id=" +
              response.id +
              "&sign=" +
              response.sign +
              "&timestamp=" +
              response.timestamp;
            item.url =
              that.apiUrl +
              "/api/Attach/ShowPDF?id=" +
              response.id +
              "&sign=" +
              response.sign +
              "&timestamp=" +
              response.timestamp;
          } else {
            // 非图片
            item.orgurl =
              //  process.env.API
              that.apiUrl +
              "/api/Attach/Download?id=" +
              response.id +
              "&sign=" +
              response.sign +
              "&timestamp=" +
              response.timestamp;
            item.url = item.orgurl;
          }

          if (that.uploadType === 1) {
            // 显示
            that.singleFile = item;
            that.imageUrl = item.url;
            that.dialogTitle = item.name;
          } else {
            that.fileList.push(item);
            that.showFileList.push(item);
          }
          that.AddSrcCache(item);
          that.handleId();
          that.$emit("callback", that.AllfileList); // 触发回调
          // 上传成功 调用onSuccess方法，否则没有完成图标
          // 处理自己的逻辑
          param.onSuccess();
        })
        .catch(() => {
          // 上传失败 调用onError方法
          // 处理自己的逻辑
          param.onError();
        });
    },
    handleRemove: function (file) {
      let that = this;
      that.onRemove(file, null);
      that.imageUrl = "";
      // astec
      //   .showConfirmDialog('警告', '确认要删除文件吗?', '', '')
      //   .then(function () {
      //     that.onRemove(file, null)
      //   })
    },
    uploadBtn(event) {
      if (this.fileList.length >= this.fileLimit) {
        return false;
      }
    },

    //用于预览新上传的照片
    handlePreviewNew: function (file) {
      let that = this;
      if (that.AllfileList && that.AllfileList.length > 0 && file.name) {
        that.AllfileList.forEach(function (item) {
          if (item.name == file.name) {
            that.handlePreview(item.orgurl, item, name);
          }
        });
      }
    },
    //预览照片
    handlePreview: function (file) {
      if (this.isImgType(file.type)) {
        if (this.imgViewer == "YoPdfViewer") {
          this.handlePreviewPdf(file.orgurl, file.type, file.name);
        } else {
          this.dialogVisible = true;
          this.PriviewStartIndex = this.GetIndexByCache(file.id);
        }
      } else if (this.isCanPreviewPDFType(file.type)) {
        this.handlePreviewPdf(file.url, "application/pdf", file.name);
      }
    },
    //预览PDF
    handlePreviewPdf: function (url, mimeType = "application/pdf", title = "") {
      let that = this;
      if (that.pdfdialogVisible) {
        // console.log("已经打开了 先关闭 0.2后打开");
        that.pdfdialogVisible = false;
        that.pdfViewerSrc = "";
        setTimeout(() => {
          //不这么搞是不能重复打开的.by Z.C
          that.pdfdialogVisible = true;
          that.pdfViewerSrc = url;
          that.mimeType = mimeType;
          that.pdfViewerTitle = title;
        }, 200);
      } else {
        that.pdfdialogVisible = true;
        that.pdfViewerSrc = url;
        that.mimeType = mimeType;
        that.pdfViewerTitle = title;
      }
    },
    // 关闭图片预览
    closeViewer() {
      this.dialogVisible = false;
    },
    //关闭PDF预览
    closePdfViewer() {
      this.pdfdialogVisible = false;
      this.pdfViewerSrc = "";
    },
    handleId: function () {
      let that = this;
      // 回调IDs用
      let newIds = "";
      if (that.uploadType === 1) {
        newIds = that.singleFile.id;
      } else {
        that.AllfileList.forEach(function (file) {
          if (file.id) {
            newIds += file.id + ",";
          }
        });
        if (newIds.length > 0) {
          newIds = newIds.substring(0, newIds.length - 1);
        }
      }
      that.$emit("update:ids", newIds); // 双向绑定ids
      that.$emit("update:id", newIds);
    },
    // 下载
    handleDownLoad: function (url) {
      if (url.length > 0) {
        url = url.toLowerCase().replace("showimage", "download");
        this.$refs.download_a.href = url;
        this.$refs.download_a.click();
      }
    },
  },
  beforeDestroy() {
    sessionStorage.removeItem(this.StorageKey);
  },
};
</script>
<style>
.btn-height {
  height: 32px;
}
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #3b70c2;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 148px;
  height: 148px;
  line-height: 148px !important;
  text-align: center;
}

.avatar {
  width: 148px;
  height: 148px;
  /* display: block; */
}

.el-icon-document {
  height: auto !important;
}

.el-upload-act:hover {
  opacity: 0.7;
  -webkit-transition: opacity 0.3s;
  transition: opacity 0.3s;
}

.el-upload-act {
  position: absolute;
  width: 148px;
  height: 148px;
  line-height: 148px;
  left: 0;
  top: 0;
  cursor: default;
  text-align: center;
  color: #fff;
  opacity: 0;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.5);
}

.el-upload-act-preview {
  margin-right: 10px;
  cursor: pointer;
}

.el-upload-act-delete {
  cursor: pointer;
}

/*.el-progress{
      top: -136px;
    }*/
.yo-file-upload {
  display: flex;
}

.yo-file-upload .el-upload-list {
  width: calc(100% - 66px);
  margin-left: 10px;
  display: flex;
  flex-wrap: wrap;
}

.without-btn .yo-file-upload .el-upload-list {
  margin-left: 65px;
}

.yo-file-upload .el-upload-list > .el-upload-list__item {
  width: calc(50% - 5px);
  background-color: #f5f7fa;
  max-height: 25px;
  margin-left: 5px;
}

.yo-file-upload .el-upload-list > .el-upload-list__item:first-child {
  margin-top: 5px;
}

.yo-file-upload .el-button.is-disabled,
.yo-file-upload .el-button.is-disabled:hover,
.yo-file-upload .el-button.is-disabled:focus {
  background-color: #ababab;
  border-color: #ababab;
}
.u-btn-s {
  position: absolute;
  left: -9999;
  height: 0;
  width: 0;
  padding: 0;
  overflow: hidden;
}
</style>
