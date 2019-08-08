<template>
  <div v-if="display" class="main">
    <div class="title">审核记录</div>
    <el-collapse v-model="activeName" @change="handleChange" accordion>
      <el-collapse-item v-for="item in RecordList" :key="item.Id" :name="item.Id">
        <template slot="title">
          <div class="title_div">
            <span class="title_name">{{item.Name}}</span>
            <span class="title_result">{{item.Result_V}}</span>
            <span class="title_time">
              <i class="header-icon el-icon-time"></i>
              {{item.CreateTime_V}}
            </span>
          </div>
        </template>
        <div>
          <el-row class="elrow" :gutter="40">
            <el-col :span="6">
              <div>
                <label style="margin: 0 5px;float: left;">审核人:</label>
                <div style="float: left;min-width: 70%;padding-left: 10px;height: 40px;">
                  <label>{{item.ApproverName}}</label>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row class="elrow" :gutter="40">
            <el-col :span="24">
              <div>
                <label style="margin: 0 5px;float: left;">审核意见:</label>
                <div style="float: left;min-width: 70%;padding-left: 10px;height: 40px;">
                  <label>{{item.Opinion}}</label>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script type="text/javascript">
export default {
  name: "AsiasApproveRecord",
  props: {
    entity: {
      type: String,
      required: true
    },

    entityid: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      activeName: "",
      RecordList: [] //审核记录
    };
  },
  methods: {
    getList: function() {
      let that = this;
      that.$http
        .post(
          "/api/ApproveLog/Record?Id=" +
            that.entityid +
            "&entity=" +
            that.entity
        )
        .then(res => {
          that.RecordList = res;
        })
        .catch(error => {
          console.error(error);
          astec.showErrorToast(error.message);
        });
    },
    handleChange(val) {
      console.log(val);
    }
  },
  watch: {
    RecordList: function(val) {
      //默认展开最后一个
      if (val != null && val.length > 0) {
        this.activeName = val[val.length - 1].Id;
      }
    }
  },
  computed: {
    display: function() {
      if (this.RecordList && this.RecordList.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.getList();
    });
  }
};
</script>
<style scoped>
.main {
  margin: 5px;
}
.title {
  margin: 5px;
  font-weight: bold;
}
.title_div {
  width: 100%;
  margin-left: 5px;
  margin-right: 5px;
}
.title_time {
  float: right;
}
.title_name {
  margin: 0 20px 0 3px;
}
.title_result {
  margin: 0 20px 0 3px;
}
</style>