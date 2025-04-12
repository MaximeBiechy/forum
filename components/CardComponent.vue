<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  count: {
    type: Number,
    required: false,
  },
  countLabel: {
    type: String,
    required: false,
    default: '',
  },
  onClick: {
    type: Function,
    required: false,
  },
  pointer: {
    type: Boolean,
    default: true,
  },
  isMessage: {
    type: Boolean,
    default: false,
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
});

const handleClick = () => {
  if (props.onClick) {
    props.onClick();
  }
};
</script>

<template>
  <v-col cols="12" md="6" lg="12" class="card" :class="{ 'cursor-pointer': pointer }"
         @click="handleClick">
    <v-card-title class="card-title">{{ title }}</v-card-title>
    <v-row class="d-flex pl-3">
      <v-col class="d-flex align-center pt-0">
        <v-avatar v-if="avatar" size="32">
          <img :src="avatar" alt="Avatar" style="width: 32px; height: 32px;" />
        </v-avatar>
        <v-col class="d-flex flex-column pl-0">
          <v-card-subtitle class="subtitle">{{ subtitle }}</v-card-subtitle>
          <v-card-subtitle class="date">{{ date }}</v-card-subtitle>
        </v-col>
      </v-col>
      <v-card-subtitle v-if="count !== undefined" class="count">
        {{ count }} {{ countLabel }}
      </v-card-subtitle>
    </v-row>
    <v-row v-if="isOwner" class="mt-2">
      <v-btn color="primary" @click="$emit('edit')">Modifier</v-btn>
      <v-btn color="error" @click="$emit('delete')">Supprimer</v-btn>
    </v-row>
  </v-col>
</template>

<style scoped>
.card {
  background-color: var(--color-surface);
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  color: var(--color-onPrimary);
}

.subtitle {
  font-size: 14px;
  color: var(--color-onSecondary);
}

.date {
  font-size: 12px;
  color: var(--color-onSecondary);
}

.count {
  font-size: 14px;
  color: var(--color-onSecondary);
  margin-top: 5px;
}
</style>