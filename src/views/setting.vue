<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {WEB_DAV_FIELD_PREFIX, WEB_DAV_FIELD_CONFIG } from '@/config/webDavConfig'
import {LOCAL_FIELD_PREFIX, LOCAL_FIELD_CONFIG } from '@/config/localConfig'
import {getAllDataByKeys, getData, saveData} from '@/util/utoolsUtil'
import {isNotEmpty, getAllListData, commonSaveData} from '@/util/commonUtil'
import {getDirectoryContents, getFileContents, initWebDavClient, putFileContents} from '@/util/webDavUtil'

onMounted(() => {
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

  const localBackupPathData = getData(localBackupPathKey)
  if (localBackupPathData) {
    localBackupPath.value = localBackupPathData.value
  }
})

const webDavConfigStr = WEB_DAV_FIELD_PREFIX
const webDavConfig = WEB_DAV_FIELD_CONFIG

const webDavUrl = ref('')

const webDavAccount = ref('')

const webDavPassword = ref('')
const webDavPasswordStar = computed(() =>
    webDavPassword.value.replace(/./g, '*')
)

const webDavSubFolder = ref('')

const webDavConfigRefs = {
  webDavUrl,
  webDavAccount,
  webDavPassword,
  webDavSubFolder
}

const localBackupPathKey = LOCAL_FIELD_PREFIX + 'localBackupPath'
const localBackupPath = ref('')

const handleOpenAdd = type => {
  webDavConfigDialog.value = true
  webDavConfigDialogType.value = type
  webDavConfigDialogInputType.value = type === 'webDavPassword' ? 'password' : 'input'
  const item = webDavConfig.find(item => item.key === type)
  webDavConfigDialogTitle.value = item.title
  webDavConfigDialogValue.value = webDavConfigRefs[type].value
}

const localBackupPathDialog = ref(false)
const localBackupPathDialogValue = ref('')
const handleOpenLocalBackupPath = () => {
  localBackupPathDialogValue.value = localBackupPath.value
  localBackupPathDialog.value = true
}
const handleLocalBackupPathCancel = () => {
  localBackupPathDialogValue.value = ''
  localBackupPathDialog.value = false
}
const handleLocalBackupPathSubmit = () => {
  const value = localBackupPathDialogValue.value.trim()
  if (value && !window.services.checkPathExists(value)) {
    errorHintShow('路径不存在，请检查路径是否正确')
    return
  }
  const postData = {
    _id: localBackupPathKey,
    value: value,
    _rev: getData(localBackupPathKey)?._rev
  }
  const result = saveData(postData)
  if (result.ok) {
    successHintShow('保存成功')
    localBackupPath.value = value
    handleLocalBackupPathCancel()
  } else if (result.error) {
    errorHintShow('保存失败：' + result.message)
    console.log(result.message)
  }
}

const handleOpenBackup = () => {
  const listData = getAllListData()

  if (!listData || listData.length === 0) {
    infoHintShow('无数据可备份')
    return
  }

  const date = new Date()
  const yyyy = date.getFullYear()
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hash = Math.random().toString(36).substring(2, 10)
  const fileName = `backup-${yyyy}-${MM}-${dd}-${hash}.json`
  const fileContent = JSON.stringify(listData, null, 2)
  const webDavClient = initWebDavClient(webDavUrl.value, webDavAccount.value, webDavPassword.value)
  putFileContents(webDavClient, fileName, fileContent, webDavSubFolder.value, true).then(() => {
    successHintShow('备份成功')
  }).catch(error => {
    errorHintShow('备份失败：' + error.message)
    console.log(error)
  })
}

let restoreFileList = []
const restoreDialog = ref(false)
const handleOpenRestore = () => {
  restoreFileList = []
  const webDavClient = initWebDavClient(webDavUrl.value, webDavAccount.value, webDavPassword.value)
  getDirectoryContents(webDavClient, webDavSubFolder.value).then(result => {
    const tmpList = result instanceof Array ? result : [result]
    restoreFileList = tmpList.filter(item => item.type === 'file')
    restoreDialog.value = true
  }).catch(error => {
    errorHintShow('恢复失败：' + error.message)
    console.log(error)
  })
}

