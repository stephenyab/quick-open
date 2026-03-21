<script setup>
import {onMounted, ref, watch} from 'vue'
import List from '@/views/list.vue'
import Setting from '@/views/setting.vue'
import {getData} from '@/util/utoolsUtil'
import {ENTRY_TYPE_FILE, ENTRY_TYPE_SHELL} from '@/constants/entryTypes'
import {normalizeMessageToArray} from '@/domain/messageCodec'

onMounted(() => {
  window.utools.onPluginEnter((action) => {
    const code = action.code
    if (code === 'quickOpenSetting') {
      return
    }
    
    window.utools.hideMainWindow()
    
    const dbData = getData(code)
    if (!dbData || !dbData.data) {
      window.utools.outPlugin()
      return
    }
    
    const { type, message } = dbData.data
    const messageList = normalizeMessageToArray(message)
    
    if (type === ENTRY_TYPE_FILE && messageList.length > 0) {
      window.services.openPath(messageList[0])
    } else if (type === ENTRY_TYPE_SHELL) {
      messageList.forEach(cmd => {
        if (cmd.trim()) {
          window.services.execShell(cmd)
        }
      })
    }
    
    window.utools.outPlugin()
  })
})

// 选项卡
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
