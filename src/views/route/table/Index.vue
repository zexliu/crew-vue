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
        <span slot="enable" slot-scope="enable">
          <a-tag v-if="enable" color="blue"> 已启用</a-tag>
          <a-tag v-else color="orange"> 未启用</a-tag>
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
          <a @click="onEnableClick(record)" :disabled="record.enable">
            <a-icon type="edit" />
            启用
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
            :to="{ name: 'RouteItem', params: { tableId: record.id } }"
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
  </a-spin>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DetailsDrawer from './DetailsDrawer.vue'
import MixinTable from '@/mixins/mixin-table'
import { fetchList } from '@/api/common'
import { enableRoute } from '@/api/route'
import { uploadExcel } from '@/api/excel'

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

  importTableId: string | null = null

  importLoading = false

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
      title: '启用状态',
      scopedSlots: { customRender: 'enable' },
      dataIndex: 'enable',
      width: 100
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
      width: 370,
      scopedSlots: { customRender: 'action' }
    }
  ]

  getRuntimeTableName(runtimeTableId: string) {
    let table = this.runtimeTables.find(item => {
      return item.id === runtimeTableId
    })
    return table ? table.tableName : ''
  }

  onEnableClick(val: any) {
    let that = this
    this.$confirm({
      title: '确定要启用该交路计划吗?',
      content: '启用交路计划将至其他交路计划将为未启用状态',
      onOk() {
        return enableRoute(val.id).then(() => {
          that.fetch()
        })
      }
    })
  }

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
    uploadExcel({ name: 'sbRouteItem', tableId: this.importTableId }, formData)
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
