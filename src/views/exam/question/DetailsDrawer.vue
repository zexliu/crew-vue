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
      width="70%"
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
          <a-form-model-item label="问题类型" prop="questionType">
            <a-select
              v-model="formData.questionType"
              @select="onQuestionTypeSelected"
              placeholder="请选择问题类型"
            >
              <a-select-option key="SINGLE_CHOICE">单选题</a-select-option>
              <a-select-option key="MULTIPLE_CHOICE">多选题</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="分值" prop="questionScore">
            <a-input-number
              style="width: 100%"
              v-model="formData.questionScore"
              placeholder="请输入分值"
              :precision="0"
              :max="100"
              :min="1"
            ></a-input-number>
          </a-form-model-item>
          <a-form-model-item label="问题内容" prop="questionContent">
            <rich-editor v-model="formData.questionContent"> </rich-editor>
          </a-form-model-item>
          <a-form-model-item label="答案选项">
            <a-form-model-item
              :labelCol="{ span: 2 }"
              :wrapperCol="{ span: 22 }"
              :label="letters[index]"
              v-for="(item, index) in formData.questionAnswerItemData"
              :key="index"
              :prop="'questionAnswerItemData.' + index + '.value'"
              :rules="{
                required: true,
                message: '请输入答案选项内容',
                trigger: 'blur'
              }"
            >
              <a-input
                v-model="item.value"
                placeholder="请输入选项内容"
                style="width: 90%; margin-right: 8px"
              />
              <a-icon
                v-if="formData.questionAnswerItemData.length > 2"
                class="dynamic-delete-button"
                type="minus-circle"
                @click="removeDynamicAnswer(item)"
              />
            </a-form-model-item>
            <a-form-model-item
              v-if="formData.questionAnswerItemData.length < letters.length"
              :labelCol="{ span: 2 }"
              :wrapperCol="{ span: 22 }"
              label=" "
              :colon="false"
            >
              <a-button
                type="dashed"
                style="width: 90%; margin-right: 8px"
                @click="addDynamicAnswer"
              >
                <a-icon type="plus" /> 添加选项
              </a-button>
            </a-form-model-item>
          </a-form-model-item>

          <a-form-model-item
            v-if="formData.questionType === 'SINGLE_CHOICE'"
            label="正确答案"
            prop="questionAnswer"
            :rules="{
              required: true,
              message: '请选择正确答案',
              trigger: 'blur'
            }"
          >
            <a-radio-group
              v-model="formData.questionAnswer"
              style="margin-left : 16px"
            >
              <a-radio
                v-for="(item, index) in formData.questionAnswerItemData"
                :value="letters[index]"
                :key="letters[index]"
              >
                {{ letters[index] }}
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            v-else
            label="正确答案"
            prop="questionAnswerData"
            :rules="{
              required: true,
              message: '请选择正确答案',
              trigger: 'blur'
            }"
          >
            <a-checkbox-group
              v-model="formData.questionAnswerData"
              style="margin-left : 16px"
            >
              <a-checkbox
                v-for="(item, index) in formData.questionAnswerItemData"
                :value="letters[index]"
                :key="letters[index]"
              >
                {{ letters[index] }}
              </a-checkbox>
            </a-checkbox-group>
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
import RichEditor from '@/components/RichEditor/Index.vue'

interface QuestionReq {
  questionStoreId: string | null
  questionType: string
  questionContent: string
  questionAnswerItemData: any[]
  questionAnswerItems: string
  questionAnswerData: string[]
  questionAnswer: string
  questionScore: number | null
}

const defaultForm: QuestionReq = {
  questionStoreId: null,
  questionType: 'SINGLE_CHOICE',
  questionContent: '',
  questionAnswerItemData: [{ value: '' }, { value: '' }],
  questionAnswerItems: '',
  questionAnswer: '',
  questionAnswerData: [],
  questionScore: null
}

@Component({
  name: 'DetailsDrawer',
  components: { RichEditor }
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/questions'
  protected subjectTitle = '题库'
  protected formData = Object.assign({}, defaultForm)
  letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K']
  storeOptions: any[] = []
  private created() {
    fetchList('/api/v1/question/stories', { current: 1, size: 999999 }).then(
      (res: any) => {
        this.storeOptions = res.records
      }
    )
  }

  private rules = {
    questionStoreId: [
      { required: true, message: '请选择所属题库', trigger: 'blur' }
    ],
    questionType: [
      { required: true, message: '请选择问题类型', trigger: 'blur' }
    ],
    questionScore: [{ required: true, message: '请输入分值', trigger: 'blur' }],
    questionContent: [
      { required: true, message: '请输入问题内容', trigger: 'blur' }
    ]
  }

  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
    this.formData.questionAnswerItemData = [{ value: '' }, { value: '' }]
  }

  addDynamicAnswer() {
    this.formData.questionAnswerItemData.push({
      value: ''
    })
  }

  removeDynamicAnswer(val: any) {
    let index = this.formData.questionAnswerItemData.indexOf(val)
    if (index !== -1) {
      this.formData.questionAnswerItemData.splice(index, 1)
    }
  }

  onQuestionTypeSelected(val: any) {
    if (val === 'SINGLE_CHOICE') {
      this.formData.questionAnswer = ''
    } else {
      this.formData.questionAnswerData = []
    }
  }

  setupFormData() {
    this.formData.questionAnswerItems = this.formData.questionAnswerItemData
      .map(item => {
        return item.value
      })
      .join(',')

    if (this.formData.questionType === 'MULTIPLE_CHOICE') {
      this.formData.questionAnswer = this.formData.questionAnswerData
        .sort()
        .join(',')
    }
  }

  protected beforeAddData() {
    this.setupFormData()
  }

  protected beforeEditData() {
    this.setupFormData()
  }

  protected onLoadDataSuccess() {
    this.$set(
      this.formData,
      'questionAnswerItemData',
      this.formData.questionAnswerItems.split(',').map(item => {
        return {
          value: item
        }
      })
    )

    if (this.formData.questionType === 'MULTIPLE_CHOICE') {
      this.$set(
        this.formData,
        'questionAnswerData',
        this.formData.questionAnswer.split(',')
      )
    }
  }
}
</script>

<style scoped lang="less">
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
</style>
