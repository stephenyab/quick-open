<script setup>
import {computed, ref} from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['click'])

const displaySubtitle = computed(() => props.subtitle || '未设置')
</script>

<template>
  <v-list-item @click="emit('click')">
    <v-list-item-title>{{ title }}</v-list-item-title>
    <v-list-item-subtitle v-if="subtitle !== null">{{ displaySubtitle }}</v-list-item-subtitle>
  </v-list-item>
</template>
