<template>
  <div class="fit flex flex-center">
    <q-circular-progress indeterminate rounded size="4rem" color="accent" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
router.push(route.path + "/ruleset");
</script>

<style scoped lang="scss"></style>

<route lang="yaml">
name: manager
</route>
