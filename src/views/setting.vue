<script lang="ts" setup>
import {ref} from 'vue'

const items = ref([
  {
    title: 'WebDav 设置',
    value: 'web-dav-setting',
    props: {
      prependIcon: 'mdi-weather-cloudy',
      appendIcon: 'mdi-arrow-right-bold'
    }
  },
  {
    title: '备份',
    value: 'back',
    props: {
      prependIcon: 'mdi-cloud-upload',
      appendIcon: 'mdi-arrow-right-bold'
    }
  },
  {
    title: '恢复',
    value: 'restore',
    props: {
      prependIcon: 'mdi-restore',
      appendIcon: 'mdi-arrow-right-bold'
    }
  }
])
</script>

<template>
  <v-list class="custom-list" :items="items"></v-list>
</template>

<style scoped>

</style>
