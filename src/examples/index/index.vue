<template>
  <div id="examples">
    <!--    <yo-img :ids.sync="formData.Files" :apiUrl="apiUrl" class="imgWidth"></yo-img>-->
    <!--       <yo-file-->
    <!--         :uploadType="3"-->
    <!--         :ids.sync="formData.Files"-->
    <!--         :apiUrl="apiUrl"-->
    <!--         :isShowTip="false"-->
    <!--         :fileLimit="1"-->
    <!--         :isMultiple="true"-->
    <!--         :allowAnonymous="true"-->
    <!--         :fileType="1"-->
    <!--         :fileList.sync="fileList"-->
    <!--         :fileListArr="fileListArr"-->
    <!--         :isShowFileList="true"-->
    <!--       ></yo-file>-->
    <!--       <el-button @click="cleanFileList">清除filelist</el-button>-->
       <yo-grid
         ref="yoGrid"
         :gridData="gridData"
         quicksearchPlaceholder="快速搜索项目名称"
         :requireData.sync="requireData"
         :showQuick="true"
         :isShowQuick="true"
         :showPagination="true"
         labelWidth="120px"
       >
         <yo-table border :header-cell-style="headerCellStyle" :tableData.sync="requireData"
                       :displayData="gridData.table" :isHaveFixed="true"></yo-table>
       </yo-grid>
    <!--    <el-row :gutter="40" v-for="item in fileList" :key="item.Id" class="margin-b-10">-->
    <!--      <el-col :span="4">-->
    <!--        <label-->
    <!--          style="margin: 0 5px;display:inline-block;font-size:14px;color:#666;"-->
    <!--        >{{ item.MaterialName }}</label>-->
    <!--      </el-col>-->
    <!--      <el-col :span="20">-->
    <!--        <yo-img :ids.sync="item.Files" :apiUrl="apiUrl" class="imgWidth"></yo-img>-->
    <!--      </el-col>-->
    <!--    </el-row>-->

    <!-- <yo-calendar :options="calendarArr"
                 class="calendar"
                 @handlePrevMonth="handlePrevMonth"
                 @handleNextMonth="handleNextMonth">
      <template slot="more">
        <span>查看更多</span>
      </template>
    </yo-calendar> -->
    <el-button @click="changetest">test</el-button>
  </div>
