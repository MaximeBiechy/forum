<script setup lang="ts">
import {useUserStore} from "~/stores/userStore";

const fields = ref([
  {label: 'Email', type: 'email', model: 'email'},
  {label: 'Mot de passe', type: 'password', model: 'password'},
]);

const formData = ref({
  name: '',
  email: '',
  password: ''
});

const title = ref('Se connecter');

const userStore = useUserStore();
const router = useRouter();

const handleSubmit = async () => {
  await userStore.login(formData.value).then(() => {
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
