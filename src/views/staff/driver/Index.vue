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
            <a-form-model-item label="所属机队">
              <a-select
                @select="onTeamSelect"
                v-model="listQuery.teamId"
                placeholder="请选择所属机队"
              >
                <a-select-option :key="''">
                  全部
                </a-select-option>
                <a-select-option v-for="item in teams" :key="item.id">
                  {{ item.teamName }}
                </a-select-option>
              </a-select>
              <!-- <a-input
                v-model="listQuery.username"
                placeholder="请输入账号模糊查询"
              /> -->
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="所属机组">
              <a-select
                v-model="listQuery.groupId"
                placeholder="请选择所属机组"
              >
                <a-select-option v-for="item in groups" :key="item.id">
                  {{ item.groupName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <template v-if="expand">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="姓名">
                <a-input
                  v-model="listQuery.realName"
                  placeholder="请输入姓名模糊查询"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="工号">
                <a-input
                  v-model="listQuery.workNo"
                  placeholder="请输入工号模糊查询"
                />
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="机队负责人">
                <a-select
                  default-value=""
                  v-model="listQuery.isTeamLeader"
                  style="width: 100%"
                  placeholder="是否机队负责人"
                >
                  <a-select-option
                    v-for="item in teamLeaderOptions"
                    :key="item.value"
                  >
                    {{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="8" :sm="24">
              <a-form-model-item label="机组负责人">
                <a-select
                  default-value=""
                  v-model="listQuery.isGroupLeader"
                  style="width: 100%"
                  placeholder="请选择锁定状态"
                >
                  <a-select-option
                    v-for="item in groupLeaderOptions"
                    :key="item.value"
                  >
                    {{ item.name }}</a-select-option
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
      :scroll="{ x: true }"
    >
      <span slot="avatar" slot-scope="avatar">
        <a-avatar :src="avatar" size="large" />
      </span>

      <span slot="teamId" slot-scope="teamId">
        {{ getTeamName(teamId) }}
      </span>

      <span slot="groupId" slot-scope="groupId">
        {{ getGroupName(groupId) }}
      </span>

      <span slot="jobTitle" slot-scope="jobTitle">
        {{ getJobTitleName(jobTitle) }}
      </span>
      <span slot="gender" slot-scope="gender">
        <a-tag v-if="gender === 'UNKNOWN'" color="orange">
          未知
        </a-tag>
        <a-tag v-else-if="gender === 'MALE'" color="blue">
          男
        </a-tag>
        <a-tag v-else-if="gender === 'FEMALE'" color="pink">
          女
        </a-tag>
      </span>

      <span slot="birthDay" slot-scope="birthDay">
        {{ birthDay }}
      </span>
      <span slot="safeAt" slot-scope="safeAt">
        {{ safeAt | timeFormatter }}
      </span>
      <span slot="isTeamLeader" slot-scope="isTeamLeader">
        <a-tag v-if="isTeamLeader" color="blue">
          是
        </a-tag>
        <a-tag v-else color="blue">
          否
        </a-tag>
      </span>
      <span slot="isGroupLeader" slot-scope="isGroupLeader">
        <a-tag v-if="isGroupLeader" color="blue">
          是
        </a-tag>
        <a-tag v-else color="blue">
          否
        </a-tag>
      </span>

      <span slot="action" slot-scope="record">
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;" @click="onDetailsClick(record)">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="onEditClick(record)">编辑</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;" @click="onDeleteClick(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </a-table>
    <details-drawer
      :visible="detailsVisible"
      :type="detailsType"
      :selectedKey="selectedKey"
      @close="onDetailsClosed"
      @on-edit-success="onEditSuccess"
      @on-add-success="onAddSuccess"
      :teams="teams"
      :jobTitleOptions="jobTitleOptions"
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
  name: 'StaffIndex',
  components: {
    DetailsDrawer,
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '司机'
  subject = 'sbStaff'
  url = '/api/v1/staffs'

  private teamLeaderOptions = [
    { name: '全部', value: '' },
    { name: '是', value: 'true' },
    { name: '否', value: 'false' }
  ]
  private groupLeaderOptions = [
    { name: '全部', value: '' },
    { name: '是', value: 'true' },
    { name: '否', value: 'false' }
  ]

  private columns = [
    {
      title: '工号',
      dataIndex: 'workNo',
      width: 120
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      width: 120
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      scopedSlots: { customRender: 'avatar' },
      width: 70
    },

    {
      title: '手机号',
      dataIndex: 'mobile',
      width: 140
    },

    {
      title: '邮箱',
      dataIndex: 'email',
      width: 220
    },

    {
      title: '性别',
      dataIndex: 'gender',
      scopedSlots: { customRender: 'gender' },
      width: 70
    },
    {
      title: '生日',
      dataIndex: 'birthDay',
      scopedSlots: { customRender: 'birthDay' },
      width: 120
    },
    {
      title: '所属机队',
      dataIndex: 'teamId',
      scopedSlots: { customRender: 'teamId' },
      width: 200
    },
    {
      title: '所属机组',
      dataIndex: 'groupId',
      scopedSlots: { customRender: 'groupId' },
      width: 200
    },
    {
      title: '机队负责人',
      dataIndex: 'isTeamLeader',
      scopedSlots: { customRender: 'isTeamLeader' },
      width: 110
    },
    {
      title: '机组负责人',
      dataIndex: 'isGroupLeader',
      scopedSlots: { customRender: 'isGroupLeader' },
      width: 110
    },
    {
      title: '职务',
      dataIndex: 'jobTitle',
      scopedSlots: { customRender: 'jobTitle' },
      width: 200
    },

    {
      title: '安全起始时间',
      dataIndex: 'safeAt',
      scopedSlots: { customRender: 'safeAt' },
      width: 200
    },

    {
      title: '操作',
      key: 'operation',
      fixed: 'right',
      width: 100,
      scopedSlots: { customRender: 'action' }
    }
  ]
  jobTitleOptions: any[] = []
  groups: any[] = []
  teams: any[] = []
  allGroups: any[] = []
  private created() {
    this.fetch()
    fetchList('/api/v1/staff/teams', { current: 1, size: 999999 }).then(
      (res: any) => {
        this.teams = res.records
      }
    )
    fetchList('/api/v1/staff/groups', {
      current: 1,
      size: 999999
    }).then((res: any) => {
      this.allGroups = res.records
    })
    fetchList('/api/v1/dict/entries', {
      current: 1,
      size: 999999,
      dictCode: 'JOB_TITLE'
    }).then((res: any) => {
      this.jobTitleOptions = res.records
    })
  }

  private onTeamSelect(val: string) {
    if (this.listQuery.groupId) {
      this.$set(this.listQuery, 'groupId', '')
    }
    if (val) {
      fetchList('/api/v1/staff/groups', {
        current: 1,
        size: 999999,
        teamId: val
      }).then((res: any) => {
        this.groups = res.records
      })
    } else {
      this.groups = []
    }
  }
  protected beforeSearch() {}

  private getTeamName(val: string) {
    let item = this.teams.find((el: any) => {
      return el.id === val
    })
    return item ? item.teamName : ''
  }

  private getGroupName(val: string) {
    let item = this.allGroups.find((el: any) => {
      return el.id === val
    })
    return item ? item.groupName : ''
  }

  private getJobTitleName(val: number) {
    let item = this.jobTitleOptions.find((el: any) => {
      return el.dictEntryValue === String(val)
    })
    return item ? item.dictEntryName : ''
  }
}
</script>
