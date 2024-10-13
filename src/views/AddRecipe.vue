<template>
  <v-container>
    <h2>Añadir Receta</h2>
    <v-form ref="form" v-model="isFormValid" @submit.prevent="submitRecipe">
      <v-text-field
        v-model="nombre"
        label="Nombre del Plato"
        :rules="[
          (v) => !!v || 'El nombre es obligatorio',
          (v) => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres',
          (v) =>
            v.length <= 100 || 'El nombre no puede tener más de 100 caracteres',
        ]"
        required
      />
      <v-textarea
        v-model="descripcion"
        label="Descripción"
        :rules="[
          (v) => !!v || 'La descripción es obligatoria',
          (v) =>
            v.length >= 10 ||
            'La descripción debe tener al menos 10 caracteres',
        ]"
        required
      />
      <v-text-field
        v-model="imagenUrl"
        label="URL de la Imagen"
        :rules="[validarUrl]"
        required
      />
      <v-textarea
        v-model="ingredientes"
        label="Ingredientes (separados por comas)"
        :rules="[
          (v) => !!v || 'Los ingredientes son obligatorios',
          (v) =>
            v.split(',').length > 0 || 'Debe haber al menos un ingrediente',
        ]"
        required
      />
      <v-textarea
        v-model="instrucciones"
        label="Instrucciones"
        :rules="[
          (v) => !!v || 'Las instrucciones son obligatorias',
          (v) =>
            v.length >= 20 ||
            'Las instrucciones deben tener al menos 20 caracteres',
        ]"
        required
      />
      <v-text-field
        v-model="tiempoPreparacion"
        label="Tiempo de Preparación (minutos)"
        type="number"
        :rules="[
          (v) => !!v || 'El tiempo de preparación es obligatorio',
          (v) =>
            v >= 1 || 'El tiempo de preparación debe ser al menos 1 minuto',
        ]"
        required
      />
      <v-select
        v-model="dificultad"
        label="Dificultad"
        :items="['Baja', 'Media', 'Alta']"
        :rules="[(v) => !!v || 'La dificultad es obligatoria']"
        required
      />
      <v-text-field
        v-model="participante"
        label="Nombre del Chef"
        :rules="[(v) => !!v || 'El nombre del chef es obligatorio']"
        required
      />

      <v-row>
        <v-col>
          <v-btn color="primary" :loading="loading" @click="goBack"
            >Atrás</v-btn
          >
        </v-col>
        <v-col>
          <v-btn
            :disabled="!isFormValid"
            :loading="loading"
            type="submit"
            color="success"
            >Guardar Receta</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import axios, { AxiosError } from "axios";

export default defineComponent({
  name: "AddRecipe",
  setup() {
    const nombre = ref("");
    const descripcion = ref("");
    const imagenUrl = ref("https://placehold.co/600x400");
    const ingredientes = ref("");
    const instrucciones = ref("");
    const tiempoPreparacion = ref(0);
    const dificultad = ref("");
    const participante = ref("");
    const isFormValid = ref(false);
    const loading = ref(false);

    // Validación de URL
    const validarUrl = (value: string) => {
      const urlPattern = new RegExp(
        "^(https?:\\/\\/)?([\\da-z.-]+)\\.([a-z.]{2,6})([\\/\\w .-]*)*\\/?$"
      );
      return urlPattern.test(value) || "La URL debe ser válida";
    };

    const submitRecipe = async () => {
      loading.value = true;
      const ingredientesArray = ingredientes.value
        .split(",")
        .map((ing) => ing.trim());

      const newRecipe = {
        nombre: nombre.value,
        descripcion: descripcion.value,
        imagenUrl: imagenUrl.value,
        ingredientes: ingredientesArray,
        instrucciones: instrucciones.value,
        tiempoPreparacion: tiempoPreparacion.value,
        dificultad: dificultad.value?.toLocaleLowerCase(),
        participante: participante.value,
      };

      try {
        const response = await axios.post("api/recetas", newRecipe);
        console.log("Receta guardada:", response.data);
        goBack();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error(
          "Error al guardar la receta:",
          axiosError.response ? axiosError.response.data : axiosError.message
        );
      }

      loading.value = false;
    };

    const goBack = () => {
      window.history.back();
    };

    return {
      nombre,
      descripcion,
      imagenUrl,
      ingredientes,
      instrucciones,
      tiempoPreparacion,
      dificultad,
      participante,
      isFormValid,
      submitRecipe,
      goBack,
      validarUrl,
      loading,
    };
  },
});
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
