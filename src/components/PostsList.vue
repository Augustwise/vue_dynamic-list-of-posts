<script setup>
import { computed, onMounted, ref } from 'vue'

import {
  createPost,
  getCommentsByPostId,
  getPostsByUserId,
} from '@/api/posts'
import AddPost from './AddPost.vue'
import PostLoader from './PostLoader.vue'
import PostPreview from './PostPreview.vue'

const props = defineProps({
  userId: {
    type: [Number, String],
    required: true,
  },
})

const posts = ref([])
const error = ref('')
const isLoading = ref(false)
const selectedPost = ref(null)
const comments = ref([])
const commentsError = ref('')
const areCommentsLoading = ref(false)
const sidebarMode = ref('')
const isCreatingPost = ref(false)
const createPostError = ref('')
const createPostFormKey = ref(0)

const isSidebarOpen = computed(() => Boolean(sidebarMode.value))

const loadPosts = async () => {
  error.value = ''
  isLoading.value = true

  try {
    posts.value = await getPostsByUserId(props.userId)
  } catch {
    error.value = 'Failed to load posts'
  } finally {
    isLoading.value = false
  }
}

const resetCreatePostState = () => {
  createPostError.value = ''
}

const openCreatePostForm = () => {
  selectedPost.value = null
  comments.value = []
  commentsError.value = ''
  areCommentsLoading.value = false
  sidebarMode.value = 'create'
  createPostFormKey.value += 1
  resetCreatePostState()
}

const closeSidebar = () => {
  selectedPost.value = null
  comments.value = []
  commentsError.value = ''
  areCommentsLoading.value = false
  sidebarMode.value = ''
  resetCreatePostState()
}

const loadComments = async (postId) => {
  comments.value = []
  commentsError.value = ''
  areCommentsLoading.value = true

  try {
    comments.value = await getCommentsByPostId(postId)
  } catch {
    commentsError.value = 'Failed to load comments'
  } finally {
    areCommentsLoading.value = false
  }
}

const openPost = async (post, shouldLoadComments = true) => {
  selectedPost.value = post
  comments.value = []
  commentsError.value = ''
  sidebarMode.value = 'preview'
  resetCreatePostState()

  if (shouldLoadComments) {
    await loadComments(post.id)
  }
}

const clearCreatePostError = () => {
  createPostError.value = ''
}

const handleCreatePost = async ({ title, body }) => {
  createPostError.value = ''

  isCreatingPost.value = true

  try {
    const createdPost = await createPost({
      userId: props.userId,
      title,
      body,
    })

    posts.value = [...posts.value, createdPost]
    await openPost(createdPost, false)
  } catch {
    createPostError.value = 'Failed to create post'
  } finally {
    isCreatingPost.value = false
  }
}

onMounted(loadPosts)
</script>

<template>
  <div
    class="PostsLayout"
    :class="{ 'PostsLayout--with-sidebar': isSidebarOpen }"
  >
    <div
      class="PostsListTile"
      :class="{ 'PostsListTile--with-sidebar': isSidebarOpen }"
    >
      <div class="box is-success">
        <div class="block">
          <div class="block is-flex is-justify-content-space-between">
            <p class="title">Posts</p>
            <button
              type="button"
              class="button is-link"
              @click="openCreatePostForm"
            >
              Add New Post
            </button>
          </div>

          <PostLoader v-if="isLoading" label="Loading posts" />

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
                  <button
                    type="button"
                    class="button is-link"
                    @click="openPost(post)"
                  >
                    Open
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="Sidebar" :class="{ 'Sidebar--open': isSidebarOpen }">
      <div class="box is-success">
        <AddPost
          v-if="sidebarMode === 'create'"
          :key="createPostFormKey"
          :is-loading="isCreatingPost"
          :error="createPostError"
          @cancel="closeSidebar"
          @clear-error="clearCreatePostError"
          @create="handleCreatePost"
        />

        <PostPreview
          v-else-if="selectedPost"
          :post="selectedPost"
          :comments="comments"
          :is-loading="areCommentsLoading"
          :error="commentsError"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.PostsLayout {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.PostsLayout--with-sidebar {
  gap: 1.5rem;
}

.PostsListTile {
  min-width: 0;
}

.Sidebar {
  overflow: hidden;
  opacity: 0;
  transition-duration: 0.5s;
  transition-property: flex-basis, max-width, opacity, width;
  transition-timing-function: ease-in-out;
}

.Sidebar--open {
  opacity: 1;
}

@media (min-width: 769px) {
  .PostsLayout {
    align-items: flex-start;
    flex-direction: row;
  }

  .PostsListTile {
    flex: 1 1 100%;
    transition: flex-basis 0.5s ease-in-out, max-width 0.5s ease-in-out;
  }

  .PostsListTile--with-sidebar {
    flex: 0 1 calc(50% - 0.75rem);
    max-width: calc(50% - 0.75rem);
  }

  .Sidebar {
    flex: 0 0 0;
    max-width: 0;
    width: 0;
  }

  .Sidebar--open {
    flex: 0 1 calc(50% - 0.75rem);
    max-width: calc(50% - 0.75rem);
    width: calc(50% - 0.75rem);
  }
}
</style>
