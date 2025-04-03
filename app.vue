<script setup lang="ts">
import {useUserStore} from "~/stores/userStore";

const userStore = useUserStore();
</script>

<template>
  <v-app>
    <HeaderComponent/>
    <v-main>
      <NuxtPage/>
    </v-main>
    <ToastComponent :message="userStore.toastSuccessMessage" type="error" :isVisible="userStore.isSuccessVisible"/>
    <ToastComponent :message="userStore.toastErrorMessage" type="error" :isVisible="userStore.isErrorVisible"/>
  </v-app>
</template>
