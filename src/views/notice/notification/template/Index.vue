<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model v-model="listQuery" layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="模板类型">
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
            <a-form-model-item label="模板标题">
              <a-input
                v-model="listQuery.keywords"
                placeholder="模板标题模糊查询"
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
        <a @click="onPublish(record)">
          <a-icon type="rocket" />
          发布
        </a>
        <a-divider type="vertical" />
        <a @click="onEditClick(record)">
          <a-icon type="edit" />
          编辑
        </a>

        <a-divider type="vertical" />
        <a @click="onDeleteClick(record)">删除</a>
      </span>

      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <h3>模板内容:</h3>
        <span v-html="record.templateContent"></span>
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

    <a-modal
      title="发布通知"
      :width="1024"
      :visible="publishVisible"
      :confirm-loading="confirmLoading"
      @ok="handleOk('form')"
      @cancel="
        {
          publishVisible = false
        }
      "
    >
      <a-form-model
        ref="form"
        :model="formData"
        :labelCol="{ span: 4 }"
        :wrapperCol="{ span: 20 }"
        :rules="rules"
      >
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              label="标题"
              prop="title"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }"
            >
              {{ formData.title }}
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="发布渠道"
              prop="title"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-tag v-if="formData.channelType === 'SYSTEM'" color="blue">
                站内
              </a-tag>
              <a-tag v-else-if="formData.channelType === 'EMAIL'" color="green">
                邮件
              </a-tag>
              <a-tag v-else-if="formData.channelType === 'SMS'" color="red">
                短信
              </a-tag>
              <a-tag v-else color="orange">
                APP
              </a-tag>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="内容" prop="content">
          <span v-html="formData.content"></span>
        </a-form-model-item>
        <a-form-model-item label="参数" prop="params">
          <a-textarea
            v-model="formData.params"
            :placeholder="'请输入Json格式参数'"
          ></a-textarea>
        </a-form-model-item>
        <a-form-model-item label="类型" prop="publishType">
          <a-radio-group v-model="formData.publishType">
            <a-radio :value="1">
              全员
            </a-radio>
            <a-radio :value="2">
              指定
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="用户"
          prop="userIds"
          v-if="formData.publishType == 2"
        >
          <a-select
            v-model="formData.userIds"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择用户"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
            @search="fetchUser"
          >
            <a-select-option v-for="item in users" :key="item.id">
              {{ item.realName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
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
  name: 'NotificationIndex',
  components: {
    DetailsDrawer,
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '通知模板'
  subject = 'sbNoticeTemplate'
  url = '/api/v1/notification/templates'
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

  users = []
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
      title: '模板编码',
      dataIndex: 'templateCode',
      width: 120
    },

    {
      title: '模板标题',
      dataIndex: 'templateTitle',
      width: 120
    },

    {
      title: '发布渠道',
      dataIndex: 'channelType',
      width: 90,
      scopedSlots: { customRender: 'channelType' }
    },
    {
      title: '模板内容',
      dataIndex: 'templateContent',
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
      width: 200,
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
  fetchUser(value: string) {
    console.log('search')
    if (value) {
      fetchList('/api/v1/users', {
        realName: value,
        current: 1,
        size: 50
      }).then((res: any) => {
        this.users = res.records
      })
    } else {
      this.users = []
    }
  }
  protected handleOk(formName: string) {
    let el: any = this.$refs[formName]
    el.validate((valid: boolean) => {
      if (valid) {
        this.confirmLoading = true
        create('/api/v1/notifications', this.formData)
          .then((res: any) => {
            this.$notification.success({
              message: '成功',
              description: '发布通知成功'
            })
          })
          .catch(() => {
            this.$notification.error({
              message: '失败',
              description: '发布通知失败'
            })
          })
          .finally(() => {
            this.confirmLoading = false
            this.publishVisible = false
          })
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
}
</script>
