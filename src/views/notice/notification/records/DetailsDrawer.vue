<template>
  <div>
    <a-drawer
      :title="type === 'ADD' ? '发布通知' : '通知详情'"
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
          <a-form-model-item label="标题" prop="title">
            <a-input
              v-model="formData.title"
              :disabled="type == 'INFO'"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item label="发布渠道" prop="channelType">
            <a-select
              :disabled="type == 'INFO'"
              v-model="formData.channelType"
              placeholder="请选择发布渠道"
            >
              <a-select-option key="SYSTEM">站内</a-select-option>
              <a-select-option key="EMAIL">邮件</a-select-option>
              <a-select-option key="SMS">短信</a-select-option>
              <a-select-option key="APP">APP</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="内容" prop="content">
            <span v-if="type == 'INFO'" v-html="formData.content"></span>
            <rich-editor
              v-else-if="formData.channelType !== 'SMS'"
              v-model="formData.content"
              placeholder="请输入内容"
            >
            </rich-editor>

            <a-textarea
              v-else
              v-model="formData.content"
              placeholder="请输入内容"
              :auto-size="{ minRows: 3, maxRows: 8 }"
            ></a-textarea>
          </a-form-model-item>
          <a-form-model-item label="参数" prop="params">
            <a-textarea
              :disabled="type == 'INFO'"
              v-model="formData.params"
              :placeholder="'请输入Json格式参数'"
            ></a-textarea>
          </a-form-model-item>
          <a-form-model-item label="类型" prop="publishType">
            <a-radio-group
              v-model="formData.publishType"
              :disabled="type == 'INFO'"
            >
              <a-radio :value="1">
                全员
              </a-radio>
              <a-radio :value="2">
                指定
              </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            label="用户"
            prop="userIds"
            v-if="formData.publishType == 2"
          >
            <a-select
              :disabled="type == 'INFO'"
              v-model="formData.userIds"
              mode="multiple"
              style="width: 100%"
              placeholder="请选择用户"
              :default-active-first-option="false"
              :show-arrow="false"
              :filter-option="false"
              :not-found-content="null"
              @search="fetchUser"
            >
              <a-select-option v-for="item in users" :key="item.id">
                {{ item.realName }}
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
import { Mixins, Component } from 'vue-property-decorator'
import MixinDetails from '@/mixins/mixin-details'
import { fetchList } from '@/api/common'
import RichEditor from '@/components/RichEditor/Index.vue'

interface QuestionReq {
  params: string
  channelType: string | null
  title: string
  content: string
  publishType: number
  userIds: number[]
  users: []
}

const defaultForm: QuestionReq = {
  params: '',
  channelType: null,
  title: '',
  content: '',
  publishType: 1,
  userIds: [],
  users: []
}

@Component({
  name: 'DetailsDrawer',
  components: { RichEditor }
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/notifications'
  protected subjectTitle = '通知'
  protected formData = Object.assign({}, defaultForm)
  users = []
  private rules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
    channelType: [
      { required: true, message: '请选择发布渠道', trigger: 'blur' }
    ],
    userIds: [{ required: true, message: '请选择用户', trigger: 'blur' }]
  }

  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
  }

  onLoadDataSuccess() {
    this.users = this.formData.users
    this.formData.userIds = this.users.flatMap((item: any) => {
      return item.id
    })
  }
  fetchUser(value: string) {
    console.log('search')
    if (value) {
      fetchList('/api/v1/users', {
        realName: value,
        current: 1,
        size: 50
      }).then((res: any) => {
        this.users = res.records
      })
    } else {
      this.users = []
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
