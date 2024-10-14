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
          <v-card-subtitle>
            Creada por: {{ recipe.participante }}
          </v-card-subtitle>
          <v-card-text>
            <strong>Descripción:</strong> {{ recipe.descripcion }}
          </v-card-text>
          <v-card-actions>
            <v-btn @click="goToRecipeDetails(recipe._id)" color="primary">
              Ver más detalles
            </v-btn>
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
            <v-btn @click="deleteRecipe(recipe._id)" color="red" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Botón flotante para añadir una nueva receta -->
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
    ></v-btn>
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
        recipes.value = response.data.recetas;
      } catch (error) {
        console.error("Error al obtener las recetas:", error);
      }
      loading.value = false;
    };

    // Función para redirigir a la vista de detalles
    const goToRecipeDetails = (id: string) => {
      router.push(`/receta/${id}`);
    };

    // Función para eliminar una receta por ID
    const deleteRecipe = async (id: string) => {
      const confirmDelete = confirm(
        "¿Estás seguro de que deseas eliminar esta receta?"
      );
      if (confirmDelete) {
        loading.value = true;
        try {
          await axios.delete(`api/receta/${id}`);
          recipes.value = recipes.value.filter((recipe) => recipe._id !== id);
          console.log("Receta eliminada");
        } catch (error) {
          console.error("Error al eliminar la receta:", error);
        }
        loading.value = false;
      }
    };

    // Llamar a la función fetchRecipes cuando el componente se monta
    onMounted(fetchRecipes);

    const goToAddRecipe = () => {
      router.push("/add-recipe");
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
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error al votar:", axiosError.message);
      }
      loading.value = false;
    };

    return {
      recipes,
      goToAddRecipe,
      goToRecipeDetails,
      editRecipe,
      deleteRecipe,
      vote,
      loading,
    };
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
</style>
