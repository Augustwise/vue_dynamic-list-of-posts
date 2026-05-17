<script setup>
import Comment from './Comment.vue'
import NoCommentsYet from './NoCommentsYet.vue'
import PostLoader from './PostLoader.vue'

defineProps({
  post: {
    type: Object,
    required: true,
  },
  comments: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

defineEmits(['delete-comment'])
</script>

<template>
  <div class="content">
    <div class="block">
      <div
        class="is-flex is-justify-content-space-between is-align-items-center"
      >
        <h2>#{{ post.id }}: {{ post.title }}</h2>

        <div class="is-flex">
          <span class="icon is-small is-right is-clickable">
            <i class="fas fa-pen-to-square"></i>
          </span>

          <span
            class="icon is-small is-right has-text-danger is-clickable ml-3"
          >
            <i class="fas fa-trash"></i>
          </span>
        </div>
      </div>

      <p data-cy="PostBody">{{ post.body }}</p>
    </div>

    <hr />

    <PostLoader v-if="isLoading" label="Loading comments" />

    <div v-else-if="error" class="notification is-danger is-light">
      {{ error }}
    </div>

    <NoCommentsYet v-else-if="comments.length === 0" />

    <template v-else>
      <Comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        @delete="$emit('delete-comment', $event)"
      />
    </template>
  </div>
</template>
