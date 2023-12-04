<template>
  <div class="app-container">
    <el-card style="margin-bottom: 20px;">
      <div slot="header" class="clearfix">
        <span>产品-新增</span>
      </div>
      <div>
        <el-form>
          <el-row>
            <el-col span="8">
              <el-form-item label="属性1" label-width="80px">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="属性1" label-width="80px">
                <el-input />
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="属性1" label-width="80px">
                <el-input />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ProductCategoryAdd',
  data() {
    return {
      input1: ''
    }
  },
  methods: {
    back() {
      this.$router.back()
    }
  }
}
</script>

<style>
.pageHeader {

}
</style>
