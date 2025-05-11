<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {getAllData, getData, saveData} from '@/util/utoolsUtil'
import {isNotEmpty} from '@/util/commonUtil'

onMounted(() => {
  const keys = webDavConfig.map(item => webDavConfigStr + item.key)
  const result = getAllData(keys)
  if (isNotEmpty(result)) {
    result.forEach(({_id: key, value}) => {
      const configKey = key.split(webDavConfigStr)[1]
      if (webDavConfigRefs[configKey]) {
        webDavConfigRefs[configKey].value = value
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

const handleOpenAdd = type => {
  webDavConfigDialog.value = true
  webDavConfigDialogType.value = type
  webDavConfigDialogInputType.value = type === 'webDavPassword' ? 'password' : 'input'
  const item = webDavConfig.find(item => item.key === type)
  webDavConfigDialogTitle.value = item.title
  webDavConfigDialogValue.value = webDavConfigRefs[type].value
}

const handleOpenBackup = () => {

}

const handleOpenRestore = async () => {

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
    webDavConfigRefs[type].value = value
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

    <v-list-item v-for="item in webDavConfig" :key="item.key" @click="handleOpenAdd(item.key)">
      <v-list-item-title>{{ item.title }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ item.key === 'webDavPassword' ? webDavPasswordStar : webDavConfigRefs[item.key] }}
      </v-list-item-subtitle>
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
