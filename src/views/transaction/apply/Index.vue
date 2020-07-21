<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model v-model="listQuery" layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="审核状态">
              <a-select v-model="listQuery.status" placeholder="请选择审核状态">
                <a-select-option key="">全部</a-select-option>
                <a-select-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  >{{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-model-item label="事务类型">
              <a-select v-model="listQuery.type" placeholder="请选择事务类型">
                <a-select-option key="">全部</a-select-option>
                <a-select-option
                  v-for="item in typeOptions"
                  :key="item.dictEntryValue"
                  >{{ item.dictEntryName }}</a-select-option
                >
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

    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="tableData"
      :bordered="true"
      :loading="loading"
      :row-key="record => record.id"
      @change="handleTableChange"
    >
      <span slot="avatar" slot-scope="avatar">
        <a-avatar :src="avatar" size="large" />
      </span>

      <span slot="type" slot-scope="type">
        <a-tag>
          {{ getTypeName(type) }}
        </a-tag>
      </span>

      <span slot="status" slot-scope="status">
        <a-tag v-if="status === 'PENDING'" color="orange">
          待审核
        </a-tag>
        <a-tag v-else-if="status === 'PASSED'" color="blue">
          已通过
        </a-tag>
        <a-tag v-else-if="status === 'REJECTED'" color="red">
          已驳回
        </a-tag>
      </span>
      <!-- <a-tag v-for="tag in tags" :key="tag" color="blue">{{ tag }}</a-tag> -->
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>

      <span slot="action" slot-scope="record">
        <a @click="onDetailsClick(record)">详情</a>
        <a-divider type="vertical" />
        <a
          :disabled="record.status !== 'PENDING'"
          @click="onAuditClick(record.id, true)"
          >通过</a
        >
        <a-divider type="vertical" />
        <a
          :disabled="record.status !== 'PENDING'"
          @click="onAuditClick(record.id, false)"
          >驳回</a
        >
      </span>
    </a-table>
    <details-drawer
      :visible="detailsVisible"
      :selectedKey="selectedKey"
      :type="detailsType"
      @close="onDetailsClosed"
      @on-edit-success="onEditSuccess"
      @on-add-success="onAddSuccess"
      :statusOptions="statusOptions"
      :typeOptions="typeOptions"
    >
    </details-drawer>

    <a-modal
      :title="dialogTitle"
      :visible="dialogVisible"
      :confirm-loading="dialogLoading"
      @ok="confirm"
      @cancel="cancel"
    >
      <a-textarea
        v-model="formData.description"
        placeholder="请输入审核意见"
        :auto-size="{ minRows: 3, maxRows: 5 }"
        :maxLength="200"
      />
    </a-modal>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import DetailsDrawer from './DetailsDrawer.vue'
import ExcelUpload from '@/components/Upload/ExcelUpload.vue'
import MixinTable from '@/mixins/mixin-table'
import { fetchList, create } from '@/api/common'
@Component({
  name: 'TransactionIndex',
  components: {
    DetailsDrawer,
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '事务'
  subject = 'sbStaffLeave'
  url = '/api/v1/leaves'

  statusOptions = [
    { label: '待审核', value: 'PENDING' },
    { label: '已通过', value: 'PASSED' },
    { label: '已驳回', value: 'REJECTED' }
  ]

  formData: any = {}
  typeOptions: any[] = []
  dialogVisible = false
  dialogLoading = false
  dialogTitle = ''
  private created() {
    this.fetch()
    fetchList('/api/v1/dict/entries', { dictCode: 'TRANSACTION_TYPE' }).then(
      (res: any) => {
        this.typeOptions = res.records
      }
    )
  }

  private columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220
    },
    //ellipsis: true,

    {
      title: '姓名',
      dataIndex: 'realName',
      width: 100
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      scopedSlots: { customRender: 'avatar' },
      width: 70
    },
    {
      title: '离队日期',
      dataIndex: 'leaveAt',
      width: 120
    },
    {
      title: '归队日期',
      dataIndex: 'backAt',
      width: 120
    },
    {
      title: '天数',
      dataIndex: 'days',
      width: 80
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      scopedSlots: { customRender: 'status' },
      width: 120
    },
    {
      title: '事务类型',
      dataIndex: 'type',
      width: 90,
      scopedSlots: { customRender: 'type' }
    },

    {
      title: '备注',
      dataIndex: 'description',
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

  getTypeName(type: number) {
    let find = this.typeOptions.find((item: any) => {
      return parseInt(item.dictEntryValue) === type
    })

    return find ? find.dictEntryName : ''
  }
  onAuditClick(id: string, isPass: boolean) {
    this.dialogVisible = true
    this.formData.id = id
    this.formData.isPass = isPass
    this.dialogTitle = isPass
      ? '确定要通过该条申请吗?'
      : '确定要驳回该条申请吗?'
  }

  confirm() {
    this.dialogLoading = true
    create('/api/v1/leaves/audit/' + this.formData.id, this.formData)
      .then((res: any) => {
        this.$notification.success({
          message: '成功',
          description: '审核成功'
        })
        this.fetch()
      })
      .finally(() => {
        this.dialogLoading = false
        this.dialogVisible = false
      })
  }
  cancel() {
    this.dialogVisible = false
    this.formData.description = ''
  }
}
</script>
