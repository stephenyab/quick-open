<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {getAllListData} from '@/util/commonUtil'
import {deleteData, deleteFeature, getData, saveData, setFeature} from '@/util/utoolsUtil'

onMounted(() => {
  initData()
})

const commonSaveData = (webForm, type) => {
  const tmpData = {
    _id: webForm.code,
    data: {
      code: webForm.code,
      message: typeof webForm.message === 'string' ? webForm.message.split('\n') : webForm.message,
      type: webForm.type
    }
  }
  saveData(tmpData)

  const operateType = webForm.type === '1' ? '打开' : '执行'
  const operateMessage = addFormTypeDict.find(item => item.code === webForm.type).message
  const explain = `${operateType} ${webForm.code} [${operateMessage}]`
  const cmdData = [webForm.code]
  setFeature(webForm.code, explain, cmdData)
}

const addDialog = ref(false)
const addFormRef = ref()
const handleOpenAdd = () => {
  addForm.type = '1'
  addDialog.value = true
}
const handleAddCancel = () => {
  addFormRef.value.reset()
  addDialog.value = false
}
const handleAddSubmit = async () => {
  const {valid} = await addFormRef.value.validate()
  if (valid) {
    commonSaveData(addForm, 1)
    handleAddCancel()
    initData()
  }
}
const addForm = reactive({
  type: '',
  code: '',
  message: ''
})
const addFormTypeDict = [
  {code: '1', message: '文件/文件夹'},
  {code: '2', message: 'Shell 脚本'}
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
      if (getData(value)) {
        return '关键字已存在'
      }
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

const allData = ref([])
const initData = () => {
  let tmpData = []
  getAllListData().forEach(item => {
    let message = item.data.message
    if (typeof message === 'string') {
      message = message.split('\n')
    }
    tmpData.push({
      id: item._id,
      code: item.data.code,
      message: message,
      type: item.data.type,
      rev: item._rev
    })
  })
  tmpData.sort((first, second) => {
    return String(first.id).localeCompare(String(second.id))
  })
  allData.value = tmpData
}
const getRealItemType = typeCode => {
  const typeItem = addFormTypeDict.find(item => item.code === String(typeCode))
  return typeItem ? typeItem.message : typeCode
}

const handleDeleteData = key => {
  deleteData(key)
  deleteFeature(key)
  initData()
}

const editDialog = ref(false)
const editFormRef = ref()
const editForm = reactive({
  type: '',
  code: '',
  oriCode: '',
  message: '',
  rev: ''
})
const handleOpenEdit = item => {
  editDialog.value = true
  Object.keys(editForm).forEach(key => {
    editForm[key] = item[key]
  })
  editForm.oriCode = item.code
}
const handleEditCancel = () => {
  editFormRef.value.reset()
  editDialog.value = false
}
const handleEditSubmit = async () => {
  const {valid} = await editFormRef.value.validate()
  if (valid) {
    console.log(editForm)

    handleEditCancel()
  }
}
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr);">
    <v-card v-for="(item, index) in allData" :key="index" class="item-card">
      <v-card-title>{{ item.code }}</v-card-title>
      <v-card-subtitle>{{ getRealItemType(item.type) }}</v-card-subtitle>
      <v-card-text>
        <div v-for="(itemText, textIndex) in item.message" :key="textIndex">
          {{ itemText }}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="handleDeleteData(item.code)">删除</v-btn>
        <v-btn variant="text" color="blue" @click="handleOpenEdit(item)">修改</v-btn>
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

  <v-dialog persistent v-model="editDialog">
    <v-card title="修改">
      <v-card-text>
        <v-form ref="editFormRef">
          <v-select
              label="类型"
              v-model="editForm.type"
              :items="addFormTypeDict"
              item-title="message"
              item-value="code"
              :rules="addFormTypeRule"
              required>
          </v-select>

          <v-text-field
              label="关键字"
              v-model="editForm.code"
              :rules="addFormCodeRule"
              required>
          </v-text-field>

          <v-textarea
              label="文件资源"
              v-model="editForm.message"
              :rules="addFormMessageRule"
              required>
          </v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="handleEditCancel">取消</v-btn>
        <v-btn variant="text" color="blue" @click="handleEditSubmit">确定</v-btn>
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
  margin: 4px;
}
</style>
