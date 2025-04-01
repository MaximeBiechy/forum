<script setup lang="ts">
import {useUserStore} from "~/stores/userStore";

const fields = ref([
  {label: 'Email', type: 'email', model: 'email'},
  {label: 'Mot de passe', type: 'password', model: 'password'},
]);

const formData = ref({
  email: '',
  password: ''
});

const title = ref('S\'inscrire');

const userStore = useUserStore();
const router = useRouter();

const handleSubmit = async () => {
  await userStore.register(formData.value)
      .then(() => {
        if (userStore.isAuthenticated) {
          router.push('/');
        }
      })
}
</script>

<template>
  <FormComponent :fields="fields" :formData="formData" :title="title" @submit="handleSubmit"/>
</template>

<style scoped>

</style>
