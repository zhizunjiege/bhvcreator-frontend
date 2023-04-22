<template>
  <q-card flat class="q-mx-auto q-pt-xl transparent ui-card">
    <q-card-section class="text-center text-h6">系统设置</q-card-section>
    <q-card-section>
      <p class="text-subtitle1">服务地址</p>
      <q-markup-table flat separator="horizontal" class="ui-table">
        <tbody>
          <tr>
            <td>数据库地址</td>
            <td>
              <q-input
                v-model.lazy="dbAddr"
                dense
                standout="bg-ignore"
                input-class="text-foreground"
                class="ui-input"
                @blur="appStore.setDbAddr(dbAddr)"
              />
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useAppStore } from "~/stores";

const appStore = useAppStore();

// local system settings
const dbAddr = ref(appStore.systemSettings.dbAddr);
</script>

<style scoped lang="scss"></style>
