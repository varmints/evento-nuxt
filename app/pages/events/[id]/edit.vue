<script setup lang="ts">
import type { CalendarDate } from '@internationalized/date'
import { getLocalTimeZone } from '@internationalized/date'
import { format } from 'date-fns'

const route = useRoute()
const toast = useToast()
const loading = ref(false)
const errors = ref<string[]>([])
const selectedDate = shallowRef<CalendarDate | null>(null)

const eventId = route.params.id as string

// Fetch the event
const { data: event, error: fetchError } = await useFetch(`/api/events/${eventId}`)

// Pre-fill form
const formData = reactive({
  title: event.value?.title || '',
  content: event.value?.content || '',
  date: null as Date | null,
})

// Keep formData.date in sync with selectedDate
watch(
  () => selectedDate.value,
  (newDate) => {
    formData.date = newDate ? newDate.toDate(getLocalTimeZone()) : null
  },
)

// Initialize selectedDate from fetched event using watch for better reactivity
watch(
  () => event.value?.date,
  (eventDate) => {
    selectedDate.value = stringDateToCalendarDate(eventDate)
  },
  { immediate: true },
)

async function onSubmit(eventForm: Event) {
  eventForm.preventDefault()
  loading.value = true

  try {
    await $fetch(`/api/events/${eventId}/edit`, {
      method: 'PATCH',
      body: formData,
    })

    toast.add({
      title: 'Great!',
      description: 'Event updated successfully',
      color: 'success',
    })

    await navigateTo('/')
  }
  catch (error: any) {
    if (error?.data?.data) {
      errors.value = error.data.data
    }
    else {
      errors.value = [error.data.statusMessage || 'An error occurred. Please try again.']
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
  <div v-if="fetchError" class="flex justify-center items-center min-h-screen">
    <span class="text-red-500">Error: {{ fetchError.statusMessage }}</span>
  </div>
  <div v-else-if="!event" class="flex justify-center items-center min-h-screen">
    <span>Loading...</span>
  </div>
  <div v-else class="flex items-center justify-center">
    <div class="w-full max-w-md p-6">
      <h1 class="font-anton text-left mb-6 text-5xl">
        Edit Event
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

        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton
            variant="subtle"
            icon="i-lucide-calendar-sync"
            :trailing="false"
          >
            {{ formData.date ? format(formData.date, 'd MMM, yyyy') : 'Pick a date' }}
          </UButton>

          <template #content="{ close }">
            <UCalendar
              v-model="selectedDate"
              class="p-3"
              @update:model-value="close()"
            />
          </template>
        </UPopover>

        <UButton
          type="submit"
          :loading="loading"
          class="w-full"
          size="lg"
        >
          Update event
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
