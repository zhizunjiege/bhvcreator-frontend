<template>
  <div class="fit flex flex-center">
    <h3>规则录入插件</h3>
  </div>
</template>

<script setup lang="ts">
import { useRuleset } from "..";

const ruleset = useRuleset();
console.log(ruleset);
</script>

<style scoped lang="scss"></style>
