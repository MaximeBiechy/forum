<script setup lang="ts">
import {ref} from 'vue';
import {useUserStore} from '~/stores/userStore';

const oldPassword = ref('');
const newPassword = ref('');
const userStore = useUserStore();
const router = useRouter();

const changePassword = async () => {
  try {
    const response: any = await $fetch(`/api/users/${userStore.id}/change-password`, {
      method: 'POST',
      body: {
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      },
    });

    if (response.success) {
      await router.push('/');
      userStore.showSuccessToast(response.message);
    } else {
      userStore.showErrorToast('Erreur lors de la modification du mot de passe.');
    }
  } catch (error) {
    console.error(error);
    userStore.showErrorToast('Erreur lors de la modification du mot de passe.');
  }
};
</script>

<template>
  <v-container class="container">
    <v-text-field v-model="oldPassword" label="Ancien mot de passe" type="password" outlined dense/>
    <v-text-field v-model="newPassword" label="Nouveau mot de passe" type="password" outlined dense/>
    <v-btn @click="changePassword" color="primary">Modifier le mot de passe</v-btn>
  </v-container>
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}
</style>