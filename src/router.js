import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

function importComponent(component) {
    return () => import(`./components/${component}`);
}

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/dictionary",
      alias: "/",
      name: "dictionary",
      component: importComponent("Dictionary")
    },
  ]
});