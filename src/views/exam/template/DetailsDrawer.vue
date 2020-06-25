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
          <a-form-model-item label="模板名称" prop="pagerTemplateName">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.pagerTemplateName"
              placeholder="请输入模板名称"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="所属题库" prop="questionStoreId">
            <a-select
              v-model="formData.questionStoreId"
              placeholder="请选择所属题库"
            >
              <a-select-option v-for="item in storeOptions" :key="item.id">{{
                item.questionStoreName
              }}</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="题目数量" prop="questionCount">
            <a-input-number
              style="width: 100%"
              v-model="formData.questionCount"
              placeholder="请输入题目数量"
              :precision="0"
              :max="100"
              :min="1"
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
import { Mixins, Component } from 'vue-property-decorator'
import MixinDetails from '@/mixins/mixin-details'
import { fetchList } from '@/api/common'
interface StoreReq {
  questionStoreName: string
  description: string
}

const defaultForm: StoreReq = {
  questionStoreName: '',
  description: ''
}

@Component({
  name: 'DetailsDrawer'
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/question/templates'
  protected subjectTitle = '模板'
  protected formData = Object.assign({}, defaultForm)
  storeOptions: any[] = []

  private rules = {
    pagerTemplateName: [
      { required: true, message: '请输入模板名称', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在2-30之间', trigger: 'blur' }
    ],
    questionStoreId: [
      { required: true, message: '请选择所属题库', trigger: 'blur' }
    ],
    questionCount: [
      { required: true, message: '请输入题目数量', trigger: 'blur' }
    ],
    description: [{ max: 200, message: '长度在200之内', trigger: 'blur' }]
  }
  private created() {
    fetchList('/api/v1/question/stories', { current: 1, size: 999999 }).then(
      (res: any) => {
        this.storeOptions = res.records
      }
    )
  }
  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
  }
}
</script>