const handleRestoreDeal = async item => {
  try {
    const webDavClient = initWebDavClient(webDavUrl.value, webDavAccount.value, webDavPassword.value)
    const result = await getFileContents(webDavClient, item.filename)
    const backupData = JSON.parse(result)
    
    for (const dataItem of backupData) {
      const webForm = {
        code: dataItem.data.code,
        message: dataItem.data.message,
        type: dataItem.data.type,
        rev: dataItem._rev
      }
      commonSaveData(webForm, '1')
    }
    
    successHintShow('恢复成功')
    restoreDialog.value = false
  } catch (error) {
    errorHintShow('恢复失败：' + error.message)
    console.log(error)
  }
}

const handleLocalBackup = () => {
  const listData = getAllListData()

  if (!listData || listData.length === 0) {
    infoHintShow('无数据可备份')
    return
  }

  const backupPath = localBackupPath.value.trim()
  if (!backupPath) {
    infoHintShow('请先设置本地备份路径')
    return
  }

  if (!window.services.checkPathExists(backupPath)) {
    errorHintShow('本地备份路径不存在，请检查路径是否正确')
    return
  }

  try {
    const date = new Date()
    const yyyy = date.getFullYear()
    const MM = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hash = Math.random().toString(36).substring(2, 10)
    const fileName = `backup-${yyyy}-${MM}-${dd}-${hash}.json`
    const fileContent = JSON.stringify(listData, null, 2)
    window.services.writeBackupFile(backupPath, fileName, fileContent)
    successHintShow('本地备份成功')
  } catch (error) {
    errorHintShow('本地备份失败：' + error.message)
    console.log(error)
  }
}

let localRestoreFileList = []
const localRestoreDialog = ref(false)
const handleLocalRestore = () => {
  localRestoreFileList = []
  
  const backupPath = localBackupPath.value.trim()
  if (!backupPath) {
    infoHintShow('请先设置本地备份路径')
    return
  }

  if (!window.services.checkPathExists(backupPath)) {
    errorHintShow('本地备份路径不存在，请检查路径是否正确')
    return
  }

  try {
    localRestoreFileList = window.services.readBackupFileList(backupPath)
    if (localRestoreFileList.length === 0) {
      infoHintShow('本地备份路径下没有备份文件')
      return
    }
    localRestoreDialog.value = true
  } catch (error) {
    errorHintShow('读取备份文件列表失败：' + error.message)
    console.log(error)
  }
}

const handleLocalRestoreDeal = item => {
  try {
    const result = window.services.readBackupFile(item.filename)
    const backupData = JSON.parse(result)
    
    for (const dataItem of backupData) {
      const webForm = {
        code: dataItem.data.code,
        message: dataItem.data.message,
        type: dataItem.data.type,
        rev: dataItem._rev
      }
      commonSaveData(webForm, '1')
    }
    
    successHintShow('本地恢复成功')
    localRestoreDialog.value = false
  } catch (error) {
    errorHintShow('本地恢复失败：' + error.message)
    console.log(error)
  }
}

const webDavConfigDialog = ref(false)
const webDavConfigDialogType = ref('')
const webDavConfigDialogInputType = ref('')
const webDavConfigDialogTitle = ref('')
const webDavConfigDialogValue = ref('')
const handleWebDavConfigAddCancel = () => {
  webDavConfigDialogValue.value = ''
  webDavConfigDialog.value = false
}
const handleWebDavConfigAddSubmit = () => {
  const type = webDavConfigDialogType.value
  const value = webDavConfigDialogValue.value.trim()
  const id = webDavConfigStr + type
  const postData = {
    _id: id,
    value: value,
    _rev: getData(id)?._rev
  }

  const result = saveData(postData)
  if (result.ok) {
    successHintShow('保存成功')
    webDavConfigRefs[type].value = value
    handleWebDavConfigAddCancel()
  } else if (result.error) {
    errorHintShow('保存失败：' + result.message)
    console.log(result.message)
  }
}

