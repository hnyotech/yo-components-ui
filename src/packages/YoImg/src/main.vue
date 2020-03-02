<template>
  <div class="preImg">
    <!-- <img v-for="file in fileList" :src="file.url" :key="file.id"  :title="file.name" @click="handlePreview(file.orgurl,file.name)"> -->
    <!-- 文件 -->
    <div v-if="fileList2.length > 0 ? true : false">
      <div v-for="file in fileList2" :key="file.id" @click="handleDownLoad(file.orgurl)" class="text file-item-img">
        <i class="el-icon-download marginright"></i>{{file.name}}
      </div>
    </div>
    <div v-if="fileList2.length === 0 && fileList.length === 0">
      <div class="text file-item-img nofile">
        <i class="el-icon-warning marginright"></i>暂无文件
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
        <el-image :src="file.url" width="200px" height="123px" style="margin-bottom:10px;border:1px solid #DDDDDD;" :title="file.name" @click="handlePreview(file)">
          <div slot="error" class="image-slot">
            <div class="errorInfo">无法加载图片</div>
          </div>
        </el-image>
      </div>
    </div>
    <yo-img-viewer
      v-if="dialogVisible"
      :on-close="closeViewer"
      :url-list="GetSrcListByCache()"
      :initialIndex="PriviewStartIndex"
      :titles="dialogTitle"
    ></yo-img-viewer>
    <a href ref="download_a" target="_blank" v-show="false"></a>
  </div>
</template>
<script type="text/javascript">
import { Base64 } from "js-base64";
import YoImgViewer from './YoImageViewer'
export default {
  name: 'YoImg',
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
      default: process.env.API
    },
    isPreviw: {
      type: Boolean,
      required: false,
      default: true
    },
    fit: {
      validator: function(value) {
        // 这个值必须匹配下列字符串中的一个
        return (
          ["fill", "contain", "cover", "none", "scale-down"].indexOf(value) !==
          -1
        );
      },
      default: "scale-down"
    }
  },
  components: {YoImgViewer},
  data: function () {
    return {
      dialogVisible: false, // 显示预览
      dialogTitle: '', // 预览标题
      fileList: [], // 附件列表(本次上传的)
      fileList2: [],
      PriviewStartIndex: 0, //預覽index
      StorageKey: "_ImgViewSrcCache"
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
    // 关闭查看器
    closeViewer() {
      this.dialogVisible = false;
    },
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
        .post(that.apiUrl + '/api/Attach/GetAttachs', param)
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
              that.AddSrcCache(item); //添加到預覽緩存
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
    
    //添加到預覽緩存組中
    AddSrcCache: function(item) {
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
      obj[id] = { src: src, title: item.name };
      cacheData[that.group] = obj;
      sessionStorage.setItem(that.StorageKey, JSON.stringify(cacheData));
    },
    
    //獲取地址所在index
    GetIndexByCache: function(id) {
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
    GetSrcListByCache: function() {
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
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/tiff',
        'image/x-icon',
        'application/x-bmp',
        'application/octet-stream'
      ]
      if (ctypeArr.indexOf(filetype) >= 0) {
        return true
      } else {
        return false
      }
    },

    handlePreview: function (file) {
      if(!this.isPreviw){
        return
      }
       this.dialogVisible = true;
      this.PriviewStartIndex = this.GetIndexByCache(file.id);
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
      if(!this.isPreviw){
        return
      }
      if (url.length > 0) {
        url = url.toLowerCase().replace('showimage', 'download')
        this.$refs.download_a.href = url
        this.$refs.download_a.click()
      }
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem(this.StorageKey)
  }
}
</script>
<style scope>
.text {
    font-size: 14px;
  }

  .file-item-img {
    display: inline-block;
    margin-bottom: 5px;
    margin-right: 10px;
    padding: 12px 10px;
    background-color: #eee;
  }
  .file-item-img:hover {
    cursor: pointer;
    background-color: #365FA4;
    color: #fff;
  }
  .nofile {
    background-color: #eee;
    color: #999;
  }
  .nofile:hover {
    cursor:not-allowed;
    background-color: #eee;
    color: #999;
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
  .preImg .flexpic .image-slot {
    width: 220px;
    height: 180px;
    /* background-color: #EEEEEE; */
    background: #EEEEEE url("./noImg.png") no-repeat 50% 40%;
    padding-top: 100px;
    box-sizing: border-box
  }
  .errorInfo {
    text-align: center;
    padding-top: 40px;
    color: #AAAAAA;
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
