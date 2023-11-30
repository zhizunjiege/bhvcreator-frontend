<template>
  <div class="fit flex flex-center">
    <q-circular-progress indeterminate rounded size="4rem" color="accent" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

onActivated(() => {
  const path = route.path + (route.path.endsWith("/") ? "" : "/");
  router.push(`${path}ruleset`);
  console.log(route);
});
</script>

<style scoped lang="scss"></style>

<route lang="yaml">
name: manager
</route>
