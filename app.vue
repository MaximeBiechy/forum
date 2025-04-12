<script setup lang="ts">
import {useUserStore} from "~/stores/userStore";

const userStore = useUserStore();
</script>

<template>
  <v-app>
    <HeaderComponent/>
    <v-main class="margin-bottom">
      <NuxtPage/>
    </v-main>
    <ToastComponent :message="userStore.toastSuccessMessage" type="success" :isVisible="userStore.isSuccessVisible"/>
    <ToastComponent :message="userStore.toastErrorMessage" type="error" :isVisible="userStore.isErrorVisible"/>
  </v-app>
</template>

<style>
.margin-bottom {
  margin-bottom: 5vh;
}
</style>
