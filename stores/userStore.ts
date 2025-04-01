import {defineStore} from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        email: '',
        isAuthenticated: false,
        isErrorVisible: ref(false),
        isSuccessVisible: ref(false),
        toastErrorMessage: ref(''),
        toastSuccessMessage: ref(''),
    }),
    actions: {
        showErrorToast(message: string) {
            this.toastErrorMessage = message;
            this.isErrorVisible = true;
            setTimeout(() => {
                this.isErrorVisible = false;
            }, 3000);
        },
        showSuccessToast(message: string) {
            this.toastSuccessMessage = message;
            this.isSuccessVisible = true;
            setTimeout(() => {
                this.isSuccessVisible = false;
            }, 3000);
        },
        async register(user: any) {
            const response: any = await $fetch('/api/auth/register', {
                method: 'POST',
                body: {
                    email: user.email,
                    password: user.password,
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.success) {
                this.email = user.email;
                this.isAuthenticated = true;
                await this.login(user);
            } else {
                const message = response.err?.message || 'Erreur lors de la création du compte';
                this.showErrorToast(message);
            }
        },
        async login(user: any) {
            const response: any = await $fetch('/api/auth/login', {
                method: 'POST',
                body: {
                    email: user.email,
                    password: user.password,
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (response.success) {
                this.email = user.email;
                this.isAuthenticated = true;
            } else {
                const message = response.err?.message || 'Erreur lors de la connexion';
                this.showErrorToast(message);
            }
        },
        logout() {
            this.email = '';
            this.isAuthenticated = false;
        },
    },
    persist: true,
});
