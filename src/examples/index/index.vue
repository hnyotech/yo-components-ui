<template>
    <div id="examples">
        <el-row>
            <el-col :span="4">
                <yo-button :type="type2">默认按钮</yo-button>
            </el-col>
            <el-col :span="4">
                <yo-button :type="type1">主要按钮</yo-button>
            </el-col>
            <el-col :span="4">
                <yo-button :type="type6">危险按钮</yo-button>
            </el-col>
        </el-row>
        <yo-menu :width="250"></yo-menu>
        <yo-detail-col :rowData="rowData" :label_width='100'></yo-detail-col>
        <yo-file :uploadType="1"></yo-file>
        <yo-enum EnumName="sssss"></yo-enum>
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
    </div>
</template>
<script>
import YoButton from '@/packages/YoButton/src/main.vue'
import YoMenu from '@/packages/YoMenu/src/main.vue'
import YoDetailCol from '@/packages/YoDetailCol/src/main.vue'
import YoFile from '@/packages/YoFile/src/main.vue'
import YoEnum from '@/packages/YoEnum/src/main.vue'
import YoGrid from '@/packages/ComplateGrid/src/main.vue'
export default {
    name: 'examples',
    components: {
        YoButton,
        YoMenu,
        YoDetailCol,
        YoFile,
        YoEnum,
        YoGrid
    },
    data () {
        return {
            type1: 'primary',
            type2: 'default',
            type3: 'info',
            type4: 'success',
            type5: 'warning',
            type6: 'danger',
            rowData: [
                [{
                    title: '标题1',
                    value: '内容1'
                },{
                    title: '标题2',
                    value: '内容2'
                },{
                    title: '标题3',
                    value: '内容3'
                }],
                [{
                    title: '标题4',
                    value: '内容4'
                }],
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
    }
}
</script>
<style scoped>

</style>
