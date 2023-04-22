<template>
  <div :class="full ? 'fullscreen' : 'fit'" class="flex flex-center">
    <router-view />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const full = computed(() => route.meta.full as boolean);
</script>

<style lang="scss"></style>
