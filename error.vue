<template>
  <main class="relative isolate min-h-screen overflow-hidden">
    <div class="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8 z-50">
      <p class="text-base font-semibold leading-8 text-zinc-600">
        {{ $props.error?.statusCode ?? "500" }}
      </p>
      <h1
        class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl text-zinc-900"
      >
        {{ $props.error?.message ?? "Internal server error" }}
      </h1>
      <p class="mt-4 text-base sm:mt-6 text-zinc-600">
        We unfortunately couldn't show the page you're looking for.
      </p>
      <div class="mt-10 flex justify-center">
        <button
          @click="handleError"
          class="text-sm font-semibold leading-7 text-black text-zinc-600"
        >
          <span aria-hidden="true">&larr;</span> Back to home
        </button>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const props = defineProps({
  error: Object,
});

const handleError = () => clearError({ redirect: "/" });
</script>
