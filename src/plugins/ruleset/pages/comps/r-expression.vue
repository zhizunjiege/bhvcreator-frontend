<template>
  <div class="full-width ellipsis" @click="dialogShow = true">
    {{ displayText }}
    <q-tooltip anchor="top middle" self="bottom middle">
      {{ displayText }}
    </q-tooltip>
  </div>
  <q-dialog v-model="dialogShow">
    <q-card flat class="bg-secondary r-card">
      <q-card-section class="text-center text-subtitle1">
        表达式
      </q-card-section>
      <q-card-section class="r-container">
        <monaco-editor
          :model-value="modelValue"
          language="ruleexpr"
          @update:model-value="emits('update:modelValue', $event)"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();
const emits = defineEmits<{
  (e: "update:modelValue", modelValue: string): void;
}>();

const dialogShow = ref(false);
const displayText = computed(() => props.modelValue.trim() || "无");
</script>

<style scoped lang="scss">
.r-card {
  max-width: 100vw;
}
.r-container {
  width: 50vw;
  height: 50vh;
}
</style>
