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
      :scroll="{ x: true }"
    >
      <span slot="fieldType" slot-scope="fieldType">
        {{ getFieldTypeName(fieldType) }}
      </span>
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
      :fieldTypeOptions="fieldTypeOptions"
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
import { Form } from 'ant-design-vue'
@Component({
  name: 'TeamIndex',
  components: {
    DetailsDrawer,
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '字段'
  subject = 'sysExtensionField'
  url = '/api/v1/extension/field'

  private created() {
    this.fetch()
  }

  private fieldTypeOptions: any[] = [
    {
      name: '字符串',
      value: 'TEXT_VALUE'
    },
    {
      name: '整型',
      value: 'LONG_VALUE'
    },
    {
      name: '浮点型',
      value: 'DOUBLE_VALUE'
    }
  ]

  private columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220
    },
    {
      title: '字段名',
      dataIndex: 'fieldName'
    },
    {
      title: '字段编码',
      dataIndex: 'fieldCode',
      width: 200
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      scopedSlots: { customRender: 'fieldType' },
      width: 200
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

  protected fetch() {
    this.listQuery.current = this.pagination.current
    this.listQuery.size = this.pagination.pageSize
    this.listQuery.tableName = 'sb_staff'
    this.loading = true
    fetchList(this.url, this.listQuery)
      .then((response: any) => {
        this.tableData = response.records
        this.pagination.total = response.total
      })
      .finally(() => {
        this.loading = false
      })
  }

  getFieldTypeName(value: string) {
    console.log(value)
    const temp = this.fieldTypeOptions.find((item: any) => {
      return item.value === value
    })

    return temp.name
  }
}
</script>