</template>
<script>
  import YoButton from "@/packages/YoButton/src/main.vue";
  import YoHeader from "@/packages/YoHeader/src/main.vue";
  import YoToolbar from "@/packages/YoToolBar/src/main.vue";
  import YoMenu from "@/packages/YoMenu/src/main.vue";
  import YoDetailCol from "@/packages/YoDetailCol/src/main.vue";
  import YoFile from "@/packages/YoFile/src/main.vue";
  import YoImg from "@/packages/YoImg/src/main.vue";
  import YoEnum from "@/packages/YoEnum/src/main.vue";
  import YoGrid from "@/packages/YoGrid/src/main.vue";
  import YoContent from "@/packages/YoContent/src/main.vue";
  import YoCity from "@/packages/YoCity/src/main.vue";
  import YoInput from "@/packages/YoControlsInput/src/main.vue";
  import YoDateWithBtn from "@/packages/YoDateWithBtn/src/main.vue";
  import YoDialogViewer from "@/packages/YoDialogViewer/src/main.vue";
  import YoTable from "@/packages/YoTable/src/main.vue";
  import YoTableNew from "@/packages/YoTableNew/src/main.vue";
  // import YoCalendar from '@/packages/YoCalendar/src/main.vue'

  export default {
    name: "examples",
    components: {
      YoHeader,
      YoDateWithBtn,
      YoButton,
      YoMenu,
      YoDetailCol,
      YoFile,
      YoImg,
      YoEnum,
      YoGrid,
      YoContent,
      YoToolbar,
      YoCity,
      YoInput,
      YoDialogViewer,
      YoTable,
      YoTableNew,
      // YoCalendar
    },
    data() {
      return {
        calendarArr: {
          biddArr: [
            {
              BeginDate: "2020-07-27",
              BiddingQueryModelList: [
                {
                  BeginDate: "2020-07-27 21:03:24",
                  BeginTime: "21:03",
                  Id: "17607",
                  Name: "FJWZ320101200002卖家1废旧物资2次"
                }
              ]
            },
            {
              BeginDate: "2020-07-23",
              BiddingQueryModelList: [
                {
                  BeginDate: "2020-07-27 21:03:24",
                  BeginTime: "11:03",
                  Id: "17607",
                  Name: "FJWZ320101200002卖家1废旧物资2次"
                },
                {
                  BeginDate: "2020-07-27 21:03:24",
                  BeginTime: "09:03",
                  Id: "17607",
                  Name: "FJWZ320101200002卖家1废旧物资2次"
                }
              ]
            }
          ],
          type: 'combination',
          headStyle: {
            todayBtn: 'right',
            combination: 'center',
            checkBtn: 'right',
          },
          viewStyle: {
            day: 'right'
          },
          calendarData: []
        },
        headerCellStyle: {
          color: 'red'
        },
        fileList: [],
        fileListArr: [],
        formData: {
          Files: 'k207ta59359000a441fd47n',
          Files2: '',
          Files3: ''
        },
        imgs: 'k203i92608u600a4416e0cp,k202pg03351c00a441288i0',
        apiUrl: process.env.AttachAPI,
        showDialogViewer: false,
        Files2: null,
        Files:
          "k2037d15529e01f4d1ef87l,k2037g5548pg0020123bc7v,k2039e1524pb0010d31dc05",
        type1: "primary",
        type2: "default",
        type3: "info",
        type4: "success",
        type5: "warning",
        type6: "danger",
        rowData: [
          [
            {
              title: "默认显示",
              value: "没有定义span 和是否显示的 默认是显示 默认列宽：span=8"
            },
            {
              title: "标题2",
              value: '默认 是 {title: "标题",value "内容"}'
            },
            {
              title: "标题3",
              value: "内容3"
            }
          ],
          [
            {
              title: "定制列宽=16",
              value:
                '需要加上 span字段 默认 是 {title: "标题",value "内容", span:"16"}',
              span: 16
            },
            {
              title: "标题4",
              value: "内容4",
              span: 8,
              isVisiable: false
            }
          ],
          [
            {
              title: "控制显示隐藏",
              value:
                '需要加上 isVisiable字段 默认 是 {title: "标题",value "内容", span:"16",isVisiable: true} 当不传该字段的时候是默认显示，true显示，false隐藏',
              span: 24,
              isVisiable: true
            }
          ]
        ],
        requireData: {
          Items: []
        },
        gridData: {
          // IsNeedSubjectType: true,
          params: {
            Name: null,
            start: null,
            end: null,
            PageSize: 10,
            PageIndex: 1
          },
          formLabel: [
            {
              value: "Name",
              name: "名称",
              type: "input",
              span: 8
            },
            {
              value: "start",
              name: "时间",
              type: "date",
              span: 8,
              format: "yyyy-MM-dd",
              pickerOptions: {
                disabledDate: this.pickerOptionsStart
              }
            },
            {
              value: "end",
              name: "时间",
              type: "date",
              span: 8,
              format: "yyyy-MM-dd",
              pickerOptions: {
                disabledDate: this.pickerOptionsEnd
              }
            }
          ],
          table: [
            {
              key: "Name",
              label: "名称",
              fixed: 'left',
              width: 100,
              align: "center",
              tooltip: false
            },
            {
              key: "HostUrl",
              label: "HostUrl",
              fixed: 'left',
              width: 200,
              align: "left",
              tooltip: true
            },
            {
              key: "ClientId",
              label: "ClientId",
              width: 200,
              align: "left",
              tooltip: true
            },
            {
              key: "CreateTime",
              label: "创建时间",
              align: "center",
              width: 100,
              tooltip: false
            },
            {
              key: "Counter",
              label: "jishu",
              align: "center",
              type: 'money',
              width: 100,
              tooltip: false
            }
          ],
          api: "/api/AnncApi/QueryPage",
          methods: "post"
        },
        reportData: [
          // 近三年的审计报告
          {
            key: 'Year',
            label: '年度',
            width: 150,
            align: 'center',
            tooltip: true
          },
          {
            key: 'AssetsTotal',
            label: '资产总额',
            width: 150,
            align: 'center',
            tooltip: true
          },
          {
            key: 'LiabilitiesTotal',
            label: '负债总额',
            width: 150,
            align: 'center',
            tooltip: true
          },
          {
            key: 'OwnersEquity',
            label: '所有者权益',
            width: 150,
            align: 'center',
            tooltip: true
          },
          {
            key: 'OperatingIncome',
            label: '营业收入',
            width: 150,
            align: 'center',
            tooltip: true
          },
          {
            key: 'ProfitBeforeTax',
            label: '利润总额',
            width: 150,
            align: 'center',
            tooltip: true
          },
          {
            key: 'NetProfit',
            label: '净利润',
            width: 150,
            align: 'center',
            tooltip: true
          },
          {
            key: 'AuditInstitution',
            label: '审计机构',
            width: 150,
            align: 'center',
            tooltip: true
          }
        ]
      };
    },
    watch: {
      
    'requireData.Items': function (params) {
      params.forEach(e => {
        e.Counter = '-1000'
      })
    },
      fileList: {
        handler: function (val) {
          // console.log(val)
        },
        deep: true
      }
    },
    mounted() {
      // this.getFindById()
      // this.fileListArr = [
      //   {
      //   id: 'k206gb5342dm00a440ac8zt',
      //   name: 'favicon.ico',
      //   orgurl: '',
      //   sign: '',
      //   size: '',
      //   status: '',
      //   timestamp: '',
      //   type: 'image/x-icon',
      //   uid: new Date().getTime(),
      //   url: ''
      // }
      // ]
    },
    methods: {
      changetest() {
        this.$set(this.calendarArr, 'biddArr', [])
      },
      handleClickDay() {
      },
      handlePrevMonth(data) {
        console.log(data)
      },
      handleNextMonth(data) {
        console.log(data)
      },
      cleanFileList() {
        this.fileListArr = []
      },
      getFindById() {
        this.$http.post('/api/Project/FindById?id=k206th0357pd001037df833').then(res => {
          if (res) {
            this.fileList = res.ProjectAttachModelList
          }
        })
      },
      pickerOptionsStart(date) {
        if (this.gridData.params.end === null) {
          return false
        } else {
          let year = 1000 * 60 * 60 * 24 * 365
          if (new Date(date).getTime() < new Date(this.gridData.params.end).getTime() - year) {
            return true
          } else {
            return false
          }
        }
      },
      pickerOptionsEnd(date) {
        if (this.gridData.params.start === null) {
          return false
        } else {
          let year = 1000 * 60 * 60 * 24 * 365
          if (new Date(date).getTime() > year + new Date(this.gridData.params.start).getTime()) {
            return true
          } else {
            return false
          }
        }
      },
      paginationCallBack(data) {
        console.log(data)
      },
      selectchange(val) {
        console.log(val);
      },
      closePdfViewer() {
        this.showDialogViewer = false;
      },
      showPdfViewer() {
        this.showDialogViewer = true;
      },
      handleYoEvent1(e) {
        console.log("zooming...")
        console.log(e);
      },
      handleYoEvent2(e) {
        console.log("moving...")
        console.log(e);
      },
      handleYoEvent3(e) {
        console.log("zoomed")
        console.log(e);
      },
      handleYoEvent4(e) {
        console.log("moved")
        console.log(e);
      }
    }
  };
</script>
<style scoped>
</style>
