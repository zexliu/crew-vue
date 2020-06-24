<template>
  <div>
    <a-drawer
      :title="
        type === 'ADD'
          ? '新增' + subjectTitle
          : type === 'EDIT'
          ? '编辑' + subjectTitle
          : subjectTitle + '详情'
      "
      width="70%"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-skeleton :loading="showSkeleton">
        <a-form-model
          ref="form"
          :model="formData"
          :labelCol="{ span: 2 }"
          :wrapperCol="{ span: 22 }"
          :rules="rules"
        >
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-model-item
                label="交路计划"
                prop="tableId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-select @change="onRouteChanged">
                  <a-select-option v-for="item in tables" :key="item.id">
                    {{ item.tableName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                label="出勤时间"
                prop="attendanceAtMoment"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-time-picker
                  style="width:100%;"
                  v-model="formData.attendanceAtMoment"
                />
              </a-form-model-item>

              <a-form-model-item
                label="接车地点"
                prop="meetStationId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-select>
                  <a-select-option v-for="item in stations" :key="item.id">
                    {{ item.stationName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="班次"
                prop="shiftId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-select>
                  <a-select-option v-for="item in shifts" :key="item.id">
                    {{ item.shiftName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                label="接车时间"
                prop="meetAtMoment"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-time-picker
                  style="width:100%;"
                  v-model="formData.meetAtMoment"
                />
              </a-form-model-item>

              <a-form-model-item
                label="退勤车次"
                prop="backTrainNo"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-input
                  style="width:100%;"
                  v-model="formData.backTrainNo"
                ></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="出勤地点"
                prop="attendanceStationId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-select>
                  <a-select-option v-for="item in stations" :key="item.id">
                    {{ item.stationName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                label="接车车次"
                prop="meetTrainNo"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-input
                  style="width:100%;"
                  v-model="formData.meetTrainNo"
                ></a-input>
              </a-form-model-item>
              <a-form-model-item
                label="退勤地点"
                prop="backStationId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-select>
                  <a-select-option v-for="item in stations" :key="item.id">
                    {{ item.stationName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="行驶里程" prop="distance">
            {{ distance }}KM
          </a-form-model-item>
          <a-form-model-item label="开行交路" prop="runtimeItemIds">
            {{ trainNumberString }}
          </a-form-model-item>
        </a-form-model>
        <a-divider>列车运行时刻信息</a-divider>
        <div class="table-operator">
          <a-form-model
            v-model="listQuery"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 18 }"
          >
            <a-row :gutter="16">
              <a-col :span="6">
                <a-form-model-item label="车次">
                  <a-input
                    v-model="listQuery.trainNo"
                    placeholder="请输入车次"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="始发站">
                  <a-select
                    default-value=""
                    v-model="listQuery.startStationId"
                    style="width: 100%"
                    placeholder="请选择始发站"
                  >
                    <a-select-option value="">
                      全部
                    </a-select-option>
                    <a-select-option v-for="item in stations" :key="item.id">
                      {{ item.stationName }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="终点站">
                  <a-select
                    default-value=""
                    v-model="listQuery.endStationId"
                    style="width: 100%"
                    placeholder="请选择终点站站"
                  >
                    <a-select-option value="">
                      全部
                    </a-select-option>
                    <a-select-option v-for="item in stations" :key="item.id">
                      {{ item.stationName }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-button type="primary" @click="handleSearch()">查询</a-button>
                <a-button style="margin-left: 8px" @click="handleResetSearch()"
                  >重置</a-button
                >
              </a-col>
            </a-row>
          </a-form-model>

          <!-- <excel-upload :name="subject" :on-success="onExcelSuccess"></excel-upload>
      <a-button type="primary" icon="export" @click="exportExcel">
        导出
      </a-button> -->
        </div>
        <a-table
          :columns="columns"
          :data-source="tableData"
          :bordered="true"
          :loading="tableLoading"
          :row-key="record => record.id"
          :pagination="pagination"
          @change="handleTableChange"
          :row-selection="{
            selectedRowKeys: selectedRowKeys,
            onChange: onTableSelectChange,
            hideDefaultSelections: true
          }"
        >
        </a-table>

        <div
          v-if="type !== 'INFO'"
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1
          }"
        >
          <a-button :style="{ marginRight: '8px' }" @click="onClose">
            取消
          </a-button>
          <a-button
            type="primary"
            :loading="loading"
            @click="submitForm('form')"
          >
            确认
          </a-button>
        </div>
      </a-skeleton>
    </a-drawer>
  </div>
</template>
<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator'
import MixinDetails from '@/mixins/mixin-details'
import moment from 'moment'
import { fetchList } from '../../../api/common'

interface TableReq {
  groupName: string
  description: string
  seq: number
  tableId: string
  runtimeItemIds: string[]
}

const defaultForm: TableReq = {
  groupName: '',
  description: '',
  tableId: '',
  seq: 0,
  runtimeItemIds: []
}
const defaultListQuery = {
  current: 1,
  size: 5
}

@Component({
  name: 'DetailsDrawer'
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/shift/groups'
  protected subjectTitle = '交路计划项'
  protected formData = Object.assign({}, defaultForm)

  get distance() {
    let value = 0

    for (let i = 0; i < this.selectedRows.length; i++) {
      value += this.selectedRows[i].distance
    }
    return value
  }

  get trainNumberString() {
    let value = ''

    for (let i = 0; i < this.selectedRows.length; i++) {
      value += this.selectedRows[i].trainNo
      if (i != this.selectedRows.length - 1) {
        value += '--->'
      }
    }
    return value
  }

  @Prop({ type: Array, default: [] })
  private tables!: any[]

  @Prop({ type: Array, default: [] })
  private shifts!: any[]

  @Prop({ type: Array, default: [] })
  private stations!: any[]

  protected listQuery: any = Object.assign({}, defaultListQuery)

  private tableData: any[] = []

  private tableLoading = false

  private runtimeTableId: string | null = null

  private selectedRowKeys: string[] = []

  private selectedRows: any[] = []

  protected pagination = {
    showQuickJumper: true,
    showLessItems: true,
    total: 0,
    pageSize: 5,
    current: 1
  }

  private columns = [
    {
      dataIndex: 'trainNo',
      title: '车次',
      width: 120
    },

    {
      title: '始发站',
      dataIndex: 'startStationName',
      width: 160
    },
    {
      title: '终点站',
      dataIndex: 'endStationName',
      width: 160
    },
    {
      title: '总里程(KM)',
      dataIndex: 'distance',
      width: 120
    },

    {
      title: '开点',
      dataIndex: 'startAt',
      width: 120
    },
    {
      title: '到点',
      dataIndex: 'endAt',
      width: 120
    }
  ]
  private rules = {
    groupName: [
      { required: true, message: '请输入班次组名称', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在2-30之间', trigger: 'blur' }
    ],
    description: [{ max: 200, message: '长度在200之内', trigger: 'blur' }]
  }

  protected handleSearch() {
    this.pagination.current = 1
    this.fetchRuntimeItems()
  }
  //查询重置
  protected handleResetSearch() {
    this.listQuery = Object.assign({}, defaultListQuery)
  }

  //table 改变重新加载数据
  protected handleTableChange(pagination: any) {
    this.pagination = pagination
    this.fetchRuntimeItems()
  }

  protected onLoadDataSuccess() {
    this.onRouteChanged(this.formData.tableId)
  }

  private onRouteChanged(value: string) {
    let temp = this.tables.find(item => {
      return item.id === value
    })

    this.runtimeTableId = temp ? temp.runtimeTableId : null
    this.handleSearch()
  }

  fetchRuntimeItems() {
    this.listQuery.current = this.pagination.current
    this.listQuery.size = this.pagination.pageSize
    if (this.runtimeTableId) {
      this.tableLoading = true
      this.listQuery.tableId = this.runtimeTableId
      fetchList('/api/v1/runtime/items', this.listQuery)
        .then((res: any) => {
          this.tableData = res.records
          this.pagination.total = res.total
        })
        .finally(() => {
          this.tableLoading = false
        })
    } else {
      this.tableData = []
    }
  }

  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
  }

  onTableSelectChange(selectedRowKeys: string[], selectedRows: any[]) {
    //新增
    if (selectedRowKeys.length > this.selectedRowKeys.length) {
      for (let i = 0; i < selectedRows.length; i++) {
        let find = this.selectedRows.find(item => {
          return item.id === selectedRows[i].id
        })

        if (!find) {
          this.selectedRows.push(selectedRows[i])
        }
      }
    } else {
      //移除
      for (let i = 0; i < this.selectedRowKeys.length; i++) {
        let find = selectedRowKeys.find(item => {
          return item === this.selectedRowKeys[i]
        })

        if (!find) {
          this.selectedRows = this.selectedRows.filter(item => {
            return item.id !== this.selectedRowKeys[i]
          })
        }
      }
    }

    this.selectedRowKeys = selectedRowKeys
  }
}
</script>
