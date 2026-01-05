<script setup lang="ts">
import { useAuthStore } from '@/stores/user'

const { loggedIn, user } = useUserSession()
const authStore = useAuthStore()

const links = [{
  label: 'Home',
  to: '/',
  active: false,
}]

const items = computed(() => {
  const baseItems = [...links]

  if (loggedIn.value) {
    baseItems.push(
      {
        label: 'Create event',
        to: '/events/create-event',
        active: false,
      },

    )
  }
  else {
    baseItems.push(
      {
        label: 'Sign up/Log in',
        to: '/auth/sign-up',
        active: false,
      },
    )
  }

  return baseItems
})

onMounted(async () => {
  if (loggedIn.value) {
    authStore.login(user.value)
  }
})
</script>

<template>
  <UHeader>
    <template #title>
      <p class="text-3xl">
        Event0
      </p>
    </template>

    <UNavigationMenu :items="items" />

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>

    <template #right>
      <div
        v-if="loggedIn"
        class="flex items-center gap-2"
      >
        <UButton
          variant="ghost"
          size="sm"
          @click="authStore.logout"
        >
          Logout
        </UButton>
      </div>
    </template>
  </UHeader>
</template>