const successHint = ref(false)
const successHintTimeout = ref(2000)
const successHintMessage = ref('成功')
const successHintShow = (message, timeout = 2000) => {
  successHint.value = true
  successHintTimeout.value = timeout
  successHintMessage.value = message
}

const errorHint = ref(false)
const errorHintTimeout = ref(2000)
const errorHintMessage = ref('失败')
const errorHintShow = (message, timeout = 2000) => {
  errorHint.value = true
  errorHintTimeout.value = timeout
  errorHintMessage.value = message
}

const infoHint = ref(false)
const infoHintTimeout = ref(2000)
const infoHintMessage = ref('提示')
const infoHintShow = (message, timeout = 2000) => {
  infoHint.value = true
  infoHintTimeout.value = timeout
  infoHintMessage.value = message
}
</script>

<template>
  <v-list>
    <v-list-item>
      <v-list-item-title class="text-h5">远端备份与恢复</v-list-item-title>
    </v-list-item>

    <v-list-item v-for="item in webDavConfig" :key="item.key" @click="handleOpenAdd(item.key)">
      <v-list-item-title>{{ item.title }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ item.key === 'webDavPassword' ? webDavPasswordStar : webDavConfigRefs[item.key] }}
      </v-list-item-subtitle>
    </v-list-item>

    <v-list-item @click="handleOpenBackup">
      <v-list-item-title>备份</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleOpenRestore">
      <v-list-item-title>恢复</v-list-item-title>
    </v-list-item>

    <v-list-item>
      <v-list-item-title class="text-h5 mt-4">本地备份与恢复</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleOpenLocalBackupPath">
      <v-list-item-title>本地备份路径</v-list-item-title>
      <v-list-item-subtitle>{{ localBackupPath || '未设置' }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item @click="handleLocalBackup">
      <v-list-item-title>本地备份</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleLocalRestore">
      <v-list-item-title>本地恢复</v-list-item-title>
    </v-list-item>
  </v-list>

  <v-dialog v-model="webDavConfigDialog">
    <v-card :title="webDavConfigDialogTitle">
      <v-card-text>
        <v-text-field autofocus v-model="webDavConfigDialogValue" :type="webDavConfigDialogInputType"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn variant="text" color="red" @click="handleWebDavConfigAddCancel">取消</v-btn>
        <v-btn variant="text" color="blue" @click="handleWebDavConfigAddSubmit">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="successHint" :timeout="successHintTimeout" color="success">{{ successHintMessage }}</v-snackbar>
  <v-snackbar v-model="errorHint" :timeout="errorHintTimeout" color="error">{{ errorHintMessage }}</v-snackbar>
  <v-snackbar v-model="infoHint" :timeout="infoHintTimeout" color="warning">{{ infoHintMessage }}</v-snackbar>

  <v-dialog v-model="restoreDialog">
    <v-card title="请选择恢复文件">
      <v-card-text style="overflow-y: auto">
        <v-list>
          <v-list-item v-for="item in restoreFileList" style="padding: 0" @click="handleRestoreDeal(item)">
            <v-list-item-title>{{ item.basename }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="restoreDialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="localBackupPathDialog">
    <v-card title="本地备份路径">
      <v-card-text>
        <v-text-field autofocus v-model="localBackupPathDialogValue"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="handleLocalBackupPathCancel">取消</v-btn>
        <v-btn variant="text" color="blue" @click="handleLocalBackupPathSubmit">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="localRestoreDialog">
    <v-card title="请选择本地恢复文件">
      <v-card-text style="overflow-y: auto">
        <v-list>
          <v-list-item v-for="item in localRestoreFileList" style="padding: 0" @click="handleLocalRestoreDeal(item)">
            <v-list-item-title>{{ item.basename }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="localRestoreDialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
