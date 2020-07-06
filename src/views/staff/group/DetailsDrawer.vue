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
          <a-form-model-item label="所属机队" prop="teamId">
            <a-select v-model="formData.teamId" placeholder="请选择机队名称">
              <a-select-option v-for="item in teams" :key="item.id">
                {{ item.teamName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="机组名称" prop="groupName">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.groupName"
              placeholder="请输入机组名称"
            ></a-input>
          </a-form-model-item>

          <a-form-model-item label="机组电话" prop="groupPhone">
            <a-input
              :disabled="type === 'INFO'"
              v-model="formData.groupPhone"
              placeholder="请输入机组电话"
            ></a-input>
          </a-form-model-item>
          <a-form-model-item
            v-if="type === 'EDIT'"
            label="机组负责人"
            prop="leaderIds"
          >
            <a-select
              v-model="formData.leaderIds"
              style="width: 100%"
              placeholder="请选择负责人"
            >
              <!-- <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
                {{ (i + 9).toString(36) + i }}
              </a-select-option> -->
            </a-select>
            <!-- <a-input
              :disabled="type === 'INFO'"
              v-model="formData.leaderIds"
              placeholder="请输入联系电话"
            ></a-input> -->
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
import { fetchList } from '@/api/common'
interface StoreReq {
  id: string | null
  groupName: string
  teamId: string
  leaderIds: []
  description: string
}

const defaultForm: StoreReq = {
  id: null,
  groupName: '',
  teamId: '',
  leaderIds: [],
  description: ''
}

@Component({
  name: 'DetailsDrawer'
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/staff/groups'
  protected subjectTitle = '机组'
  protected formData = Object.assign({}, defaultForm)
  private users = []
  @Prop({
    type: Array,
    default: []
  })
  private teams!: []

  onLoadDataSuccess() {
    fetchList('/api/v1/staffs', {
      current: 0,
      size: 999999,
      teamId: this.formData.id
    }).then((res: any) => {
      this.users = res.records
    })
  }

  private rules = {
    groupName: [
      { required: true, message: '请输入机组名称', trigger: 'blur' },
      { min: 2, max: 30, message: '长度在2-30之间', trigger: 'blur' }
    ],

    teamId: [{ required: true, message: '请选择所属机队', trigger: 'blur' }],
    groupPhone: [{ max: 30, message: '长度在30之内', trigger: 'blur' }],

    description: [{ max: 200, message: '长度在200之内', trigger: 'blur' }]
  }

  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
  }
}
</script>
