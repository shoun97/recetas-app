import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "@mdi/font/css/materialdesignicons.css";
import axios from "axios";

// Configura axios con la URL base
axios.defaults.baseURL = process.env.VUE_APP_API_URL;

// Monta la aplicación Vue
createApp(App).use(vuetify).use(router).mount("#app");
