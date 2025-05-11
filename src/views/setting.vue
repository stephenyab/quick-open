<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {getAllData, getData, saveData} from '@/util/utoolsUtil'
import {isNotEmpty} from '@/util/commonUtil'

onMounted(() => {
  const keys = webDavConfig.map(item => webDavConfigStr + item.key)
  const result = getAllData(keys)
  if (isNotEmpty(result)) {
    result.forEach(item => {
      const key = item._id
      const value = item.value
      if (key.endsWith('webDavUrl')) {
        webDavUrl.value = value
      } else if (key.endsWith('webDavAccount')) {
        webDavAccount.value = value
      } else if (key.endsWith('webDavPassword')) {
        webDavPassword.value = value
      } else if (key.endsWith('webDavSubFolder')) {
        webDavSubFolder.value = value
      }
    })
  }
})

const webDavConfigStr = 'webDav/config/'
const webDavConfig = [
  {key: 'webDavUrl', title: 'WebDav 服务器地址'},
  {key: 'webDavAccount', title: 'WebDav 账号'},
  {key: 'webDavPassword', title: 'WebDav 密码'},
  {key: 'webDavSubFolder', title: '子文件夹'},
]

const webDavUrl = ref('')

const webDavAccount = ref('')

const webDavPassword = ref('')
const webDavPasswordStar = computed(() => {
  if (webDavPassword.value && webDavPassword.value.length > 0) {
    return Array(webDavPassword.value.length).fill('*').join('')
  } else {
    return ''
  }
})

const webDavSubFolder = ref('')

const handleOpenAdd = type => {
  webDavConfigDialog.value = true
  webDavConfigDialogType = type
  webDavConfigDialogInputType.value = type === 'webDavPassword' ? 'password' : 'input'
  const item = webDavConfig.find(item => item.key === type)
  webDavConfigDialogTitle.value = item.title
  if (type === 'webDavUrl') {
    webDavConfigDialogValue.value = webDavUrl.value
  } else if (type === 'webDavAccount') {
    webDavConfigDialogValue.value = webDavAccount.value
  } else if (type === 'webDavPassword') {
    webDavConfigDialogValue.value = webDavPassword.value
  } else if (type === 'webDavSubFolder') {
    webDavConfigDialogValue.value = webDavSubFolder.value
  }
}

const handleOpenBackup = () => {

}

const handleOpenRestore = async () => {

}

let webDavConfigDialogType = ''
const webDavConfigDialog = ref(false)
const webDavConfigDialogInputType = ref('')
const webDavConfigDialogTitle = ref('')
const webDavConfigDialogValue = ref('')
const handleWebDavConfigAddCancel = () => {
  webDavConfigDialogValue.value = ''
  webDavConfigDialog.value = false
}
const handleWebDavConfigAddSubmit = () => {
  const id = webDavConfigStr + webDavConfigDialogType
  const postData = {
    _id: id,
    value: webDavConfigDialogValue.value
  }

  const oldData = getData(id)
  if (oldData) {
    postData._rev = oldData._rev
  }

  const result = saveData(postData)
  if (result.ok) {
    if (webDavConfigDialogType === 'webDavUrl') {
      webDavUrl.value = webDavConfigDialogValue.value
    } else if (webDavConfigDialogType === 'webDavAccount') {
      webDavAccount.value = webDavConfigDialogValue.value
    } else if (webDavConfigDialogType === 'webDavPassword') {
      webDavPassword.value = webDavConfigDialogValue.value
    } else if (webDavConfigDialogType === 'webDavSubFolder') {
      webDavSubFolder.value = webDavConfigDialogValue.value
    }
    handleWebDavConfigAddCancel()
  } else if (result.error) {
    console.log(result.message)
  }
}
</script>

<template>
  <v-list>
    <v-list-item>
      <v-list-item-title class="text-h5">WebDav 设置</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleOpenAdd('webDavUrl')">
      <v-list-item-title>WebDav 服务器地址</v-list-item-title>
      <v-list-item-subtitle>{{ webDavUrl }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item @click="handleOpenAdd('webDavAccount')">
      <v-list-item-title>WebDav 账号</v-list-item-title>
      <v-list-item-subtitle>{{ webDavAccount }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item @click="handleOpenAdd('webDavPassword')">
      <v-list-item-title>WebDav 密码</v-list-item-title>
      <v-list-item-subtitle>{{ webDavPasswordStar }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item @click="handleOpenAdd('webDavSubFolder')">
      <v-list-item-title>子文件夹</v-list-item-title>
      <v-list-item-subtitle>{{ webDavSubFolder }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item>
      <v-list-item-title class="text-h5 mt-4">备份与恢复</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleOpenBackup">
      <v-list-item-title>备份</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleOpenRestore">
      <v-list-item-title>恢复</v-list-item-title>
    </v-list-item>
  </v-list>

  <v-dialog v-model="webDavConfigDialog">
    <v-card :title="webDavConfigDialogTitle">
      <v-card-text>
        <v-text-field v-model="webDavConfigDialogValue" :type="webDavConfigDialogInputType"></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn variant="text" color="red" @click="handleWebDavConfigAddCancel">取消</v-btn>
        <v-btn variant="text" color="blue" @click="handleWebDavConfigAddSubmit">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
