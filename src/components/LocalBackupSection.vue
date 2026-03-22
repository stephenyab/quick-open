<script setup>
/**
 * 本地备份设置区域组件
 * 提供本地备份路径配置、备份和恢复功能
 */
import {onMounted, ref} from 'vue'
import {LOCAL_FIELD_PREFIX} from '@/config/localConfig'
import {getData, saveData} from '@/utils/utoolsUtil'
import {backupToLocal, listLocalBackupFiles, restoreLocalBackupFile} from '@/services/backupService'
import {useHint} from '@/composables/useHint'
import RestoreFileDialog from '@/components/RestoreFileDialog.vue'

const emit = defineEmits(['refresh'])

const {showSuccess, showError, showInfo} = useHint()

const localBackupPathKey = LOCAL_FIELD_PREFIX + 'localBackupPath'
const localBackupPath = ref('')

onMounted(() => {
  loadConfig()
})

const loadConfig = () => {
  const localBackupPathData = getData(localBackupPathKey)
  if (localBackupPathData) {
    localBackupPath.value = localBackupPathData.value
  }
}

const pathDialog = ref(false)
const pathDialogValue = ref('')

const handleOpenPathDialog = () => {
  pathDialogValue.value = localBackupPath.value
  pathDialog.value = true
}

const handlePathCancel = () => {
  pathDialogValue.value = ''
  pathDialog.value = false
}

const handlePathSubmit = () => {
  const value = pathDialogValue.value.trim()
  if (value && !window.services.checkPathExists(value)) {
    showError('路径不存在，请检查路径是否正确')
    return
  }
  const postData = {
    _id: localBackupPathKey,
    value: value,
    _rev: getData(localBackupPathKey)?._rev
  }
  const result = saveData(postData)
  if (result.ok) {
    showSuccess('保存成功')
    localBackupPath.value = value
    handlePathCancel()
  } else if (result.error) {
    showError('保存失败：' + result.message)
    console.log(result.message)
  }
}

const handleBackup = async () => {
  const backupPath = localBackupPath.value.trim()
  if (!backupPath) {
    showInfo('请先设置本地备份路径')
    return
  }

  if (!window.services.checkPathExists(backupPath)) {
    showError('本地备份路径不存在，请检查路径是否正确')
    return
  }

  try {
    backupToLocal({backupPath})
    showSuccess('本地备份成功')
  } catch (error) {
    if (error && error.code === 'NO_DATA') {
      showInfo(error.message)
      return
    }
    showError('本地备份失败：' + error.message)
    console.log(error)
  }
}

const restoreDialog = ref(false)
const restoreFileList = ref([])

const handleOpenRestore = () => {
  restoreFileList.value = []
  
  const backupPath = localBackupPath.value.trim()
  if (!backupPath) {
    showInfo('请先设置本地备份路径')
    return
  }

  if (!window.services.checkPathExists(backupPath)) {
    showError('本地备份路径不存在，请检查路径是否正确')
    return
  }

  try {
    restoreFileList.value = listLocalBackupFiles({backupPath})
    if (restoreFileList.value.length === 0) {
      showInfo('本地备份路径下没有备份文件')
      return
    }
    restoreDialog.value = true
  } catch (error) {
    showError('读取备份文件列表失败：' + error.message)
    console.log(error)
  }
}

const handleRestore = item => {
  try {
    restoreLocalBackupFile({fileItem: item})
    showSuccess('本地恢复成功')
    emit('refresh')
  } catch (error) {
    showError('本地恢复失败：' + error.message)
    console.log(error)
  }
}
</script>

<template>
  <v-list>
    <v-list-item>
      <v-list-item-title class="text-h5 mt-4">本地备份与恢复</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleOpenPathDialog">
      <v-list-item-title>本地备份路径</v-list-item-title>
      <v-list-item-subtitle>{{ localBackupPath || '未设置' }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item @click="handleBackup">
      <v-list-item-title>本地备份</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleOpenRestore">
      <v-list-item-title>本地恢复</v-list-item-title>
    </v-list-item>
  </v-list>

  <v-dialog v-model="pathDialog">
    <v-card title="本地备份路径">
      <v-card-text>
        <v-text-field autofocus v-model="pathDialogValue"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="handlePathCancel">取消</v-btn>
        <v-btn variant="text" color="blue" @click="handlePathSubmit">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <RestoreFileDialog
    v-model="restoreDialog"
    title="请选择本地恢复文件"
    :files="restoreFileList"
    @select="handleRestore"
  />
</template>
