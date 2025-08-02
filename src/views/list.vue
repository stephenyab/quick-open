<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {getAllListData} from '@/util/commonUtil'

onMounted(() => {
  initData()
})

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

let allData = []
const initData = () => {
  allData = []
  console.log(getAllListData())
  getAllListData().forEach(item => {
    let message = item.data.message
    if (typeof message === 'string') {
      message = message.split('\n')
    }
    allData.push({
      id: item._id,
      code: item.data.code,
      message: message,
      type: item.data.type,
      rev: item._rev
    })
  })
  allData.sort((first, second) => {
    return String(first.id).localeCompare(String(second.id))
  })
}
const getRealItemType = computed(typeCode => {
  const typeItem = addFormTypeDict.find(item => item.code === String(typeCode))
  if (typeItem) {
    return typeItem.message
  } else {
    return typeCode
  }
})
</script>

<template>
  <div style="display: flex">
    <v-card class="item-card" style="width: 50%">
      <v-card-title>Card title</v-card-title>
      <v-card-subtitle>测试</v-card-subtitle>
      <v-card-text>...</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red">删除</v-btn>
        <v-btn variant="text" color="blue">修改</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="item-card" style="width: 50%">
      <v-card-title>Card title</v-card-title>
      <v-card-subtitle>测试</v-card-subtitle>
      <v-card-text>...</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red">删除</v-btn>
        <v-btn variant="text" color="blue">修改</v-btn>
      </v-card-actions>
    </v-card>
  </div>

  <div style="display: flex">
    <v-card v-for="(item, index) in allData" :key="index" class="item-card" style="width: 50%;">
      <v-card-title>{{ item.code }}</v-card-title>
      <v-card-subtitle>{{ getRealItemType(item.code) }}</v-card-subtitle>
      <v-card-text>
        <div v-for="(itemText, textIndex) in item.message" :key="textIndex">
          {{ itemText }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red">删除</v-btn>
        <v-btn variant="text" color="blue">修改</v-btn>
      </v-card-actions>
    </v-card>
  </div>

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
