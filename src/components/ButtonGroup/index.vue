<template>
  <el-row :gutter="10" class="mb8">
    <template v-for="button in buttonConfig">
      <el-col :span="1.5">
        <el-button
          :circle="button.circle"
          :icon="button.icon ? button.icon : ''"
          :plain="button.plain ? button.plain : false"
          :size="button.size ? button.size : 'mini'"
          :type="button.type ? button.type : 'primary'"
          @click="button.click()"
        >{{ button.text }}
        </el-button>
      </el-col>
    </template>
  </el-row>
</template>

<script>

export default {
  name: 'ButtonGroup',
  props: {
    buttonConfig: {
      type: Array,
      required: true,
      default: [
        {
          text: '按钮',
          type: 'primary',
          size: 'mini',
          click: () => {
            console.log('click success')
          },
          plain: true,
          icon: ''
        }
      ]
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
