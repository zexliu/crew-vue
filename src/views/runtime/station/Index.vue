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
      <!-- <span slot="nextStationId" slot-scope="nextStationId">
        {{ getStationName(nextStationId) }}
      </span> -->

      <span slot="isPark" slot-scope="isPark">
        <a-tag v-if="isPark" color="blue"> 是</a-tag>
        <a-tag v-else color="orange">否</a-tag>
      </span>

      <span slot="isReturn" slot-scope="isReturn">
        <a-tag v-if="isReturn" color="blue"> 是</a-tag>
        <a-tag v-else color="orange">否</a-tag>
      </span>

      <span slot="action" slot-scope="record">
        <a @click="onEditClick(record)">
          <a-icon type="edit" />
          编辑
        </a>

        <a-divider type="vertical" />
        <a @click="onDeleteClick(record)"> <a-icon type="delete" /> 删除</a>
      </span>
    </a-table>
    <details-drawer
      :visible="detailsVisible"
      :type="detailsType"
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
  subjectTitle = '车站'
  subject = 'sbStation'
  url = '/api/v1/stations'
  // stations: any[] = []
  private created() {
    this.fetch()
  }

  // fetchAll() {
  //   fetchList(this.url, { current: 1, size: 99999 }).then((res: any) => {
  //     this.stations = res.records
  //     console.log('station', this.stations)
  //     console.log('id', this.stations[0].id)
  //   })
  // }

  // private getStationName(id: string) {
  //   let station = this.stations.find((item: any) => {
  //     return item.id === id
  //   })
  //   if (station) {
  //     return station.stationName
  //   }
  //   return ''
  // }
  private columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220
    },
    {
      title: '车站名称',
      dataIndex: 'stationName',
      width: 160
    },
    {
      title: '车站编码',
      dataIndex: 'stationCode',
      width: 160
    },
    // {
    //   title: '下一站名称',
    //   dataIndex: 'nextStationId',
    //   scopedSlots: { customRender: 'nextStationId' },
    //   width: 160
    // },

    {
      title: '下站距离(KM)',
      dataIndex: 'nextStationDistance',
      scopedSlots: { customRender: 'nextStationDistance' },
      width: 140
    },
    {
      title: '停车场',
      dataIndex: 'isPark',
      scopedSlots: { customRender: 'isPark' },
      width: 140
    },
    {
      title: '折返点',
      dataIndex: 'isReturn',
      scopedSlots: { customRender: 'isReturn' },
      width: 140
    },
    {
      title: '排序',
      dataIndex: 'seq',
      width: 100
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 300,
      ellipsis: true
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createAt',
    //   scopedSlots: { customRender: 'createAt' },
    //   width: 190
    // },
    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 160,
      scopedSlots: { customRender: 'action' }
    }
  ]

  //   protected fetch() {
  //     this.loading = true
  //     fetchList(this.url, this.listQuery)
  //       .then((response: any) => {
  //         this.tableData = response.records
  //         this.pagination.total = response.total
  //       })
  //       .finally(() => {
  //         this.loading = false
  //       })
  //     // this.fetchAll()
  //   }
}
</script>
