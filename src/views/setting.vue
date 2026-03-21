<script setup>
import {useHint} from '@/composables/useHint'
import WebDavSection from '@/components/WebDavSection.vue'
import LocalBackupSection from '@/components/LocalBackupSection.vue'

const {hint, hintTimeout, hintMessage, hintColor} = useHint()
</script>

<template>
  <WebDavSection />
  <LocalBackupSection />
  <v-snackbar v-model="hint" :timeout="hintTimeout" :color="hintColor">{{ hintMessage }}</v-snackbar>
</template>

<style scoped>
</style>
