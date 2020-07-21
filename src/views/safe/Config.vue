<template>
  <a-card :bordered="false">
    <a-form-model
      ref="form"
      :model="formData"
      :labelCol="{ span: 6 }"
      :wrapperCol="{ span: 10 }"
      :rules="rules"
    >
      <a-row>
        <a-col :span="12">
          <a-form-model-item label="无重大安全事故天数" prop="safe1At">
            {{ getDays(formData.safe1At) }}

            <a-button
              icon="undo"
              class="reset-button"
              @click="onResetClick(1, '确定要重置无重大安全事故天数吗?')"
              >重置</a-button
            >
          </a-form-model-item>
          <a-form-model-item label="无较大安全事故天数" prop="safe3At">
            {{ getDays(formData.safe3At) }}

            <a-button
              icon="undo"
              class="reset-button"
              @click="onResetClick(3, '确定要重置无较大安全事故天数吗?')"
              >重置</a-button
            >
          </a-form-model-item>
          <a-form-model-item label="无劳动人身安全天数" prop="safe5At">
            {{ getDays(formData.safe5At) }}

            <a-button
              icon="undo"
              class="reset-button"
              @click="onResetClick(5, '确定要重置无劳动人身安全天数吗?')"
              >重置</a-button
            >
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="无大安全事故天数" prop="safe2At">
            {{ getDays(formData.safe2At) }}

            <a-button
              icon="undo"
              class="reset-button"
              @click="onResetClick(2, '确定要重置无大安全事故天数吗?')"
              >重置</a-button
            >
          </a-form-model-item>
          <a-form-model-item label="无一般安全事故天数" prop="safe4At">
            {{ getDays(formData.safe4At) }}

            <a-button
              icon="undo"
              class="reset-button"
              @click="onResetClick(4, '确定要重置无一般安全事故天数吗?')"
              >重置</a-button
            >
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>

    <a-modal
      :title="dialogTitle"
      :visible="dialogVisible"
      :confirm-loading="dialogLoading"
      @ok="confirm"
      @cancel="cancel"
    >
      <a-textarea
        v-model="formData.description"
        placeholder="请输入备注"
        :auto-size="{ minRows: 3, maxRows: 5 }"
        :maxLength="200"
      />
    </a-modal>
  </a-card>
</template>

<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import MixinDetails from '@/mixins/mixin-details'
import { fetchList, create } from '@/api/common'
import moment from 'moment'
@Component({
  name: 'Config'
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  formData: any = {}
  rules = {
    safe1At: [{ required: true }],
    safe2At: [{ required: true }],
    safe3At: [{ required: true }],
    safe4At: [{ required: true }],
    safe5At: [{ required: true }]
  }
  dialogVisible = false
  dialogLoading = false
  dialogTitle = ''
  created() {
    this.fetch()
  }

  fetch() {
    fetchList('/api/v1/safe/configs/latest', {}).then((res: any) => {
      this.formData = res
      this.formData.description = ''
    })
  }

  getDays(str: string) {
    let days = moment().diff(moment(str, 'YYYY-MM-DD'), 'days')
    return days + '天'
  }

  onResetClick(type: number, title: string) {
    this.formData.type = type
    this.dialogVisible = true
    this.dialogTitle = title
  }

  confirm() {
    let el: any = this.$refs['form']
    el.validate((valid: boolean) => {
      if (valid) {
        this.dialogLoading = true
        let now = moment().format('YYYY-MM-DD')
        if (this.formData.type == 1) {
          this.formData.safe1At = now
        } else if (this.formData.type === 2) {
          this.formData.safe2At = now
        } else if (this.formData.type == 3) {
          this.formData.safe3At = now
        } else if (this.formData.type == 4) {
          this.formData.safe4At = now
        } else if (this.formData.type == 5) {
          this.formData.safe5At = now
        }
        create('/api/v1/safe/configs', this.formData)
          .then((res: any) => {
            this.$notification.success({
              message: '成功',
              description: '重置成功'
            })
            this.fetch()
          })
          .finally(() => {
            this.dialogLoading = false
            this.dialogVisible = false
          })
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }
  cancel() {
    this.dialogVisible = false
    this.formData.description = ''
  }
}
</script>

<style>
.reset-button {
  margin-left: 16px;
}
</style>
