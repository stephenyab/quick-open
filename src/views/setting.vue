<script setup>
/**
 * 设置页面
 * 包含 WebDAV 远程备份和本地备份配置
 */
import WebDavSection from '@/components/WebDavSection.vue'
import LocalBackupSection from '@/components/LocalBackupSection.vue'
</script>

<template>
  <WebDavSection />
  <LocalBackupSection />
</template>

<style scoped>
</style>
