import Vue from "vue";
import Vuetify from "vuetify";
import HelloDecoratorComponent from "./components/HelloDecorator.vue";
import VueRouter from "vue-router";
import Notifications from "vue-notification";
import appRoutes from "./routes";
import StoreOptions from "./states";
import Vuex from 'vuex';


Vue.prototype.$menu = true;

Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(Notifications);
Vue.use(Vuex);

const v = new Vue({
  el: "#app",
  store: new Vuex.Store(StoreOptions),
  router: appRoutes,
  template: `
    <div>

        Name: <input v-model="name" type="text">
        <h1>Hello Decorator Component</h1>
        <hello-decorator-component :name="name" :initialEnthusiasm="5" />
        </div>
        `,
  data: { name: "World" },
  components: {
    HelloDecoratorComponent
  }
});
