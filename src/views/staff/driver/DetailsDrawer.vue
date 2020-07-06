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
          :labelCol="{ span: 10 }"
          :wrapperCol="{ span: 14 }"
          :rules="rules"
        >
          <a-tabs v-model="tabKey">
            <a-tab-pane key="1" tab="基本信息">
              <a-row>
                <a-col :span="11">
                  <a-form-model-item label="所属机队" prop="teamId">
                    <a-select
                      @select="onTeamSelect"
                      v-model="formData.teamId"
                      :disabled="type === 'INFO'"
                      placeholder="请选择所属机队"
                    >
                      <a-select-option v-for="item in teams" :key="item.id">
                        {{ item.teamName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="所属机组" prop="groupId">
                    <a-select
                      v-model="formData.groupId"
                      :disabled="type === 'INFO'"
                      placeholder="请选择所属机组"
                    >
                      <a-select-option v-for="item in groups" :key="item.id">
                        {{ item.groupName }}
                      </a-select-option>
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="工号" prop="workNo">
                    <a-input
                      :disabled="type === 'INFO'"
                      v-model="formData.workNo"
                      placeholder="请输入工号"
                    ></a-input>
                  </a-form-model-item>
                  <a-form-model-item label="姓名" prop="realName">
                    <a-input
                      :disabled="type === 'INFO'"
                      v-model="formData.realName"
                      placeholder="请输入真实姓名"
                    ></a-input>
                  </a-form-model-item>
                  <a-form-model-item label="手机号码" prop="mobile">
                    <a-input
                      :disabled="type === 'INFO'"
                      v-model="formData.mobile"
                      placeholder="请输入手机号码"
                    ></a-input>
                  </a-form-model-item>
                  <a-form-model-item label="邮箱" prop="email">
                    <a-input
                      :disabled="type === 'INFO'"
                      v-model="formData.email"
                      placeholder="请输入邮箱"
                    ></a-input>
                  </a-form-model-item>
                  <a-form-model-item label="头像">
                    <avatar-upload
                      :disabled="type === 'INFO'"
                      v-model="formData.avatar"
                    ></avatar-upload>
                  </a-form-model-item>
                </a-col>
                <a-col :span="11">
                  <a-form-model-item label="生日" prop="birthDay">
                    <a-date-picker
                      valueFormat="YYYY-MM-DD"
                      :disabled="type === 'INFO'"
                      v-model="formData.birthDay"
                    />
                  </a-form-model-item>
                  <a-form-model-item label="性别">
                    <a-select
                      :disabled="type === 'INFO'"
                      v-model="formData.gender"
                      style="width: 100%"
                      placeholder="请选择性别"
                    >
                      <a-select-option
                        v-for="item in genderOptions"
                        :key="item.value"
                      >
                        {{ item.name }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>
                  <a-form-model-item label="职务">
                    <a-select
                      :disabled="type === 'INFO'"
                      v-model="formData.jobTitle"
                      style="width: 100%"
                      placeholder="请选择职务"
                    >
                      <a-select-option
                        v-for="item in jobTitleOptions"
                        :key="item.dictEntryValue"
                      >
                        {{ item.dictEntryName }}</a-select-option
                      >
                    </a-select>
                  </a-form-model-item>

                  <a-form-model-item label="机队负责人">
                    <a-switch
                      :disabled="type === 'INFO'"
                      checked-children="是"
                      un-checked-children="否"
                      v-model="formData.isTeamLeader"
                    />
                  </a-form-model-item>
                  <a-form-model-item label="机组负责人">
                    <a-switch
                      :disabled="type === 'INFO'"
                      checked-children="是"
                      un-checked-children="否"
                      v-model="formData.isGroupLeader"
                    />
                  </a-form-model-item>
                  <a-form-model-item label="安全时间" v-if="type === 'EDIT'">
                    <!-- v-model="formData.expireAt" -->
                    <a-date-picker
                      :showTime="true"
                      :disabled="type === 'INFO'"
                      v-model="formData.safeAtMoment"
                    />
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="2" tab="拓展信息" force-render>
              <a-row>
                <a-col :span="11">
                  <div
                    v-for="(item, index) in formData.extensions"
                    :key="item.fieldCode"
                  >
                    <a-form-model-item
                      v-if="index % 2 == 0"
                      :label="item.fieldName"
                    >
                      <a-input
                        :disabled="type === 'INFO'"
                        style="width: 100%"
                        v-if="item.fieldType === 'TEXT_VALUE'"
                        v-model="item.value"
                        :placeholder="'请输入' + item.fieldName"
                      ></a-input>

                      <a-input-number
                        v-if="item.fieldType === 'LONG_VALUE'"
                        style="width: 100%"
                        :disabled="type === 'INFO'"
                        v-model="item.value"
                        :placeholder="'请输入' + item.fieldName"
                        :precision="0"
                      ></a-input-number>

                      <a-input-number
                        v-if="item.fieldType === 'DOUBLE_VALUE'"
                        style="width: 100%"
                        :disabled="type === 'INFO'"
                        v-model="item.value"
                        :placeholder="'请输入' + item.fieldName"
                      ></a-input-number>
                    </a-form-model-item>
                  </div>
                </a-col>
                <a-col :span="11">
                  <div
                    v-for="(item, index) in formData.extensions"
                    :key="item.fieldCode"
                  >
                    <a-form-model-item
                      v-if="index % 2 == 1"
                      :label="item.fieldName"
                    >
                      <a-input
                        style="width: 100%"
                        v-if="item.fieldType === 'TEXT_VALUE'"
                        v-model="item.value"
                        :placeholder="'请输入' + item.fieldName"
                      ></a-input>

                      <a-input-number
                        v-if="item.fieldType === 'LONG_VALUE'"
                        style="width: 100%"
                        :disabled="type === 'INFO'"
                        v-model="item.value"
                        :placeholder="'请输入' + item.fieldName"
                        :precision="0"
                      ></a-input-number>

                      <a-input-number
                        v-if="item.fieldType === 'DOUBLE_VALUE'"
                        style="width: 100%"
                        :disabled="type === 'INFO'"
                        v-model="item.value"
                        :placeholder="'请输入' + item.fieldName"
                      ></a-input-number>
                    </a-form-model-item>
                  </div>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
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
import { Mixins, Component, Emit, Prop, Watch } from 'vue-property-decorator'
import AvatarUpload from '@/components/Upload/AvatarUpload.vue'
import md5 from 'md5'
import moment from 'moment'
import MixinDetails from '@/mixins/mixin-details'
import { fetchList } from '@/api/common'

interface UserReq {
  realName: string
  avatar: string
  mobile: string
  workNo: string
  email: string
  gender: string
  birthDay: string | null
  teamId: string | null
  groupId: string
  jobTitle: string | null
  safeAt: string | null
  safeAtMoment: any
  extensions: any[]
}

const defaultForm: UserReq = {
  realName: '',
  avatar: '',
  mobile: '',
  workNo: '',
  email: '',
  gender: 'UNKNOWN',
  birthDay: null,
  teamId: '',
  groupId: '',
  jobTitle: '',
  safeAt: null,
  safeAtMoment: null,
  extensions: []
}

@Component({
  name: 'DetailsDrawer',
  components: {
    AvatarUpload
  }
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = 'api/v1/staffs'
  protected subjectTitle = '司机'
  protected formData = Object.assign({}, defaultForm)

  @Prop({
    type: Array,
    default: []
  })
  private teams!: []

  @Prop({
    type: Array,
    default: []
  })
  private jobTitleOptions!: []
  private tabKey = '1'

  private groups = []
  private extensionFields: any[] = []

  created() {
    fetchList('/api/v1/extension/field', {
      current: 1,
      size: 9999,
      tableName: 'sb_staff'
    }).then((res: any) => {
      this.extensionFields = res.records
      this.resetExtensions()
    })
  }

  private genderOptions = [
    { name: '未知', value: 'UNKNOWN' },
    { name: '男', value: 'MALE' },
    { name: '女', value: 'FEMALE' }
  ]
  private rules = {
    teamId: [{ required: true, message: '请选择所属机队', trigger: 'blur' }],
    groupId: [{ required: true, message: '请选择所属机组', trigger: 'blur' }],
    workNo: [
      { required: true, message: '请输入工号', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在2-20之间', trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { min: 8, max: 30, message: '长度在8-30之间', trigger: 'blur' }
    ],
    realName: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在2-20之间', trigger: 'blur' }
    ]
  }

  protected onLoadDataSuccess() {
    this.tabKey = '1'
    this.$set(
      this.formData,
      'safeAtMoment',
      this.formData.safeAt ? moment(this.formData.safeAt, 'x') : null
    )
    let extensions = []

    console.log('extensions = ', this.formData.extensions)
    for (let i = 0; i < this.extensionFields.length; i++) {
      const element = this.extensionFields[i]

      let find = this.formData.extensions.find((item: any) => {
        return item.fieldCode === element.fieldCode
      })
      let val = null
      if (find) {
        if (element.fieldType === 'LONG_VALUE') {
          val = find.longValue
        } else if (element.fieldType === 'DOUBLE_VALUE') {
          val = find.doubleValue
        } else if (element.fieldType === 'TEXT_VALUE') {
          val = find.textValue
        }
      }
      extensions.push({
        fieldName: element.fieldName,
        fieldCode: element.fieldCode,
        fieldType: element.fieldType,
        value: val
      })
    }
    this.$set(this.formData, 'extensions', extensions)
  }

  protected resetFormData() {
    this.formData = Object.assign({}, defaultForm)
    this.resetExtensions()
  }

  private resetExtensions() {
    let extensions = []
    for (let i = 0; i < this.extensionFields.length; i++) {
      const element = this.extensionFields[i]
      extensions.push({
        fieldName: element.fieldName,
        fieldCode: element.fieldCode,
        fieldType: element.fieldType,
        value: null
      })
    }
    this.$set(this.formData, 'extensions', extensions)
    this.tabKey = '1'
  }

  protected beforeAddData() {
    this.beforeEditData()
  }

  protected beforeEditData() {
    if (this.formData.safeAtMoment != null) {
      this.formData.safeAt = this.formData.safeAtMoment.format('x')
    } else {
      this.formData.safeAt = null
    }
  }
  private onTeamSelect(val: string) {
    if (this.formData.groupId) {
      this.$set(this.formData, 'groupId', '')
    }
    if (val) {
      fetchList('/api/v1/staff/groups', {
        current: 1,
        size: 999999,
        teamId: val
      }).then((res: any) => {
        this.groups = res.records
      })
    } else {
      this.groups = []
    }
  }
}
</script>
