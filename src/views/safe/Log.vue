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
      <span slot="createAt" slot-scope="createAt">
        {{ createAt | timeFormatter }}
      </span>
      <span slot="type" slot-scope="type">
        <a-tag v-if="type === 0">
          初始化
        </a-tag>
        <a-tag v-if="type === 1">
          重置无重大安全事故
        </a-tag>
        <a-tag v-if="type === 2">
          重置无大安全事故
        </a-tag>
        <a-tag v-if="type === 3">
          重置无较大安全事故
        </a-tag>
        <a-tag v-if="type === 4">
          重置无一般安全事故
        </a-tag>
        <a-tag v-if="type === 5">
          重置无劳动人身安全
        </a-tag>
      </span>
    </a-table>
  </a-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import MixinTable from '@/mixins/mixin-table'
import { fetchList } from '@/api/common'
@Component({
  name: 'SafeLog',
  components: {}
})
export default class extends Mixins(MixinTable) {
  url = '/api/v1/safe/configs'
  groups: any[] = []
  private created() {
    this.fetch()
  }

  private columns = [
    {
      dataIndex: 'id',
      title: 'ID',
      width: 220
    },
    {
      title: '操作类型',
      dataIndex: 'type',
      width: 200,
      scopedSlots: { customRender: 'type' }
    },
    {
      title: '操作人昵称',
      dataIndex: 'nickname',
      width: 120
    },
    {
      title: '操作人ID',
      dataIndex: 'operatorId',
      width: 220
    },
    {
      title: '备注',
      dataIndex: 'description',
      ellipsis: true
    },
    {
      title: '操作时间',
      dataIndex: 'createAt',
      scopedSlots: { customRender: 'createAt' },
      width: 190
    }
  ]
}
</script>
