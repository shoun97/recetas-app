import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import AddRecipe from "../views/AddRecipe.vue";
import EditRecipe from "../views/EditRecipe.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/add-recipe", component: AddRecipe },
  { path: "/edit-recipe/:id", component: EditRecipe },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
