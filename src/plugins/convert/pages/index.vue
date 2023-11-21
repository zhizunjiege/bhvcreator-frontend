<template>
  <div class="fit flex flex-center">
    <q-circular-progress indeterminate rounded size="4rem" color="accent" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();

if (route.query.id) {
  router.push(route.path + "/export?id=" + route.query.id);
} else {
  router.push(route.path + "/import");
}
</script>

<style scoped lang="scss"></style>

<route lang="yaml">
name: convert
</route>
