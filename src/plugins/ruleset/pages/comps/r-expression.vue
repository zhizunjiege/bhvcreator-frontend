<template>
  <div class="full-width ellipsis" @click="editorShow = true">
    {{ displayText }}
    <q-tooltip anchor="top middle" self="bottom middle">
      {{ displayText }}
    </q-tooltip>
  </div>
  <q-card v-if="editorShow" class="fixed-center z-top">
    <q-card-section class="row text-subtitle1">
      表达式编辑器
      <q-space />
      <q-btn
        flat
        round
        dense
        icon="bi-x-circle"
        class="ui-clickable"
        @click="editorShow = false"
      />
    </q-card-section>
    <q-card-section class="text-left r-container">
      <monaco-editor
        :model-value="modelValue"
        language="ruleexpr"
        @update:model-value="emits('update:modelValue', $event)"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
}>();

const editorShow = ref(false);
const displayText = computed(() => props.modelValue.trim() || "无");
</script>

<style scoped lang="scss">
.r-container {
  width: 60vw;
  height: 50vh;
}
</style>
