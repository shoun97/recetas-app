<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h2>Recetas</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        v-for="recipe in recipes"
        :key="recipe._id"
        cols="12"
        sm="6"
        md="4"
      >
        <v-card class="recipe-card" height="100%">
          <div class="mantel-bar"></div>
          <v-img :src="recipe.url" height="200px" width="100%" />
          <v-card-title>{{ recipe.nombre }}</v-card-title>
          <v-card-subtitle
            >Creada por: {{ recipe.participante }}</v-card-subtitle
          >
          <v-card-text>
            <strong>Descripción:</strong> {{ recipe.descripcion }}<br />
            <strong>Ingredientes:</strong>
            {{
              recipe.ingredientes
                ? recipe.ingredientes.join(", ")
                : "No hay ingredientes disponibles"
            }}<br />
            <strong>Instrucciones:</strong> {{ recipe.instrucciones }}<br />
            <strong>Tiempo de Preparación:</strong>
            {{ recipe.tiempoPreparacion }} minutos<br />
            <strong>Dificultad:</strong> {{ recipe.dificultad }}<br />
            <strong>Votos:</strong> {{ recipe.votos }}
          </v-card-text>
          <v-card-actions>
            <v-btn
              @click="vote(recipe._id, 1)"
              :loading="loading"
              color="primary"
              icon
            >
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
            <v-btn
              @click="vote(recipe._id, 0)"
              :loading="loading"
              color="red"
              icon
            >
              <v-icon>mdi-thumb-down</v-icon>
            </v-btn>
            <v-btn @click="editRecipe(recipe._id)" color="orange" icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botón flotante en la parte inferior con ícono de más -->
    <v-btn
      color="primary"
      class="add-recipe-btn"
      @click="goToAddRecipe"
      fab
      fixed
      bottom
      right
      icon="mdi-plus"
      :loading="loading"
    >
    </v-btn>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios, { AxiosError } from "axios";

interface Recipe {
  _id: string;
  nombre: string;
  descripcion: string;
  ingredientes: string[];
  instrucciones: string;
  tiempoPreparacion: number;
  dificultad: string;
  participante: string;
  votos: number;
  url: string;
}

export default defineComponent({
  name: "HomePage",
  setup() {
    const router = useRouter();
    const recipes = ref<Recipe[]>([]);
    const loading = ref(false);

    // Función para obtener recetas de la API
    const fetchRecipes = async () => {
      loading.value = true;
      try {
        const response = await axios.get("api/recetas");
        console.log("Recetas obtenidas:", response.data); // Log para verificar la estructura
        recipes.value = response.data.recetas; // Asegúrate de que esta propiedad exista en tu respuesta
      } catch (error) {
        console.error("Error al obtener las recetas:", error);
      }
      loading.value = false;
    };

    // Llamar a la función fetchRecipes cuando el componente se monta
    onMounted(fetchRecipes);

    const goToAddRecipe = () => {
      router.push("/add-recipe");
    };

    const viewRecipe = (id: string) => {
      router.push(`/recipe/${id}`);
    };

    const editRecipe = (id: string) => {
      router.push(`/edit-recipe/${id}`);
    };

    const vote = async (id: string, voto: number) => {
      loading.value = true;
      try {
        const response = await axios.post(`api/recetas/${id}/${voto}`);
        const updatedRecipe = recipes.value.find((recipe) => recipe._id === id);
        if (updatedRecipe) {
          updatedRecipe.votos = response.data.votos;
        }
        console.log("Voto registrado:", response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error al votar:", axiosError.message);
      }
      loading.value = false;
    };

    return { recipes, goToAddRecipe, viewRecipe, vote, editRecipe, loading };
  },
});
</script>

<style scoped>
.add-recipe-btn {
  position: fixed;
  bottom: 16px;
  right: 16px;
}
.mantel-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  background-color: #e5e5f7;
  clip-path: polygon(0 0, 100% 0, 0 100%);
  background-image: url("../assets/patron-rojo.jpg");
  background-size: 100% !important;
  z-index: 1;
}

.recipe-card {
  position: relative;
  overflow: hidden;
}

.recipe-card .v-card-title,
.recipe-card .v-card-subtitle,
.recipe-card .v-card-text {
  position: relative;
  z-index: 2;
}

.mantel-bar_text {
  color: black !important;
  font-weight: bolder !important;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
</style>
