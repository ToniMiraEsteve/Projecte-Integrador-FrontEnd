import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { useAuthStore } from '@/stores/auth';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true
});

const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#app');
