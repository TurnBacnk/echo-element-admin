<template>
  <i-frame :src="url"/>
</template>
<script>
import iFrame from '@/components/iFrame/index.vue'

export default {
  name: 'Druid',
  components: { iFrame },
  data() {
    return {
      url: 'http://localhost:30000/echo/dev/druid/login.html'
    }
  },
  created() {

  },
  methods: {

  }
}
</script>
