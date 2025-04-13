<script setup lang="ts">
import {useUserStore} from "~/stores/userStore";
import type {Topic} from '~/types/interfaces';
import {ref} from 'vue';

const userStore = useUserStore();
const router = useRouter();
const topics = ref<Topic[]>([]);
const loading = ref(true);
const newTopicTitle = ref('');
const newTopicMessage = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 20;
const showForm = ref(false);

const route = useRoute();
const forumId = route.params.forumId;

const fetchTopics = async () => {
  try {
    const response: any = await $fetch(`/api/forums/${forumId}`, {
      method: 'GET',
      params: {
        page: currentPage.value,
        limit: itemsPerPage,
      },
    });


    if (response.success) {
      loading.value = false;
      topics.value = response.topics;
      totalPages.value = response.totalPages;
    }
  } catch (error: any) {
    if (error.statusCode === 404) {
      userStore.showErrorToast('Forum introuvable.');
      await router.push('/');
    } else {
      console.error('Erreur lors de la récupération des sujets :', error);
    }
  }
};
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchTopics();
  }
};

const toggleForm = () => {
  showForm.value = !showForm.value;
};
const createTopic = async () => {
  if (!userStore.isAuthenticated) {
    userStore.showErrorToast('Vous devez être connecté pour créer un sujet.');
    return;
  }

  if (!newTopicTitle.value.trim() || !newTopicMessage.value.trim()) {
    userStore.showErrorToast('Le titre et le message ne peuvent pas être vides.');
    return;
  }

  try {
    const response: any = await $fetch(`/api/forums/${forumId}`, {
      method: 'POST',
      body: {
        title: newTopicTitle.value,
        message: newTopicMessage.value,
        user_id: userStore.id,
      },
    });

    if (response.success) {
      toggleForm();
      newTopicTitle.value = '';
      newTopicMessage.value = '';
      userStore.showSuccessToast('Sujet créé avec succès.');
      await fetchTopics();
    }
  } catch (error) {
    console.error('Erreur lors de la création du sujet :', error);
    userStore.showErrorToast('Erreur lors de la création du sujet.');
  }
};

const deleteTopic = async (topicId: number) => {
  try {
    const response: any = await $fetch(`/api/forums/${forumId}/topics/${topicId}`, {
      method: 'DELETE',
    });

    if (response.success) {
      userStore.showSuccessToast('Sujet supprimé avec succès.');
      await fetchTopics();
    } else {
      userStore.showErrorToast('Erreur lors de la suppression du sujet.');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du sujet :', error);
    userStore.showErrorToast('Erreur lors de la suppression du sujet.');
  }
};

const editTopic = async (topicId: number, newTitle: string) => {
  if (!newTitle.trim()) {
    userStore.showErrorToast('Le titre ne peut pas être vide.');
    return;
  }

  try {
    const response: any = await $fetch(`/api/forums/${forumId}/topics/${topicId}`, {
      method: 'PUT',
      body: {title: newTitle},
    });

    if (response.success) {
      userStore.showSuccessToast('Sujet modifié avec succès.');
      await fetchTopics();
    } else {
      userStore.showErrorToast('Erreur lors de la modification du sujet.');
    }
  } catch (error) {
    console.error('Erreur lors de la modification du sujet :', error);
    userStore.showErrorToast('Erreur lors de la modification du sujet.');
  }
};

onMounted(fetchTopics);
</script>

<template>
  <v-container class="container" fluid>
    <v-row justify="center" class="ga-2">
      <v-btn @click="router.push('/')" color="secondary" class="mb-4">
        Retour aux forums
      </v-btn>
      <v-btn v-if="!showForm && userStore.isAuthenticated" @click="toggleForm" color="primary">
        Créer un sujet
      </v-btn>
    </v-row>
    <v-row v-if="showForm" class="create-topic-form-wrapper" justify="center">
      <v-col cols="12" class="create-topic-form">
        <v-text-field
            v-model="newTopicTitle"
            label="Titre du sujet"
            outlined
            dense
            hide-details
        />
        <v-textarea
            v-model="newTopicMessage"
            label="Premier message"
            outlined
            dense
            hide-details
        />
        <v-row class="form-actions mt-1" align="center" justify="center">
          <v-btn @click="toggleForm" color="secondary">
            Annuler
          </v-btn>
          <v-btn @click="createTopic" color="primary">
            Créer un sujet
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <LoaderComponent v-if="loading"/>
    <v-row v-else-if="topics.length === 0" justify="center" class="empty-message">
      <v-col cols="12" md="8" lg="6" class="text-center">
        <v-icon color="primary" size="48">mdi-comment-question-outline</v-icon>
        <p class="empty-text">Aucun sujet pour le moment. Soyez le premier à en créer un!</p>
      </v-col>
    </v-row>
    <CardComponent
        v-for="topic in topics"
        :key="topic.id"
        :title="topic.title"
        :subtitle="`Dernier message par ${topic?.last_message_author?.split('@')[0]}`"
        :avatar="`/assets/avatars/${topic?.author_avatar}`"
        :date="formatDate(topic?.last_message_date, false)"
        :count="topic.message_count"
        count-label="message(s)"
        @click="() => router.push({ path: `/forums/${forumId}/topics/${topic.id}` })"
        @delete="deleteTopic(topic.id)"
        @save="(newTitle) => editTopic(topic.id, newTitle)"
    />
    <PaginationComponent
        v-if="topics.length > 0"
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
  width: 100%;
}

.topic-card {
  background-color: var(--color-surface);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.form-actions {
  display: flex;
  gap: 10px;
}

.create-topic-form-wrapper {
  margin: 20px auto 0;
  width: 100%;
}

.create-topic-form {
  background-color: var(--color-surface);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.create-topic-form > * {
  margin-bottom: 16px;
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