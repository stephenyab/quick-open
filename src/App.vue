<script setup>
import {ref, watch} from 'vue'
import List from '@/views/list.vue'
import Setting from '@/views/setting.vue'
import {usePluginEnter, createHintService} from '@/composables'

usePluginEnter()
const {hint, hintTimeout, hintMessage, hintColor} = createHintService()

const tab = ref('list')
const listRef = ref()

watch(tab, (newVal) => {
  if (newVal === 'list' && listRef.value) {
    listRef.value.initData()
  }
})
</script>

<template>
  <div class="app-container">
    <v-tabs density="compact" v-model="tab" class="fixed-tabs">
      <v-tab value="list">列表</v-tab>
      <v-tab value="setting">设置</v-tab>
    </v-tabs>

    <div class="tabs-content">
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="list">
          <list ref="listRef"></list>
        </v-tabs-window-item>
        <v-tabs-window-item value="setting">
          <setting></setting>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
  </div>

  <v-snackbar v-model="hint" :timeout="hintTimeout" :color="hintColor">{{ hintMessage }}</v-snackbar>
</template>

<style scoped>
.app-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fixed-tabs {
  flex-shrink: 0;
}

.tabs-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
