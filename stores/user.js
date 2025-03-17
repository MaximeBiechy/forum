import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        name: '',
        email: '',
        isAuthenticated: false,
    }),
    actions: {
        login(user) {
            this.name = user.name;
            this.email = user.email;
            this.isAuthenticated = true;
        },
        logout() {
            this.name = '';
            this.email = '';
            this.isAuthenticated = false;
        },
    },
    persist: {
        enabled: true,
        strategies: [
            {
                key: 'user',
                storage: localStorage,
            },
        ],
    },
});
