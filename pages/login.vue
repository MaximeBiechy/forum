<script setup lang="ts">
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

const handleSubmit = () => {
}
</script>

<template>
  <FormComponent :fields="fields" :formData="formData" :title="title" @submit="handleSubmit"/>
</template>

<style scoped>

</style>
