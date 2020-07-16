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
            <a-form-model-item label="月份">
              <a-month-picker
                placeholder="Select month"
                style="width: 100%"
                @change="onChange"
                :defaultValue="curMoment"
                :allowClear="false"
              />
              <br />
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="所属机队">
              <a-select v-model="listQuery.teamId" placeholder="请选择机队名称">
                <a-select-option :key="''">
                  全部
                </a-select-option>
                <a-select-option v-for="item in teams" :key="item.id">
                  {{ item.teamName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <template v-if="expand">
            <a-col :md="8" :sm="24">
              <a-form-model-item label="所属机组">
                <a-select
                  v-model="listQuery.groupId"
                  placeholder="请选择机队名称"
                >
                  <a-select-option :key="''">
                    全部
                  </a-select-option>
                  <a-select-option v-for="item in groups" :key="item.id">
                    {{ item.groupName }}
                  </a-select-option>
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
      <a-button type="primary" icon="sync" @click="generate('CURRENT')">
        生成本月
      </a-button>
      <a-button type="primary" icon="sync" @click="generate('NEXT')">
        生成下月
      </a-button>
      <!-- <excel-upload :name="subject" :on-success="onExcelSuccess"></excel-upload>
      <a-button type="primary" icon="export" @click="exportExcel">
        导出
      </a-button> -->
    </div>

    <a-table
      :columns="columns"
      :pagination="pagination"
      :data-source="tableData"
      :bordered="true"
      :loading="loading"
      :row-key="record => record.id"
      @change="handleTableChange"
      :scroll="{ x: 2600 }"
    >
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>

      <span slot="team_id" slot-scope="team_id">
        {{ getTeamName(team_id) }}
      </span>
      <span slot="group_id" slot-scope="group_id">
        {{ getGroupName(group_id) }}
      </span>
    </a-table>
    <!-- 生成表单 -->
    <a-modal
      :visible="generateShow"
      :title="generateTitle"
      :confirm-loading="generateLoading"
      okText="生成"
      @cancel="
        () => {
          generateShow = false
        }
      "
      @ok="handleGenerate('generateForm')"
    >
      <a-form-model
        ref="generateForm"
        :model="generateForm"
        :rules="generateRules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-model-item label="开始日期" prop="startAt">
          {{ generateForm.startAt }}
        </a-form-model-item>
        <a-form-model-item label="结束日期" prop="endAt">
          {{ generateForm.endAt }}
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import MixinTable from '@/mixins/mixin-table'
import { fetchList, create, update } from '@/api/common'
import moment from 'moment'

@Component({
  name: 'ArrangeTable',
  components: {}
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '排班表'
  url = '/api/v1/scheduling/staff'
  generateShow = false
  generateTitle = ''
  generateLoading = false
  generateForm: any = {
    startAt: null,
    endAt: null
  }
  generateRules = {}

  groups: any[] = []

  teams: any[] = []

  curMoment = moment()

  private columns: any[] = []
  private created() {
    console.log('---', this.pagination)
    this.listQuery.startAt = moment()
      .startOf('month')
      .format('YYYY-MM-DD')
    this.listQuery.endAt = moment()
      .endOf('month')
      .format('YYYY-MM-DD')
    this.fetch()
    fetchList('/api/v1/staff/teams', { current: 1, size: 9999 }).then(
      (res: any) => {
        this.teams = res.records
      }
    )

    fetchList('/api/v1/staff/groups', { current: 1, size: 9999 }).then(
      (res: any) => {
        this.groups = res.records
      }
    )
  }

  generate(generateType: string) {
    if (generateType === 'CURRENT') {
      this.generateTitle = '生成本月数据'
      this.generateForm.startAt = moment().format('YYYY-MM-DD')
      this.generateForm.endAt = moment()
        .endOf('month')
        .format('YYYY-MM-DD')
    } else {
      this.generateTitle = '生成下月数据'
      this.generateForm.startAt = moment()
        .add(1, 'month')
        .startOf('month')
        .format('YYYY-MM-DD')
      this.generateForm.endAt = moment()
        .add(1, 'month')
        .endOf('month')
        .format('YYYY-MM-DD')
    }

    this.generateShow = true
  }

  handleGenerate(formName: string) {
    let el: any = this.$refs[formName]
    el.validate((valid: boolean) => {
      if (valid) {
        this.generateLoading = true
        create('/api/v1/scheduling/gen', this.generateForm)
          .then(res => {
            this.$notification.success({
              message: '成功',
              description: '生成数据成功'
            })
            this.fetch()
          })
          .catch((e: any) => {
            this.$notification.error({
              message: '失败',
              description: '生成数据失败' + e
            })
          })
          .finally(() => {
            this.generateShow = false
            this.generateLoading = false
          })
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  onChange(moment: any, dateString: any) {
    this.listQuery.startAt = moment.startOf('month').format('YYYY-MM-DD')
    this.listQuery.endAt = moment.endOf('month').format('YYYY-MM-DD')
  }

  onSearchSuccess() {
    console.log(this.tableData)
    this.columns = [
      {
        dataIndex: 'team_id',
        title: '机队',
        width: 120,
        scopedSlots: { customRender: 'team_id' }
      },
      {
        dataIndex: 'group_id',
        title: '机组',
        width: 120,
        scopedSlots: { customRender: 'group_id' }
      },
      {
        dataIndex: 'real_name',
        title: '司机名称',
        width: 120
      }
    ]
    let start: any = moment(this.listQuery.startAt, 'YYYY-MM-DD')
    let endAt: any = moment(this.listQuery.endAt, 'YYYY-MM-DD')
    let dura = endAt.format('x') - start.format('x')
    let duratime = moment.duration(dura)
    for (let i = 0; i <= duratime.days(); i++) {
      let temp = moment(this.listQuery.startAt, 'YYYY-MM-DD').add(i, 'days')
      this.columns.push({
        dataIndex: temp.format('YYYY-MM-DD'),
        title: i + 1,
        width: 50
      })
    }
    console.log('columns', this.columns)
    console.log('data', this.tableData)
  }

  getTeamName(val: string) {
    const find = this.teams.find((item: any) => {
      return item.id === val
    })
    return find ? find.teamName : ''
  }

  getGroupName(val: string) {
    const find = this.groups.find((item: any) => {
      return item.id === val
    })
    return find ? find.groupName : ''
  }
}
</script>
