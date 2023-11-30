<template>
  <!-- TODO: License -->
  <!-- <div>
    <div>
      <h3 class="q-mb-xl text-center">Hello World</h3>
    </div>
    <div class="flex justify-center">
      <q-btn to="/home" class="full-width bg-primary"> 进入系统 </q-btn>
    </div>
  </div> -->
  <q-circular-progress indeterminate rounded size="4rem" color="accent" />
</template>

<script setup lang="ts"></script>

<style scoped lang="scss"></style>

<route lang="yaml">
meta:
  layout: center
redirect: /home
</route>
