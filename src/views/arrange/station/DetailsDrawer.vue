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
          <a-form-model-item label="车站名称" prop="stationName">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.stationName"
              placeholder="请输入车站名称"
            ></a-input>
          </a-form-model-item>

          <a-form-model-item label="车站编码" prop="stationCode">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.stationCode"
              placeholder="请输入车站编码"
            ></a-input>
          </a-form-model-item>

          <a-form-model-item label="下一站" prop="nextStationId">
            <a-select
              :disabled="type === 'INFO'"
              v-model="formData.nextStationId"
              placeholder="请选择下站信息"
              style="width: 100%"
            >
              <a-select-option
                v-for="station in stations"
                :key="station.id"
                :disabled="station.id === formData.id"
              >
                {{ station.stationName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="下站距离">
            <a-input-number
              style="width: 100%"
              v-model="formData.nextStationDistance"
              placeholder="请输入下站距离"
              :precision="2"
              :max="100"
              :min="0"
            ></a-input-number>
          </a-form-model-item>

          <a-form-model-item label="排序">
            <a-input-number
              style="width: 100%"
              v-model="formData.seq"
              placeholder="请输入排序"
              :precision="0"
              :max="999999999"
              :min="0"
            ></a-input-number>
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
interface StationReq {
  stationName: string
  stationCode: string
  nextStationId: string
  nextStationDistance: number
  seq: number
  description: string
}

const defaultForm: StationReq = {
  stationName: '',
  stationCode: '',
  nextStationId: '',
  nextStationDistance: 0,
  seq: 0,
  description: ''
}
@Component({
  name: 'DetailsDrawer'
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/stations'
  protected subjectTitle = '车站'
  protected formData = Object.assign({}, defaultForm)
  @Prop({ type: Array, default: [], required: true })
  public stations!: any[]
  private rules = {
    stationName: [
      { required: true, message: '请输入车站名称', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在2-30之间', trigger: 'blur' }
    ],
    stationCode: [
      { required: true, message: '请输入车站编码', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在2-30之间', trigger: 'blur' }
    ],
    description: [{ max: 200, message: '长度在200之内', trigger: 'blur' }]
  }

  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
  }
}
</script>
