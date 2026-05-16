<script setup>
defineProps({
  id: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    required: true,
  },
  error: {
    type: String,
    default: '',
  },
  dataCy: {
    type: String,
    default: '',
  },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field" :data-cy="dataCy">
    <label class="label" :for="id">
      {{ label }}
    </label>

    <div class="control has-icons-left" :class="{ 'has-icons-right': error }">
      <input
        :id="id"
        :value="modelValue"
        type="text"
        :name="name"
        :placeholder="placeholder"
        class="input"
        :class="{ 'is-danger': error }"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <span class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>

      <span
        v-if="error"
        class="icon is-small is-right has-text-danger"
        data-cy="ErrorIcon"
      >
        <i class="fas fa-exclamation-triangle"></i>
      </span>
    </div>

    <p v-if="error" class="help is-danger" data-cy="ErrorMessage">
      {{ error }}
    </p>
  </div>
</template>
