<template>
  <a-card :bordered="false">
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
    >
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>

      <span slot="runtimeTableId" slot-scope="runtimeTableId">
        {{ getRuntimeTableName(runtimeTableId) }}
      </span>

      <span slot="action" slot-scope="record">
        <a @click="onEditClick(record)">
          <a-icon type="edit" />
          编辑
        </a>
        <a-divider type="vertical" />
        <router-link :to="{ name: 'RouteItem', params: { tableId: record.id } }"
          ><a> <a-icon type="unordered-list" />计划明细</a></router-link
        >
        <a-divider type="vertical" />
        <a @click="onDeleteClick(record)"> <a-icon type="delete" /> 删除</a>
      </span>
    </a-table>
    <details-drawer
      :visible="detailsVisible"
      :type="detailsType"
      :selectedKey="selectedKey"
      :runtimeTables="runtimeTables"
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
  subjectTitle = '交路计划'
  subject = 'sbRouteTable'
  url = '/api/v1/route/tables'
  runtimeTables: any[] = []
  private created() {
    this.fetch()
    fetchList('/api/v1/runtime/tables', { current: 1, size: 99999 }).then(
      (res: any) => {
        this.runtimeTables = res.records
      }
    )
  }

  private columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220
    },
    {
      title: '交路计划名称',
      dataIndex: 'tableName',
      width: 120
    },
    {
      title: '运行时刻表',
      scopedSlots: { customRender: 'runtimeTableId' },
      dataIndex: 'runtimeTableId',
      width: 120
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true
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
      width: 240,
      scopedSlots: { customRender: 'action' }
    }
  ]

  getRuntimeTableName(runtimeTableId: string) {
    let table = this.runtimeTables.find(item => {
      return item.id === runtimeTableId
    })
    return table ? table.tableName : ''
  }
}
</script>
