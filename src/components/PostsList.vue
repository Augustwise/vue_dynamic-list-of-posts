<script setup>
import { onMounted, ref } from 'vue'

import { getPostsByUserId } from '@/api/posts'

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
})

const posts = ref([])
const error = ref('')
const isLoading = ref(false)

const loadPosts = async () => {
  error.value = ''
  isLoading.value = true

  try {
    posts.value = await getPostsByUserId(props.userId)
  } catch (loadError) {
    error.value = loadError.message
  } finally {
    isLoading.value = false
  }
}

onMounted(loadPosts)
</script>

<template>
  <div class="tile is-parent">
    <div class="tile is-child box is-success">
      <div class="block">
        <div class="block is-flex is-justify-content-space-between">
          <p class="title">Posts</p>
          <button type="button" class="button is-link">Add New Post</button>
        </div>

        <div v-if="isLoading" class="is-flex is-justify-content-center mt-2">
          <button type="button" class="button is-loading is-white">
            Loading posts
          </button>
        </div>

        <div v-else-if="error" class="notification is-danger is-light">
          {{ error }}
        </div>

        <div
          v-else-if="posts.length === 0"
          class="notification is-warning is-light"
        >
          No posts yet
        </div>

        <table
          v-else
          class="table is-fullwidth is-striped is-hoverable is-narrow"
        >
          <thead>
            <tr class="has-background-link-light">
              <th>ID</th>
              <th>Title</th>
              <th class="has-text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ post.title }}</td>
              <td class="has-text-right is-vcentered">
                <button type="button" class="button is-link">Open</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
