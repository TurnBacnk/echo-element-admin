<template>
  <div v-loading="loading" :style="'height:' + height">
    <iframe
      :src="src"
      frameborder="no"
      scrolling="auto"
      style="width: 100%; height: 100%"
    />
  </div>
</template>
<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      height: document.documentElement.clientHeight - 94.5 + 'px;',
      loading: true,
      url: process.env.VUE_APP_BASE_API + this.src
    }
  },
  mounted: function() {
    setTimeout(() => {
      this.loading = false
    }, 300)
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 94.5 + 'px;'
    }
  }
}
</script>
