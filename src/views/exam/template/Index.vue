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
      <span slot="enable" slot-scope="enable">
        <a-tag v-if="enable" color="blue">
          已启用
        </a-tag>
        <a-tag v-else>
          未启用
        </a-tag>
      </span>

      <span slot="action" slot-scope="record">
        <a @click="onEnableClick(record)" :disabled="record.enable">
          <a-icon type="caret-right" />
          启用模板
        </a>
        <a-divider type="vertical" />
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
    >
    </details-drawer>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DetailsDrawer from './DetailsDrawer.vue'
import ExcelUpload from '@/components/Upload/ExcelUpload.vue'
import MixinTable from '@/mixins/mixin-table'
import { enableTemplate } from '@/api/question'
@Component({
  name: 'StoreIndex',
  components: {
    DetailsDrawer,
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '模板'
  subject = 'qaQuestionPagerTemplate'
  url = '/api/v1/question/templates'

  private created() {
    this.fetch()
  }

  private columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220
    },
    {
      title: '模板名称',
      dataIndex: 'pagerTemplateName',
      width: 200
    },
    {
      title: '题目数量',
      dataIndex: 'questionCount',
      width: 100
    },
    {
      title: '启用状态',
      dataIndex: 'enable',
      width: 100,
      scopedSlots: { customRender: 'enable' }
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

  onEnableClick(val: any) {
    let that = this
    this.$confirm({
      title: '确定要启用该模板吗?',
      content: '启用模板将止其他模板为未启用状态',
      onOk() {
        return enableTemplate(val.id).then(() => {
          that.fetch()
        })
      }
    })
  }
}
</script>
