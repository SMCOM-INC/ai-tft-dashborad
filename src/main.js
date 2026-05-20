import { VueQueryPlugin } from '@tanstack/vue-query';
import VueDatePicker from '@vuepic/vue-datepicker';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import '@vuepic/vue-datepicker/dist/main.css';
import { createApp } from 'vue';

import App from '@/App.vue';
import { queryClient } from '@/lib/queries/queryClient.js';
import router from '@/router/index.js';

// dynamic import failed 대응
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin, { queryClient });
app.component('VueDatePicker', VueDatePicker);
app.mount('#app');
