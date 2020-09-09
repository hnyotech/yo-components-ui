<template>
  <div class="cc-calendar">
    <calendarHeader
      :headOptions="headOptions"
      @handlePrevMonth='handlePrevMonth'
      @handleNextMonth='handleNextMonth'
      @handleToday='handleToday'
    />
    <ul class="calendar-week clear">
      <li v-for="(item, index) in calendarTitleArr" :key="index" class="week-item">{{item}}</li>
    </ul>
    <ul class="calendar-view clear">
      <li v-for="(item, index) in visibleCalendar"
          :key="index"
          class="date-view"
          :class="[
          {'month-class': !isCurrentMonth(item.date)},
          {todayBg: isCurrentDay(item.date)},
          {handleDay: item.clickDay}
        ]"
      >
        <!--          @click="handleClickDay(item)"-->
        <span class="date-day"
              :style="dayStyle"
              :class="[{'opacity-class': !isCurrentMonth(item.date)}]"
        >
          {{item.day}}
        </span>
        <div v-if="isCurrentMonth(item.date) && biddArr(item)" class="bidd-content">
          <span v-for="(bidd,index) in biddArr(item)" :key="'bidd'+index">{{bidd.BeginTime}}</span>
        </div>
        <div v-if="isCurrentMonth(item.date) && biddArr(item)"
             :class="(new Date(item.date).getDay() === 0 ? 7 : new Date(item.date).getDay())>3?'bidd-box left':'bidd-box right'">
          <div class="bidd-info" v-for="(bidd2,index) in biddArr(item)" :key="'bidd2'+index">
            <div class="bidd-time">
              <span class="dot"></span>
              <span>{{bidd2.BeginTime}}</span>
            </div>
            <div class="bidd-name">
              <span class="bidd">竞价会：</span>
              <span class="bidd-word">{{bidd2.Name}}</span>
            </div>
          </div>
          <span
            :class="(new Date(item.date).getDay() === 0 ? 7 : new Date(item.date).getDay())>3?'sanjiao right':'sanjiao left'"></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import '../../../assets/css/reset.min.css'
  import calendarHeader from './canlendar-head.vue';
  import * as utils from '../../../assets/js/utils.js';

  export default {
    name: 'YoCalendar',
    componentName: 'YoCalendar',
    props: {
      options: Object
    },
    watch: {
      options: {
        handler(newval) {
          this.options = newval
          this.$set(this.headOptions, 'biddArr', newval.biddArr)
        },
        deep: true,
        immediate: true
      }
    },
    components: {
      calendarHeader
    },
    data() {
      let {year, month, day} = utils.getNewDate(new Date());
      return {
        headOptions: {
          type: this.options.type,
          style: this.options.headStyle,
          date: '',
          biddArr: this.options.biddArr
        },
        calendarTitleArr: [
          '一',
          '二',
          '三',
          '四',
          '五',
          '六',
          '日'
        ],
        time: {year, month, day},
        calendarList: []
      }
    },
    computed: {
      dayStyle: function () {
        return {
          textAlign: this.options.viewStyle.day,
        }
      },
      visibleCalendar() {
        let calendatArr = [];
        let {year, month} = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1));
        let currentFirstDay = utils.getDate(year, month, 1);
        // 获取当前月第一天星期几
        let weekDay = currentFirstDay.getDay() === 0 ? 7 : currentFirstDay.getDay();
        let startTime = currentFirstDay - (weekDay - 1) * 24 * 60 * 60 * 1000;

        let monthDayNum = 42;

        for (let i = 0; i < monthDayNum; i++) {
          let day = new Date(startTime + i * 24 * 60 * 60 * 1000).getDate();
          day = day < 10 ? '0' + day : day;
          calendatArr.push({
            date: new Date(startTime + i * 24 * 60 * 60 * 1000),
            year: year,
            month: month + 1,
            day: day,
            clickDay: false,
          })
        }

        this.headOptions.date = `${utils.englishMonth(month)} ${year}`;
        return calendatArr
      }
    },
    methods: {
      biddArr(item) {
        if (this.isCurrentMonth(item.date)) {
          let same = 1
          let arr = []
          for (let a in this.headOptions.biddArr) {
            let BeginDate = this.headOptions.biddArr[a].BeginDate
            if (BeginDate.split('-')[2] === (item.day + '') && this.isCurrentMonth(new Date(BeginDate))) {
              same = same + 1
              if (this.headOptions.biddArr[a].BiddingQueryModelList.length <= 2) {
                arr = this.headOptions.biddArr[a].BiddingQueryModelList
              } else {
                arr = [this.headOptions.biddArr[a].BiddingQueryModelList[0], this.headOptions.biddArr[a].BiddingQueryModelList[1]]
              }
            }
          }
          if (same > 1) {
            return arr
          } else {
            return false
          }
        } else {
          return false
        }
      },
      // 是否是当前月
      isCurrentMonth(date) {
        let {year: currentYear, month: currentMonth} = utils.getNewDate(utils.getDate(this.time.year, this.time.month, 1));
        let {year, month} = utils.getNewDate(date);
        return currentYear == year && currentMonth == month
      },
      // 是否是今天
      isCurrentDay(date) {
        let {year: currentYear, month: currentMonth, day: currentDay} = utils.getNewDate(new Date());
        let {year, month, day} = utils.getNewDate(date);
        return currentYear == year && currentMonth == month && currentDay == day;
      },
      // 上一个月
      handlePrevMonth() {
        let prevMonth = utils.getDate(this.time.year, this.time.month, 1);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        this.time = utils.getNewDate(prevMonth);
        this.headOptions.date = `${utils.englishMonth(this.time.month)} ${this.time.year}`;
        this.$emit('handlePrevMonth', {year: this.time.year, month: Number(this.time.month) + 1});
      },
      // 下一个月
      handleNextMonth() {
        let nextMonth = utils.getDate(this.time.year, this.time.month, 1);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        this.time = utils.getNewDate(nextMonth);
        this.headOptions.date = `${utils.englishMonth(this.time.month)} ${this.time.year}`;
        this.$emit('handleNextMonth', {year: this.time.year, month: Number(this.time.month) + 1});
      },
      // 点击回到今天
      handleToday() {
        this.time = utils.getNewDate(new Date());
        this.$emit('handleToday');
      },
      // 点击某一天
      handleClickDay(item) {
        this.$forceUpdate();
        this.$emit('handleClickDay', item);
        this.calendarList.map(x => {
          x.clickDay = false;
        });
        this.$set(item, 'clickDay', true);
      }
    },
    created() {
      this.calendarList = this.visibleCalendar;
      this.calendarType = this.options.calendarType;
    }
  }
