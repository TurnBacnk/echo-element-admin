<template>
  <i-frame :src="url"/>
</template>
<script>
import iFrame from '@/components/iFrame/index'

export default {
  name: 'Druid',
  components: { iFrame },
  data() {
    return {
      url: 'http://localhost:30000/echo/dev/druid/login.html'
    }
  },
  created() {
    this.usernameAndPasswordNotice()
  },
  methods: {
    usernameAndPasswordNotice() {
      this.$message({
        message: 'username:admin',
        type: 'success'
      })
      this.$message({
        message: 'password:111111',
        type: 'success'
      })
    }
  }
}
</script>
