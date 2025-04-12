<script setup lang="ts">
import {defineEmits, defineProps} from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['pageChange']);

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit('pageChange', page);
  }
};
</script>

<template>
  <v-row justify="center" class="pagination">
    <v-btn
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        color="primary"
        outlined
    >
      Précédent
    </v-btn>
    <v-btn
        v-for="page in totalPages"
        :key="page"
        :color="page === currentPage ? 'primary' : 'default'"
        @click="goToPage(page)"
        class="mx-1"
    >
      {{ page }}
    </v-btn>
    <v-btn
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
        color="primary"
        outlined
    >
      Suivant
    </v-btn>
  </v-row>
</template>

<style scoped>
.pagination {
  margin-top: 20px;
}
</style>