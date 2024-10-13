<template>
  <v-container>
    <h2>Editar Receta</h2>
    <v-form ref="form" v-model="isFormValid" @submit.prevent="submitRecipe">
      <v-text-field
        v-model="nombre"
        :rules="nombreRules"
        label="Nombre del Plato"
        required
      />

      <v-textarea
        v-model="descripcion"
        :rules="descripcionRules"
        label="Descripción"
        required
      />

      <v-text-field
        v-model="imagenUrl"
        :rules="urlRules"
        label="URL de la Imagen"
        required
      />

      <v-textarea
        v-model="ingredientes"
        :rules="ingredientesRules"
        label="Ingredientes (separados por comas)"
        required
      />

      <v-textarea
        v-model="instrucciones"
        :rules="instruccionesRules"
        label="Instrucciones"
        required
      />

      <v-text-field
        v-model="tiempoPreparacion"
        :rules="tiempoPreparacionRules"
        label="Tiempo de Preparación (minutos)"
        type="number"
        required
      />

      <v-select
        v-model="dificultad"
        :rules="dificultadRules"
        label="Dificultad"
        :items="['Baja', 'Media', 'Alta']"
        required
      />

      <v-text-field
        v-model="participante"
        :rules="participanteRules"
        label="Nombre del Chef"
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
            type="submit"
            color="success"
            :loading="loading"
            :disabled="!isFormValid"
          >
            Guardar Receta
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import axios, { AxiosError } from "axios";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "EditRecipe",
  setup() {
    const route = useRoute();
    const id = route.params.id as string;

    const isFormValid = ref(false);
    const nombre = ref("");
    const descripcion = ref("");
    const imagenUrl = ref("");
    const ingredientes = ref("");
    const instrucciones = ref("");
    const loading = ref(false);
    const tiempoPreparacion = ref(0);
    const dificultad = ref("");
    const participante = ref("");

    // Reglas de validación
    const nombreRules = [
      (v: string) => !!v || "El nombre es obligatorio",
      (v: string) =>
        (v && v.length >= 3) || "El nombre debe tener al menos 3 caracteres",
      (v: string) =>
        (v && v.length <= 100) ||
        "El nombre no puede tener más de 100 caracteres",
    ];
    const descripcionRules = [
      (v: string) => !!v || "La descripción es obligatoria",
      (v: string) =>
        (v && v.length >= 10) ||
        "La descripción debe tener al menos 10 caracteres",
    ];
    const urlRules = [
      (v: string) => !!v || "La URL es obligatoria",
      (v: string) => /^https?:\/\/.*$/.test(v) || "La URL debe ser válida",
    ];
    const ingredientesRules = [
      (v: string) => !!v || "Los ingredientes son obligatorios",
      (v: string) =>
        v.split(",").filter((i) => i.trim()).length > 0 ||
        "Debe haber al menos un ingrediente",
    ];
    const instruccionesRules = [
      (v: string) => !!v || "Las instrucciones son obligatorias",
      (v: string) =>
        (v && v.length >= 20) ||
        "Las instrucciones deben tener al menos 20 caracteres",
    ];
    const tiempoPreparacionRules = [
      (v: number) => !!v || "El tiempo de preparación es obligatorio",
      (v: number) =>
        v >= 1 || "El tiempo de preparación debe ser al menos 1 minuto",
    ];
    const dificultadRules = [
      (v: string) => !!v || "La dificultad es obligatoria",
    ];
    const participanteRules = [
      (v: string) => !!v || "El nombre del chef es obligatorio",
    ];

    // Cargar receta
    const fetchRecipe = async () => {
      loading.value = true;
      try {
        const response = await axios.get(`api/receta/${id}`);
        const recipe = response.data;
        nombre.value = recipe.nombre;
        descripcion.value = recipe.descripcion;
        imagenUrl.value = recipe.url;
        ingredientes.value = recipe.ingredientes.join(", ");
        instrucciones.value = recipe.instrucciones;
        tiempoPreparacion.value = recipe.tiempoPreparacion;
        dificultad.value = recipe.dificultad;
        participante.value = recipe.participante;
      } catch (error) {
        console.error("Error al cargar la receta:", error);
      }
      loading.value = false;
    };

    const submitRecipe = async () => {
      loading.value = true;
      const ingredientesArray = ingredientes.value
        .split(",")
        .map((ing) => ing.trim());

      const updatedRecipe = {
        nombre: nombre.value,
        descripcion: descripcion.value,
        url: imagenUrl.value,
        ingredientes: ingredientesArray,
        instrucciones: instrucciones.value,
        tiempoPreparacion: tiempoPreparacion.value,
        dificultad: dificultad.value.toLowerCase(),
        participante: participante.value,
      };

      try {
        await axios.put(`api/receta/${id}`, updatedRecipe);
        console.log("Receta actualizada");
        goBack();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("Error al actualizar la receta:", axiosError.message);
      }

      loading.value = false;
    };

    const goBack = () => {
      window.history.back();
    };

    // Cargar la receta al montar el componente
    onMounted(fetchRecipe);

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
      nombreRules,
      descripcionRules,
      urlRules,
      ingredientesRules,
      instruccionesRules,
      tiempoPreparacionRules,
      dificultadRules,
      participanteRules,
      loading,
    };
  },
});
</script>

<style scoped>
/* Estilos personalizados si es necesario */
</style>
