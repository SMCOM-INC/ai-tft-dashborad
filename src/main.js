import { createSentryPiniaPlugin } from '@sentry/vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import VueDatePicker from '@vuepic/vue-datepicker';
import { QuillEditor } from '@vueup/vue-quill';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist';
import '@vuepic/vue-datepicker/dist/main.css';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'vue-simple-calendar/dist/style.css';
import { createApp } from 'vue';
import VueDOMPurifyHTML from 'vue-dompurify-html';
import vSelect from 'vue-select';

import 'vue-select/dist/vue-select.css';

import App from '@/App.vue';
import { queryClient } from '@/lib/queries/queryClient.js';
import { initSentry } from '@/lib/sentry/sentry.js';
import router from '@/router/index.js';

// dynamic import failed 대응
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

const app = createApp(App);

initSentry({ app, router });

const pinia = createPinia();
pinia.use(piniaPersist);
pinia.use(createSentryPiniaPlugin());

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin, { queryClient });
app.use(VueDOMPurifyHTML);
app.component('VueDatePicker', VueDatePicker);
app.component('VSelect', vSelect);
app.component('QuillEditor', QuillEditor);
app.mount('#app');
