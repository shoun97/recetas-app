import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import AddRecipe from "../views/AddRecipe.vue";
import EditRecipe from "../views/EditRecipe.vue";
import RecipeDetail from "@/views/RecipeDetail.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/add-recipe", component: AddRecipe },
  { path: "/edit-recipe/:id", component: EditRecipe },
  { path: "/receta/:id", component: RecipeDetail },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
