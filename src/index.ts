import Vue from 'vue';
import Vuetify from 'vuetify';
import HelloDecoratorComponent from './components/HelloDecorator.vue';
import ElizerNavBar from './shared/navbar.vue';

Vue.use(Vuetify);

const v = new Vue({
    el: '#app',
    template: `
    <div>

        Name: <input v-model="name" type="text">
        <h1>Hello Decorator Component</h1>
        <hello-decorator-component :name="name" :initialEnthusiasm="5" />
        </div>
    `,
    data: { name: 'World' },
    components: {
        ElizerNavBar,
        HelloDecoratorComponent,
    },
});
