import {useUserStore} from "~/stores/userStore";

export default defineNuxtRouteMiddleware((to, from) => {
    const userStore = useUserStore();

    if (!userStore.isAuthenticated || userStore.role !== 'admin') {
        return navigateTo('/');
    }
});