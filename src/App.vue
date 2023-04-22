<template>
  <router-view />
</template>

<script setup lang="ts">
import { useAppStore } from "~/stores";

const $q = useQuasar();

$q.dark.set("auto");

const appStore = useAppStore();

appStore.loadSystemSettings();
onBeforeUnmount(appStore.saveSystemSettings);
</script>

<style lang="scss">
html,
body {
  font-family: "Microsoft YaHei" !important;
  font-size: 16px !important;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: 1px;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--ui-primary);
}
::-webkit-scrollbar-track,
::-webkit-scrollbar-corner {
  background-color: var(--ui-secondary);
}
::-webkit-scrollbar-thumb {
  border-radius: 0.25rem;
  background-color: var(--ui-info);
}
</style>
