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
      :width="720"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-skeleton :loading="showSkeleton">
        <a-form-model
          ref="form"
          :model="formData"
          :labelCol="{ span: 6 }"
          :wrapperCol="{ span: 14 }"
          :rules="rules"
        >
          <a-form-model-item label="所属时刻表" prop="tableId">
            <a-select
              :disabled="type === 'INFO'"
              v-model="formData.tableId"
              placeholder="请选择所属时刻表"
              style="width: 100%"
            >
              <a-select-option v-for="item in tables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="车次" prop="trainNo">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.trainNo"
              placeholder="请输入车次"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="服务号" prop="serviceNo">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.serviceNo"
              placeholder="请输入服务号"
            ></a-input>
          </a-form-model-item>

          <a-form-model-item label="始发站" prop="startStationId">
            <a-select
              :disabled="type === 'INFO'"
              v-model="formData.startStationId"
              placeholder="请选择始发站"
              style="width: 100%"
            >
              <a-select-option v-for="station in stations" :key="station.id">
                {{ station.stationName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="终点站" prop="endStationId">
            <a-select
              :disabled="type === 'INFO'"
              v-model="formData.endStationId"
              placeholder="请选择终点站"
              style="width: 100%"
            >
              <a-select-option v-for="station in stations" :key="station.id">
                {{ station.stationName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="总里程">
            <a-input-number
              style="width: 100%"
              v-model="formData.distance"
              placeholder="请输入总里程"
              :precision="2"
              :max="999"
              :min="0"
            ></a-input-number>
          </a-form-model-item>

          <a-form-model-item label="开点">
            <a-time-picker v-model="formData.startAtMoment" />
          </a-form-model-item>
          <a-form-model-item label="到点">
            <a-time-picker v-model="formData.endAtMoment" />
          </a-form-model-item>

          <a-form-model-item label="方向">
            <a-switch
              v-model="formData.up"
              checked-children="上行"
              un-checked-children="下行"
            />
          </a-form-model-item>
          <a-form-model-item label="描述">
            <a-textarea
              v-model="formData.description"
              :disabled="type === 'INFO'"
              placeholder="请输入描述"
              :maxLength="200"
              :auto-size="{ minRows: 4, maxRows: 8 }"
            ></a-textarea>
          </a-form-model-item>
        </a-form-model>
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

interface ItemReq {
  tableId: string
  startStationId: string
  endStationId: string
  trainNo: string
  serviceNo: string
  description: string
  startAtMoment: any
  endAtMoment: any
  startAt: string
  endAt: string
  distance: number
  up: boolean
}

const defaultForm: ItemReq = {
  tableId: '',
  startStationId: '',
  endStationId: '',
  trainNo: '',
  serviceNo: '',
  startAtMoment: null,
  endAtMoment: null,
  startAt: '',
  endAt: '',
  distance: 0,
  up: false,
  description: ''
}
@Component({
  name: 'DetailsDrawer'
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/runtime/items'
  protected subjectTitle = '时刻项'
  protected formData = Object.assign({}, defaultForm)
  @Prop({ type: Array, default: [], required: true })
  public stations!: any[]
  @Prop({ type: Array, default: [], required: true })
  public tables!: any[]
  private rules = {
    tableId: [{ required: true, message: '请选择所属时刻表', trigger: 'blur' }],
    trainNo: [
      { required: true, message: '请输入车次', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在2-30之间', trigger: 'blur' }
    ],
    serviceNo: [
      { required: true, message: '请输入服务号', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在2-30之间', trigger: 'blur' }
    ],
    startStationId: [
      { required: true, message: '请选择起始站', trigger: 'blur' }
    ],
    endStationId: [
      { required: true, message: '请选择终点站', trigger: 'blur' }
    ],

    description: [{ max: 200, message: '长度在200之内', trigger: 'blur' }]
  }

  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
  }

  protected onLoadDataSuccess() {
    this.$set(
      this.formData,
      'startAtMoment',
      this.formData.startAt ? moment(this.formData.startAt, 'HH:mm:ss') : null
    )

    this.$set(
      this.formData,
      'endAtMoment',
      this.formData.endAt ? moment(this.formData.endAt, 'HH:mm:ss') : null
    )
  }

  protected beforeAddData() {
    this.formData.startAt = this.formData.startAtMoment
      ? this.formData.startAtMoment.format('HH:mm:ss')
      : null
    this.formData.endAt = this.formData.endAtMoment
      ? this.formData.endAtMoment.format('HH:mm:ss')
      : null
  }

  protected beforeEditData() {
    this.beforeAddData()
  }
}
</script>
