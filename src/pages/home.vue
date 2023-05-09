<template>
  <q-layout view="hHh lpR fFf" class="fullscreen">
    <q-header class="bg-primary">
      <q-toolbar>
        <q-toolbar-title shrink>
          <q-img :src="Logo" width="2rem" alt="Logo" class="q-mr-sm" />
          规则行为建模软件
        </q-toolbar-title>
        <q-toolbar-title>
          <q-btn flat class="q-ml-lg text-subtitle1">
            插件
            <q-icon name="bi-caret-down-fill" size="1rem" class="q-ml-lg" />
            <q-menu
              fit
              anchor="bottom left"
              self="top left"
              class="text-subtitle2"
            >
              <q-list dense>
                <template v-for="plugin in core.plugins">
                  <q-item
                    v-if="plugin.menu"
                    :key="plugin.name"
                    v-ripple
                    clickable
                    active-class=""
                    :to="
                      plugin.menu.items
                        ? ''
                        : resolve('/home', plugin.name, plugin.menu.to)
                    "
                  >
                    <q-item-section>{{ plugin.menu.label }}</q-item-section>
                    <template v-if="plugin.menu.items">
                      <q-item-section side>
                        <q-icon name="bi-chevron-right" size="xs" />
                      </q-item-section>
                      <q-menu
                        fit
                        anchor="top end"
                        self="top start"
                        class="text-subtitle2"
                      >
                        <q-list dense>
                          <q-item
                            v-for="item in plugin.menu.items"
                            :key="item.label"
                            v-ripple
                            clickable
                            :to="resolve('/home', plugin.name, item.to)"
                            active-class=""
                          >
                            <q-item-section>{{ item.label }}</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </template>
                  </q-item>
                </template>
              </q-list>
            </q-menu>
          </q-btn>
          <q-btn flat to="/home/settings" class="q-ml-lg text-subtitle1">
            设置
          </q-btn>
        </q-toolbar-title>
        <q-toolbar-title>
          <q-btn
            flat
            round
            :icon="$q.dark.isActive ? 'bi-moon' : 'bi-sun'"
            size="sm"
            class="float-right q-mx-sm ui-clickable"
            @click="$q.dark.toggle"
          >
            <q-tooltip anchor="bottom left" self="top middle">
              切换主题
            </q-tooltip>
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page :style-fn="pageStyle">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { resolve } from "path-browserify";
import Logo from "~/assets/logo.png";
import { useCore } from "~/core";

// page style
function pageStyle(offset: number, height: number) {
  const h = `${height - offset}px`;
  return {
    minHeight: h,
    height: h,
    overflow: "auto",
  };
}

// use core
const core = useCore();
</script>

<style scoped lang="scss"></style>

<style lang="scss">
.ui-clickable:not([disabled]) {
  cursor: pointer;
  &:hover {
    color: var(--ui-accent);
  }
}
</style>
