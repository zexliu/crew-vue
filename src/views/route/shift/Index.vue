<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model v-model="listQuery" layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="所属班组">
              <a-select
                v-model="listQuery.shiftGroupId"
                placeholder="请选择所属班次组"
              >
                <a-select-option v-for="item in groups" :key="item.id">{{
                  item.groupName
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :md="(!expand && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(expand && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="handleSearch()">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleResetSearch()"
                >重置</a-button
              >
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
    >
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>

      <span slot="shiftGroupId" slot-scope="shiftGroupId">
        {{ getShiftGroupName(shiftGroupId) }}
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
      :groups="groups"
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
  name: 'ShiftIndex',
  components: {
    DetailsDrawer
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '班次'
  subject = 'sbShift'
  url = '/api/v1/shifts'
  groups: any[] = []
  private created() {
    fetchList('/api/v1/shift/groups', { current: 1, size: 9999 }).then(
      (res: any) => {
        this.groups = res.records
      }
    )
    var shiftGroupId = this.$route.params.shiftGroupId
    if (shiftGroupId) {
      this.$set(this.listQuery, 'shiftGroupId', shiftGroupId)
    }
    this.fetch()
  }

  private columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220
    },
    {
      title: '班次名称',
      dataIndex: 'shiftName',
      width: 100
    },
    {
      title: '所属班次组',
      dataIndex: 'shiftGroupId',
      width: 140,
      scopedSlots: { customRender: 'shiftGroupId' }
    },
    {
      title: '描述',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: '排序',
      dataIndex: 'seq',
      width: 80
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

  getShiftGroupName(id: string) {
    const group = this.groups.find(item => {
      return item.id === id
    })

    return group ? group.groupName : ''
  }
}
</script>
