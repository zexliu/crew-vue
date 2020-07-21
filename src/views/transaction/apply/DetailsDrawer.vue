<template>
  <div>
    <a-drawer
      title="事务详情"
      width="50%"
      :visible="visible"
      :body-style="{ paddingBottom: '80px' }"
      @close="onClose"
    >
      <a-skeleton :loading="showSkeleton">
        <a-descriptions>
          <a-descriptions-item label="ID">
            {{ formData.id }}
          </a-descriptions-item>
          <a-descriptions-item label="审核状态">
            <a-tag v-if="status === 'PENDING'" color="orange">
              待审核
            </a-tag>
            <a-tag v-else-if="status === 'PASSED'" color="blue">
              已通过
            </a-tag>
            <a-tag v-else-if="status === 'REJECTED'" color="red">
              已驳回
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="请假类型">
            {{ getTypeName(type) }}
          </a-descriptions-item>
          <a-descriptions-item label="申请人头像">
            <a-avatar shape="square" :size="64" :src="formData.avatar" />
          </a-descriptions-item>
          <a-descriptions-item label="申请人姓名">
            {{ formData.realName }}
          </a-descriptions-item>
          <a-descriptions-item label="申请人ID">
            {{ formData.userId }}
          </a-descriptions-item>

          <a-descriptions-item label="离队日期">
            {{ formData.leaveAt }}
          </a-descriptions-item>
          <a-descriptions-item label="归队日期">
            {{ formData.backAt }}
          </a-descriptions-item>

          <a-descriptions-item label="天数">
            {{ formData.days }}
          </a-descriptions-item>
          <a-descriptions-item :span="3" label="备注">
            {{ formData.description }}
          </a-descriptions-item>
          <!-- <a-descriptions-item label="创建时间">
           {{ formData.createAt }}
          </a-descriptions-item> -->
        </a-descriptions>

        <a-timeline style="margin-top: 16px; ">
          <a-timeline-item
            v-for="item in formData.logs"
            :key="item.id"
            :color="getColor(item.type)"
          >
            <p>
              <span>
                {{ item.createAt | timeFormatter }}
              </span>
              <span style="margin-left:16px;">{{ item.realName }}</span>
              <span style="margin-left:16px;">{{
                getLogTypeName(item.type)
              }}</span>
            </p>
            <p v-if="item.description">{{ item.description }}</p>
          </a-timeline-item>
        </a-timeline>
      </a-skeleton>
    </a-drawer>
  </div>
</template>
<script lang="ts">
import { Mixins, Component, Prop } from 'vue-property-decorator'
import MixinDetails from '@/mixins/mixin-details'
import { fetchList } from '@/api/common'

@Component({
  name: 'DetailsDrawer',
  components: {}
})
export default class DetailsDrawer extends Mixins(MixinDetails) {
  protected url = '/api/v1/leaves'
  protected subjectTitle = '事务详情'
  protected formData: any = {}

  @Prop({
    type: Array,
    default: []
  })
  protected typeOptions!: any[]

  private created() {
    // fetchList('/api/v1/question/stories', { current: 1, size: 999999 }).then(
    //   (res: any) => {
    //   }
    // )
  }

  getTypeName(type: number) {
    let find = this.typeOptions.find((item: any) => {
      return parseInt(item.dictEntryValue) === type
    })

    return find ? find.dictEntryName : ''
  }
  getColor(type: string) {
    if (type === 'CREATE') {
      return 'green'
    } else if (type === 'UPDATE') {
      return 'orange'
    } else if (type === 'PASS') {
      return 'blue'
    } else if (type === 'REJECT') {
      return 'red'
    }
  }
  getLogTypeName(type: string) {
    if (type === 'CREATE') {
      return '提交申请'
    } else if (type === 'UPDATE') {
      return '修改申请'
    } else if (type === 'PASS') {
      return '审核通过'
    } else if (type === 'REJECT') {
      return '审核驳回'
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
