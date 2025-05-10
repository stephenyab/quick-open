<script lang="ts" setup>
import {computed, ref} from 'vue'

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

const handleOpenAdd = title => {

}

const handleBackup = () => {

}

const handleRestore = () => {

}
</script>

<template>
  <v-list>
    <v-list-item>
      <v-list-item-title class="text-h5">WebDav 设置</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleOpenAdd('WebDav 服务器地址')">
      <v-list-item-title>WebDav 服务器地址</v-list-item-title>
      <v-list-item-subtitle>{{ webDavUrl }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item @click="handleOpenAdd('WebDav 账号')">
      <v-list-item-title>WebDav 账号</v-list-item-title>
      <v-list-item-subtitle>{{ webDavAccount }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item @click="handleOpenAdd('WebDav 密码')">
      <v-list-item-title>WebDav 密码</v-list-item-title>
      <v-list-item-subtitle>{{ webDavPasswordStar }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item @click="handleOpenAdd('子文件夹')">
      <v-list-item-title>子文件夹</v-list-item-title>
      <v-list-item-subtitle>{{ webDavSubFolder }}</v-list-item-subtitle>
    </v-list-item>

    <v-list-item>
      <v-list-item-title class="text-h5 mt-4">备份与恢复</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleBackup">
      <v-list-item-title>备份</v-list-item-title>
    </v-list-item>

    <v-list-item @click="handleRestore">
      <v-list-item-title>恢复</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped>

</style>
