<script lang="ts" setup>
import {ref} from 'vue'

const addDialog = ref(false)
const addFormRef = ref()
const handleOpenAdd = () => {
  addForm.value.type = '1'
  addDialog.value = true
}
const handleAddCancel = () => {
  addFormRef.value.reset()
  addDialog.value = false
}
const handleAddSubmit = async () => {
  const {valid} = await addFormRef.value.validate()
  if (valid) {
    console.log(addForm.value)

    handleAddCancel()
  }
}
const addForm = ref({
  type: '',
  code: '',
  message: ''
})
const addFormTypeDict = [
  {code: '1', message: '文件/文件夹'},
  {code: '2', message: 'Shell脚本'}
]
const addFormTypeRule = [
  value => {
    if (value) {
      return true
    }
    return '类型必填'
  }
]
const addFormCodeRule = [
  value => {
    if (value) {
      return true
    }
    return '关键字必填'
  }
]
const addFormMessageRule = [
  value => {
    if (value) {
      return true
    }
    return '文件资源必填'
  }
]
</script>

<template>
  <v-card title="Card title" text="..." class="item-card">
    <v-card-actions>
      <v-btn variant="text" color="red">删除</v-btn>
      <v-btn variant="text" color="blue">修改</v-btn>
    </v-card-actions>
  </v-card>

  <v-btn icon="mdi-plus" class="add-button" @click="handleOpenAdd"/>

  <v-dialog persistent v-model="addDialog">
    <v-card title="新增">
      <v-card-text>
        <v-form ref="addFormRef">
          <v-select
              label="类型"
              v-model="addForm.type"
              :items="addFormTypeDict"
              item-title="message"
              item-value="code"
              :rules="addFormTypeRule"
              required>
          </v-select>

          <v-text-field
              autofocus
              label="关键字"
              v-model="addForm.code"
              :rules="addFormCodeRule"
              required>
          </v-text-field>

          <v-textarea
              label="文件资源"
              v-model="addForm.message"
              :rules="addFormMessageRule"
              required>
          </v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="handleAddCancel">取消</v-btn>
        <v-btn variant="text" color="blue" @click="handleAddSubmit">确定</v-btn>
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
}
</style>
