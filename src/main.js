import { createSSRApp } from "vue";
import * as Pinia from 'pinia';
import uviewPlus from 'uview-plus'

import { goBack } from './utils/utils.js'


import App from "./App.vue";
export function createApp() {
	const app = createSSRApp(App);

	app.config.globalProperties.$goBack = goBack
	app.use(Pinia.createPinia());
	app.use(uviewPlus);
	return {
		app,
		Pinia
	};
}
new VConsole()