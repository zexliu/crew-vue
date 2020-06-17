<template>
  <a-card :bordered="false">
    <div class="table-operator">
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
      :scroll="{ x: 1800 }"
    >
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>

      <span slot="submitAt" slot-scope="submitAt">
        {{ submitAt | timeFormatter }}
      </span>

      <span slot="status" slot-scope="status">
        <a-tag v-if="status === 'GENERATED'" color="blue">
          已生成
        </a-tag>
        <a-tag v-if="status === 'SUBMITTED'" color="green">
          已提交
        </a-tag>
        <a-tag v-else>
          未知
        </a-tag>
      </span>
      <span slot="effect" slot-scope="effect">
        <a-tag v-if="effect" color="blue">
          有效
        </a-tag>
        <a-tag v-else>
          无效
        </a-tag>
      </span>

      <!-- <span slot="action" slot-scope="record">
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
      </span> -->
    </a-table>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ExcelUpload from '@/components/Upload/ExcelUpload.vue'
import MixinTable from '@/mixins/mixin-table'
@Component({
  name: 'StoreIndex',
  components: {
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '试卷'
  subject = 'qaDriverQuestionPager'
  url = '/api/v1/question/pager'

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
      dataIndex: 'templateId',
      title: '模板ID',
      width: 220
    },
    {
      dataIndex: 'driverId',
      title: '司机ID',
      width: 220
    },
    {
      dataIndex: 'questionStoreId',
      title: '题库ID',
      width: 220
    },
    {
      title: '总分数',
      dataIndex: 'totalScore',
      width: 100
    },
    {
      title: '司机得分',
      dataIndex: 'driverScore',
      width: 100
    },
    {
      title: '题目数量',
      dataIndex: 'questionCount',
      width: 100
    },
    {
      title: '答题用时',
      dataIndex: 'timeDuration',
      width: 100
    },
    {
      title: '状态',
      dataIndex: 'status',
      scopedSlots: { customRender: 'status' },

      width: 100
    },
    {
      title: '是否有效',
      dataIndex: 'effect',
      scopedSlots: { customRender: 'effect' },
      width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createAt',
      scopedSlots: { customRender: 'createAt' },
      width: 190
    },
    {
      title: '提交时间',
      dataIndex: 'submitAt',
      scopedSlots: { customRender: 'submitAt' },
      width: 190
    }
    // {
    //   title: '操作',
    //   key: 'operation',
    //   fixed: 'right',
    //   width: 120,
    //   scopedSlots: { customRender: 'action' }
    // }
  ]
}
</script>
