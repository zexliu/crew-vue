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
              <a-date-picker
                style="width: 100%"
                :defaultValue="curMoment"
                @change="onChange"
                :allowClear="false"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="班次组">
              <a-select
                default-value=""
                v-model="listQuery.shiftGroupId"
                style="width: 100%"
                placeholder="请选择所属班次"
              >
                <a-select-option value="">
                  全部
                </a-select-option>
                <a-select-option v-for="item in shiftGroups" :key="item.id">
                  {{ item.groupName }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <template v-if="expand">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="交路号">
                <a-input
                  v-model="listQuery.routeItemNo"
                  placeholder="请输入交路号"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="机队">
                <a-select
                  default-value=""
                  v-model="listQuery.staffTeamId"
                  style="width: 100%"
                  placeholder="请选择所属机队"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option v-for="item in staffTeams" :key="item.id">
                    {{ item.teamName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="机组">
                <a-select
                  default-value=""
                  v-model="listQuery.staffGroupId"
                  style="width: 100%"
                  placeholder="请选择所属机组"
                >
                  <a-select-option value="">
                    全部
                  </a-select-option>
                  <a-select-option v-for="item in staffGroups" :key="item.id">
                    {{ item.groupName }}</a-select-option
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
      :row-key="record => record.routeItemNo"
      @change="handleTableChange"
      :scroll="{ x: true }"
    >
      <span slot="shiftGroupId" slot-scope="shiftGroupId">
        {{ getShiftGroupName(shiftGroupId) }}
      </span>
      <span slot="staffTeamId" slot-scope="staffTeamId">
        {{ getStaffTeamName(staffTeamId) }}
      </span>
      <span slot="staffGroupId" slot-scope="staffGroupId">
        {{ getStaffGroupName(staffGroupId) }}
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
  url = '/api/v1/scheduling/day'
  tables: any[] = []
  shifts: any[] = []
  shiftGroups: any[] = []
  staffGroups: any[] = []
  staffTeams: any[] = []

  curMoment = moment()

  private created() {
    this.listQuery.date = this.curMoment.format('YYYY-MM-DD')
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
      width: 140
    },
    {
      dataIndex: 'shiftGroupId',
      title: '班次组',
      scopedSlots: { customRender: 'shiftGroupId' },
      width: 140
    },
    // {
    //   dataIndex: 'shiftId',
    //   title: '班次',
    //   scopedSlots: { customRender: 'shiftId' },
    //   width: 80
    // },
    {
      title: '机队',
      dataIndex: 'staffTeamId',
      width: 140,
      scopedSlots: { customRender: 'staffTeamId' }
    },
    {
      title: '机组',
      dataIndex: 'staffGroupId',
      width: 140,
      scopedSlots: { customRender: 'staffGroupId' }
    },
    { title: '出勤时间', dataIndex: 'attendanceAt', width: 100 },
    { title: '退勤时间', dataIndex: 'backAt', width: 100 },
    {
      title: '司机',
      dataIndex: 'staffs',
      scopedSlots: { customRender: 'staffs' }
    }
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

  onChange(moment: any, dateString: any) {
    this.listQuery.date = moment.format('YYYY-MM-DD')
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-list-grid .ant-list-item {
  margin-bottom: 0px;
}
</style>
