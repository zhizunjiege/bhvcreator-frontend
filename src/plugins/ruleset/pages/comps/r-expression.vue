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
      <q-card-section>
        <q-input
          :model-value="modelValue"
          dense
          filled
          autogrow
          type="textarea"
          @update:model-value="emits('update:modelValue', $event as string)"
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
  max-width: 60%;
  width: 60%;
}
</style>
