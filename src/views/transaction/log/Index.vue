<template>
  <a-card :bordered="false">
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="tableData"
      :bordered="true"
      :loading="loading"
      :row-key="record => record.id"
      @change="handleTableChange"
    >
      <span slot="avatar" slot-scope="avatar">
        <a-avatar :src="avatar" size="large" />
      </span>
      <span slot="type" slot-scope="type">
        <a-tag v-if="type === 'CREATE'" color="green">
          提交申请
        </a-tag>
        <a-tag v-else-if="type === 'UPDATE'" color="orange">
          修改申请
        </a-tag>
        <a-tag v-else-if="type === 'PASS'" color="blue">
          审核通过
        </a-tag>
        <a-tag v-else-if="type === 'REJECT'" color="red">
          审核驳回
        </a-tag>
      </span>

      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>
    </a-table>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ExcelUpload from '@/components/Upload/ExcelUpload.vue'
import MixinTable from '@/mixins/mixin-table'
import { fetchList } from '@/api/common'
@Component({
  name: 'TransactionLog',
  components: {
    ExcelUpload
  }
})
export default class extends Mixins(MixinTable) {
  subjectTitle = '事务日志'
  subject = 'sbStaffLeaveLog'
  url = '/api/v1/leave/logs'

  private created() {
    this.fetch()
    // fetchList('/api/v1/question/stories', { current: 1, size: 999999 }).then(
    //   (res: any) => {
    //     this.storeOptions = res.records
    //   }
    // )
  }

  private columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220
    },
    {
      dataIndex: 'leaveId',
      title: '事务记录ID',
      width: 220
    },
    //ellipsis: true,

    {
      title: '姓名',
      dataIndex: 'realName',
      width: 100
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      scopedSlots: { customRender: 'avatar' },
      width: 70
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      scopedSlots: { customRender: 'type' },
      width: 100
    },
    {
      title: '备注',
      dataIndex: 'description',
      ellipsis: true
    },

    {
      title: '创建时间',
      dataIndex: 'createAt',
      scopedSlots: { customRender: 'createAt' },
      width: 190
    }
  ]
}
</script>
