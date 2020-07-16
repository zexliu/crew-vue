<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model
        v-model="listQuery"
        :labelCol="{ span: 6 }"
        :wrapperCol="{ span: 18 }"
      >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="日期">
              <a-range-picker @change="onChange" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="司机名称">
              <a-select
                show-search
                v-model="listQuery.staffId"
                placeholder="请输入司机名称"
                style="width: 100%"
                :default-active-first-option="false"
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="handleStaffSearch"
              >
                <a-select-option v-for="item in staffs" :key="item.id">
                  {{ item.realName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <template v-if="expand">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="测酒结果">
                <a-select
                  default-value=""
                  v-model="listQuery.alcoholResult"
                  style="width: 100%"
                  placeholder="请选择测酒结果"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option
                    v-for="item in alcoholOptions"
                    :key="item.value"
                  >
                    {{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="出勤状态">
                <a-select
                  default-value=""
                  v-model="listQuery.attendanceStatus"
                  style="width: 100%"
                  placeholder="请选择出勤状态"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option
                    v-for="item in attendanceOptions"
                    :key="item.value"
                  >
                    {{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="退勤状态">
                <a-select
                  default-value=""
                  v-model="listQuery.backStatus"
                  style="width: 100%"
                  placeholder="请选择退勤状态"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option
                    v-for="item in backOptions"
                    :key="item.value"
                  >
                    {{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="考试结果">
                <a-select
                  default-value=""
                  v-model="listQuery.answerStatus"
                  style="width: 100%"
                  placeholder="请选考试结果"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option
                    v-for="item in answerOptions"
                    :key="item.value"
                  >
                    {{ item.label }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </template>
          <a-col :md="(!expand && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(expand && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="handleSearch()">查询</a-button>
              <a-button style="margin-left: 8px" @click="handleResetSearch()"
                >重置</a-button
              >
              <a @click="expandToggle" style="margin-left: 8px">
                {{ expand ? '收起' : '展开' }}
                <a-icon :type="expand ? 'up' : 'down'" />
              </a>
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
      :scroll="{ x: 1000 }"
    >
      <span slot="alcoholResult" slot-scope="alcoholResult">
        <a-tag v-if="alcoholResult == 0" color="green">
          正常
        </a-tag>
        <a-tag v-if="alcoholResult == 1" color="orange">
          饮酒
        </a-tag>
        <a-tag v-if="alcoholResult == 2" color="red">
          酗酒
        </a-tag>
      </span>

      <span slot="attendanceStatus" slot-scope="attendanceStatus">
        <a-tag v-if="attendanceStatus == 0">
          未出勤
        </a-tag>
        <a-tag v-if="attendanceStatus == 1" color="green">
          正常
        </a-tag>
        <a-tag v-if="attendanceStatus == 2" color="orange">
          迟到
        </a-tag>
      </span>

      <span slot="backStatus" slot-scope="backStatus">
        <a-tag v-if="backStatus == 0">
          未退勤
        </a-tag>
        <a-tag v-if="backStatus == 1" color="green">
          正常
        </a-tag>
        <a-tag v-if="backStatus == 2" color="orange">
          早退
        </a-tag>
      </span>
      <span slot="duration" slot-scope="duration">
        {{ formatDuration(duration) }}
      </span>
      <span slot="shiftGroupId" slot-scope="shiftGroupId">
        {{ getShiftGroupName(shiftGroupId) }}
      </span>
      <span slot="staffTeamId" slot-scope="staffTeamId">
        {{ getStaffTeamName(staffTeamId) }}
      </span>
      <span slot="staffGroupId" slot-scope="staffGroupId">
        {{ getStaffGroupName(staffGroupId) }}
      </span>
      <span slot="avatar" slot-scope="avatar">
        <a-avatar :src="avatar" size="large" />
      </span>
      <span slot="staffs" slot-scope="staffs">
        <a-list :grid="{ gutter: 16, column: 4 }" :data-source="staffs">
          <a-list-item slot="renderItem" slot-scope="item">
            <div style="width:148px; text-align: center;">
              <a-avatar
                shape="square"
                :size="100"
                icon="user"
                :src="item.avatar"
              />
              <h6 style="margin-top: 8px;">
                {{ item.realName }}
              </h6>
            </div>
          </a-list-item>
        </a-list>
      </span>
    </a-table>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import MixinTable from '@/mixins/mixin-table'
import { fetchList } from '@/api/common'
import moment from 'moment'
@Component({
  name: 'ArrangeDayIndex'
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '排班日计划'
  subject = 'sbRouteItem'
  url = '/api/v1/staff/attendances'
  tables: any[] = []
  shifts: any[] = []
  shiftGroups: any[] = []
  staffGroups: any[] = []
  staffTeams: any[] = []
  alcoholOptions = [
    { label: '正常', value: 0 },
    { label: '饮酒', value: 1 },
    { label: '酗酒', value: 2 }
  ]

  attendanceOptions = [
    { label: '未出勤', value: 0 },
    { label: '正常', value: 1 },
    { label: '迟到', value: 2 }
  ]
  backOptions = [
    { label: '未退勤', value: 0 },
    { label: '正常', value: 1 },
    { label: '早退', value: 2 }
  ]
  answerOptions = [
    { label: '合格', value: 1 },
    { label: '为合格', value: 2 }
  ]
  staffs: any[] = []

  private created() {
    fetchList('/api/v1/route/tables', {
      current: 1,
      size: 99999
    }).then((res: any) => {
      this.tables = res.records
    })

    fetchList('/api/v1/shifts', {
      current: 1,
      size: 99999
    }).then((res: any) => {
      this.shifts = res.records
    })

    fetchList('/api/v1/staff/teams', {
      current: 1,
      size: 99999
    }).then((res: any) => {
      this.staffTeams = res.records
    })

    fetchList('/api/v1/staff/groups', {
      current: 1,
      size: 99999
    }).then((res: any) => {
      this.staffGroups = res.records
    })

    fetchList('/api/v1/shift/groups', {
      current: 1,
      size: 99999
    }).then((res: any) => {
      this.shiftGroups = res.records
    })

    this.fetch()
  }

  // private upOptions = [
  //   { name: '全部', value: '' },
  //   { name: '下行', value: 'false' },
  //   { name: '上行', value: 'true' }
  // ]

  private columns = [
    {
      dataIndex: 'routeItemNo',
      title: '交路号',
      width: 100
    },
    {
      dataIndex: 'date',
      title: '日期',
      width: 120
    },
    {
      title: '机队',
      dataIndex: 'staffTeamId',
      width: 120,
      scopedSlots: { customRender: 'staffTeamId' }
    },
    {
      title: '机组',
      dataIndex: 'staffGroupId',
      width: 120,
      scopedSlots: { customRender: 'staffGroupId' }
    },
    {
      dataIndex: 'realName',
      title: '司机姓名',
      width: 140
    },
    {
      title: '司机头像',
      dataIndex: 'avatar',
      width: 100,
      scopedSlots: { customRender: 'avatar' }
    },

    {
      dataIndex: 'answerAccuracy',
      title: '考试分数',
      width: 100
    },
    {
      dataIndex: 'alcoholValue',
      title: '测酒值',
      width: 100
    },
    {
      dataIndex: 'alcoholResult',
      title: '测酒结果',
      scopedSlots: { customRender: 'alcoholResult' },
      width: 100
    },
    {
      dataIndex: 'attendanceStatus',
      title: '出勤状态',
      scopedSlots: { customRender: 'attendanceStatus' },
      width: 100
    },
    {
      dataIndex: 'backStatus',
      title: '退勤状态',
      scopedSlots: { customRender: 'backStatus' },
      width: 100
    },
    {
      dataIndex: 'duration',
      title: '有效工时',
      scopedSlots: { customRender: 'duration' },
      width: 120
    },
    {
      dataIndex: 'distance',
      title: '行驶里程',
      width: 120
    },
    {
      dataIndex: 'attendanceAt',
      title: '出勤时间',
      width: 120
    },
    {
      dataIndex: 'realAttendanceAt',
      title: '实际出勤',
      width: 120
    },
    {
      dataIndex: 'backAt',
      title: '退勤时间',
      width: 120
    },
    {
      dataIndex: 'realBackAt',
      title: '实际退勤',
      width: 120
    },
    {
      dataIndex: 'attendanceDeviceId',
      title: '出勤设备',
      width: 100
    },
    {
      dataIndex: 'backDeviceId',
      title: '退勤设备',
      width: 100
    }
    // {
    //   dataIndex: 'shiftGroupId',
    //   title: '班次组',
    //   scopedSlots: { customRender: 'shiftGroupId' },
    //   width: 140
    // }
  ]

  getShiftName(id: string) {
    let item = this.shifts.find((el: any) => {
      return el.id === id
    })
    return item ? item.shiftName : ''
  }

  getShiftGroupName(id: string) {
    let item = this.shiftGroups.find((el: any) => {
      return el.id === id
    })
    return item ? item.groupName : ''
  }

  getStaffTeamName(id: string) {
    let item = this.staffTeams.find((el: any) => {
      return el.id === id
    })
    return item ? item.teamName : ''
  }

  getStaffGroupName(id: string) {
    let item = this.staffGroups.find((el: any) => {
      return el.id === id
    })
    return item ? item.groupName : ''
  }

  onChange(moment: any[], dateString: any[]) {
    if (moment.length == 2) {
      this.listQuery.startAt = moment[0].format('YYYY-MM-DD')
      this.listQuery.endAt = moment[1].format('YYYY-MM-DD')
    } else {
      this.listQuery.startAt = null
      this.listQuery.endAt = null
    }
  }

  handleStaffSearch(value: string) {
    if (value) {
      fetchList('/api/v1/staffs', {
        realName: value,
        current: 1,
        size: 50
      }).then((res: any) => {
        this.staffs = res.records
      })
    } else {
      this.staffs = []
    }
  }
  formatDuration(value: number) {
    let minutes = Math.round(value / 60)
    let hour = Math.round(minutes / 60)
    minutes = minutes % 60
    if (hour > 0) {
      return hour + '小时' + minutes + '分钟'
    } else {
      return minutes + '分钟'
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-list-grid .ant-list-item {
  margin-bottom: 0px;
}
</style>
