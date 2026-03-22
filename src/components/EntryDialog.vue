<script setup>
/**
 * 条目编辑对话框组件
 * 支持新增和编辑两种模式
 */
import {computed, reactive, ref, watch} from 'vue'
import {ENTRY_TYPES, OPERATE_TYPE_CREATE, OPERATE_TYPE_UPDATE} from '@/constants/entryTypes'
import {normalizeMessageToString} from '@/utils/messageCodec'
import {createCodeRule, messageRequiredRule, typeRequiredRule} from '@/rules/formRules'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String,
    default: 'add',
    validator: (val) => ['add', 'edit'].includes(val)
  },
  entry: {
    type: Object,
    default: () => ({})
  },
  existingCodes: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref()
const form = reactive({
  type: '',
  code: '',
  oriCode: '',
  message: '',
  rev: ''
})

const title = computed(() => props.mode === 'add' ? '新增' : '修改')

const codeRule = computed(() => {
  if (props.mode === 'add') {
    return createCodeRule((code) => props.existingCodes.includes(code))
  }
  return createCodeRule((code) => code !== props.entry.code && props.existingCodes.includes(code))
})

watch(() => props.modelValue, (val) => {
  if (val && props.mode === 'edit' && props.entry) {
    Object.keys(form).forEach(key => {
      form[key] = props.entry[key]
    })
    form.oriCode = props.entry.code
    form.message = normalizeMessageToString(props.entry.message)
  } else if (val && props.mode === 'add') {
    form.type = '1'
    form.code = ''
    form.message = ''
    form.oriCode = ''
    form.rev = ''
  }
})

const handleCancel = () => {
  formRef.value?.reset()
  dialog.value = false
}

const handleSubmit = async () => {
  const {valid} = await formRef.value.validate()
  if (valid) {
    emit('submit', {
      ...form,
      operateType: props.mode === 'add' ? OPERATE_TYPE_CREATE : OPERATE_TYPE_UPDATE
    })
    handleCancel()
  }
}
</script>

<template>
  <v-dialog persistent v-model="dialog">
    <v-card :title="title">
      <v-card-text>
        <v-form ref="formRef">
          <v-select
              label="类型"
              v-model="form.type"
              :items="ENTRY_TYPES"
              item-title="message"
              item-value="code"
              :rules="typeRequiredRule"
              required>
          </v-select>

          <v-text-field
              :autofocus="mode === 'add'"
              label="关键字"
              v-model="form.code"
              :rules="codeRule"
              required>
          </v-text-field>

          <v-textarea
              label="文件资源"
              v-model="form.message"
              :rules="messageRequiredRule"
              required>
          </v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" color="red" @click="handleCancel">取消</v-btn>
        <v-btn variant="text" color="blue" @click="handleSubmit">确定</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
