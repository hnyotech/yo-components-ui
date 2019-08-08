<template>
  <div class="tinymce-editor">
    <textarea :id="id"></textarea>
  </div>
</template>
<script>
import tinymce from "../../../static/tinymce/tinymce";
import "../../../static/tinymce/themes/silver/theme";
// import "../../../static/tinymce/skins/content/default/content.css";
//插件
import "../../../static/tinymce/plugins/advlist";
import "../../../static/tinymce/plugins/autolink";
import "../../../static/tinymce/plugins/lists";
import "../../../static/tinymce/plugins/link";
import "../../../static/tinymce/plugins/image";
import "../../../static/tinymce/plugins/charmap";
import "../../../static/tinymce/plugins/print";
import "../../../static/tinymce/plugins/preview";
import "../../../static/tinymce/plugins/anchor";
import "../../../static/tinymce/plugins/searchreplace";
import "../../../static/tinymce/plugins/visualblocks";
import "../../../static/tinymce/plugins/code";
import "../../../static/tinymce/plugins/fullscreen";
import "../../../static/tinymce/plugins/insertdatetime";
import "../../../static/tinymce/plugins/media";
import "../../../static/tinymce/plugins/table";
import "../../../static/tinymce/plugins/paste"; //
import "../../../static/tinymce/plugins/imagetools";
import "../../../static/tinymce/plugins/wordcount";
import "../../../static/tinymce/plugins/textcolor";
// import "../../../static/tinymce/plugins/contextmenu";
// import "../../../static/tinymce/plugins/colorpicker";
// import "../../../static/tinymce/plugins/textcolor";

