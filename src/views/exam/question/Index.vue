<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model v-model="listQuery" layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="所属题库">
              <a-select
                v-model="listQuery.questionStoreId"
                placeholder="请选择所属题库"
              >
                <a-select-option v-for="item in storeOptions" :key="item.id">{{
                  item.questionStoreName
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-model-item label="试题内容">
              <a-input
                v-model="listQuery.questionContent"
                placeholder="试题内容模糊查询"
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
      <span slot="questionType" slot-scope="questionType">
        <a-tag v-if="questionType === 'SINGLE_CHOICE'" color="blue">
          单选题
        </a-tag>
        <a-tag v-else color="orange">
          多选题
        </a-tag>
      </span>
      <!-- <a-tag v-for="tag in tags" :key="tag" color="blue">{{ tag }}</a-tag> -->
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>
      <span
        slot="questionContent"
        slot-scope="questionContent"
        v-html="questionContent"
      >
      </span>

      <span slot="action" slot-scope="record">
        <a @click="onEditClick(record)">
          <a-icon type="edit" />
          编辑
        </a>

        <a-divider type="vertical" />
        <a @click="onDeleteClick(record)">删除</a>
      </span>

      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <h3>问题内容:</h3>
        <span v-html="record.questionContent"></span>
        <h3>答案选项:</h3>
        <a-row
          v-for="(item, index) in record.questionAnswerItems.split(',')"
          :key="index"
        >
          <span>
            {{ letters[index] + ':   ' + item }}
          </span>
        </a-row>
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
import { fetchList } from '@/api/common'
@Component({
  name: 'StoreIndex',
  components: {
    DetailsDrawer,
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '试题'
  subject = 'qaQuestion'
  url = '/api/v1/questions'
  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
  storeOptions: any[] = []

  private created() {
    this.fetch()
    fetchList('/api/v1/question/stories', { current: 1, size: 999999 }).then(
      (res: any) => {
        this.storeOptions = res.records
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
      title: '试题内容',
      dataIndex: 'questionContent',
      ellipsis: true,
      scopedSlots: { customRender: 'questionContent' }
    },
    {
      title: '试题类型',
      dataIndex: 'questionType',
      width: 90,
      scopedSlots: { customRender: 'questionType' }
    },

    {
      title: '正确答案',
      dataIndex: 'questionAnswer',
      width: 90
    },
    {
      title: '分值',
      dataIndex: 'questionScore',
      width: 90
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
