<template>
    <div id="examples">
        <yo-header title="标题">
            <yo-toolbar :showAutoback="true">
                <yo-button :type="type2">默认按钮</yo-button>
                <yo-button :type="type1">主要按钮</yo-button>
                <yo-button :type="type6">危险按钮</yo-button>
            </yo-toolbar>
        </yo-header>
        
        <yo-menu :width="250"></yo-menu>
        <yo-detail-col :rowData="rowData" :label_width='100'></yo-detail-col>
        <yo-file :uploadType="1"  :ids.sync="Files" :apiUrl="apiUrl"></yo-file>
        <yo-file :uploadType="3" :ids.sync="Files"  :apiUrl="apiUrl"></yo-file>
        <yo-img></yo-img>
        <yo-input></yo-input>
        
        <el-form>
            
        <yo-enum EnumName="sssss" label="123" prop="234"></yo-enum>
        <yo-city :api="''" :labelWidth="'120'" :label="'地址：'" @selectchange="selectchange()"></yo-city>
        </el-form>
        
        
      <yo-content>
          <yo-grid ref="YoGrid"
            :quicksearchPlaceholder="'快速搜索公告编号'"
            :requireData.sync="requireData"
            :gridData="gridData"
            :showPagination="true"
            :quickSearchVal="'AnncCode'"
            :tabsAlign="'left'"
            :unitGroup="true"
            :unitAlign="'right'"
            :needtabs="false">
            <el-table ref="multipleTable" :data="requireData.Items" style="width: 100%">
                <el-table-column
                v-for="item in gridData.table"
                :key="item.key"
                :align="item.align"
                :prop="item.key"
                :label="item.label"
                :min-width="item.width"
                :show-overflow-tooltip="item.tooltip"
                ></el-table-column>
                <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="small"
                    type="info"
                    icon="el-icon-edit"
                    @click="addNewOrg(scope.$index, scope.row)"
                    >编辑</el-button>
                    <el-button
                    size="small"
                    type="danger"
                    icon="el-icon-delete"
                    v-if="scope.row.Id.length>20"
                    @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                </template>
                </el-table-column>
            </el-table>
        </yo-grid>
      </yo-content>
    </div>
</template>
<script>
import YoButton from '@/packages/YoButton/src/main.vue'
import YoHeader from '@/packages/YoHeader/src/main.vue'
import YoToolbar from '@/packages/YoToolBar/src/main.vue'
import YoMenu from '@/packages/YoMenu/src/main.vue'
import YoDetailCol from '@/packages/YoDetailCol/src/main.vue'
import YoFile from '@/packages/YoFile/src/main.vue'
import YoImg from '@/packages/YoImg/src/main.vue'
import YoEnum from '@/packages/YoEnum/src/main.vue'
import YoGrid from '@/packages/YoGrid/src/main.vue'
import YoContent from '@/packages/YoContent/src/main.vue'
import YoCity from '@/packages/YoCity/src/main.vue'
import YoInput from '@/packages/YoControlsInput/src/main.vue'
export default {
    name: 'examples',
    components: {
        YoHeader,
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
        YoInput
    },
    data () {
        return {
             apiUrl: process.env.AttachAPI,
             Files:'k2037d15529e01f4d1ef87l,k2037g5548pg0020123bc7v,k2039e1524pb0010d31dc05',
            type1: 'primary',
            type2: 'default',
            type3: 'info',
            type4: 'success',
            type5: 'warning',
            type6: 'danger',
            rowData: [
                [{
                    title: '默认显示',
                    value: '没有定义span 和是否显示的 默认是显示 默认列宽：span=8',
                },{
                    title: '标题2',
                    value: '默认 是 {title: "标题",value "内容"}'
                },{
                    title: '标题3',
                    value: '内容3'
                }],
                [{
                    title: '定制列宽=16',
                    value: '需要加上 span字段 默认 是 {title: "标题",value "内容", span:"16"}',
                    span: 16,
                },
                {
                    title: '标题4',
                    value: '内容4',
                    span: 8,
                    isVisiable: false
                }],[
                    {
                    title: '控制显示隐藏',
                    value: '需要加上 isVisiable字段 默认 是 {title: "标题",value "内容", span:"16",isVisiable: true} 当不传该字段的时候是默认显示，true显示，false隐藏',
                    span: 24,
                    isVisiable: true
                    }
                ]
            ],
            requireData: {
                Item:[]
            },
            gridData: {
                params: {
                Name: '',
                PageSize: 10,
                PageIndex: 1
                },
                formLabel: [
                {
                    value: 'Name',
                    name: '名称',
                    type: 'input',
                    span: 8
                },
                {
                    value: 'Name',
                    name: '枚举',
                    type: 'select',
                    span: 8,
                    options: [{
                        Name:'3444',
                        Value:'Value',
                        Description:'Description date',
                    }]
                },
                {
                    value: 'Name',
                    name: '时间',
                    type: 'date',
                    span: 8,
                    format: 'yyyy-MM-dd'
                }
                ],
                table: [
                {
                    key: 'Name',
                    label: '名称',
                    width: 100,
                    align: 'center',
                    tooltip: false
                },
                {
                    key: 'HostUrl',
                    label: 'HostUrl',
                    width: 200,
                    align: 'left',
                    tooltip: true
                },
                {
                    key: 'ClientId',
                    label: 'ClientId',
                    width: 200,
                    align: 'left',
                    tooltip: true
                },
                {
                    key: 'CreateTime',
                    label: '创建时间',
                    align: 'center',
                    width: 100,
                    tooltip: false
                }
                ],
                api: '/api/SysSubSystem/Query',
                methods: 'post'
            },
        }
    },
    methods: {
        selectchange (val) {
            console.log(val)
        }
    }
}
</script>
<style scoped>

</style>
