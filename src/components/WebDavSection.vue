<script setup>
/**
 * WebDAV 备份设置区域组件
 * 提供 WebDAV 配置、远程备份和恢复功能
 */
import {computed, onMounted, ref} from 'vue'
import {WEB_DAV_FIELD_PREFIX, WEB_DAV_FIELD_CONFIG} from '@/config/webDavConfig'
import {getAllDataByKeys, getData, saveData} from '@/utils/utoolsUtil'
import {isNotEmpty} from '@/utils/commonUtil'
import {backupToWebDav, listWebDavBackupFiles, restoreWebDavBackupFile} from '@/services/backupService'
import {useHint} from '@/composables/useHint'
import RestoreFileDialog from '@/components/RestoreFileDialog.vue'

const emit = defineEmits(['refresh'])

const {showSuccess, showError, showInfo} = useHint()

const webDavConfigStr = WEB_DAV_FIELD_PREFIX
const webDavConfig = WEB_DAV_FIELD_CONFIG

const webDavUrl = ref('')
const webDavAccount = ref('')
const webDavPassword = ref('')
const webDavSubFolder = ref('')

const webDavPasswordStar = computed(() =>
    webDavPassword.value.replace(/./g, '*')
)

const webDavConfigRefs = {
  webDavUrl,
  webDavAccount,
  webDavPassword,
  webDavSubFolder
}

onMounted(() => {
  loadConfig()
})

const loadConfig = () => {
  const keys = webDavConfig.map(item => webDavConfigStr + item.key)
  const result = getAllDataByKeys(keys)
  if (isNotEmpty(result)) {
    result.forEach(({_id: key, value}) => {
      const configKey = key.split(webDavConfigStr)[1]
      if (webDavConfigRefs[configKey]) {
        webDavConfigRefs[configKey].value = value
      }
    })
  }
}

const configDialog = ref(false)
const configDialogType = ref('')
const configDialogInputType = ref('')
const configDialogTitle = ref('')
const configDialogValue = ref('')

const handleOpenConfig = type => {
  configDialog.value = true
  configDialogType.value = type
  configDialogInputType.value = type === 'webDavPassword' ? 'password' : 'input'
  const item = webDavConfig.find(item => item.key === type)
  configDialogTitle.value = item.title
  configDialogValue.value = webDavConfigRefs[type].value
}

const handleConfigCancel = () => {
  configDialogValue.value = ''
  configDialog.value = false
}

const handleConfigSubmit = () => {
  const type = configDialogType.value
  const value = configDialogValue.value.trim()
  const id = webDavConfigStr + type
  const postData = {
    _id: id,
    value: value,
    _rev: getData(id)?._rev
  }

  const result = saveData(postData)
  if (result.ok) {
    showSuccess('保存成功')
    webDavConfigRefs[type].value = value
    handleConfigCancel()
  } else if (result.error) {
    showError('保存失败：' + result.message)
    console.log(result.message)
  }
}

const handleBackup = async () => {
  try {
    await backupToWebDav({
      webDavUrl: webDavUrl.value,
      webDavAccount: webDavAccount.value,
      webDavPassword: webDavPassword.value,
      webDavSubFolder: webDavSubFolder.value
    })
    showSuccess('备份成功')
  } catch (error) {
    if (error && error.code === 'NO_DATA') {
      showInfo(error.message)
      return
    }
    showError('备份失败：' + error.message)
    console.log(error)
  }
}

const restoreDialog = ref(false)
const restoreFileList = ref([])

const handleOpenRestore = async () => {
  restoreFileList.value = []
  try {
    restoreFileList.value = await listWebDavBackupFiles({
      webDavUrl: webDavUrl.value,
      webDavAccount: webDavAccount.value,
      webDavPassword: webDavPassword.value,
      webDavSubFolder: webDavSubFolder.value
    })
    restoreDialog.value = true
  } catch (error) {
    showError('恢复失败：' + error.message)
    console.log(error)
  }
}

const handleRestore = async item => {
  try {
    await restoreWebDavBackupFile({
      webDavUrl: webDavUrl.value,
      webDavAccount: webDavAccount.value,
      webDavPassword: webDavPassword.value,
      webDavSubFolder: webDavSubFolder.value,
      fileItem: item
    })
    showSuccess('恢复成功')
    emit('refresh')
  } catch (error) {
    showError('恢复失败：' + error.message)
    console.log(error)
  }
}
</script>

<template>
  <v-list>
    <v-list-item>
      <v-list-item-title class="text-h5">远端备份与恢复</v-list-item-title>
    </v-list-item>

    <v-list-item v-for="item in webDavConfig" :key="item.key" @click="handleOpenConfig(item.key)">
      <v-list-item-title>{{ item.title }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ item.key === 'webDavPassword' ? webDavPasswordStar : webDavConfigRefs[item.key] }}
      </v-list-item-subtitle>
    </v-list-item>

    <v-list-item @click="handleBackup">
      <v-list-item-title>备份</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleOpenRestore">
      <v-list-item-title>恢复</v-list-item-title>
    </v-list-item>
  </v-list>

  <v-dialog v-model="configDialog">
    <v-card :title="configDialogTitle">
      <v-card-text>
        <v-text-field autofocus v-model="configDialogValue" :type="configDialogInputType"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="handleConfigCancel">取消</v-btn>
        <v-btn variant="text" color="blue" @click="handleConfigSubmit">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <RestoreFileDialog
    v-model="restoreDialog"
    title="请选择恢复文件"
    :files="restoreFileList"
    @select="handleRestore"
  />
</template>
