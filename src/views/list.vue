<script setup>
import {onMounted, ref, computed} from 'vue'
import {getAllListData, saveEntry} from '@/services/entryService'
import {deleteData, deleteFeature} from '@/utils/utoolsUtil'
import {getEntryTypeLabel, OPERATE_TYPE_CREATE, OPERATE_TYPE_UPDATE} from '@/constants/entryTypes'
import {normalizeMessageToArray} from '@/utils/messageCodec'
import EntryDialog from '@/components/EntryDialog.vue'

onMounted(() => {
  initData()
})

const allData = ref([])
const existingCodes = computed(() => allData.value.map(item => item.code))

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

const dialogVisible = ref(false)
const dialogMode = ref('add')
const currentEntry = ref({})

const handleOpenAdd = () => {
  dialogMode.value = 'add'
  currentEntry.value = {}
  dialogVisible.value = true
}

const handleOpenEdit = item => {
  dialogMode.value = 'edit'
  currentEntry.value = {...item}
  dialogVisible.value = true
}

const handleDialogSubmit = (formData) => {
  saveEntry(formData, formData.operateType)
  initData()
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

  <EntryDialog
    v-model="dialogVisible"
    :mode="dialogMode"
    :entry="currentEntry"
    :existing-codes="existingCodes"
    @submit="handleDialogSubmit"
  />
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
