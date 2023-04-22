import { Quasar, Dialog, Notify } from "quasar";
import iconSet from "quasar/icon-set/bootstrap-icons";
import langCn from "quasar/lang/zh-CN";
import "quasar/src/css/index.sass";
import "@quasar/extras/bootstrap-icons/bootstrap-icons.css";

import { createRouter, createWebHashHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import generatedRoutes from "virtual:generated-pages";

import "~/styles/index.scss";

import App from "~/App.vue";

// config quasar
const quasarConfig = {
  config: {},
  iconSet: iconSet,
  lang: langCn,
  plugins: {
    Dialog,
    Notify,
  },
};

// config vue-router
const router = createRouter({
  history: createWebHashHistory(),
  routes: setupLayouts(generatedRoutes),
});

// create app instance
createApp(App)
  .use(Quasar, quasarConfig)
  .use(router)
  .use(createPinia())
  .mount("#app");
