<script lang="ts" setup>
import {onMounted, ref} from 'vue'

const route = ref('')
const enterAction = ref({})

onMounted(() => {
  // window.utools.onPluginEnter((action) => {
  //   route.value = action.code
  //   enterAction.value = action
  // })
  // window.utools.onPluginOut((isKill) => {
  //   route.value = ''
  // })
})

const handleOpenAdd = () => {
  alert('新增配置项')
}
</script>

<template>
  <v-card title="Card title" text="..." class="item-card">
    <v-card-actions>
      <v-btn>Click me</v-btn>
    </v-card-actions>
  </v-card>

  <!-- 新增配置项 -->
  <v-btn icon="mdi-plus" class="add-button" @click="handleOpenAdd"/>
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
