<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model v-model="listQuery" layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="所属机队">
              <a-select v-model="listQuery.teamId" placeholder="请选择机队名称">
                <a-select-option :key="''">
                  全部
                </a-select-option>
                <a-select-option v-for="item in teams" :key="item.id">
                  {{ item.teamName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="机组名称">
              <a-input
                v-model="listQuery.groupName"
                placeholder="请输入机组名称模糊查询"
              />
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
      :scroll="{ x: true }"
    >
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>

      <span slot="action" slot-scope="record">
        <a @click="onEditClick(record)">
          <a-icon type="edit" />
          编辑
        </a>

        <a-divider type="vertical" />
        <a @click="onDeleteClick(record)">删除</a>
      </span>
    </a-table>
    <details-drawer
      :visible="detailsVisible"
      :type="detailsType"
      :selectedKey="selectedKey"
      @close="onDetailsClosed"
      @on-edit-success="onEditSuccess"
      @on-add-success="onAddSuccess"
      :teams="teams"
    >
    </details-drawer>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DetailsDrawer from './DetailsDrawer.vue'
import ExcelUpload from '@/components/Upload/ExcelUpload.vue'
import MixinTable from '@/mixins/mixin-table'
import { fetchList } from '../../../api/common'

@Component({
  name: 'GroupIndex',
  components: {
    DetailsDrawer,
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '机组'
  subject = 'sbStaffGroup'
  url = '/api/v1/staff/groups'
  teams = []
  private created() {
    this.fetch()
    fetchList('/api/v1/staff/teams', { current: 1, size: 9999 }).then(
      (res: any) => {
        this.teams = res.records
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
      title: '机组名称',
      dataIndex: 'groupName',
      width: 200
    },
    {
      title: '负责人',
      dataIndex: 'leaderDescriptions',
      width: 200
    },
    {
      title: '轮换次数',
      dataIndex: 'rotateCount',
      width: 100
    },
    {
      title: '轮换状态',
      dataIndex: 'rotateStatus',
      scopedSlots: { customRender: 'rotateStatus' },
      width: 120
    },
    {
      title: '描述',
      dataIndex: 'description',
      width: 300,
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
      width: 200,
      scopedSlots: { customRender: 'action' }
    }
  ]
}
</script>
