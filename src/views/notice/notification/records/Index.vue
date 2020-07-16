<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model v-model="listQuery" layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="发布渠道" >
              <a-select
                v-model="listQuery.channelType"
                placeholder="请选择模板类型"
              >
                <a-select-option
                  v-for="item in noticeTypeOptions"
                  :key="item.value"
                  >{{ item.label }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-model-item label="通知标题">
              <a-input
                v-model="listQuery.keywords"
                placeholder="通知标题模糊查询"
              ></a-input>
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
        发布通知
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
      <span slot="channelType" slot-scope="channelType">
        <a-tag v-if="channelType === 'SYSTEM'" color="blue">
          站内
        </a-tag>
        <a-tag v-else-if="channelType === 'EMAIL'" color="green">
          邮件
        </a-tag>
        <a-tag v-else-if="channelType === 'SMS'" color="red">
          短信
        </a-tag>
        <a-tag v-else color="orange">
          APP
        </a-tag>
      </span>
      <span slot="publishType" slot-scope="publishType">
        <a-tag v-if="publishType === 1" color="blue">
          全员
        </a-tag>
        <a-tag v-else-if="publishType === 2" color="green">
          指定用户
        </a-tag>
      </span>
      <!-- <a-tag v-for="tag in tags" :key="tag" color="blue">{{ tag }}</a-tag> -->
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>
      <!-- <span
        slot="templateContent"
        slot-scope="templateContent"
        v-html="templateContent"
      >
      </span> -->

      <span slot="action" slot-scope="record">
        <a @click="onDetailsClick(record)">
          详情
        </a>

        <a-divider type="vertical" />
        <a @click="onDeleteClick(record)">删除</a>
      </span>

      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <h3>模板内容:</h3>
        <span v-html="record.content"></span>
        <h3>参数:</h3>
        <span v-html="record.params"></span>
      </div>
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
import { fetchList, create } from '@/api/common'
import RichEditor from '@/components/RichEditor/Index.vue'

@Component({
  name: 'StoreIndex',
  components: {
    DetailsDrawer,
    ExcelUpload,
    RichEditor
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '通知记录'
  subject = 'sbNoticeTemplate'
  url = '/api/v1/notifications'
  storeOptions: any[] = []
  publishVisible = false
  confirmLoading = false
  formData: any = {}
  private rules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    channelType: [
      { required: true, message: '请选择发布渠道', trigger: 'blur' }
    ],
    publishType: [
      { required: true, message: '请选择发布类型', trigger: 'blur' }
    ],
    userIds: [{ required: true, message: '请指定发布用户', trigger: 'blur' }]
  }

  noticeTypeOptions = [
    { label: '全部', value: '' },
    { label: '站内', value: 'SYSTEM' },
    { label: '邮件', value: 'EMAIL' },
    { label: '短信', value: 'SMS' },
    { label: 'APP', value: 'APP' }
  ]

  private created() {
    this.fetch()
  }

  private columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220
    },
    //ellipsis: true,

    {
      title: '标题',
      dataIndex: 'title',
      width: 120
    },
    {
      title: '发布类型',
      dataIndex: 'publishType',
      scopedSlots: { customRender: 'publishType' },
      width: 120
    },
    {
      title: '发布渠道',
      dataIndex: 'channelType',
      width: 90,
      scopedSlots: { customRender: 'channelType' }
    },
    {
      title: '参数',
      dataIndex: 'params',
      width: 120
    },

    {
      title: '内容',
      dataIndex: 'content',
      ellipsis: true,
      scopedSlots: { customRender: 'templateContent' }
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
      width: 140,
      scopedSlots: { customRender: 'action' }
    }
  ]

  onPublish(value: any) {
    this.publishVisible = true
    this.formData.title = value.templateTitle
    this.formData.content = value.templateContent
    this.formData.channelType = value.channelType
    this.$set(this.formData, 'publishType', 1)
    this.$set(this.formData, 'userIds', [])
  }
}
</script>
