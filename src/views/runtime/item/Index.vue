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
            <a-form-model-item label="所属时刻表">
              <a-select
                default-value=""
                v-model="listQuery.tableId"
                style="width: 100%"
                placeholder="请选择所属时刻表"
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
            <a-form-model-item label="车次">
              <a-input v-model="listQuery.trainNo" placeholder="请输入车次" />
            </a-form-model-item>
          </a-col>
          <template v-if="expand">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="方向">
                <a-select
                  default-value=""
                  v-model="listQuery.up"
                  style="width: 100%"
                  placeholder="请选择方向"
                >
                  <a-select-option v-for="item in upOptions" :key="item.value">
                    {{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="始发站">
                <a-select
                  default-value=""
                  v-model="listQuery.startStationId"
                  style="width: 100%"
                  placeholder="请选择始发站"
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
              <a-form-model-item label="终点站">
                <a-select
                  default-value=""
                  v-model="listQuery.endStationId"
                  style="width: 100%"
                  placeholder="请选择终点站站"
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
              <a-form-model-item label="服务号">
                <a-input
                  v-model="listQuery.serviceNo"
                  placeholder="请输入服务号"
                />
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
      :scroll="{ x: 1600 }"
    >
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>
      <span slot="up" slot-scope="up">
        <a-tag v-if="up" color="blue">
          上行线
        </a-tag>
        <a-tag v-else color="orange">下行线</a-tag>
      </span>
      <span slot="tableId" slot-scope="tableId">
        {{ getTableName(tableId) }}
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
import ExcelUpload from '@/components/Upload/ExcelUpload.vue'
import MixinTable from '@/mixins/mixin-table'
import { fetchList } from '@/api/common'
@Component({
  name: 'StoreIndex',
  components: {
    DetailsDrawer,
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '时刻项'
  subject = 'sbRuntimeItem'
  url = '/api/v1/runtime/items'
  tables: any[] = []
  stations: any[] = []

  private created() {
    fetchList('/api/v1/runtime/tables', {
      current: 1,
      size: 99999
    }).then((res: any) => {
      this.tables = res.records
    })
    fetchList('/api/v1/stations', { current: 1, size: 99999 }).then(
      (res: any) => {
        this.stations = res.records
      }
    )
    var tableId = this.$route.params.tableId
    if (tableId) {
      this.$set(this.listQuery, 'tableId', tableId)
    }
    this.fetch()
  }

  private upOptions = [
    { name: '全部', value: '' },
    { name: '下行', value: 'false' },
    { name: '上行', value: 'true' }
  ]

  private columns = [
    {
      dataIndex: 'trainNo',
      title: '车次',
      width: 120
    },
    {
      title: '方向',
      dataIndex: 'up',
      width: 80,
      scopedSlots: { customRender: 'up' }
    },
    {
      title: '所属时刻表',
      dataIndex: 'tableId',
      width: 120,
      scopedSlots: { customRender: 'tableId' }
    },
    {
      title: '始发站',
      dataIndex: 'startStationName',
      width: 160
    },
    {
      title: '终点站',
      dataIndex: 'endStationName',
      width: 160
    },
    {
      title: '总里程(KM)',
      dataIndex: 'distance',
      width: 120
    },

    {
      title: '开点',
      dataIndex: 'startAt',
      width: 120
    },
    {
      title: '到点',
      dataIndex: 'endAt',
      width: 120
    },
    {
      title: '服务号',
      dataIndex: 'serviceNo',
      width: 80
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

  //编辑成功回调
  protected onEditSuccess(val: any) {
    val.startStationName = this.getStationName(val.startStationId)
    val.endStationName = this.getStationName(val.endStationId)

    const newData = [...this.tableData]
    const target = newData.find((item: any) => {
      return item.id === this.selectedKey
    })
    if (target) {
      Object.assign(target, val)
      this.tableData = newData
    }
  }
}
</script>
