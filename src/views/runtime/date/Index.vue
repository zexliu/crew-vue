<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="sync" @click="generate('CURRENT')">
        生成本月
      </a-button>
      <a-button type="primary" icon="sync" @click="generate('NEXT')">
        生成下月
      </a-button>
      <a-button
        :disabled="updateForm.id == null || updateForm.id === undefined"
        type="primary"
        icon="edit"
        @click="
          {
            updateShow = true
          }
        "
      >
        修改
      </a-button>
      <!-- <excel-upload :name="subject" :on-success="onExcelSuccess"></excel-upload>
      <a-button type="primary" icon="export" @click="exportExcel">
        导出
      </a-button> -->
    </div>
    <a-calendar
      @panelChange="onPanelChange"
      @select="onSelect"
      :header-render="headerRender"
    >
      <div
        align="middle"
        slot="dateCellRender"
        slot-scope="value"
        style="width: 100%; height:100%; padding-top : 24px"
      >
        {{ getDateTableName(value) }}
      </div>
    </a-calendar>

    <!-- 生成表单 -->
    <a-modal
      :visible="generateShow"
      :title="generateTitle"
      :width="800"
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
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              :label-col="{ span: 8 }"
              :wrapper-col="{ span: 10 }"
              label="开始日期"
              prop="startAt"
            >
              {{ generateForm.startAt }}
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="结束日期" prop="endAt">
              {{ generateForm.endAt }}
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-form-model-item label="生成规则">
          <a-form-model-item
            label="工作日"
            prop="generateRules.workday"
            :colon="false"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model="generateForm.generateRules.workday"
              placeholder="请选择时刻表"
            >
              <a-select-option v-for="item in tables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="周末"
            prop="generateRules.holiday"
            :colon="false"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model="generateForm.generateRules.holiday"
              placeholder="请选择时刻表"
            >
              <a-select-option v-for="item in tables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <!-- <a-form-model-item
            label="周一"
            prop="generateRules.MONDAY"
            :colon="false"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model="generateForm.generateRules.MONDAY"
              placeholder="请选择时刻表"
            >
              <a-select-option v-for="item in tables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="周二"
            prop="generateRules.TUESDAY"
            :colon="false"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model="generateForm.generateRules.TUESDAY"
              placeholder="请选择时刻表"
            >
              <a-select-option v-for="item in tables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="周三"
            prop="generateRules.WEDNESDAY"
            :colon="false"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model="generateForm.generateRules.WEDNESDAY"
              placeholder="请选择时刻表"
            >
              <a-select-option v-for="item in tables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="周四"
            prop="generateRules.THURSDAY"
            :colon="false"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model="generateForm.generateRules.THURSDAY"
              placeholder="请选择时刻表"
            >
              <a-select-option v-for="item in tables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="周五"
            prop="generateRules.FRIDAY"
            :colon="false"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model="generateForm.generateRules.FRIDAY"
              placeholder="请选择时刻表"
            >
              <a-select-option v-for="item in tables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="周六"
            prop="generateRules.SATURDAY"
            :colon="false"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model="generateForm.generateRules.SATURDAY"
              placeholder="请选择时刻表"
            >
              <a-select-option v-for="item in tables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            label="周日"
            prop="generateRules.SUNDAY"
            :colon="false"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 18 }"
          >
            <a-select
              v-model="generateForm.generateRules.SUNDAY"
              placeholder="请选择时刻表"
            >
              <a-select-option v-for="item in tables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
          </a-form-model-item> -->
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-modal
      :visible="updateShow"
      title="修改时刻表"
      okText="生成"
      @cancel="
        () => {
          updateShow = false
        }
      "
      @ok="handleUpdate('updateForm')"
    >
      <a-form-model
        ref="updateForm"
        :model="updateForm"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-model-item label="日期" prop="date">
          {{ updateForm.date }}
        </a-form-model-item>
        <a-form-model-item label="时刻表" prop="tableId">
          <a-select v-model="updateForm.tableId" placeholder="请选择时刻表">
            <a-select-option v-for="item in tables" :key="item.id">
              {{ item.tableName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>

<script lang="tsx">
import moment from 'moment'
import { Component, Vue } from 'vue-property-decorator'
import { fetchList, create, update } from '@/api/common'
@Component({
  name: 'DateIndex',
  components: {}
})
export default class extends Vue {
  generateForm: any = {
    startAt: null,
    endAt: null,
    generateRules: {}
  }
  generateLoading = false
  generateRules = {
    startAt: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
    endAt: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
    generateRules: {
      workday: [{ required: true, message: '请选择时刻表', trigger: 'blur' }],
      holiday: [{ required: true, message: '请选择时刻表', trigger: 'blur' }]
      // MONDAY: [{ required: true, message: '请选择时刻表', trigger: 'blur' }],
      // TUESDAY: [{ required: true, message: '请选择时刻表', trigger: 'blur' }],
      // WEDNESDAY: [{ required: true, message: '请选择时刻表', trigger: 'blur' }],
      // THURSDAY: [{ required: true, message: '请选择时刻表', trigger: 'blur' }],
      // FRIDAY: [{ required: true, message: '请选择时刻表', trigger: 'blur' }],
      // SATURDAY: [{ required: true, message: '请选择时刻表', trigger: 'blur' }],
      // SUNDAY: [{ required: true, message: '请选择时刻表', trigger: 'blur' }]
    }
  }

  private updateForm: any = {}

  updateShow = false

  generateShow = false
  generateType = ''
  generateTitle = ''
  tableData: any[] = []
  listQuery: any = {
    current: 1,
    size: 9999,
    month: moment().format('YYYY-MM')
  }
  tables: any[] = []

  created() {
    this.fetch(true)
    fetchList('/api/v1/runtime/tables', { current: 1, size: 9999 }).then(
      (res: any) => {
        this.tables = res.records
      }
    )
  }

  fetch(firstIn = false) {
    fetchList('/api/v1/runtime/table/dates', this.listQuery).then(
      (res: any) => {
        this.tableData = res.records
        if (firstIn) {
          let temp = this.tableData.find((item: any) => {
            return moment().format('YYYY-MM-DD') === item.date
          })

          if (temp) {
            this.updateForm = Object.assign({}, temp)
          } else {
            this.updateForm = {}
          }
        }
      }
    )
  }

  onPanelChange(value: any, mode: any) {
    this.listQuery.month = value.format('YYYY-MM')
    this.fetch()
  }

  onSelect(value: any) {
    let temp = this.tableData.find((item: any) => {
      return value.format('YYYY-MM-DD') === item.date
    })

    if (temp) {
      this.updateForm = Object.assign({}, temp)
    } else {
      this.updateForm = {}
    }
  }

  generate(val: any) {
    this.generateType = val
    if (this.generateType === 'CURRENT') {
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

  getDateTableName(value: any) {
    const data = this.tableData.find((item: any) => {
      return item.date === value.format('YYYY-MM-DD')
    })
    if (data) {
      const table = this.tables.find((item: any) => {
        return item.id === data.tableId
      })
      if (table) {
        return table.tableName
      }
    }

    return ''
  }

  handleGenerate(formName: string) {
    let el: any = this.$refs[formName]
    el.validate((valid: boolean) => {
      if (valid) {
        this.generateForm.generateRules.MONDAY = this.generateForm.generateRules.workday

        this.generateForm.generateRules.TUESDAY = this.generateForm.generateRules.workday

        this.generateForm.generateRules.WEDNESDAY = this.generateForm.generateRules.workday

        this.generateForm.generateRules.THURSDAY = this.generateForm.generateRules.workday

        this.generateForm.generateRules.FRIDAY = this.generateForm.generateRules.workday

        this.generateForm.generateRules.SATURDAY = this.generateForm.generateRules.holiday

        this.generateForm.generateRules.SUNDAY = this.generateForm.generateRules.holiday

        delete this.generateForm.generateRules.workday
        delete this.generateForm.generateRules.holiday
        this.generateLoading = true
        create('/api/v1/runtime/table/dates/gen', this.generateForm)
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

  handleUpdate(formName: string) {
    let el: any = this.$refs[formName]
    el.validate((valid: boolean) => {
      if (valid) {
        return update(
          '/api/v1/runtime/table/dates',
          this.updateForm.id,
          this.updateForm
        )
          .then(res => {
            this.$notification.success({
              message: '成功',
              description: '修改成功'
            })

            this.tableData.forEach(element => {
              if (this.updateForm.date === element.date) {
                element.tableId = this.updateForm.tableId
              }
            })
          })
          .catch((e: any) => {
            this.$notification.error({
              message: '失败',
              description: '修改失败' + e
            })
          })
          .finally(() => (this.updateShow = false))
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  headerRender({ value, type, onChange, onTypeChange }: any) {
    const start = 0
    const end = 12
    const monthOptions = []
    const current = value.clone()
    const localeData = value.localeData()
    const months = []
    for (let i = 0; i < 12; i++) {
      current.month(i)
      months.push(localeData.monthsShort(current))
    }

    for (let index = start; index < end; index++) {
      monthOptions.push(
        <a-select-option class="month-item" key={`${index}`}>
          {months[index]}
        </a-select-option>
      )
    }
    const month = value.month()

    const year = value.year()
    const options = []
    for (let i = year - 10; i < year + 10; i += 1) {
      options.push(
        <a-select-option key={i} value={i} class="year-item">
          {i}年
        </a-select-option>
      )
    }
    return (
      <div style={{ padding: '10px' }}>
        <a-row type="flex" justify="end">
          <a-select
            dropdownMatchSelectWidth={false}
            class="my-year-select"
            onChange={(newYear: any) => {
              const now = value.clone().year(newYear)
              onChange(now)
            }}
            value={String(year) + '年'}>
            {options}
          </a-select>
          <a-select
            style={{ marginLeft: '16px' }}
            dropdownMatchSelectWidth={false}
            value={String(month)}
            onChange={(selectedMonth: any) => {
              const newValue = value.clone()
              newValue.month(parseInt(selectedMonth, 10))
              onChange(newValue)
            }}>
            {monthOptions}
          </a-select>
        </a-row>
      </div>
    )
  }
}
</script>

<style></style>