export default {
  name: "AsiasEditor",
  props: {
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: ""
    },
    height: {
      type: Number,
      default: 250
    },
    readonly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },

    plugins: {
      type: [String, Array],
      default:
        "advlist autolink lists link image charmap print preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste imagetools wordcount"
    },
    toolbar: {
      type: [String, Array],
      default:
        "print preview code| undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image |removeformat|fontselect forecolor fontsizeselect backcolor|" 
    },
    menubar: {
      type: [String, Boolean],
      default: "file edit insert view format table tools"
    },
    setting: {}
  },
  watch: {
    value(newValue) {
      if (newValue == null) {
        //避免null值报错
        return;
      }
      console.log("watch value " + this.id);
      var editor = tinymce.get(this.id);
      var content = editor.getContent();
      if (content != newValue) {
        editor.setContent(newValue);
      }
    }
  },
  data: function () {
    return {
      id: "editor-" + this.uuid(16)//new Date().getTime()
    };
  },
  computed: {
    toolBar: function () {
      if (this.readonly) {
        return "print | preview";
      } else {
        return this.toolbar;
      }
    },
    Plugins: function () {
      return this.plugins;
    },
    menuBar: function () {
      if (this.readonly) {
        return false;
      } else {
        return this.menubar;
      }
    },
    tableToolar: function () {
      if (this.readonly) {
        return false;
      } else {
        return "tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol";
      }
    },
    readOnly: function () {
      if (this.readonly) {
        return 1;
      } else {
        return 0;
      }
    },
    menuList: function () {
      if (this.readonly) {
        return {
          file: { title: "File", items: "newdocument | print" },
          edit: {
            title: "Edit",
            items: "undo redo | cut copy paste pastetext | selectall"
          },
          insert: { title: "Insert", items: "link media | template hr" },
          view: { title: "View", items: "visualaid" },
          format: {
            title: "Format",
            items:
              "bold italic underline strikethrough superscript subscript | formats | removeformat"
          },
          table: {
            title: "Table",
            items: "inserttable tableprops deletetable | cell row column"
          },
          tools: { title: "Tools", items: "spellchecker code" }
        };
      } else {
        return {
          file: { title: "File", items: "newdocument  | print" },
          edit: {
            title: "Edit",
            items: "undo redo | cut copy paste pastetext | selectall"
          },
          insert: { title: "Insert", items: "link media | template hr" },
          view: { title: "View", items: "visualaid" },
          format: {
            title: "Format",
            items:
              "bold italic underline strikethrough superscript subscript | formats | removeformat"
          },
          table: {
            title: "Table",
            items: "inserttable tableprops deletetable | cell row column"
          },
          tools: { title: "Tools", items: "spellchecker code" }
        };
      }
    }
  },
  methods: {
    uuid: function (len) {
      if (len == undefined) {
        len = 32;
      }
      var s = [];
      var hexDigits = "0123456789abcdef";
      for (var i = 0; i < len; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      var uuid = s.join("");
      return uuid;
    },
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    //可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.value = "";
    },
    //上传文件
    uploadFile: function (file, success) {
      //   debugger;
      let that = this;
      let form = new FormData();
      form.append("file", file);
      form.append("allowanonymous", true);
      let actionUrl = "/api/Attach/SaveAttach"; //上传附件接口地址
      that
        .$http({
          url: actionUrl,
          method: "post",
          data: form,
          onUploadProgress: function (progressEvent) {
            //原生上传进度事件
            if (progressEvent.lengthComputable) {
              //  this.progress = complete
              var complete =
                (((progressEvent.loaded / progressEvent.total) * 100) | 0) +
                "%";
              console.log("onUploadProgress:" + complete); //上传进度
            }
          }
        })
        .then(response => {
          //  debugger;
          console.log("upload success:" + response.id);
          var item = new Object();
          item.id = response.id;
          item.sign = response.sign;
          item.timestamp = response.timestamp;
          item.name = response.name;
          item.size = response.size;
          item.type = response.type;
          if (that.isImgType(item.type)) {
            item.orgurl =
             process.env.API +
              "/api/Attach/ShowImage?id=" +
              response.id +
              "&sign=" +
              response.sign +
              "&timestamp=" +
              response.timestamp;
            item.url =
             process.env.API +
              "/api/Attach/ShowThumbImage?id=" +
              response.id +
              "&sign=" +
              response.sign +
              "&timestamp=" +
              response.timestamp;
          } else {
            //非图片
            item.orgurl =
             process.env.API +
              "/api/Attach/Download?id=" +
              response.id +
              "&sign=" +
              response.sign +
              "&timestamp=" +
              response.timestamp;
            item.url = item.orgurl;
          }
          //成功回调
          success(item.orgurl);
        })
        .catch(error => {
          console.error(error);
          astec.showErrorToast(error.message);
        });
    },
    //判断是否图片
    isImgType: function (filetype) {
      var ctypeArr = [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/tiff",
        "image/x-icon",
        "application/x-bmp"
      ];
      if (ctypeArr.indexOf(filetype) >= 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted: function () {
    const that = this;
    const setting = {
      selector: "#" + that.id,
      language_url: "static/tinymce/langs/zh_CN.js",
      language: "zh_CN",
      skin_url: "static/tinymce/skins/ui/oxide",
      plugins: this.Plugins,
      toolbar: this.toolBar,
      //   menu: this.menuList,
      branding: false,
      menubar: this.menuBar,
      height: this.height,
      readonly: this.disabled,
      table_toolbar: this.tableToolar,
      init_instance_callback: function (editor) {
        console.log("editor init_instance:" + that.id);
        if (that.readonly) {
          console.log("设置为只读模式:" + that.id);
          editor.getBody().setAttribute("contenteditable", false);
        }
      },
      images_upload_handler: (blobInfo, success, failure) => {
        // debugger;
        console.log("images_upload_handler....");
        var file = blobInfo.blob();
        if (!(file instanceof File)) {
          //不是文件类型,且是Blob,转换成File对象
          //   debugger;
          file = new window.File([file], blobInfo.filename(), {
            type: file.type
          });
        }
        that.uploadFile(file, success);
        // const img = "data:image/jpeg;base64," + blobInfo.base64();
        // success(img);
      },
      setup: function (editor) {
        editor.on("click", function (e) {
          //   console.log("Editor was clicked");
          that.onClick(editor);
        });
        editor.on("input change undo redo", () => {
          //    console.log("Editor event!!");
          var content = editor.getContent();
          that.$emit("update:value", content);
        });
      }
    };
    Object.assign(setting, that.setting);
    tinymce.init(setting);
  },
  beforeDestroy: function () {
    tinymce.get(this.id).destroy();
  }
};
</script>
<style>
  .tox .tox-dialog--width-lg{
    min-height: 640px;
    height: auto !important;
  }
</style>

