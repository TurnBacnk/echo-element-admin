<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <keep-alive>
          <workspace-form :page-config="item" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

import PageTable from '@/components/ListTable/index.vue'
import WorkspaceForm from '@/views/config/workflow/component/workspace-form.vue'

export default {
  name: 'WorkSpace',
  components: { WorkspaceForm, PageTable },
  data() {
    return {
      showSearch: true,
      queryForm: {
        businessModuleName: undefined
      },
      tableColumnConfig: [],
      activeName: 'need-audit',
      tabMapOptions: [
        {
          label: '待我审核',
          key: 'need-audit',
          dataSource: '/api/work-flow/need-audit-list'
        },
        {
          label: '我发起的',
          key: 'my-submit',
          dataSource: '/api/work-flow/my-submit-list'
        }
      ]
    }
  },
  async activated() {
    await this.init()
  },
  methods: {

  }
}

</script>
