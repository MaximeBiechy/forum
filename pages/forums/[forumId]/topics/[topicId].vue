<script setup lang="ts">
import {onMounted, ref} from 'vue';
import {useUserStore} from '~/stores/userStore';
import {useRoute, useRouter} from 'vue-router';
import type {Message} from '~/types/interfaces';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const messages = ref<Message[]>([]);
const loading = ref(true);
const newMessageContent = ref('');
const editingMessageId = ref<number | null>(null);
const editingMessageContent = ref('');
const currentPage = ref(1);
const totalPages = ref(1);
const itemsPerPage = 20;

const topicId = route.params.topicId;
const forumId = route.params.forumId;
const fetchMessages = async () => {
  try {
    const response: any = await $fetch(`/api/forums/${forumId}/topics/${topicId}`, {
      method: 'GET',
      params: {
        page: currentPage.value,
      },
    });

    if (response.success) {
      messages.value = response.messages;
      totalPages.value = response.totalPages;
      loading.value = false;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error);
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchMessages();
  }
};

const createMessage = async () => {
  if (!userStore.isAuthenticated) {
    userStore.showErrorToast('Vous devez être connecté pour répondre.');
    return;
  }

  if (!newMessageContent.value.trim()) {
    userStore.showErrorToast('Le message ne peut pas être vide.');
    return;
  }

  try {
    const response: any = await $fetch('/api/messages', {
      method: 'POST',
      body: {
        topic_id: topicId,
        content: newMessageContent.value,
        user_id: userStore.id,
      },
    });

    if (response.success) {
      newMessageContent.value = '';
      userStore.showSuccessToast('Message posté avec succès.');
      await fetchMessages();
    }
  } catch (error) {
    console.error('Erreur lors de la création du message :', error);
    userStore.showErrorToast('Erreur lors de la création du message.');
  }
};

const editMessage = async (messageId: number) => {
  if (!editingMessageContent.value.trim()) {
    userStore.showErrorToast('Le message ne peut pas être vide.');
    return;
  }

  try {
    const response: any = await $fetch(`/api/messages/${messageId}`, {
      method: 'PUT',
      body: {
        content: editingMessageContent.value,
      },
    });

    if (response.success) {
      editingMessageId.value = null;
      editingMessageContent.value = '';
      userStore.showSuccessToast('Message modifié avec succès.');
      await fetchMessages();
    }
  } catch (error) {
    console.error('Erreur lors de la modification du message :', error);
    userStore.showErrorToast('Erreur lors de la modification du message.');
  }
};

const deleteMessage = async (messageId: number) => {
  try {
    const response: any = await $fetch(`/api/messages/${messageId}`, {
      method: 'DELETE',
    });

    if (response.success) {
      userStore.showSuccessToast('Message supprimé avec succès.');
      await fetchMessages();
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du message :', error);
    userStore.showErrorToast('Erreur lors de la suppression du message.');
  }
};

onMounted(fetchMessages);
</script>

<template>
  <v-container class="container" fluid>
    <v-row>
      <v-btn @click="router.push(`/forums/${forumId}`)" color="secondary" class="mb-4">
        Retour au forum
      </v-btn>
    </v-row>
    <v-col cols="8" class="message-list">
      <LoaderComponent v-if="loading"/>
      <v-row v-else>
        <CardComponent
            v-for="message in messages"
            :key="message.id"
            :title="message.content"
            :subtitle="message.author_email.split('@')[0]"
            :date="formatDate(message.created_at, false)"
            :avatar="`/assets/avatars/${message.author_avatar}`"
        >
          <template #default>
            <p class="content">{{ message.content }}</p>
          </template>
          <template #actions>
            <v-row
                v-if="userStore.isAuthenticated && (userStore.id === message.user_id || userStore.role === 'admin')"
            >
              <v-btn
                  @click="() => { editingMessageId = message.id; editingMessageContent = message.content; }"
                  color="primary"
              >
                Modifier
              </v-btn>
              <v-btn
                  v-if="userStore.role === 'admin'"
                  @click="deleteMessage(message.id)"
                  color="error"
              >
                Supprimer
              </v-btn>
            </v-row>
          </template>
        </CardComponent>
      </v-row>
      <PaginationComponent
          v-if="messages.length > 0"
          :current-page="currentPage"
          :total-pages="totalPages"
          @pageChange="goToPage"
      />
    </v-col>
    <v-col cols="3" class="reply-form">
      <v-row v-if="userStore.isAuthenticated">
        <v-textarea v-model="newMessageContent" label="Votre réponse" outlined dense/>
        <v-btn @click="createMessage" color="primary" block>Répondre</v-btn>
      </v-row>
    </v-col>
  </v-container>
</template>

<style scoped>
.message-list {
  margin-top: 20px;
}

.reply-form {
  background-color: var(--color-surface);
  border-radius: 10px;
  padding: 20px;
}

.reply-form v-textarea {
  margin-bottom: 10px;
}
</style>