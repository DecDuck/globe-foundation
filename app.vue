<template>
  <div class="min-h-screen w-full flex flex-col">
    <Header />
    <main class="flex grow">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) =>
    title ? `${title} | Globe Foundation` : "Globe Foundation",
});
</script>
