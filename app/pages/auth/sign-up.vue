<script setup lang="ts">
const type = ref('sign-up')
const loading = ref(false)
const formData = reactive({
  email: 'example@gmail.com',
  password: 'test123',
})

const { signUp, signIn } = useAuth()

async function onsubmit(event: Event) {
  event.preventDefault()
  loading.value = true

  try {
    if (type.value === 'sign-up') {
      await signUp(formData)
    }
    else {
      await signIn(formData)
    }
  }
  finally {
    loading.value = false
  }
}

definePageMeta({
  layout: 'auth',
  middleware: ['sign-up-guard'],
})
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-md p-6">
      <h1 class="text-center mb-6 text-5xl">
        {{ type === 'sign-up' ? 'Sign up' : 'Sign in' }}
      </h1>

      <UForm
        :state="formData"
        class="space-y-4"
        @submit="onsubmit"
      >
        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="formData.email"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
        >
          <UInput
            v-model="formData.password"
            type="password"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          trailing-icon="i-lucide-arrow-right"
          :loading="loading"
        >
          {{ type === 'sign-up' ? 'Sign up' : 'Sign in' }}
        </UButton>
        <span class="mx-3">or</span>
        <ULink
          type="button"
          @click="navigateTo('/')"
        >
          Go back to home
        </ULink>

        <USeparator />

        <ULink
          @click="type = type === 'sign-up' ? 'sign-in' : 'sign-up'"
        >
          {{ type === 'sign-up' ? 'I want to sign in' : 'I want to sign up' }}
        </ULink>
      </UForm>
    </div>
  </div>
</template>
