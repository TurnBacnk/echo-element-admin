<template>
  <div>
    <div class="work-panel">
      <div class="panel">
        <div class="panel-item" @click="to('WorkSpace')">
          <div>
            <i class="el-icon-s-platform" />
            <span>进入工作区</span>
          </div>
          <p>
            您可以发起流程、查看流程进度等。
          </p>
        </div>
        <div class="panel-item" @click="to('FormsPanel')">
          <div>
            <i class="el-icon-s-custom" />
            <span>进入管理后台</span>
          </div>
          <p>
            审批工作流创建 、编辑及其他设置操作，均可以在后台进行
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Workflow',
  data() {
    return {}
  },
  methods: {
    to(name) {
      this.$router.push({
        name: name
      })
    }
  }
}
</script>

<style scoped>

h4 {
  margin: 0 auto;
  color: #38adff;
  margin-top: 150px;
}

.user{
  position: absolute;
  left: 20%;
  margin-top: 20px;
  div{
    margin-left: 20px;
    display: inline-block;
  }
}

.work-panel {
  text-align: left;
  display: flex;
  justify-content: center;
  position: relative;
  .panel {
    margin-top: 80px;
    max-width: 700px;
    display: flex;
    justify-content: center;

    .panel-item {
      cursor: pointer;
      margin: 0 40px;
      width: 250px;
      padding: 10px;
      display: inline-block;
      background: #ffffff;
      border-radius: 10px;
      border: 1px solid #ffffff;
      box-shadow: 1px 1px 8px 0 #b0b0b1;

      &:hover {
        border: 1px solid #2594ff;
        box-shadow: 1px 1px 13px 0 #a4a4a5;
      }

      div:nth-child(1) {
        color: #7a7a7a;
        font-weight: bold;
        height: 60px;
        line-height: 60px;
        font-size: large;
        border-bottom: 1px solid #cccdcd;

        span {
          margin-left: 30px;
        }
      }

      i {
        padding: 8px;
        color: #ffffff;
        background: #2594ff;
        font-size: 25px;
        border-radius: 5px;
      }

      .el-icon-s-platform {
        background: rgb(255, 148, 62);
      }

      p {
        padding: 10px 0;
        color: #7a7a7a;
        font-size: medium;
      }
    }
  }

}
</style>
