<script setup lang="ts">
import {ref} from 'vue';
import {useUserStore} from "~/stores/userStore";

const userStore = useUserStore();
const userMenu = ref(false);
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/');
}
</script>

<template>
  <v-app-bar app>
    <v-toolbar-title class="mr-auto">
      <NuxtLink to="/">Forum</NuxtLink>
    </v-toolbar-title>
    <v-btn>Menu 1</v-btn>
    <v-btn>Menu 2</v-btn>
    <v-spacer></v-spacer>
    <v-menu v-model="userMenu" offset-y>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar v-if="userStore.isAuthenticated" size="32">
            <img :src="`/assets/avatars/${userStore.avatar_image_name}`" alt="Avatar utilisateur" style="width: 32px; height: 32px;">
          </v-avatar>
          <img v-else :src="`/assets/avatars/default_avatar.png`" alt="Avatar utilisateur" style="width: 32px; height: 32px;">
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-if="!userStore.isAuthenticated">
          <v-list-item-title>
            <NuxtLink to="/auth/login">Se connecter</NuxtLink>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!userStore.isAuthenticated">
          <v-list-item-title>
            <NuxtLink to="/auth/register">S'inscrire</NuxtLink>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="userStore.isAuthenticated" @click="handleLogout">
          <v-list-item-title>
            Se déconnecter
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style scoped>
.v-toolbar-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-primary);
}

a {
  text-decoration: none;
  color: inherit;
}
</style>