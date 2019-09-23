<template>
  <div>
    <div v-show="imageUrl.length>0&&uploadType==1"
         style="position: relative;margin-top: 5px;margin-bottom: 5px;">
      <img :src="imageUrl" class="avatar">
      <span class="el-upload-act">
        <span class="el-upload-act-preview">
          <i class="el-icon-zoom-in" @click.stop="handlePreview(imageUrl,dialogTitle)"></i>
        </span>
        <span class="el-upload-act-delete">
          <i class="el-icon-delete" @click.stop="handleRemove(singleFile)"></i>
        </span>
      </span>
    </div>
    <el-upload ref="upload"
               v-show="IsShow"
               class="avatar-uploader"
               :with-credentials="true"
               :action="action"
               :multiple="false"
               :limit="FileLimit"
               :FileAccept="FileAccept"
               :auto-upload="autoupload"
               :show-file-list="true"
               :list-type="ListType"
               :data="ExData"
               :file-list="fileList"
               :on-exceed="onExceed"
               :before-remove="beforeRemove"
               :before-upload="beforeUpload"
               :on-change="onChange"
               :on-remove="onRemove"
               :on-preview="onPreview"
               :http-request="httpRequest">
      <!--<template v-if="uploadType==1">
        <i class="el-icon-plus avatar-uploader-icon"></i>
      </template>-->
      <template v-if="uploadType==2 || uploadType==1">
        <i class="el-icon-plus avatar-uploader-icon"></i>
        <!-- <el-button size="small" type="primary">选择</el-button> -->
        <el-progress type="circle" :percentage="25"></el-progress>
      </template>
      <template v-else>
        <el-button size="small" type="primary">选择</el-button>
      </template>
      <div v-if="IsShowTip" slot="tip" class="el-upload__tip">{{Tip}}</div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle" top="20px">
      <!-- 预览弹出 -->
      <img width="100%" :src="dialogImageUrl" alt>
      <span slot="footer" class="dialog-footer">
        <a href ref="download_a" target="_blank" v-show="false"></a>
        <el-button type="text" @click="handleDownLoad(dialogImageUrl)">下载原图</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'YoFile',
  props: {
    ids: {
      type: String,
      required: false,
      default: null
    },
    id: {
      type: String,
      required: false,
      default: null
    },
    // 控件类型:1 img,2 imageList 3 files
    uploadType: {
      type: Number,
      required: false,
      default: 1
    },
    // 文件最大上传个数限制 0不限
    fileLimit: {
      type: Number,
      required: false,
      default: 0
    },
    // 文件大小B, 0不限
    fileSize: {
      type: Number,
      required: false,
      default: 104857600
    },
    // 文件后缀
    fileExtension: {
      type: String,
      required: false,
      default: ''
    },
    // 支持多选文件
    isMultiple: {
      type: Boolean,
      required: false,
      default: false
    },
    // 是否显示 tip
    isShowTip: {
      type: Boolean,
      required: false,
      default: true
    },
    // 附加信息
    exData: {
      type: Object,
      required: false,
      default: null
    },
    // 匿名附件
    allowAnonymous: {
      type: Boolean,
      required: false,
      default: false
    },
    apiUrl: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      // action:process.env.API + "/api/Attach/SaveAttach", //上传附件接口地址
      action: this.apiUrl + '/api/Attach/SaveAttach', // 上传附件接口地址
      autoupload: true, // 自动上传
      imageUrl: '', // uploadType=1时候 显示图片  //"http://wx3.sinaimg.cn/large/006nLajtly1fpi9ikmj1kj30dw0dwwfq.jpg"
      fileList: [], // 附件列表(本次上传的)
      fileListOrg: [], // 原始附件列表-默认带着的
      dialogImageUrl: '', // 预览图片地址
      dialogVisible: false, // 显示预览
      dialogTitle: '', // 预览标题
      showFileList: [], // 需要提交的文件列表
      delInd: '', // 待删除的文件索引
      singleFile: '', // 单个文件
    }
  },
  created: function () {
    // console.log("created:" + this.ids);
    this.loadData(this.ids)
  },
  mounted: function () {

  },
  watch: {
    ids: function (val) {
      console.log('watch ids:' + val)
      // 变化后 持续加载附件
      this.loadData(this.ids)
    },
    showFileList: function (newVal, fromVal) {
      // console.log(newVal)
      // TODO:
    }
  },
  // 计算属性
  computed: {
    AllfileList: function () {
      // 所有附件
      //    debugger;
      var allList = []
      if (this.fileListOrg != null && this.fileListOrg.length > 0) {
        allList = allList.concat(this.fileListOrg)
      }
      if (this.showFileList != null && this.showFileList.length > 0) {
        allList = allList.concat(this.showFileList)
      }

      return allList
    },
    IsShow: function () {
      if (this.uploadType === 1 && this.imageUrl.length > 0) {
        return false
      } else {
        return true
      }
    },
    ExData: function () {
      // 附加信息
      var param = {}
      param.test = 'admin'
      if (this.exData != null) {
        Object.assign(param, this.exData)
      }
      return param
    },
    // 文件列表的显示类型
    ListType: function () {
      if (this.uploadType === 1) {
        return 'picture-card'
      } else if (this.uploadType === 2) {
        return 'picture-card'
      } else {
        return 'text'
      }
    },
    // 显示文件列表:单图片时候不显示
    IsShowFileList: function () {
      if (this.uploadType === 1) {
        return false
      } else {
        return true
      }
    },
    // 允许的文件类型
    FileAccept: function () {
      var acceptstr = ''
      if (this.fileExtension.length > 0) {
        acceptstr = this.fileExtension
      } else {
        // 未单独指定的 根据uploadType自定义
        if (this.uploadType === 1 || this.uploadType === 2) {
          // 图片的
          acceptstr = '.jpg,.jpeg,.png,.ico'
        }
      }
      return acceptstr
    },
    // 显示的 提示语
    Tip: function () {
      var tipStr = ''
      if (this.FileAccept.length > 0) {
        tipStr += '只能上传 ' + this.FileAccept + ' 类型的文件,'
      }
      if (this.FileLimit > 0) {
        tipStr += '允许上传最多' + this.FileLimit + '个文件,'
      }
      if (this.fileSize > 0) {
        //   debugger;
        var sizeStr = this.fileSize + 'B,'
        if (this.fileSize < 1024) {
        } else if (this.fileSize < 1024 * 1024) {
          sizeStr = Math.round(this.fileSize / 1024, 2) + 'KB,'
        } else {
          // M
          sizeStr = Math.round(this.fileSize / 1024 / 1024, 2) + 'MB,'
        }
        tipStr += '单个文件不能超过' + sizeStr
      }
      if (tipStr.length > 0) {
        tipStr = tipStr.substring(0, tipStr.length - 1)
      }
      return tipStr
    },
    // 是否显示提示
    IsShowTip: function () {
      // debugger;
      return this.isShowTip && this.Tip.length > 0
    },
    // 是否允许多选
    IsMultiple: function () {
      if (this.uploadType === 1) {
        return false
      } else {
        return this.isMultiple
      }
    },
    // 文件上传数量
    FileLimit: function () {
      if (this.uploadType === 1) {
        return 1
      } else {
        return this.fileLimit
      }
    }
  },
  methods: {
    fileListContainId: function (id) {
      // 判断指定ID是否在fileList里面
      var that = this
      for (var i = 0; i < that.showFileList.length; i++) {
        if (that.showFileList[i].id === id) {
          return true
        }
      }
      return false
    },
    loadData: function (ids) {
      var that = this
      if (ids == null || ids === undefined || ids.length === 0) {
        that.showFileList = []
        that.fileList = []
        that.fileListOrg = []
        that.imageUrl = ''
        that.singleFile = {}
        return false
      }
      //   debugger;
      var idArr = ids.split(',')
      var loadId = []
      // 先判断id 是否加载过了
      idArr.forEach(function (id) {
        if (!that.fileListContainId(id)) {
          loadId.push(id)
        }
      })
      if (loadId.length === 0) {
        return false
      };
      var newIds = loadId.join(',')
      // console.log(process.env.API);
      // console.log(this.apiUrl)

      var param = {}
      param['ids'] = newIds
      that.$http.post(that.apiUrl + '/api/Attach/GetAttachs', param).then(resp => {
        resp.forEach(function (file) {
          var item = {}
          item.id = file.id
          item.sign = file.sign
          item.timestamp = file.timestamp
          item.name = file.name
          item.size = file.size
          item.type = file.type
          if (that.isImgType(item.type)) {
            item.orgurl =
              //  process.env.API +
                that.apiUrl + '/api/Attach/ShowImage?id=' +
                file.id +
                '&sign=' +
                file.sign +
                '&timestamp=' +
                file.timestamp
            item.url =
              //  process.env.API +
                that.apiUrl + '/api/Attach/ShowThumbImage?id=' +
                file.id +
                '&sign=' +
                file.sign +
                '&timestamp=' +
                file.timestamp
          } else {
            // 非图片
            item.orgurl =
              //  process.env.API +
                that.apiUrl + '/api/Attach/Download?id=' +
                file.id +
                '&sign=' +
                file.sign +
                '&timestamp=' +
                file.timestamp
            item.url = item.orgurl
          }
          if (that.uploadType === 1) {
            that.singleFile = item
          } else {
            that.fileList.push(item)
            that.showFileList.push(item)
          }
          that.handleId()
        })
      })
        .catch(err => {
          console.error(err)
          astec.showErrorToast(err.Message)
        })
    },
    // 判断是否图片
    isImgType: function (filetype) {
      var ctypeArr = [
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/tiff',
        'image/x-icon',
        'application/x-bmp'
      ]
      if (ctypeArr.indexOf(filetype) >= 0) {
        return true
      } else {
        return false
      }
    },
    onPreview: function (file) {
      // 点击文件列表中已上传的文件时的钩子
      console.log('onPreview.')
      console.log(file)
      if (this.isImgType(file.type)) {
        this.handlePreview(file.url, file.name)
      } else {
        // 直接触发下载
        this.handleDownLoad(file.url)
      }
    },
    onRemove: function (file, fileList) {
      // 文件列表移除文件时的钩子
      var that = this
      var delFile = this.delInd !== '' ? that.showFileList[this.delInd] : file
      if (this.delInd === 0) {
        delFile = that.showFileList[0]
      };
      //   debugger;
      // 从服务器端删除
      that.$http
        .post(
         that.apiUrl +
          '/api/Attach/Delete?id=' +
            delFile.id +
            '&sign=' +
            delFile.sign +
            '&timestamp=' +
            delFile.timestamp
        )
        .then(resp => {
          console.log('remove file ' + delFile.id)
          // 移除列表
          that.showFileList = that.showFileList.filter(t => t.id !== delFile.id)
          that.handleId()
        })
        .catch(err => {
          astec.showErrorToast(err.Message)
        })
    },
    onChange: function (file, fileList) {
      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    },
    beforeUpload: function (file) {
      // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      console.log('beforeUpload..')
    },
    beforeRemove: function (file, fileList) {
      // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止上传。
      if (file.id) {
        this.delInd = ''
      } else {
        for (let i = 0; fileList.length; i++) {
          if (file.name === fileList[i].name) {
            this.delInd = i
            return
          };
        };
      }

      return astec.showConfirmDialog('警告', '确认要删除文件吗?', '', '')
    },
    onExceed: function (files, fileList) {
      // 文件超出个数限制时的钩子
      console.log('onExceed..')
      if (this.uploadType === 1) {
        return true
      } else {
        astec.showErrorToast('文件超出个数限制!')
        return false
      }
    },
    httpRequest: function (param) {
      var that = this
      // 自定义上传 ,否则无法获取当前用户--暂时先不用,因为无法获取正确的状态
      //  debugger;
      //  return;
      var form = new FormData()
      form.append('file', param.file)
      form.append('exData', param.file.uid)
      if (that.allowAnonymous) {
        // 匿名附件
        form.append('allowanonymous', true)
      }
      if (param.data) {
        // TODO:附加信息
      }
      //   that.$refs.upload.clearFiles();//
      that.$http.post(param.action, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          let percent = (progressEvent.loaded / progressEvent.total * 100) | 0
          // 调用onProgress方法来显示进度条，需要传递个对象 percent为进度值
          param.onProgress({percent: percent})
        }
      }).then((response) => {
        //  debugger;
        console.log('upload success:' + response.id)
        var item = {}
        item.id = response.id
        item.sign = response.sign
        item.timestamp = response.timestamp
        item.name = response.name
        item.size = response.size
        item.type = response.type
        if (that.isImgType(item.type)) {
          item.orgurl =
            //  process.env.API
              this.apiUrl + '/api/Attach/ShowImage?id=' +
              response.id +
              '&sign=' +
              response.sign +
              '&timestamp=' +
              response.timestamp
          item.url =
            //  process.env.API
              this.apiUrl + '/api/Attach/ShowThumbImage?id=' +
              response.id +
              '&sign=' +
              response.sign +
              '&timestamp=' +
              response.timestamp
        } else {
          // 非图片
          item.orgurl =
            //  process.env.API
              this.apiUrl + '/api/Attach/Download?id=' +
              response.id +
              '&sign=' +
              response.sign +
              '&timestamp=' +
              response.timestamp
          item.url = item.orgurl
        }
        that.showFileList.push(item)
        that.handleId()
        that.$emit('callback', that.AllfileList) // 触发回调
        // 上传成功 调用onSuccess方法，否则没有完成图标
        // 处理自己的逻辑
        param.onSuccess()
        // 显示
        if (that.uploadType === 1) {
          that.singleFile = item
          that.imageUrl = item.orgurl
          that.dialogTitle = item.name
        }
      }).catch(() => {
        // 上传失败 调用onError方法
        // 处理自己的逻辑
        param.onError()
      })
    },
    handleRemove: function (file) {
      console.log(file)
      var that = this
      astec
        .showConfirmDialog('警告', '确认要删除文件吗?', '', '')
        .then(function () {
          //  console.log("handleRemove");
          that.onRemove(file, null)
          that.imageUrl = ''
        })
    },
    handlePreview: function (url, name) {
      console.log('handlePreview:' + url)
      this.dialogImageUrl = url
      this.dialogVisible = true
      if (name) {
        this.dialogTitle = name
      } else {
        this.dialogTitle = ''
      }
    },
    handleId: function () {
      var that = this
      // 回调IDs用
      var newIds = ''
      that.AllfileList.forEach(function (file) {
        if (file.id) {
          newIds += file.id + ','
        }
      })
      if (newIds.length > 0) {
        newIds = newIds.substring(0, newIds.length - 1)
      }
      that.$emit('update:ids', newIds) // 双向绑定ids
      that.$emit('update:id', newIds)
    },
    // 下载
    handleDownLoad: function (url) {
      if (url.length > 0) {
        url = url.toLowerCase().replace('showimage', 'download')
        this.$refs.download_a.href = url
        this.$refs.download_a.click()
      }
    }
  }
}
</script>
<style>
    .avatar-uploader .el-upload {
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

      .avatar-uploader .el-upload:hover {
        border-color: #3B70C2;
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
</style>
