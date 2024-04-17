<template>
  <div class="tab-container">
<!--    <el-tag>mounted times ：{{ createdTimes }}</el-tag>-->
<!--    <el-alert :closable="false" style="width:200px;display:inline-block;vertical-align: middle;margin-left:30px;" title="Tab with keep-alive" type="success" />-->
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
<!--        <keep-alive>-->
          <tab-pane v-if="activeName===item.key" :data-source="item.dataSource" />
<!--        </keep-alive>-->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabPane from './components/TabPane'

export default {
  name: 'Tab',
  components: { TabPane },
  data() {
    return {
      tabMapOptions: [
        { label: '待我审核', key: 'needApproval', dataSource: '/api/approval-instance/get-all-need-approval' },
        { label: '我发起的', key: 'mySubmit', dataSource: '/api/approval-instance/get-all-my-publish-approval' }
      ],
      activeName: 'needApproval',
      createdTimes: 0
    }
  },
  watch: {
    activeName(val) {
      // this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    // init the default selected tab
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
