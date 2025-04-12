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

const emit = defineEmits(['save']);

const isEditing = ref(false);
const editedTitle = ref(props.title);

const startEditing = () => {
  isEditing.value = true;
};

const saveEdit = () => {
  isEditing.value = false;
  emit('save', editedTitle.value);
};

const cancelEdit = () => {
  isEditing.value = false;
  editedTitle.value = props.title;
};
</script>

<template>
  <v-col cols="12" md="6" lg="12" class="card" :class="{ 'cursor-pointer': pointer }"
         @click="handleClick">
    <div v-if="isEditing">
      <v-text-field
          v-model="editedTitle"
          label="Modifier le titre"
          outlined
          dense
      />
      <v-btn color="primary" class="mt-2" @click="saveEdit">Enregistrer</v-btn>
      <v-btn color="secondary" class="mt-2" @click="cancelEdit">Annuler</v-btn>
    </div>
    <div v-else>
      <v-row class="d-flex align-center" justify="space-between">
        <v-col cols="auto" class="flex-grow-1">
          <v-card-title class="card-title">
            {{ title }}
          </v-card-title>
        </v-col>
        <v-col cols="auto">
          <v-row v-if="isOwner" class="mr-2">
            <v-icon color="primary" class="mr-2" @click.stop="startEditing">mdi-pencil</v-icon>
            <v-icon color="error" @click.stop="$emit('delete')">mdi-delete</v-icon>
          </v-row>
        </v-col>
      </v-row>

      <v-row class="d-flex pl-3">
        <v-col class="d-flex align-center pt-0">
          <v-avatar v-if="avatar" size="32">
            <img :src="avatar" alt="Avatar" style="width: 32px; height: 32px;"/>
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
    </div>
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
  white-space: normal; /* permet le retour à la ligne */
  word-break: break-word; /* casse les mots trop longs si nécessaire */
  line-height: 1.4; /* améliore la lisibilité si plusieurs lignes */
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