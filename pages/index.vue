<script setup lang="ts">
import type {Forum} from '~/types/interfaces';
import {useUserStore} from "~/stores/userStore";

const forums = ref<Forum[]>([]);
const loading = ref(true);
const newForumTitle = ref('');
const userStore = useUserStore();
const router = useRouter();

const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 4;

const fetchForums = async () => {
  try {
    const response: any = await $fetch('/api/forums', {
      method: 'GET',
      params: {
        order: 'desc',
        page: currentPage.value,
        limit: itemsPerPage,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.success) {
      loading.value = false;
      forums.value = response.forums;
      totalPages.value = response.totalPages;
      for (const forum of forums.value) {
        const createdBy = forum.created_by;
        const response: any = await $fetch(`/api/users/${createdBy}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.success) {
          forum.user = response.user;
        } else {
          console.error('Error fetching user:', response.error);
        }
      }
    }

  } catch (error) {
    console.error('Error fetching forums:', error);
  }
};

onMounted(fetchForums);

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchForums();
  }
};

const createForum = async (forum: Forum) => {
  if (!userStore.isAuthenticated) {
    userStore.showErrorToast('Vous devez être connecté pour créer un forum.');
    return;
  }

  if (!newForumTitle.value.trim()) {
    userStore.showErrorToast('Le titre du forum ne peut pas être vide.');
    return;
  }

  try {
    const response: any = await $fetch('/api/forums', {
      method: 'POST',
      body: {
        title: newForumTitle.value,
        created_by: userStore.id,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.success) {
      newForumTitle.value = '';
      userStore.showSuccessToast('Forum créé avec succès.');
      await fetchForums();
    } else {
      userStore.showErrorToast('Erreur lors de la création du forum.');
    }

  } catch (error) {
    console.error('Error creating forum:', error);
    userStore.showErrorToast('Erreur lors de la création du forum.');
  }
}
</script>

<template>
  <v-container class="container" fluid>
    <v-row class="create-forum-form" align="center">
      <v-col cols="12" md="1" class="d-flex justify-center">
        <v-avatar v-if="userStore.isAuthenticated" size="48">
          <img :src="`/assets/avatars/${userStore.avatar_image_name}`" alt="Avatar utilisateur"
               style="width: 48px; height: 48px;"/>
        </v-avatar>
        <v-avatar v-else size="48">
          <img src="/assets/avatars/default_avatar.png" alt="Avatar par défaut" style="width: 48px; height: 48px;"/>
        </v-avatar>
      </v-col>
      <v-col cols="12" md="9">
        <v-text-field
            v-model="newForumTitle"
            label="Partage ce que tu as dans la tête..."
            outlined
            dense
            hide-details
        />
      </v-col>
      <v-col cols="12" md="2">
        <v-btn @click="createForum" color="primary" block>
          Créer
        </v-btn>
      </v-col>
    </v-row>
    <LoaderComponent v-if="loading"/>
    <v-row v-else-if="forums.length === 0" justify="center" class="empty-message">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <v-icon color="primary" size="48">mdi-comment-question-outline</v-icon>
        <p class="empty-text">Aucun forum pour le moment. Soyez le premier à en créer un!</p>
      </v-col>
    </v-row>
    <CardComponent
        v-for="forum in forums"
        :key="forum.id"
        :title="forum.title"
        :subtitle="forum.user?.email?.split('@')[0]"
        :avatar="`/assets/avatars/${forum?.user?.avatar_image_name}` || '/assets/avatars/default_avatar.png'"
        :date="formatDate(forum.created_at, false)"
        :count="forum.topic_count"
        count-label=" sujet(s)"
        @click="() => router.push(`/forums/${forum.id}`)"
        :isForum="true"
    />
    <PaginationComponent
        v-if="forums.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        @pageChange="goToPage"
    />
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

.create-forum-form {
  background-color: var(--color-surface);
  border-radius: 10px;
  padding: 10px;
  width: 100%;
  margin: 20px 0;
}
</style>