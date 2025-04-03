import vuetify, {transformAssetUrls} from 'vite-plugin-vuetify';
import {initializeDatabase} from './server/utils/mysql';

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: {enabled: true},
    build: {
        transpile: ['vuetify'],
    },
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({autoImport: true}));
            });
        },
        '@pinia/nuxt',
        'pinia-plugin-persistedstate/nuxt',
    ],
    nitro: {
        experimental: {
            websocket: true
        }
    },
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
    hooks: {
        async 'nitro:build:before'() {
            await initializeDatabase();
        },
    },
    css: [
        '~/assets/style/style.css'
    ],
});
