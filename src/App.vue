<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import List from '@/views/list.vue'
import Setting from '@/views/setting.vue'

onMounted(() => {
  // window.utools.onPluginEnter((action) => {
  //   route.value = action.code
  //   enterAction.value = action
  // })
  // window.utools.onPluginOut((isKill) => {
  //   route.value = ''
  // })
})

// 选项卡
const tab = ref('list')
</script>

<template>
  <v-tabs density="compact" v-model="tab">
    <v-tab value="list">列表</v-tab>
    <v-tab value="setting">设置</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item value="list">
      <list></list>
    </v-tabs-window-item>
    <v-tabs-window-item value="setting">
      <setting></setting>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<style scoped>

</style>
