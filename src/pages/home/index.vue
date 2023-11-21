<template>
  <div class="fit flex flex-center">
    <q-circular-progress indeterminate rounded size="4rem" color="accent" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

router.push("/home/ruleset");
</script>

<style scoped lang="scss"></style>
