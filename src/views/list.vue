<script setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {getAllListData, saveEntry} from '@/services/entryService'
import {deleteData, deleteFeature} from '@/util/utoolsUtil'
import {ENTRY_TYPES, ENTRY_TYPE_FILE, getEntryTypeLabel, OPERATE_TYPE_CREATE, OPERATE_TYPE_UPDATE} from '@/constants/entryTypes'
import {normalizeMessageToArray, normalizeMessageToString} from '@/domain/messageCodec'
import {typeRequiredRule, messageRequiredRule, createAddCodeRule, createEditCodeRule} from '@/rules/formRules'

onMounted(() => {
  initData()
})

const addDialog = ref(false)
const addFormRef = ref()
const handleOpenAdd = () => {
  addForm.type = ENTRY_TYPE_FILE
  addDialog.value = true
}
const handleAddCancel = () => {
  addFormRef.value.reset()
  addDialog.value = false
}
const handleAddSubmit = async () => {
  const {valid} = await addFormRef.value.validate()
  if (valid) {
    saveEntry(addForm, OPERATE_TYPE_CREATE)
    handleAddCancel()
    initData()
  }
}
const addForm = reactive({
  type: '',
  code: '',
  message: ''
})
const addFormCodeRule = createAddCodeRule()

const allData = ref([])
const initData = () => {
  let tmpData = []
  getAllListData().forEach(item => {
    const message = normalizeMessageToArray(item.data.message)
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
defineExpose({ initData })
const getRealItemType = typeCode => {
  return getEntryTypeLabel(typeCode)
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
const editFormOriCode = computed(() => editForm.oriCode)
const editFormCodeRule = createEditCodeRule(editFormOriCode)
const handleOpenEdit = item => {
  editDialog.value = true
  Object.keys(editForm).forEach(key => {
    editForm[key] = item[key]
  })
  editForm.oriCode = item.code
  editForm.message = normalizeMessageToString(item.message)
}
const handleEditCancel = () => {
  editFormRef.value.reset()
  editDialog.value = false
}
const handleEditSubmit = async () => {
  const {valid} = await editFormRef.value.validate()
  if (valid) {
    saveEntry(editForm, OPERATE_TYPE_UPDATE)
    handleEditCancel()
    initData()
  }
}
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(2, 1fr);">
    <v-card v-for="item in allData" :key="item.id" class="item-card">
      <v-card-title>{{ item.code }}</v-card-title>
      <v-card-subtitle>{{ getRealItemType(item.type) }}</v-card-subtitle>
      <v-card-text>
        <div class="message-ellipsis">
          <p v-for="(itemText, textIndex) in item.message" :key="textIndex">
            {{ itemText }}
          </p>
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
              :items="ENTRY_TYPES"
              item-title="message"
              item-value="code"
              :rules="typeRequiredRule"
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
              :rules="messageRequiredRule"
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
              :items="ENTRY_TYPES"
              item-title="message"
              item-value="code"
              :rules="typeRequiredRule"
              required>
          </v-select>

          <v-text-field
              label="关键字"
              v-model="editForm.code"
              :rules="editFormCodeRule"
              required>
          </v-text-field>

          <v-textarea
              label="文件资源"
              v-model="editForm.message"
              :rules="messageRequiredRule"
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

.message-ellipsis {
  height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical
}
</style>
