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
          <a-form-model-item label="交路计划名称" prop="tableName">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.tableName"
              placeholder="请输入交路计划名称"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="运行时刻表" prop="runtimeTableId">
            <a-select v-model="formData.runtimeTableId">
              <a-select-option v-for="item in runtimeTables" :key="item.id">
                {{ item.tableName }}
              </a-select-option>
            </a-select>
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
  groupName: string
  description: string
  seq: number
}

const defaultForm: TableReq = {
  groupName: '',
  description: '',
  seq: 0
}
@Component({
  name: 'DetailsDrawer'
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/route/tables'
  protected subjectTitle = '交路计划'
  protected formData = Object.assign({}, defaultForm)

  @Prop({
    type: Array,
    default: () => {
      return []
    }
  })
  private runtimeTables!: any[]

  private rules = {
    tableName: [
      { required: true, message: '请输入交路计划名称', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在2-30之间', trigger: 'blur' }
    ],

    runtimeTableId: [
      { required: true, message: '请选择时刻表', trigger: 'blur' }
    ],
    description: [{ max: 200, message: '长度在200之内', trigger: 'blur' }]
  }

  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
  }
}
</script>
