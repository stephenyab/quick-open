<script setup>
import {computed} from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '请选择文件'
  },
  files: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'select'])

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleSelect = (item) => {
  emit('select', item)
  dialog.value = false
}

const handleClose = () => {
  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog">
    <v-card :title="title">
      <v-card-text style="overflow-y: auto">
        <v-list>
          <v-list-item 
            v-for="item in files" 
            :key="item.filename" 
            style="padding: 0" 
            @click="handleSelect(item)">
            <v-list-item-title>{{ item.basename }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="handleClose">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
