const POSTS_URL = 'https://mate.academy/students-api/posts'

export const getPostsByUserId = async (userId) => {
  const response = await fetch(
    `${POSTS_URL}?userId=${encodeURIComponent(userId)}`,
  )

  if (!response.ok) {
    throw new Error('Unable to load posts right now')
  }

  const posts = await response.json()

  return Array.isArray(posts) ? posts : [posts]
}
