<template>
  <a-spin tip="上传中..." :spinning="importLoading">
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

        <span slot="action" slot-scope="record">
          <a @click="onEditClick(record)">
            <a-icon type="edit" />
            编辑
          </a>
          <a-divider type="vertical" />

          <a-upload
            :multiple="false"
            :showUploadList="false"
            :before-upload="beforeUpload"
            :customRequest="customRequest"
          >
            <a
              href="javascript:;"
              @click="
                {
                  importTableId = record.id
                }
              "
            >
              <a-icon type="import" />
              导入
            </a>
          </a-upload>
          <a-divider type="vertical" />
          <router-link
            :to="{ name: 'RuntimeItem', params: { tableId: record.id } }"
            ><a> <a-icon type="unordered-list" /> 时刻项</a></router-link
          >

          <a-divider type="vertical" />
          <a @click="onDeleteClick(record)"> <a-icon type="delete" /> 删除</a>
        </span>
      </a-table>
      <details-drawer
        :visible="detailsVisible"
        :type="detailsType"
        :stations="stations"
        :selectedKey="selectedKey"
        @close="onDetailsClosed"
        @on-edit-success="onEditSuccess"
        @on-add-success="onAddSuccess"
      >
      </details-drawer>
    </a-card>
  </a-spin>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DetailsDrawer from './DetailsDrawer.vue'
import ExcelUpload from '@/components/Upload/ExcelUpload.vue'
import MixinTable from '@/mixins/mixin-table'
import { fetchList } from '@/api/common'
import { uploadExcel } from '@/api/excel'
@Component({
  name: 'StoreIndex',
  components: {
    DetailsDrawer,
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '时刻表'
  subject = 'sbRuntimeTable'
  url = '/api/v1/runtime/tables'
  importTableId: string | null = null
  importLoading = false
  stations: any[] = []
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
      title: '车站时刻表名称',
      dataIndex: 'tableName',
      width: 160
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
      width: 300,
      scopedSlots: { customRender: 'action' }
    }
  ]

  private beforeUpload(file: any) {
    const isLt2M = file.size / 1024 / 1024 < 2

    const isExce = file.name.endsWith('.xlsx')

    if (!isExce) {
      this.$message.error('导入excel文件只能是xlsx格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传文件大小不能超过 2MB!')
    }
    return isExce && isLt2M
  }

  private customRequest(data: any) {
    const formData = new FormData()
    formData.append('file', data.file)
    this.importLoading = true
    uploadExcel(
      { name: 'sbRuntimeItem', tableId: this.importTableId },
      formData
    )
      .then((res: any) => {
        this.$notification.success({
          message: '成功',
          description: '导入数据成功'
        })
      })
      .catch(e => {
        this.$notification.error({
          message: '失败',
          description: '导入数据失败'
        })
      })
      .finally(() => {
        this.importLoading = false
      })
  }
}
</script>
