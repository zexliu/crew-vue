<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model
        v-model="listQuery"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
      >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="交路计划">
              <a-select
                default-value=""
                v-model="listQuery.tableId"
                style="width: 100%"
                placeholder="请选择所属交路计划"
              >
                <a-select-option value="">
                  全部
                </a-select-option>
                <a-select-option v-for="item in tables" :key="item.id">
                  {{ item.tableName }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="班次">
              <a-select
                default-value=""
                v-model="listQuery.shiftId"
                style="width: 100%"
                placeholder="请选择所属班次"
              >
                <a-select-option value="">
                  全部
                </a-select-option>
                <a-select-option v-for="item in shifts" :key="item.id">
                  {{ item.shiftName }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <template v-if="expand">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="出勤地点">
                <a-select
                  default-value=""
                  v-model="listQuery.attendanceStationId"
                  style="width: 100%"
                  placeholder="请选择出勤地点"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option v-for="item in stations" :key="item.id">
                    {{ item.stationName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="接车车次">
                <a-input
                  v-model="listQuery.meetTrainNo"
                  placeholder="请输入接车车次"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="接车地点">
                <a-select
                  default-value=""
                  v-model="listQuery.meetStationId"
                  style="width: 100%"
                  placeholder="请选择接车地点"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option v-for="item in stations" :key="item.id">
                    {{ item.stationName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="退勤车次">
                <a-input
                  v-model="listQuery.meetTrainNo"
                  placeholder="退勤车次"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="退勤地点">
                <a-select
                  default-value=""
                  v-model="listQuery.backStationId"
                  style="width: 100%"
                  placeholder="请选择退勤地点"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option v-for="item in stations" :key="item.id">
                    {{ item.stationName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </template>
          <a-col :md="(!expand && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(expand && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="handleSearch()">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleResetSearch()"
                >重置</a-button
              >
              <a @click="expandToggle" style="margin-left: 8px">
                {{ expand ? '收起' : '展开' }}
                <a-icon :type="expand ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="onAddClick">
        添加{{ subjectTitle }}
      </a-button>
      <!-- <excel-upload :name="subject" :on-success="onExcelSuccess"></excel-upload>
      <a-button type="primary" icon="export" @click="exportExcel">
        导出
      </a-button> -->
    </div>

    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="tableData"
      :bordered="true"
      :loading="loading"
      :row-key="record => record.id"
      @change="handleTableChange"
      :scroll="{ x: true }"
    >
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>
      <span slot="tableId" slot-scope="tableId">
        {{ getTableName(tableId) }}
      </span>
      <span slot="shiftId" slot-scope="shiftId">
        {{ getShiftName(shiftId) }}
      </span>
      <span slot="attendanceStationId" slot-scope="attendanceStationId">
        {{ getStationName(attendanceStationId) }}
      </span>
      <span slot="meetStationId" slot-scope="meetStationId">
        {{ getStationName(meetStationId) }}
      </span>
      <span slot="backStationId" slot-scope="backStationId">
        {{ getStationName(backStationId) }}
      </span>

      <span slot="action" slot-scope="record">
        <a @click="onEditClick(record)">
          <a-icon type="edit" />
          编辑
        </a>

        <a-divider type="vertical" />
        <a @click="onDeleteClick(record)">
          <a-icon type="delete" />
          删除</a
        >
      </span>
    </a-table>
    <details-drawer
      :visible="detailsVisible"
      :type="detailsType"
      :stations="stations"
      :tables="tables"
      :shifts="shifts"
      :selectedKey="selectedKey"
      @close="onDetailsClosed"
      @on-edit-success="onEditSuccess"
      @on-add-success="onAddSuccess"
    >
    </details-drawer>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DetailsDrawer from './DetailsDrawer.vue'
import MixinTable from '@/mixins/mixin-table'
import { fetchList } from '@/api/common'
@Component({
  name: 'StoreIndex',
  components: {
    DetailsDrawer
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '交路计划项'
  subject = 'sbRouteItem'
  url = '/api/v1/route/items'
  tables: any[] = []
  shifts: any[] = []
  stations: any[] = []

  private created() {
    fetchList('/api/v1/route/tables', {
      current: 1,
      size: 99999
    }).then((res: any) => {
      this.tables = res.records
    })

    fetchList('/api/v1/shifts', {
      current: 1,
      size: 99999
    }).then((res: any) => {
      this.shifts = res.records
    })
    fetchList('/api/v1/stations', { current: 1, size: 99999 }).then(
      (res: any) => {
        this.stations = res.records
      }
    )
    var tableId = this.$route.params.tableId
    if (tableId) {
      this.listQuery.tableId = tableId
    }
    this.fetch()
  }

  // private upOptions = [
  //   { name: '全部', value: '' },
  //   { name: '下行', value: 'false' },
  //   { name: '上行', value: 'true' }
  // ]

  private columns = [
    {
      dataIndex: 'tableId',
      title: '交路表',
      scopedSlots: { customRender: 'tableId' },
      width: 100
    },
    {
      dataIndex: 'shiftId',
      title: '班次',
      scopedSlots: { customRender: 'shiftId' },
      width: 80
    },
    {
      title: '出勤地点',
      dataIndex: 'attendanceStationId',
      width: 160,
      scopedSlots: { customRender: 'attendanceStationId' }
    },
    {
      title: '出勤时间',
      dataIndex: 'attendanceAt',
      width: 120
    },
    {
      title: '接车时间',
      dataIndex: 'meetAt',
      width: 120
    },
    {
      title: '接车车次',
      dataIndex: 'meetTrainNo',
      width: 120
    },
    {
      title: '接车地点',
      dataIndex: 'meetStationId',
      width: 160,
      scopedSlots: { customRender: 'meetStationId' }
    },
    {
      title: '开行交路',
      dataIndex: 'trainNoDescriptions',
      width: 500
    },
    {
      title: '退勤车次',
      dataIndex: 'backTrainNo',
      width: 120
    },
    {
      title: '退勤地点',
      dataIndex: 'backStationId',
      width: 160,
      scopedSlots: { customRender: 'backStationId' }
    },
    {
      title: '退勤时间',
      dataIndex: 'backAt',
      width: 120
    },
    {
      title: '总里程(KM)',
      dataIndex: 'distance',
      width: 120
    },
    {
      title: '备注',
      dataIndex: 'remark'
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      scopedSlots: { customRender: 'createAt' },
      width: 190
    },

    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]

  getTableName(id: string) {
    let item = this.tables.find((el: any) => {
      return el.id === id
    })
    return item ? item.tableName : ''
  }

  getStationName(id: string) {
    let item = this.stations.find((el: any) => {
      return el.id === id
    })
    return item ? item.stationName : ''
  }

  getShiftName(id: string) {
    let item = this.shifts.find((el: any) => {
      return el.id === id
    })
    return item ? item.shiftName : ''
  }

  //编辑成功回调
  //   protected onEditSuccess(val: any) {
  //     val.startStationName = this.getStationName(val.startStationId)
  //     val.endStationName = this.getStationName(val.endStationId)

  //     const newData = [...this.tableData]
  //     const target = newData.find((item: any) => {
  //       return item.id === this.selectedKey
  //     })
  //     if (target) {
  //       Object.assign(target, val)
  //       this.tableData = newData
  //     }
  //   }
}
</script>
