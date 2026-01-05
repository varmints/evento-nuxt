<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import { getLocalTimeZone } from '@internationalized/date'
import { format } from 'date-fns'

const toast = useToast()
const loading = ref(false)
const errors = ref<string[]>([])
const selectedDate = shallowRef<CalendarDate | null>(null)

const formData = reactive({
  title: '',
  content: '',
  date: computed(() => selectedDate.value ? selectedDate.value.toDate(getLocalTimeZone()) : null),
})

async function onSubmit(event: Event) {
  event.preventDefault()
  loading.value = true

  try {
    await $fetch('/api/events/event', {
      method: 'POST',
      body: formData,
    })

    toast.add({
      title: 'Great !!',
      description: 'Event created successfully',
      color: 'success',
    })

    await navigateTo('/')
  }
  catch (error: any) {
    if (error?.data?.data) {
      errors.value = error.data.data
    }
    else {
      errors.value = [error.data.statusMessage || 'An arror occurred. Please try again.']
    }
  }
  finally {
    loading.value = false
  }
}

definePageMeta({
  middleware: ['auth-guard'],
})
</script>

<template>
  <div class="flex items-center justify-center">
    <div class="w-full max-w-md p-6">
      <h1 class="font-anton text-left mb-6 text-5xl">
        Create Event
      </h1>

      <UForm
        :state="formData"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Title"
          name="title"
        >
          <UInput
            v-model="formData.title"
            class="w-full"
            placeholder="Event title"
          />
        </UFormField>

        <UFormField
          label="Content"
          name="content"
        >
          <UTextarea
            v-model="formData.content"
            autoresize
            class="w-full"
            placeholder="Enter event details..."
          />
        </UFormField>

        <UPopover>
          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-calendar"
          >
            {{ formData.date ? format(formData.date, 'd MMM, yyyy') : 'Select a date' }}
          </UButton>

          <template #content>
            <UCalendar
              v-model="selectedDate"
              class="p-2"
            />
          </template>
        </UPopover>

        <UButton
          type="submit"
          :loading="loading"
          class="w-full"
          size="lg"
        >
          Create event
        </UButton>

        <div v-if="errors.length" class="mt-4">
          <UBadge v-for="(error, index) in errors" :key="index + error" color="error">
            {{ error }}
          </UBadge>
        </div>
      </UForm>
    </div>
  </div>
</template>
