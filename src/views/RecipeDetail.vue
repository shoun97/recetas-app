<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h2>Detalles de la Receta</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" sm="8" offset-sm="2">
        <v-card v-if="recipe" class="recipe-detail-card">
          <v-img :src="recipe.url" height="300px" width="100%" />
          <v-card-title>{{ recipe.nombre }}</v-card-title>
          <v-card-subtitle>
            Creada por: {{ recipe.participante }}
          </v-card-subtitle>
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
          </v-card-actions>
        </v-card>
        <v-btn @click="goBack" color="primary" class="mt-3">Volver</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
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
  name: "RecipeDetail",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const recipe = ref<Recipe | null>(null);
    const loading = ref(false);

    // Función para obtener los detalles de una receta específica
    const fetchRecipeDetails = async (id: string) => {
      loading.value = true;
      try {
        const response = await axios.get(`api/receta/${id}`);
        recipe.value = response.data;
        console.log(response.data);
      } catch (error) {
        console.error("Error al obtener los detalles de la receta:", error);
      }
      loading.value = false;
    };

    const vote = async (id: string, voto: number) => {
      loading.value = true;
      try {
        const response = await axios.post(`api/recetas/${id}/${voto}`);
        if (recipe.value) {
          recipe.value.votos = response.data.votos;
        }
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error al votar:", axiosError.message);
      }
      loading.value = false;
    };

    // Función para volver a la página anterior
    const goBack = () => {
      router.push("/");
    };

    onMounted(() => {
      const recipeId = route.params.id as string;
      fetchRecipeDetails(recipeId);
    });

    return { recipe, loading, vote, goBack };
  },
});
</script>

<style scoped>
.recipe-detail-card {
  margin-bottom: 20px;
}
</style>
