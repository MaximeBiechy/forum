<script setup lang="ts">
interface Field {
  label: string;
  type: string;
  model: string;
}

const props = defineProps({
  fields: {
    type: Array as PropType<Field[]>,
    required: true,
  },
  formData: {
    type: Object as PropType<Record<string, any>>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
});

const emit = defineEmits(['submit']);

const handleSubmit = (event: Event) => {
  event.preventDefault();
  emit('submit');
}
</script>

<template>
  <v-container class="form-container" fluid>
    <v-card class="form-card" elevation="2">
      <v-card-title class="form-title">{{ title }}</v-card-title>
      <v-card-text>
        <v-form @submit="handleSubmit">
          <v-col cols="12">
            <v-row v-for="field in fields" :key="field.model" class="form-field-row">
              <v-text-field
                  v-model="formData[field.model]"
                  :label="field.label"
                  :type="field.type"
                  outlined
                  dense
                  class="form-field"
              />
            </v-row>
          </v-col>
          <v-btn type="submit" color="primary" class="form-submit-btn" block>Submit</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-card {
  max-width: 600px;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
}

.form-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.form-field-row {
  margin-bottom: 8px;
}

.form-field {
  width: 100%;
}

.form-submit-btn {
  margin-top: 20px;
}
</style>
