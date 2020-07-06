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
          <a-form-model-item label="字段名称" prop="fieldName">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.fieldName"
              placeholder="请输入字段名称"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="字段编码" prop="fieldCode">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.fieldCode"
              placeholder="请输入字段编码"
            ></a-input>
          </a-form-model-item>

          <a-form-model-item
            prop="fieldType"
            label="字段类型"
            v-if="type !== 'EDIT'"
          >
            <a-select
              v-model="formData.fieldType"
              style="width: 100%"
              placeholder="请选择字段类型"
            >
              <a-select-option
                v-for="item in fieldTypeOptions"
                :key="item.value"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
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
import { fetchList } from '@/api/common'
interface StoreReq {
  tableName: string
  fieldName: string
  fieldCode: string
  fieldType: string
}

const defaultForm: StoreReq = {
  tableName: 'sb_staff',
  fieldName: '',
  fieldCode: '',
  fieldType: ''
}

@Component({
  name: 'DetailsDrawer'
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/extension/field'
  protected subjectTitle = '字段'
  protected formData = Object.assign({}, defaultForm)
  private users = []

  @Prop({
    type: Array,
    default: []
  })
  fieldTypeOptions!: any[]

  private rules = {
    fieldName: [
      { required: true, message: '请输入字段名称', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在2-30之间', trigger: 'blur' }
    ],
    fieldCode: [
      { required: true, message: '请输入字段编码', trigger: 'blur' },
      { max: 30, message: '长度30之间', trigger: 'blur' }
    ],
    fieldType: [{ required: true, message: '请选择字段类型', trigger: 'blur' }]
  }

  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
  }
}
</script>
