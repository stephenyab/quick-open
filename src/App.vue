<script lang="ts" setup>
import {onMounted, ref} from 'vue'

const route = ref('')
const enterAction = ref({})

onMounted(() => {
  window.utools.onPluginEnter((action) => {
    route.value = action.code
    enterAction.value = action
  })
  window.utools.onPluginOut((isKill) => {
    route.value = ''
  })
})
</script>

<template>
  <div>Hello World！</div>
  <div>{{ route }}</div>
  <div>{{ enterAction }}</div>
</template>
