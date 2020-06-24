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
          <a-form-model-item label="班次名称" prop="shiftName">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.shiftName"
              placeholder="请输入班次组名称"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="所属班次组" prop="shiftGroupId">
            <a-select
              v-model="formData.shiftGroupId"
              placeholder="请选择所属班次组"
            >
              <a-select-option v-for="group in groups" :key="group.id">
                {{ group.groupName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="排序">
            <a-input-number
              style="width: 100%"
              :disabled="type === 'INFO'"
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
interface TableReq {
  shiftName: string
  shiftGroupId: string
  description: string
  seq: number
}

const defaultForm: TableReq = {
  shiftName: '',
  shiftGroupId: '',
  description: '',
  seq: 0
}
@Component({
  name: 'DetailsDrawer'
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/shifts'
  protected subjectTitle = '班次组'
  protected formData = Object.assign({}, defaultForm)
  @Prop({ type: Array, default: [], required: true })
  public groups!: any[]
  private rules = {
    shiftName: [
      { required: true, message: '请输入班次名称', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在2-30之间', trigger: 'blur' }
    ],
    shiftGroupId: [
      { required: true, message: '请选择所属班次组', trigger: 'blur' }
    ],
    description: [{ max: 200, message: '长度在200之内', trigger: 'blur' }]
  }

  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
  }
}
</script>
