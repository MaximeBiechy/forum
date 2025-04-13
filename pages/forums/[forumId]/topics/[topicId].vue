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

const connectWS = () => {
  const isSecure = location.protocol === "https:";
  const wsUrl = (isSecure ? "wss://" : "ws://") + location.host + "/_ws";
  const ws = new WebSocket(wsUrl);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'fetch-messages') {
      fetchMessages();
    }
  };

  return ws;
};
const fetchMessages = async () => {
  try {
    const response: any = await $fetch(`/api/forums/${forumId}/topics/${topicId}`, {
      method: 'GET',
      params: {
        page: currentPage.value,
        limit: itemsPerPage,
      },
    });

    if (response.success) {
      messages.value = response.messages || [];
      totalPages.value = response.totalPages || 1;
      loading.value = false;
    } else {
      await router.push('/')
    }
  } catch (error: any) {
    if (error.statusCode === 404) {
      userStore.showErrorToast('Topic introuvable.');
      await router.push('/');
    } else {
      console.error('Erreur lors de la récupération des messages :', error);
    }
  }
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchMessages();
  }
};

const postMessage = async () => {
  if (!userStore.isAuthenticated) {
    userStore.showErrorToast('Vous devez être connecté pour répondre.');
    return;
  }

  if (!newMessageContent.value.trim()) {
    userStore.showErrorToast('Le message ne peut pas être vide.');
    return;
  }

  try {
    const response: any = await $fetch(`/api/forums/${forumId}/topics/${topicId}`, {
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
    }
  } catch (error) {
    console.error('Erreur lors de la création du message :', error);
    userStore.showErrorToast('Erreur lors de la création du message.');
  }
};

const deleteMessage = async (messageId: number) => {
  try {
    const response: any = await $fetch(`/api/messages/${messageId}`, {
      method: 'DELETE',
    });

    if (response.success) {
      userStore.showSuccessToast('Message supprimé avec succès.');
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du message :', error);
    userStore.showErrorToast('Erreur lors de la suppression du message.');
  }
};

const startEditingMessage = (messageId: number, content: string) => {
  editingMessageId.value = messageId;
  editingMessageContent.value = content;
};

const editMessage = async (messageId: number, newContent: string) => {
  if (!newContent.trim()) {
    userStore.showErrorToast('Le message ne peut pas être vide.');
    return;
  }

  try {
    const response: any = await $fetch(`/api/messages/${messageId}`, {
      method: 'PUT',
      body: {
        content: newContent,
      },
    });

    if (response.success) {
      editingMessageId.value = null;
      editingMessageContent.value = '';
      userStore.showSuccessToast('Message modifié avec succès.');
    }
  } catch (error) {
    console.error('Erreur lors de la modification du message :', error);
    userStore.showErrorToast('Erreur lors de la modification du message.');
  }
};

onMounted(() => {
  fetchMessages();
  connectWS();
});
</script>

<template>
  <v-container class="container" fluid>
    <v-row>
      <v-btn @click="router.push(`/forums/${forumId}`)" color="secondary" class="mb-4">
        Retour au forum
      </v-btn>
    </v-row>
    <v-row class="content-row" justify="center" align="start">
      <v-col cols="12" md="8" lg="8" class="d-flex">
        <v-col cols="12" class="message-list">
          <LoaderComponent v-if="loading"/>
          <v-row v-else>
            <CardComponent
                v-for="message in messages"
                :key="message.id"
                :title="message.content"
                :subtitle="message?.author_email?.split('@')[0]"
                :date="formatDate(message.created_at, false)"
                :avatar="message?.author_avatar ? `/assets/avatars/${message.author_avatar}` : '/assets/avatars/default_avatar.png'"
                :pointer="false"
                :isMessage="true"
                :isOwner="userStore.id === message.user_id"
                @save="(newContent) => editMessage(message.id, newContent)"
                @delete="deleteMessage(message.id)"
            />
          </v-row>
          <PaginationComponent
              v-if="messages.length > 0"
              :current-page="currentPage"
              :total-pages="totalPages"
              @pageChange="goToPage"
          />
        </v-col>
      </v-col>

      <v-col cols="12" md="4" class="reply-form d-md-block">
        <v-row>
          <v-textarea v-model="newMessageContent" label="Votre réponse" outlined dense/>
          <v-btn @click="postMessage" color="primary" block>Répondre</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.content-row {
  margin-top: 20px;
}

.message-list {
  border-radius: 10px;
  padding: 20px;
  width: 100%;
}

.reply-form {
  background-color: var(--color-surface);
  border-radius: 10px;
  padding: 20px;
  position: sticky;
  top: 100px;
}

</style>