<script setup lang="ts">
import {definePageMeta} from "#imports";
import {onMounted, ref} from 'vue';
import {useUserStore} from '~/stores/userStore';

definePageMeta({
  middleware: 'auth-admin',
});

const forums = ref([]);
const newForumTitle = ref('');
const userStore = useUserStore();
const loading = ref(true);
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 4;
const router = useRouter();

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
    }
  } catch (error) {
    console.error('Error fetching forums:', error);
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchForums();
  }
};

const createForum = async () => {
  if (!newForumTitle.value.trim()) {
    userStore.showErrorToast('Le titre du forum ne peut pas être vide.');
    return;
  }

  const response: any = await $fetch('/api/forums', {
    method: 'POST',
    body: {title: newForumTitle.value, created_by: userStore.id},
  });
  if (response.success) {
    newForumTitle.value = '';
    userStore.showSuccessToast('Forum créé avec succès.');
    await fetchForums();
  }
};

const deleteForum = async (forumId: number) => {
  const response: any = await $fetch(`/api/forums/${forumId}`, {method: 'DELETE'});
  if (response.success) {
    userStore.showSuccessToast('Forum supprimé avec succès.');
    await fetchForums();
  }
};

const renameForum = async (forumId: number, newTitle: string) => {
  if (!newTitle.trim()) {
    userStore.showErrorToast('Le titre ne peut pas être vide.');
    return;
  }

  try {
    const response: any = await $fetch(`/api/forums/${forumId}`, {
      method: 'PUT',
      body: {title: newTitle},
    });

    if (response.success) {
      userStore.showSuccessToast('Forum renommé avec succès.');
      await fetchForums();
    } else {
      userStore.showErrorToast('Erreur lors du renommage du forum.');
    }
  } catch (error) {
    console.error('Erreur lors du renommage du forum :', error);
    userStore.showErrorToast('Erreur lors du renommage du forum.');
  }
};

onMounted(fetchForums);
</script>

<template>
  <v-container class="container" fluid>
    <v-row class="create-forum-form" align="center">
      <v-col cols="12" md="9">
        <v-text-field
            v-model="newForumTitle"
            label="Créer un nouveau forum"
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
        <p class="empty-text">Aucun forum pour le moment.</p>
      </v-col>
    </v-row>
    <CardComponent
        v-for="forum in forums"
        :key="forum.id"
        :title="forum.title"
        :date="formatDate(forum.created_at, false)"
        :count="forum.topic_count"
        count-label=" sujet(s)"
        @click="() => router.push(`/forums/${forum.id}`)"
        @save="(newTitle) => renameForum(forum.id, newTitle)"
        @delete="deleteForum(forum.id)"
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

.empty-message {
  margin-top: 40px;
}

.empty-text {
  font-size: 18px;
  font-weight: bold;
  color: var(--color-onBackground);
  margin-top: 10px;
}
</style>