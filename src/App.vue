<template>
  <v-app>
    <v-app-bar app :elevation="2" color="primary" class="background">
      <v-btn icon @click="goBack" v-if="!isHomePage">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Virtual Master Chef Ilis</v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();

    const isHomePage = computed(() => route.path === "/");

    const goBack = () => {
      router.back();
    };

    return { isHomePage, goBack };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

/* Estilo para el v-app-bar con diseño de mantel rojo y blanco */
</style>
