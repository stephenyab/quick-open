<script lang="ts" setup>
import {onMounted, ref} from 'vue'

onMounted(() => {
  // window.utools.onPluginEnter((action) => {
  //   route.value = action.code
  //   enterAction.value = action
  // })
  // window.utools.onPluginOut((isKill) => {
  //   route.value = ''
  // })
})

// 新增配置项
const addDialog = ref(false)
const handleOpenAdd = () => {
  addDialog.value = true
}
const handleAddCancel = () => {
  addDialog.value = false
}
const handleAddSubmit = () => {
  addDialog.value = false
}
</script>

<template>
  <v-card title="Card title" text="..." class="item-card">
    <v-card-actions>
      <v-btn variant="text" color="red">删除</v-btn>
      <v-btn variant="text" color="blue">修改</v-btn>
    </v-card-actions>
  </v-card>

  <!-- 新增配置项 -->
  <v-btn icon="mdi-plus" class="add-button" @click="handleOpenAdd"/>
  <v-dialog persistent v-model="addDialog">
    <v-card title="新增" class="add-card">

      <v-card-actions>
        <div style="float: right">
          <v-btn variant="text" color="red" @click="handleAddCancel">取消</v-btn>
          <v-btn variant="text" color="blue" @click="handleAddSubmit">确定</v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.add-button {
  position: fixed;
  bottom: 2rem;
  right: 1.5rem
}

.item-card {
  margin: 5px;
  padding: 5px;
}

.add-card {
  padding: 5px;
}
</style>