</script>

<style lang="less">
  .cc-calendar {
    padding: 0px 10px 0 10px;
    width: 100%;
    height: 100%;
    background: #ffffff;
    box-sizing: border-box;

    .calendar-week {
      width: 100%;
      height: 25px;
      line-height: 25px;
      border: 1px solid #E4E7EA;
      border-right: none;
      background-color: #365FA4;

      .week-item {
        float: left;
        width: 14.285%;
        text-align: center;
        font-size: 12px;
        color: #ffffff;
        border-right: 1px solid #E4E7EA;
      }
    }

    .calendar-view {
      width: 100%;
      border-left: 1px solid #E4E7EA;

      .date-view {
        float: left;
        width: 14.285%;
        height: 35px;
        border-right: 1px solid #E4E7EA;
        border-bottom: 1px solid #E4E7EA;
        cursor: pointer;
        position: relative;

        .bidd-content {
          position: absolute;
          top: 2px;
          left: 2px;

          span {
            display: block;
            width: 50px;
            height: 14px;
            line-height: 14px;
            font-size: 11px;
            text-align: center;
            border-left: solid 2px transparent;
            margin-bottom: 2px;
          }

          span:nth-child(odd) {
            background-color: #E7FFF2;
            border-left: solid 2px #00B853;
            color: #00B853;
          }

          span:nth-child(even) {
            background-color: #ECF6FF;
            border-left: solid 2px #3296FA;
            color: #3296FA;
          }
        }

        .bidd-box {
          display: none;
          position: absolute;
          width: 200px;
          height: auto;
          top: -10px;
          z-index: 99;
          padding: 10px 10px 0px 10px;
          color: #ffffff;
          background-color: #333333;
          box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.4);
          border-radius: 4px;

          .bidd-info {
            font-size: 12px;

            .bidd-time {
              display: flex;
              justify-content: flex-start;
              align-content: center;
              align-items: center;

              .dot {
                display: flex;
                width: 6px;
                height: 6px;
                border-radius: 3px;
                margin-right: 6px;
              }
            }

            .bidd-name {
              margin-top: 4px;
              margin-bottom: 20px;
              display: flex;
              justify-content: flex-start;
              align-content: end;
              align-items: end;

              .bidd {
                font-size: 12px;
                color: #999999;
              }

              .bidd-word {
                width: 140px;
                max-width: 140px;
                font-size: 12px;
              }
            }
          }

          .bidd-info:nth-child(odd) {
            .dot {
              background-color: #00B853;
            }
          }

          .bidd-info:nth-child(even) {
            .dot {
              background-color: #3296FA;
            }
          }

          .sanjiao {
            width: 0;
            height: 0;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            position: absolute;
            top: 20px;
            z-index: 999;
          }

          .sanjiao.left {
            border-right: 10px solid #333333;
            left: -10px;
          }

          .sanjiao.right {
            border-left: 10px solid #333333;
            right: -10px;
          }
        }

        .bidd-box.left {
          left: -224px;
        }

        .bidd-box.right {
          right: -224px;
        }

        .date-day {
          padding: 8px 8px 0;
          display: block;
          width: 100%;
          font-size: 14px;
          color: #7F8794;
        }
      }

      .date-view:hover {
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.17);

        .bidd-box {
          display: block;
        }
      }

      .date-view.month-class {
        cursor: default;
      }

      .date-view.month-class:hover {
        box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
      }

      .opacity-class {
        opacity: .5;
      }

      .month-class {
        /*background-image: linear-gradient(45deg, rgba(000, 000, 000, .03) 25%, transparent 25%, transparent 50%, rgba(000, 000, 000, .03) 50%, rgba(000, 000, 000, .03) 75%, transparent 75%, transparent);*/
        background-size: 20px 20px;
      }

      .todayBg {
        /*background: #FFFDEF;*/
      }

      .handleDay {
        background: #2061FF !important;

        .date-day {
          color: #BCCFFF !important;
        }

        .calendar-num {
          color: #fff !important;
        }
      }
    }
  }
</style>
