<script setup lang="ts">
import type {Forum} from '~/types/interfaces';
import {formatDate} from "~/utils/dateUtils";

const forums = ref<Forum[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    forums.value = await $fetch('/api/forums', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    for (const forum of forums.value) {
      const createdBy = forum.created_by;
      forum.user = await $fetch(`/api/users/${createdBy}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    loading.value = false;
  } catch (error) {
    console.error('Error fetching forums:', error);
  }
})
</script>

<template>
  <v-container class="container" fluid>
    <h1>Forums</h1>
    <LoaderComponent v-if="loading"/>
    <v-row v-else class="card-container">
      <v-col v-for="forum in forums" :key="forum.id" cols="12" md="6" lg="12">
        <v-card class="forum-card" elevation="2">
          <v-card-title class="card-title">{{ forum.title }}</v-card-title>
          <v-card-subtitle class="user-name"> {{ forum.user?.email.split('@')[0] }}</v-card-subtitle>
          <v-card-subtitle class="created-text">Crée il y a {{ formatDate(forum.created_at, true) }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-container {
  width: 100%;
  margin-top: 20px;
}

.forum-card {
  background-color: var(--color-surface);
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  color: var(--color-onPrimary);
}

.user-name {
  font-weight: bold;
  color: var(--color-onPrimary);
}

.created-text {
  color: var(--color-onSecondary);
}
</style>