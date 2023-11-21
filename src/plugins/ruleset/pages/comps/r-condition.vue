<template>
  <r-expression v-model="condition.expression" />
</template>

<script setup lang="ts">
import { Condition } from "../..";

import rExpression from "./r-expression.vue";

const props = defineProps<{
  modelValue: Condition;
}>();

const condition = computed(() => props.modelValue);
</script>

<style scoped lang="scss"></style>
