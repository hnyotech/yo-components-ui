<template>
  <div class="my-city">
    <el-form-item :label="label" prop="CityCode">
      <el-select v-model="mycityForm.provinceCode" @change="onProvinceChange" placeholder="请选择省" @visible-change="visibleChange">
        <el-option v-for="(item,index) in provinces" :key="item.Level + index" :label="item.Name" :value="item.Code"></el-option>
      </el-select>
      <el-select v-model="mycityForm.cityCode" @change="onCityChange" placeholder="请选择市" @visible-change="visibleChange">
        <el-option v-for="(item,index) in citys" :key="item.Level + index" :label="item.Name" :value="item.Code"></el-option>
      </el-select>
      <el-select v-model="mycityForm.countyCode" @change="onCountyChange" placeholder="请选择区" @visible-change="visibleChange">
        <el-option v-for="(item,index) in countys" :key="item.Level + index" :label="item.Name" :value="item.Code"></el-option>
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
export default {
  name: 'YoCity',
  data () {
    return {
      allData: [],
      provinces: [],
      citys: [],
      countys: [],
      mycityForm: {
        provinceCode: '',
        provinceName: '',
        cityName: '',
        cityCode: '',
        countyName: '',
        countyCode: '',
        selCityCode: ''
      },
      isLoad: true // 防止用户调用selectchange变化CityCode的值触发多次监听事件
    }
  },
  props: {
    CityCode: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: '地址'
    },
    labelWidth: {
      type: String,
      required: false,
      default: '100px'
    },
    api: {
      type: String,
      default: ''
    }
  },
  watch: {
    CityCode: function (val) {
      // 1.编辑的时候加载数据，因为考虑用户可能没选择到区，所以根据用户最后选择的Code往前逆推“省份”、“城市”
      // 2.如果当前选择到省或者市，则需要把后一级数据加载出来
      // 3.为了防止allData数据还没有加载完成先执行了编辑，所以在allData中也添加了初始化编辑数据功能
      if (this.allData.length > 0 && this.isLoad && val != '' && val != null) {
        var selItem = this.loadData(val, 0)
        if (selItem.Level != 1) {
          if (this.citys.length == 0) {
            this.loadData(this.countys[0].ParentId, 0)// 市
          }
          if (this.mycityForm.provinceCode == '') {
            this.loadData(this.citys[0].ParentId, 0)// 省
          }
        }
        // 不是最后一级，加载后一级数据
        if (selItem.Level != 3) {
          this.loadData(selItem.Code, 1)// 市
        }
      }
      this.isLoad = false
    },
    allData: function (val) {
      for (var item of this.allData) {
        if (item.ParentId == '0') {
          this.provinces.push(item)
        }
      }
      if (this.CityCode != '' && this.CityCode != null) {
        if (this.allData.length > 0) {
          var selItem = this.loadData(this.CityCode, 0)
          if (selItem.Level != 1) {
            if (this.citys.length == 0) {
              this.loadData(this.countys[0].ParentId, 0)// 市
            }
            if (this.mycityForm.provinceCode == '') {
              this.loadData(this.citys[0].ParentId, 0)// 省
            }
          }
          // 不是最后一级，加载后一级数据
          if (selItem.Level != 3) {
            this.loadData(selItem.Code, 1)// 市
          }
        }
      }
    }
  },
  methods: {
    // 加载市和区数据 direction方向 0-向上级 1-向下级 (向上主要是用于新增数据，向下主要是用于编辑初始化数据)
    loadData (selcode, direction) {
      var nowItem = this.allData.find(item => item.Code === selcode)
      for (var item of this.allData) {
        if (item.Level == (nowItem.Level + 1) && item.ParentId == nowItem.Code && direction == '1') {
          if (item.Level == 3) {
            this.countys.push(item)
          } else if (item.Level == 2) {
            if (this.citys.length == 0) {
              this.citys.push(item)
            } else {
              for (let i = 0; i< this.citys.length; i++) {
                if (this.citys[i].Code != item.Code) {
                  this.citys.push(item)
                }
              }
            }
          }
        }
        if (item.Level == nowItem.Level && item.ParentId == nowItem.ParentId && direction == '0') {
          if (item.Level == 3) {
            this.countys.push(item)
            if (nowItem.Code == item.Code) {
              this.mycityForm.countyName = item.Name
              this.mycityForm.countyCode = item.Code
            }
          } else if (item.Level == 2) {
            if (this.citys.length == 0) {
              this.citys.push(item)
            } else {
              for (let i = 0; i< this.citys.length; i++) {
                if (this.citys[i].Code != item.Code) {
                  this.citys.push(item)
                }
              }
            }
            if (nowItem.Code == item.Code) {
              this.mycityForm.cityName = item.Name
              this.mycityForm.cityCode = item.Code
            }
          } else if (item.Level == 1) {
            if (nowItem.Code == item.Code) {
              this.mycityForm.provinceName = item.Name
              this.mycityForm.provinceCode = item.Code
              break
            }
          }
        }
      }
      return nowItem
    },
    onLoadAllData (url) {
      let that = this
      let apiUrl = url
      this.$http
        .post(apiUrl, {})
        .then(res => {
          that.allData = res
        })
    },
    // 选省
    onProvinceChange () {
      this.mycityForm.cityCode = ''
      this.mycityForm.cityName = ''
      this.mycityForm.countyCode = ''
      this.mycityForm.countyName = ''
      this.citys = []
      this.countys = []
      var provinceItem = this.loadData(this.mycityForm.provinceCode, 1)
      this.mycityForm.selCityCode = this.mycityForm.provinceCode
      this.mycityForm.provinceName = provinceItem.Name
      this.$emit('selectchange', this.mycityForm)
      // console.log('选省:' + this.provinces.length + '---' + this.citys.length + '---' + this.countys.length)
    },
    // 选市
    onCityChange () {
      this.mycityForm.countyCode = ''
      this.mycityForm.countyName = ''
      this.countys = []
      var cityItem = this.loadData(this.mycityForm.cityCode, 1)
      this.mycityForm.selCityCode = this.mycityForm.cityCode
      this.mycityForm.cityName = cityItem.Name
      this.$emit('selectchange', this.mycityForm)
      // console.log('选市:' + this.provinces.length + '---' + this.citys.length + '---' + this.countys.length)
    },
    onCountyChange () {
      this.mycityForm.selCityCode = this.mycityForm.countyCode
      this.mycityForm.countyName = this.countys.find(
        item => item.Code === this.mycityForm.countyCode
      )['Name']
      this.$emit('selectchange', this.mycityForm)
      // console.log('选区:' + this.provinces.length + '---' + this.citys.length + '---' + this.countys.length)
    }
  },
  created: function () {
    this.onLoadAllData(this.api)
  }
}
</script>
