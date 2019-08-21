<template>
  <div>
    <!-- <img v-for="file in fileList" :src="file.url" :key="file.id"  :title="file.name" @click="handlePreview(file.orgurl,file.name)"> -->
    <!-- 文件 -->
    <div v-if="fileList2.length > 0 ? true : false">
      <div v-for="file in fileList2" :key="file.id" @click="handleDownLoad(file.orgurl)" class="text item">
        <i class="el-icon-download marginright"></i>{{file.name}}
      </div>
    </div>
    <!-- 图片 -->
    <!-- <el-row :gutter="12">
      <el-col :span="4"  v-for="file in fileList" :key="file.id" >
          <img :src="file.url" width="200px" height="123px" style="margin-bottom:10px;" :title="file.name" @click="handlePreview(file.orgurl,file.name)" alt="暂无图片">
      </el-col>
    </el-row> -->
    <div class="flexpic">
      <div v-for="file in fileList" :key="file.id" style="margin-right:3px;" >
        <!-- <img    alt="暂无图片"> -->
        <el-image :src="file.url" width="200px" height="123px" style="margin-bottom:10px;border:1px solid #ccc;" :title="file.name" @click="handlePreview(file.orgurl,file.name)"></el-image>
      </div>
    </div>
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
  name: 'YoImg',
  props: {
    ids: {
      type: String,
      required: false,
      default: null
    },
    apiUrl: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      dialogImageUrl: '', // 预览图片地址
      dialogVisible: false, // 显示预览
      dialogTitle: '', // 预览标题
      fileList: [], // 附件列表(本次上传的)
      fileList2: []
    }
  },
  created: function () {
    this.loadData(this.ids)
  },
  mounted: function () {},
  watch: {
    ids: function (val) {
      console.log('watch ids:' + val)
      // 变化后 持续加载附件
      this.loadData(this.ids)
    }
  },

  methods: {
    fileListContainId: function (id) {
      // 判断指定ID是否在fileList里面
      var that = this
      for (var i = 0; i < that.fileList.length; i++) {
        if (that.fileList[i].id === id) {
          return true
        }
      }
      return false
    },
    loadData: function (ids) {
      var that = this
      if (ids == null || ids === undefined || ids.length === 0) {
        // console.log(ids)
        that.fileList = []
        return false
      }
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
      }
      var newIds = loadId.join(',')
      console.log('loadData:' + newIds)
      var param = {}
      param['ids'] = newIds
      that.$http
        .post('/api/Attach/GetAttachs', param)
        .then(resp => {
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
              that.apiUrl +
                '/api/Attach/ShowImage?id=' +
                file.id +
                '&sign=' +
                file.sign +
                '&timestamp=' +
                file.timestamp
              item.url =
              //  process.env.API +
              that.apiUrl +
                '/api/Attach/ShowThumbImage?id=' +
                file.id +
                '&sign=' +
                file.sign +
                '&timestamp=' +
                file.timestamp
              that.fileList.push(item)
            } else {
              // 非图片
              item.orgurl =
              //  process.env.API +
              that.apiUrl +
                '/api/Attach/Download?id=' +
                file.id +
                '&sign=' +
                file.sign +
                '&timestamp=' +
                file.timestamp
              item.url = item.orgurl
              that.fileList2.push(item)
            }

            // that.fileList.push(item);
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
<style scope>
.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 5px;
    padding: 12px 0px 12px 5px;
  }
  .item:hover {
    cursor: pointer;
    background-color: #365FA4;
    color: #fff;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    /* width: 480px; */
  }
  .marginright {
    margin-right: 5px;
  }
  .flexpic {
    display: flex;
  }
</style>
