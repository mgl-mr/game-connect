import { createApp } from 'vue';
import { database, auth, storage } from './firebase';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App);

app.config.globalProperties.$db = database;
app.config.globalProperties.$auth = auth;
app.config.globalProperties.$storage = storage;

app.use(store).use(router).mount('#app');
