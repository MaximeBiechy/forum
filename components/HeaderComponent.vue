<script setup lang="ts">
import {ref} from 'vue';

const isAuthenticated = ref(false);
const userMenu = ref(false);

const handleLogout = () => {
  // TODO: Implement logout
}
</script>

<template>
  <v-app-bar app>
    <v-toolbar-title class="mr-auto">
      <NuxtLink to="/">Forum</NuxtLink>
    </v-toolbar-title>
    <v-btn text>Menu 1</v-btn>
    <v-btn text>Menu 2</v-btn>
    <v-spacer></v-spacer>
    <v-menu v-model="userMenu" offset-y>
      <template v-slot:activator="{ isActive, props, on }">
        <v-btn icon v-bind="props" v-on="on">
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-if="!isAuthenticated">
          <v-list-item-title>
            <NuxtLink to="/login">Se connecter</NuxtLink>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!isAuthenticated">
          <v-list-item-title>
            <NuxtLink to="/register">S'inscrire</NuxtLink>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isAuthenticated" @click="handleLogout">
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
}

a {
  text-decoration: none;
  color: inherit;
}
</style>
