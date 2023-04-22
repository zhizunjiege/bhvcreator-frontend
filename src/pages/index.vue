<template>
  <!-- TODO: License -->
  <div>
    <div>
      <h3 class="q-mb-xl text-center">Helloworld!</h3>
    </div>
    <div class="flex justify-center">
      <q-btn to="/home/settings" class="full-width bg-primary"> 进入系统 </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>

<route lang="yaml">
meta:
  layout: center
  full: true
</route>
