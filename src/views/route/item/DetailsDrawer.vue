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
                <a-select @change="onRouteChanged" v-model="formData.tableId">
                  <a-select-option v-for="item in tables" :key="item.id">
                    {{ item.tableName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                label="出勤时间"
                prop="attendanceAtMoment"
                v-model="formData.attendanceAtMoment"
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
                <a-select v-model="formData.meetStationId">
                  <a-select-option v-for="item in stations" :key="item.id">
                    {{ item.stationName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                label="退勤时间"
                prop="backAtMoment"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-time-picker
                  style="width:100%;"
                  v-model="formData.backAtMoment"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="班次"
                prop="shiftId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-select v-model="formData.shiftId">
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
                prop="backRuntimeItemId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-select
                  show-search
                  v-model="formData.backRuntimeItemId"
                  placeholder="请输入退勤车次"
                  style="width: 100%"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="handleBackSearch"
                >
                  <a-select-option
                    v-for="item in backRuntimeItems"
                    :key="item.id"
                  >
                    {{ item.trainNo }}
                  </a-select-option>
                </a-select>
                <!-- <a-input
                  style="width:100%;"
                  v-model="formData.backTrainNo"
                ></a-input> -->
              </a-form-model-item>
              <a-form-model-item
                label="备注"
                prop="remark"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-input v-model="formData.remark"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="出勤地点"
                prop="attendanceStationId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-select v-model="formData.attendanceStationId">
                  <a-select-option v-for="item in stations" :key="item.id">
                    {{ item.stationName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                label="接车车次"
                prop="meetRuntimeItemId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-select
                  show-search
                  v-model="formData.meetRuntimeItemId"
                  placeholder="请输入接车车次"
                  style="width: 100%"
                  :default-active-first-option="false"
                  :show-arrow="false"
                  :filter-option="false"
                  :not-found-content="null"
                  @search="handleMeetSearch"
                >
                  <a-select-option
                    v-for="item in meetRuntimeItems"
                    :key="item.id"
                  >
                    {{ item.trainNo }}
                  </a-select-option>
                </a-select>
                <!-- <a-input
                  style="width:100%;"
                  v-model="formData.meetTrainNo"
                ></a-input> -->
              </a-form-model-item>
              <a-form-model-item
                label="退勤地点"
                prop="backStationId"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-select v-model="formData.backStationId">
                  <a-select-option v-for="item in stations" :key="item.id">
                    {{ item.stationName }}
                  </a-select-option>
                </a-select>
              </a-form-model-item>

              <a-form-model-item
                label="描述"
                prop="description"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                <a-input v-model="formData.description"></a-input>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row :gutter="16">
            <a-col :span="16">
              <a-form-model-item
                label="开行交路"
                prop="runtimeItemIds"
                :labelCol="{ span: 3 }"
                :wrapperCol="{ span: 21 }"
              >
                {{ trainNumberString }}
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-form-model-item
                label="行驶里程"
                prop="distance"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 18 }"
              >
                {{ distance }}KM
              </a-form-model-item>
            </a-col>
          </a-row>
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
import message from 'ant-design-vue/es/message'

interface TableReq {
  tableId: string | null
  shiftId: string | null
  routeItemNo: string
  attendanceStationId: string | null
  attendanceAt: string
  attendanceAtMoment: any
  meetAt: string
  meetAtMoment: any
  meetRuntimeItemId: string | null
  meetStationId: string | null
  backRuntimeItemId: string | null
  backStationId: string | null
  backAt: string
  backAtMoment: any
  distance: number
  remark: string
  description: string
  runtimeItemIds: string[]
  meetRuntimeItem: any
  backRuntimeItem: any
  runtimeItems: any[]
  runtimeTableId: string | null
  trainNoDescriptions: string
}

const defaultForm: TableReq = {
  tableId: null,
  shiftId: null,
  routeItemNo: '',
  attendanceStationId: null,
  attendanceAt: '',
  attendanceAtMoment: null,
  meetAt: '',
  meetAtMoment: null,
  meetRuntimeItemId: null,
  meetStationId: null,
  backRuntimeItemId: null,
  backStationId: null,
  backAt: '',
  backAtMoment: null,
  distance: 0,
  remark: '',
  description: '',
  runtimeItemIds: [],
  meetRuntimeItem: null,
  backRuntimeItem: null,
  runtimeItems: [],
  runtimeTableId: null,
  trainNoDescriptions: ''
}
const defaultListQuery = {
  current: 1,
  size: 5
}

@Component({
  name: 'DetailsDrawer'
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/route/items'
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

  private meetRuntimeItems: any[] = []

  private backRuntimeItems: any[] = []

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
    tableId: [{ required: true, message: '请选择交路计划', trigger: 'blur' }],
    shiftId: [{ required: true, message: '请选择班次', trigger: 'blur' }],
    attendanceStationId: [
      { required: true, message: '请选择出勤地点', trigger: 'change' }
    ],
    attendanceAtMoment: [
      { required: true, message: '请选择出勤时间', trigger: 'change' }
    ],
    meetAtMoment: [
      { required: true, message: '请选择接车时间', trigger: 'change' }
    ],
    backAtMoment: [
      { required: true, message: '请选择退勤时间', trigger: 'change' }
    ],
    meetRuntimeItemId: [
      { required: true, message: '请选择接车车次', trigger: 'change' }
    ],
    meetStationId: [
      { required: true, message: '请选择接车地点', trigger: 'change' }
    ],
    backRuntimeItemId: [
      { required: true, message: '请选择退勤车次', trigger: 'change' }
    ],
    backStationId: [
      { required: true, message: '请选择退勤地点', trigger: 'change' }
    ],
    runtimeItemIds: [
      {
        required: true,
        message: '请在下方表格中选择出行交路',
        trigger: 'change',
        type: 'array',
        min: 1
      }
    ],
    description: [{ max: 200, message: '长度在200之内', trigger: 'change' }],
    remark: [{ max: 200, message: '长度在200之内', trigger: 'change' }]
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
    this.runtimeTableId = this.formData.runtimeTableId
    this.handleSearch()
    this.formData.attendanceAtMoment = moment(
      this.formData.attendanceAt,
      'hh:mm:ss'
    )

    this.formData.meetAtMoment = moment(this.formData.meetAt, 'hh:mm:ss')
    this.formData.backAtMoment = moment(this.formData.backAt, 'hh:mm:ss')
    this.meetRuntimeItems = [this.formData.meetRuntimeItem]
    this.backRuntimeItems = [this.formData.backRuntimeItem]
    this.selectedRowKeys = []
    this.selectedRows = []

    this.formData.runtimeItems.forEach((item: any) => {
      this.selectedRowKeys.push(item.id)
    })
    this.$set(this.formData, 'runtimeItemIds', this.selectedRowKeys)

    this.selectedRows = this.formData.runtimeItems
  }

  private onRouteChanged(value: string) {
    let temp = this.tables.find(item => {
      return item.id === value
    })
    this.runtimeTableId = temp ? temp.runtimeTableId : null
    this.formData.meetStationId = null
    this.formData.backStationId = null
    this.meetRuntimeItems = []
    this.backRuntimeItems = []
    this.onTableSelectChange([], [])
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
    this.$set(this.formData, 'runtimeItemIds', selectedRowKeys)
  }

  handleMeetSearch(value: string) {
    fetchList('/api/v1/runtime/items', {
      tableId: this.runtimeTableId,
      trainNo: value,
      current: 1,
      size: 50
    }).then((res: any) => {
      this.meetRuntimeItems = res.records
    })
  }

  handleBackSearch(value: string) {
    fetchList('/api/v1/runtime/items', {
      tableId: this.runtimeTableId,
      trainNo: value,
      current: 1,
      size: 50
    }).then((res: any) => {
      this.backRuntimeItems = res.records
    })
  }

  protected beforeEditData() {
    // console.log(
    //   'before',
    //   this.formData.attendanceAtMoment.format('hh:mm:ss'),
    //   this.formData.meetAtMoment.format('hh:mm:ss'),
    //   this.formData.backAtMoment.format('hh:mm:ss')
    // )
    this.formData.attendanceAt = this.formData.attendanceAtMoment.format(
      'hh:mm:ss'
    )
    this.formData.meetAt = this.formData.meetAtMoment.format('hh:mm:ss')
    this.formData.backAt = this.formData.backAtMoment.format('hh:mm:ss')
    this.formData.distance = this.distance
    this.formData.trainNoDescriptions = this.trainNumberString
  }

  protected beforeAddData() {
    this.beforeEditData()
  }
}
</script>
